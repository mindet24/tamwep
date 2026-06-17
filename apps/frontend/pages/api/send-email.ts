import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, getEmailTemplates } from '@/lib/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, type, url } = req.body;

  if (!email || !type || !url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const templates = getEmailTemplates();
    const subject = type === 'verify' ? 'ยืนยันอีเมล' : 'รีเซ็ตรหัสผ่าน';
    const html = type === 'verify' 
      ? templates.verificationEmail(url)
      : templates.resetPasswordEmail(url);

    await sendEmail({
      to: email,
      subject,
      html
    });

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
