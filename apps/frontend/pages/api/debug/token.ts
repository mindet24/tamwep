import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

// Guard this debug route: only allow in non-production or when explicitly enabled
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production' && process.env.DEBUG_TOKEN !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
