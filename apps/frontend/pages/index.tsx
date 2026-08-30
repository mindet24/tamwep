import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

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
  // LLM Advisor (new)
  const [goal, setGoal] = useState('เว็บไซต์ one-page สำหรับร้านกาแฟ พร้อมเมนูและติดต่อ');
  const [tech, setTech] = useState('HTML/CSS/JS');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [snippet, setSnippet] = useState('');
  const [responseText, setResponseText] = useState('');
  const [sources, setSources] = useState('');
  // contact temporarily removed — form disabled in UI

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
      <Navbar />
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
                href="#llm"
                style={{
                  padding: '0.95rem 1.8rem',
                  borderRadius: 9999,
                  background: '#111',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                ขอคำแนะนำจาก LLM
              </a>
              <a
                href="#services"
                style={{
                  padding: '0.95rem 1.8rem',
                  borderRadius: 9999,
                  border: '1px solid #111',
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                ดูรายละเอียดบริการ
              </a>
            </div>
          </div>
        </section>

        <section id="services" style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>บริการของเรา (LLM Advisor)</h2>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {[
                {
                  title: 'คำแนะนำการออกแบบเว็บไซต์',
                  description: 'ออกแบบ UX/UI, โครงสร้างหน้า, และแนวทางการวางเนื้อหาให้เหมาะกับเป้าหมายธุรกิจ',
                },
                {
                  title: 'สถาปัตยกรรม & เทคโนโลยี',
                  description: 'ข้อเสนอเทคโนโลยี (static, SSR, headless CMS, hosting) และการตั้งค่าเบื้องต้น',
                },
                {
                  title: 'แผนการพัฒนา & Snippet',
                  description: 'แผนแบ่งงานเป็นขั้นตอน พร้อมตัวอย่างโค้ดสั้นๆ เพื่อเริ่มต้นทันที',
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
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ทำไมต้องใช้ LLM Advisor ของ TAMWEP</h2>
            <ul style={{ paddingLeft: '1.25rem', color: '#444' }}>
              <li>ให้คำแนะนำเชิงปฏิบัติได้จริง พร้อม checklist ที่ทำตามได้</li>
              <li>ยืดหยุ่น: สามารถอ้างอิงข้อมูลจาก URL หรือเอกสารที่คุณเตรียมให้</li>
              <li>ตอบเป็นภาษาธรรมชาติ พร้อมตัวอย่างโค้ดสั้นๆ เพื่อเริ่มต้นทันที</li>
            </ul>
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
              <label style={{ fontWeight: 700 }}>LLM Advisor — บอกสิ่งที่ต้องการแล้วกด "แนะนำ"</label>
              <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="เช่น เว็บไซต์ one-page สำหรับร้านกาแฟ" style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #d6d6d6' }} />
              <textarea value={sources} onChange={(e) => setSources(e.target.value)} placeholder="แหล่งข้อมูล (URL หรือข้อความสั้น) — ใส่ข้อมูลที่อยากให้ LLM อ้างอิง (ไม่บังคับ)" style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #d6d6d6', minHeight: 80 }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Tech stack (optional)" style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #d6d6d6', flex: 1 }} />
                <button
                  onClick={async () => {
                    if (!goal.trim()) return;
                    setAdvisorLoading(true);
                    setChecklist([]);
                    setSnippet('');
                    setResponseText('');
                    try {
                      const res = await fetch('/api/llm/recommend', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ goal, tech, sources }),
                      });
                      const data = await res.json();
                      if (data.ok) {
                        setChecklist(data.checklist || []);
                        setSnippet(data.snippet || '');
                        setResponseText(data.text || data.snippet || '');
                      } else {
                        setResponseText('ข้อผิดพลาด: ' + (data.error || 'unknown'));
                      }
                    } catch (e) {
                      setResponseText('ไม่สามารถเรียก LLM ได้');
                    } finally {
                      setAdvisorLoading(false);
                    }
                  }}
                  disabled={advisorLoading}
                  style={{ padding: '0.6rem 1rem', borderRadius: 8, background: '#111', color: '#fff', border: 'none' }}
                >
                  {advisorLoading ? 'กำลังเรียก LLM...' : 'แนะนำ'}
                </button>
              </div>

              {checklist.length > 0 && (
                <div style={{ background: '#fafafa', borderRadius: '0.75rem', padding: '1rem' }}>
                  <h4>Checklist</h4>
                  <ol>
                    {checklist.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ol>
                </div>
              )}

              {snippet && (
                <div style={{ background: '#111', color: '#fff', borderRadius: '0.75rem', padding: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Snippet</strong>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(snippet);
                        alert('คัดลอกแล้ว');
                      }}
                      style={{ background: '#fff', color: '#111', borderRadius: 6, padding: '0.25rem 0.5rem', border: 'none' }}
                    >
                      คัดลอก
                    </button>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>{snippet}</div>
                </div>
              )}
              {responseText && (
                <div style={{ background: '#f3f4f6', borderRadius: '0.75rem', padding: '1rem' }}>
                  <h4>คำอธิบาย</h4>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#111' }}>{responseText}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        

        <footer style={{ padding: '2rem 1rem', background: '#111', color: '#fff', marginTop: '3rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>TAMWEP</strong>
              <div style={{ fontSize: '0.9rem', color: '#ddd' }}>© {new Date().getFullYear()} TAMWEP</div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ddd' }}>Built with ❤️ — Prototype</div>
          </div>
        </footer>
      </main>
    </>
  );
}
