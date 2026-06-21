import Head from 'next/head';
import AuthNavbar from '../components/AuthNavbar';

export default function Contact() {
  return (
    <>
      <Head>
        <title>TAMWEP | ติดต่อ</title>
      </Head>
      <AuthNavbar />
      <main style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', padding: '3rem 2rem', maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ติดต่อเรา</h1>
        <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
          สนใจทำเว็บไซต์กับ TAMWEP ติดต่อเราได้ทันที เราพร้อมให้คำปรึกษาและเสนอราคาตามความต้องการของคุณ
        </p>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
            <h2>ข้อมูลติดต่อ</h2>
            <p>โทร: 090-123-4567</p>
            <p>อีเมล: contact@tamwep.com</p>
            <p>LINE: @tamwep</p>
          </div>
          <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
            <h2>เขียนข้อความหาเรา</h2>
            <form style={{ display: 'grid', gap: '1rem' }}>
              <label>
                ชื่อ
                <input type="text" style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
              </label>
              <label>
                อีเมล
                <input type="email" style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
              </label>
              <label>
                ข้อความ
                <textarea style={{ width: '100%', minHeight: '180px', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
              </label>
              <button type="submit" style={{ padding: '0.95rem 1.2rem', borderRadius: '9999px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700 }}>
                ส่งข้อความ
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
