import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../lib/email';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
const appendFile = promisify(fs.appendFile);

// Determine a stable log directory under the frontend app
const baseCwd = process.cwd();
const frontendSegment = path.join('apps', 'frontend');
const LOG_DIR = baseCwd.endsWith(frontendSegment) ? path.join(baseCwd, 'logs') : path.join(baseCwd, 'apps', 'frontend', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'contact.log');

type Data =
  | { ok: true; preview?: string }
  | { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing message' });
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
    const entry = `${new Date().toISOString()}\tfrom=${from}\tsubject=${subject}\tmessage=${(message || '').replace(/\n/g, ' ')}\n`;
    try {
      await appendFile(LOG_FILE, entry, { encoding: 'utf8' });
    } catch (e) {
      console.error('Failed to write contact log:', e);
    }
    const result: any = await sendEmail({ to, subject, html });
    // result may include preview when using test account
    return res.status(200).json({ ok: true, preview: result.preview });
  } catch (e: any) {
    console.error('Contact email failed:', e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
