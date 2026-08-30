import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | { ok: true; checklist: string[]; snippet: string }
  | { ok: false; error: string };

// Basic per-IP rate limiter for this route
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 30;
const rateMap: Map<string, { count: number; start: number }> = new Map();

function getIp(req: any) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

const DEFAULT_SYSTEM = `You are an expert web developer and UX designer. Given a short user goal and optional tech stack, produce a concise JSON object with two keys: \n1) checklist: an array of short actionable steps (3-8 items) the user can follow to build a minimal one-page website to meet the goal. \n2) snippet: a minimal, copy-pasteable HTML/CSS/JS example (no external build step) that implements the core layout or feature (keep it under 200 lines). Respond only with the JSON object.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { goal, tech, style } = req.body || {};
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

  // Build prompt
  const userPrompt = `Goal: ${goal}\nTech: ${tech || 'any'}\nStyle: ${style || 'simple, clean'}\n\nReturn a JSON object as described.`;

  // If no OpenAI key is configured, return a safe canned response for development
  if (!process.env.OPENAI_API_KEY) {
    const checklist = [
      'Create a basic one-page HTML structure',
      'Add responsive CSS for mobile and desktop',
      'Include a hero section with headline and CTA',
      'Add a services/work section with examples',
      'Add a contact form that POSTs to /api/contact',
    ];
    const snippet = `<!doctype html>\n<html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<style>body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0} .hero{padding:40px;text-align:center;background:#f7f7f7} .btn{display:inline-block;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none}</style>\n</head><body><section class=\"hero\"><h1>My One Page</h1><p>Quick starter</p><a class=\"btn\" href=\"#contact\">Contact</a></section></body></html>`;
    return res.status(200).json({ ok: true, checklist, snippet });
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
      // fallback: return the LLM text as snippet
      return res.status(200).json({ ok: true, checklist: [], snippet: String(content) });
    }

    const checklist = Array.isArray(parsed.checklist) ? parsed.checklist.map(String) : [];
    const snippet = String(parsed.snippet || parsed.code || '');
    return res.status(200).json({ ok: true, checklist, snippet });
  } catch (err: any) {
    console.error('LLM recommend error', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
