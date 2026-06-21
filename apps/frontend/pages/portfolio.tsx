import Head from 'next/head';
import AuthNavbar from '../components/AuthNavbar';

const works = [
  {
    title: 'เว็บไซต์ร้านกาแฟ',
    description: 'ดีไซน์อบอุ่นพร้อมเมนูและระบบสั่งออนไลน์',
  },
  {
    title: 'เว็บไซต์ร้านอาหาร',
    description: 'เมนูสวยงามและระบบจองโต๊ะง่าย ๆ',
  },
  {
    title: 'เว็บไซต์ธุรกิจบริการ',
    description: 'นำเสนอบริการและข้อมูลสำคัญอย่างมืออาชีพ',
  },
];

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>TAMWEP | ผลงาน</title>
      </Head>
      <AuthNavbar />
      <main style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', padding: '3rem 2rem', maxWidth: 1080, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ผลงานของเรา</h1>
        <p style={{ marginBottom: '2rem', color: '#475569' }}>
          ตัวอย่างเว็บไซต์ที่สร้างให้ลูกค้าทั่วไทย พร้อมรองรับทุกอุปกรณ์และประสบการณ์การใช้งานที่ดี
        </p>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {works.map((work) => (
            <div key={work.title} style={{ padding: '1.5rem', borderRadius: '1rem', background: '#fff', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>{work.title}</h2>
              <p style={{ margin: 0, color: '#475569' }}>{work.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
