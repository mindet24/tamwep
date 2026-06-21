import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>TAMWEP | รับทำเว็บไซต์</title>
        <meta
          name="description"
          content="TAMWEP รับทำเว็บไซต์ธุรกิจด้วยดีไซน์สวยและระบบใช้งานง่าย พร้อมบริการดูแลหลังบ้านแบบครบวงจร"
        />
      </Head>
      <main style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#111', lineHeight: 1.7 }}>
        <section style={{ padding: '4rem 2rem', background: '#f7f7f7' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <p style={{ margin: 0, color: '#ff6f61', fontWeight: 700, letterSpacing: '0.12em' }}>
              รับทำเว็บไซต์
            </p>
            <h1 style={{ margin: '1rem 0', fontSize: 'clamp(2.8rem, 4vw, 4.5rem)' }}>
              สร้างเว็บไซต์ให้ธุรกิจคุณโดดเด่นในโลกออนไลน์
            </h1>
            <p style={{ margin: '1.5rem 0', maxWidth: 720, fontSize: '1.05rem', color: '#444' }}>
              TAMWEP ให้บริการออกแบบเว็บไซต์พร้อมระบบจัดการที่ใช้งานง่าย เหมาะกับธุรกิจ
              SME, ร้านค้าออนไลน์, บริการ และองค์กรที่ต้องการภาพลักษณ์ทันสมัย
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/services"
                style={{
                  padding: '0.95rem 1.8rem',
                  borderRadius: 9999,
                  background: '#111',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                เริ่มต้นเลย
              </a>
              <a
                href="/portfolio"
                style={{
                  padding: '0.95rem 1.8rem',
                  borderRadius: 9999,
                  border: '1px solid #111',
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                ดูบริการของเรา
              </a>
            </div>
          </div>
        </section>

        <section style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>บริการของเรา</h2>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {[
                {
                  title: 'เว็บไซต์สวยทันสมัย',
                  description: 'ออกแบบหน้าเว็บไซต์สวย ดูดี บนทั้งมือถือและคอมพิวเตอร์',
                },
                {
                  title: 'ระบบหลังบ้านใช้งานง่าย',
                  description: 'จัดการเนื้อหาและคำสั่งซื้อได้สะดวก โดยไม่ต้องมีความรู้ด้านเทคนิค',
                },
                {
                  title: 'ปรับแต่งตามความต้องการ',
                  description: 'รองรับฟีเจอร์เฉพาะธุรกิจ เช่น ระบบจองสินค้า หรือระบบติดต่อออนไลน์',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '1.6rem',
                    borderRadius: '1rem',
                    background: '#fff',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#555' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '3rem 2rem', background: '#f7f7f7' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ทำไมต้องเลือก TAMWEP</h2>
            <ul style={{ paddingLeft: '1.25rem', color: '#444' }}>
              <li>ทีมงานดูแลตั้งแต่ต้นจนจบ ทั้งออกแบบและติดตั้งใช้งาน</li>
              <li>เน้นเว็บโหลดเร็วและรองรับ SEO เบื้องต้น</li>
              <li>บริการหลังการขาย พร้อมอัปเดตและแก้ไขตามต้องการ</li>
            </ul>
          </div>
        </section>

        <section style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ติดต่อเรา</h2>
            <p style={{ margin: 0, color: '#444' }}>
              สนใจเว็บไซต์ใหม่หรือปรับปรุงเว็บไซต์เดิม ติดต่อเราได้เลย
            </p>
            <p style={{ marginTop: '1rem', fontWeight: 700 }}>
              Email: contact@tamwep.com<br />
              โทร: 090-123-4567
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
