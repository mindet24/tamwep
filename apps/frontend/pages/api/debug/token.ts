import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

// Guard this debug route: only allow in non-production or when explicitly enabled
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always block in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  // If DEBUG_TOKEN_SECRET is set, require matching header `x-debug-token`
  const debugSecret = process.env.DEBUG_TOKEN_SECRET;
  if (debugSecret) {
    const header = (req.headers['x-debug-token'] || req.headers['x-debug-secret'] || '') as string;
    if (!header || header !== debugSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else if (process.env.DEBUG_TOKEN !== 'true') {
    // If no secret provided, only allow when DEBUG_TOKEN=true in non-production
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
