import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@tamwep.com',
      to,
      subject,
      html
    });
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function getEmailTemplates() {
  return {
    verificationEmail: (url: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ยืนยันอีเมล</h2>
        <p>ขอบคุณที่สมัครสมาชิก กรุณากดลิงก์ด้านล่างเพื่อยืนยันอีเมลของคุณ</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #174477; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">ยืนยันอีเมล</a>
        <p style="color: #999; font-size: 12px;">ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</p>
      </div>
    `,
    resetPasswordEmail: (url: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>รีเซ็ตรหัสผ่าน</h2>
        <p>กรุณากดลิงก์ด้านล่างเพื่อรีเซ็ตรหัสผ่านของคุณ</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #174477; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">รีเซ็ตรหัสผ่าน</a>
        <p style="color: #999; font-size: 12px;">ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
      </div>
    `,
    welcomeEmail: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ยินดีต้อนรับ, ${name}!</h2>
        <p>บัญชีของคุณได้รับการสร้างเรียบร้อยแล้ว</p>
        <p>คุณสามารถเข้าสู่ระบบและเริ่มใช้บริการของเราได้แล้ว</p>
      </div>
    `
  };
}
