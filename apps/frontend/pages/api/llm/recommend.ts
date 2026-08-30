import type { NextApiRequest, NextApiResponse } from 'next';
// Public access: no server-side auth required (rate-limited per IP)
import { promises as fs } from 'fs';
import path from 'path';

type Data =
  | { ok: true; checklist: string[]; snippet: string; text?: string }
  | { ok: false; error: string };

// Basic per-IP rate limiter for this route
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 30;
const rateMap: Map<string, { count: number; start: number }> = new Map();

// No per-user quota enforced for public access in this build; only per-IP rate limiting below.

function getIp(req: any) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

const DEFAULT_SYSTEM = `You are an expert web developer and UX designer. Provide helpful, natural-language recommendations for building websites. When possible include a concise JSON object with keys:\n1) checklist: an array of short actionable steps (3-8 items) the user can follow.\n2) snippet: a minimal, copy-pasteable HTML/CSS/JS example (no external build step). If the model prefers to answer in plain text, return a natural, conversational explanation that is actionable and includes any checklist or code inline. Use any "sources" provided by the user when relevant and be explicit about using them.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  // public endpoint (no auth) — protected only by per-IP rate limiting

  const { goal, tech, style, sources } = req.body || {};
  if (!goal || typeof goal !== 'string' || goal.trim().length < 3) {
    return res.status(400).json({ ok: false, error: 'Missing or invalid goal' });
  }

  // rate limit
  const ip = getIp(req);
  const now = Date.now();
  const state = rateMap.get(ip) || { count: 0, start: now };
  if (now - state.start > RATE_WINDOW_MS) {
    state.count = 0;
    state.start = now;
  }
  state.count += 1;
  rateMap.set(ip, state);
  if (state.count > RATE_MAX) return res.status(429).json({ ok: false, error: 'Rate limit exceeded' });

  // no per-user quota checks for public access

  // Build prompt
  const srcText = sources ? `Sources: ${String(sources)}\n\n` : '';
  // include any stored rag docs if present
  const dataFile = path.join(process.cwd(), 'apps', 'frontend', 'data', 'rag_docs.json');
  let docsText = '';
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const docs = JSON.parse(raw || '[]');
    if (Array.isArray(docs) && docs.length > 0) {
      docsText = docs.slice(-5).map((d: any, i: number) => `Doc ${i + 1} Title: ${d.title}\n${d.content}`).join('\n\n') + '\n\n';
    }
  } catch (e) {
    docsText = '';
  }

  const userPrompt = `${srcText}${docsText}Goal: ${goal}\nTech: ${tech || 'any'}\nStyle: ${style || 'simple, clean'}\n\nReturn a JSON object with checklist and snippet if possible — otherwise answer naturally.`;

  // If Ollama is configured, prefer it
  const OLLAMA_URL = process.env.OLLAMA_URL || process.env.OLLAMA_HOST || 'http://localhost:11434';
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

  if (process.env.USE_OLLAMA === '1' || process.env.OLLAMA_URL || process.env.OLLAMA_MODEL) {
    try {
      const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt: userPrompt, max_tokens: 800, temperature: 0.2 }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        // fall through to other handlers
        console.error('Ollama responded with error:', text);
      } else {
        const json = await resp.json().catch(() => null);
        const content = json?.result || json?.text || json?.output || (await resp.text());
        // try parse JSON inside content
        let parsed = null;
        try { parsed = JSON.parse(content); } catch (e) { parsed = null; }
        if (parsed) {
          const checklist = Array.isArray(parsed.checklist) ? parsed.checklist.map(String) : [];
          const snippet = String(parsed.snippet || parsed.code || '');
          return res.status(200).json({ ok: true, checklist, snippet, text: String(content) });
        }
        return res.status(200).json({ ok: true, checklist: [], snippet: String(content), text: String(content) });
      }
    } catch (e) {
      console.error('Ollama call failed', e);
      // fall back to OpenAI/dev response below
    }
  }

  // If no OpenAI key is configured, return a safe canned response for development
  if (!process.env.OPENAI_API_KEY) {
    const checklist = [
      'Create a basic one-page HTML structure',
      'Add responsive CSS for mobile and desktop',
      'Include a hero section with headline and CTA',
      'Add a services/feature section',
      'Provide an actionable checklist and minimal example code',
    ];
    const snippet = `<!doctype html>\n<html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<style>body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0} .hero{padding:40px;text-align:center;background:#f7f7f7} .btn{display:inline-block;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none}</style>\n</head><body><section class=\"hero\"><h1>My One Page</h1><p>Quick starter</p></section></body></html>`;
    const text = `ตัวอย่างคำแนะนำ:\n- ${checklist.join('\n- ')}\n\nตัวอย่างโค้ด:\n${snippet}`;
    return res.status(200).json({ ok: true, checklist, snippet, text });
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ ok: false, error: `LLM error: ${text}` });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';

    // try to extract JSON from content
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // attempt to find first { ... }
      const m = content.match(/\{[\s\S]*\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = null; }
      }
    }

    if (!parsed) {
      // fallback: return the LLM text as snippet + text
      return res.status(200).json({ ok: true, checklist: [], snippet: String(content), text: String(content) });
    }

    const checklist = Array.isArray(parsed.checklist) ? parsed.checklist.map(String) : [];
    const snippet = String(parsed.snippet || parsed.code || '');
    return res.status(200).json({ ok: true, checklist, snippet, text: String(content) });
  } catch (err: any) {
    console.error('LLM recommend error', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
