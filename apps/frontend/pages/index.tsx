import Head from 'next/head';
import { useEffect, useState } from 'react';

const SAMPLE_DOCS = [
  {
    title: 'TAMWEP 소개',
    content:
      'TAMWEP เป็นบริษัทรับทำเว็บไซต์ ธุรกิจ SME, ร้านค้าออนไลน์, บริการ และองค์กรที่ต้องการเว็บไซต์สวยและใช้งานง่าย พร้อมระบบหลังบ้านที่จัดการเนื้อหาได้ง่าย',
  },
  {
    title: 'บริการ',
    content:
      'บริการของ TAMWEP ประกอบด้วย การออกแบบเว็บไซต์สวยทันสมัย, ระบบหลังบ้านใช้งานง่าย, และปรับแต่งตามความต้องการธุรกิจ',
  },
];

export default function Home() {
  const [question, setQuestion] = useState('TAMWEP ให้บริการอะไรบ้าง');
  const [answer, setAnswer] = useState('พิมพ์คำถามแล้วกด “ถามเลย” เพื่อดูการตอบกลับจาก LLM แบบง่าย');
  const [loading, setLoading] = useState(false);
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  useEffect(() => {
    const seedDemoDocs = async () => {
      try {
        await Promise.all(
          SAMPLE_DOCS.map((doc) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/rag/ingest`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(doc),
            }),
          ),
        );
      } catch (error) {
        console.error('Could not seed demo docs:', error);
      }
    };

    seedDemoDocs();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) {
      setAnswer('กรุณาพิมพ์คำถามก่อน');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });

      const data = await response.json();
      setAnswer(data.answer || 'ตอบกลับไม่พบ');
    } catch (error) {
      setAnswer('ไม่สามารถเชื่อมต่อ backend ได้ กรุณาเปิด backend ที่ port 3001 ก่อนใช้งาน');
    } finally {
      setLoading(false);
    }
  };

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
        <section id="hero" style={{ padding: '4rem 2rem', background: '#f7f7f7' }}>
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
                href="#services"
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
                href="#works"
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

        <section id="services" style={{ padding: '3rem 2rem' }}>
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

        <section id="why" style={{ padding: '3rem 2rem', background: '#f7f7f7' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ทำไมต้องเลือก TAMWEP</h2>
            <ul style={{ paddingLeft: '1.25rem', color: '#444' }}>
              <li>ทีมงานดูแลตั้งแต่ต้นจนจบ ทั้งออกแบบและติดตั้งใช้งาน</li>
              <li>เน้นเว็บโหลดเร็วและรองรับ SEO เบื้องต้น</li>
              <li>บริการหลังการขาย พร้อมอัปเดตและแก้ไขตามต้องการ</li>
            </ul>
          </div>
        </section>

        <section id="works" style={{ padding: '3rem 2rem', background: '#ffffff' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ผลงานตัวอย่าง</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[1,2,3].map((n) => (
                <div key={n} style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ marginTop: 0 }}>Project {n}</h3>
                  <p style={{ margin: 0 }}>เว็บไซต์สาธิตสำหรับลูกค้า บริการออกแบบและติดตั้ง</p>
                </div>
              ))}
            </div>
          </div>

        </section>

        <section id="llm" style={{ padding: '3rem 2rem', background: '#f7f7f7' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>LLM แบบง่าย</h2>
            <div
              style={{
                background: '#fff',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
                display: 'grid',
                gap: '1rem',
              }}
            >
              <label style={{ fontWeight: 700 }}>คำถามของคุณ</label>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                placeholder="เช่น TAMWEP ให้บริการอะไรบ้าง"
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #d6d6d6',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleAsk}
                disabled={loading}
                style={{
                  alignSelf: 'start',
                  padding: '0.9rem 1.4rem',
                  border: 'none',
                  borderRadius: 9999,
                  background: '#111',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                {loading ? 'กำลังคิด...' : 'ถามเลย'}
              </button>
              <div
                style={{
                  background: '#fafafa',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  color: '#333',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {answer}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ติดต่อเรา</h2>
            <p style={{ margin: 0, color: '#444' }}>ส่งข้อความมาหาเราได้ผ่านฟอร์มด้านล่าง</p>

            <div style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // client-side validation
                  if (!contactEmail || !contactEmail.trim() || !contactMessage || !contactMessage.trim()) {
                    setContactStatus('กรุณากรอก Email และข้อความ');
                    return;
                  }
                  setContactLoading(true);
                  setContactStatus(null);
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
                    });
                    const data = await res.json();
                    if (data.ok) {
                      setContactStatus('ส่งสำเร็จ ขอบคุณครับ');
                      setContactName('');
                      setContactEmail('');
                      setContactMessage('');
                      if (data.preview) {
                        setContactStatus((s) => (s ? s + ` (preview: ${data.preview})` : `preview: ${data.preview}`));
                      }
                    } else {
                      setContactStatus('ส่งไม่สำเร็จ: ' + (data.error || 'unknown'));
                    }
                  } catch (err: any) {
                    setContactStatus('เกิดข้อผิดพลาดในการส่ง');
                  } finally {
                    setContactLoading(false);
                  }
                }}
              >
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 700 }}>Email ที่ติดต่อได้</label>
                  <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="your@email.com" type="email" style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #ddd' }} />

                  <label style={{ fontWeight: 700 }}>ชื่อ (ไม่บังคับ)</label>
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="ชื่อของคุณ" style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #ddd' }} />

                  <label style={{ fontWeight: 700 }}>ข้อความ</label>
                  <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={6} placeholder="รายละเอียดที่ต้องการ" style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #ddd' }} />

                  <button type="submit" disabled={contactLoading || !contactEmail.trim() || !contactMessage.trim()} style={{ padding: '0.75rem 1rem', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontWeight: 700 }}>
                    {contactLoading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </button>
                </div>
              </form>

              {contactStatus && <p style={{ marginTop: '0.75rem' }}>{contactStatus}</p>}

              <p style={{ marginTop: '1rem', fontWeight: 700 }}>Email: 20778@mh.ac.th</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
