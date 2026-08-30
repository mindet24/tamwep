import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import { promisify } from 'util';
const appendFile = promisify(fs.appendFile);

// Determine a stable log directory under the frontend app
const baseCwd = process.cwd();
const frontendSegment = path.join('apps', 'frontend');
const LOG_DIR = baseCwd.endsWith(frontendSegment) ? path.join(baseCwd, 'logs') : path.join(baseCwd, 'apps', 'frontend', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'contact.log');
// Data file for persisted submissions
const DATA_DIR = baseCwd.endsWith(frontendSegment) ? path.join(baseCwd, 'data') : path.join(baseCwd, 'apps', 'frontend', 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

// Simple in-memory rate limiter (per IP). For production use an external store.
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 10; // max submissions per window per IP
const rateMap: Map<string, { count: number; start: number }> = new Map();

function getIp(req: any) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

type Data =
  | { ok: true; preview?: string }
  | { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  // Basic server-side validation
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ ok: false, error: 'Message is required and must be at least 5 characters' });
  }
  if (email && typeof email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email format' });
    }
  }

  // Rate limiting per IP
  const ip = getIp(req);
  const now = Date.now();
  const state = rateMap.get(ip) || { count: 0, start: now };
  if (now - state.start > RATE_WINDOW_MS) {
    state.count = 0;
    state.start = now;
  }
  state.count += 1;
  rateMap.set(ip, state);
  if (state.count > RATE_MAX) {
    return res.status(429).json({ ok: false, error: 'Rate limit exceeded. Please try later.' });
  }

  const from = email && typeof email === 'string' ? `${email}` : 'anonymous@example.com';
  const subject = `Contact form from ${name || 'Anonymous'}`;
  const to = process.env.CONTACT_EMAIL || '20778@mh.ac.th';

  const html = `
    <p><strong>Name:</strong> ${name || '—'}</p>
    <p><strong>Email:</strong> ${from}</p>
    <p><strong>Message:</strong></p>
    <div>${(message || '').replace(/\n/g, '<br/>')}</div>
  `;

  try {
    // ensure log dir exists
    try {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    } catch (err) {
      // non-fatal
    }

    // write a log entry (timestamp, from, subject)
    const entry = `${new Date().toISOString()}\tip=${ip}\tfrom=${from}\tsubject=${subject}\tmessage=${(message || '').replace(/\n/g, ' ')}\n`;
    try {
      await appendFile(LOG_FILE, entry, { encoding: 'utf8' });
    } catch (e) {
      console.error('Failed to write contact log:', e);
    }

    // persist submission to data file
    try {
      await fsp.mkdir(DATA_DIR, { recursive: true });
      let arr: any[] = [];
      try {
        const raw = await fsp.readFile(DATA_FILE, 'utf8');
        arr = JSON.parse(raw || '[]');
      } catch (_) {
        arr = [];
      }
      arr.push({ createdAt: new Date().toISOString(), ip, name: name || null, email: email || null, message });
      await fsp.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to persist submission:', e);
    }

    // Email sending disabled in this build — persist/log only and return success
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('Contact email failed:', e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
