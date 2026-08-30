import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'apps', 'frontend', 'data');
const FILE = path.join(DATA_DIR, 'rag_docs.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const doc = req.body || {};
  if (!doc.title || !doc.content) return res.status(400).json({ ok: false, error: 'Missing title or content' });

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let existing = [];
    try {
      const raw = await fs.readFile(FILE, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {
      existing = [];
    }
    existing.push({ id: Date.now(), title: String(doc.title), content: String(doc.content) });
    await fs.writeFile(FILE, JSON.stringify(existing, null, 2), 'utf8');
    return res.status(200).json({ ok: true, count: existing.length });
  } catch (err: any) {
    console.error('rag ingest error', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
