import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all .2s ease' }}>
      <nav style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="#hero"><a style={{ fontWeight: 800, color: '#111', textDecoration: 'none', fontSize: '1.05rem' }}>TAMWEP</a></Link>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>รับทำเว็บไซต์</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#services" style={{ color: '#333', textDecoration: 'none' }}>บริการ</a>
          <a href="#why" style={{ color: '#333', textDecoration: 'none' }}>ทำไมเรา</a>
          <a href="#works" style={{ color: '#333', textDecoration: 'none' }}>ผลงาน</a>
          <a href="#llm" style={{ color: '#333', textDecoration: 'none' }}>LLM</a>
          <a href="#contact" style={{ padding: '0.5rem 0.9rem', borderRadius: 9999, background: '#111', color: '#fff', textDecoration: 'none' }}>ติดต่อ</a>
        </div>
      </nav>
    </header>
  );
}
