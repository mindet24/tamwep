import Head from 'next/head';
import Link from 'next/link';
import AuthNavbar from '../components/AuthNavbar';

export default function Services() {
  return (
    <>
      <Head>
        <title>TAMWEP | บริการของเรา</title>
      </Head>
      <AuthNavbar />
      <main style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', padding: '3rem 2rem', maxWidth: 1080, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>บริการของเรา</h1>
        <p style={{ marginBottom: '2rem', color: '#475569' }}>
          เราให้บริการออกแบบและพัฒนาเว็บไซต์ที่ตอบโจทย์ธุรกิจ พร้อมดูแลระบบหลังบ้านและการใช้งานตลอดเวลา
        </p>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            {
              title: 'เว็บไซต์ธุรกิจ',
              description: 'เว็บไซต์สวยและทันสมัยสำหรับองค์กร ธุรกิจร้านค้า และบริการต่าง ๆ',
            },
            {
              title: 'ร้านค้าออนไลน์',
              description: 'ระบบขายของออนไลน์พร้อมตะกร้าสินค้าและการชำระเงินที่ใช้ง่าย',
            },
            {
              title: 'ระบบจองและบริการ',
              description: 'ระบบจองคิวหรือบริการออนไลน์สำหรับร้านสปา, คลินิก, โรงแรม และอื่น ๆ',
            },
            {
              title: 'เว็บพอร์ตโฟลิโอ',
              description: 'สร้างผลงานและแสดงตัวตนให้ลูกค้าเห็นภาพลักษณ์ที่น่าเชื่อถือ',
            },
          ].map((item) => (
            <div key={item.title} style={{ padding: '1.5rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>{item.title}</h2>
              <p style={{ margin: 0, color: '#475569' }}>{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
