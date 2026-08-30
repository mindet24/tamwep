'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AuthNavbar() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#0f172a',
      color: 'white',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>
        TAMWEP
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <a href="#hero" style={{ color: 'white', textDecoration: 'none' }}>
          หน้าแรก
        </a>
        <a href="#services" style={{ color: 'white', textDecoration: 'none' }}>
          บริการ
        </a>
        <a href="#works" style={{ color: 'white', textDecoration: 'none' }}>
          ผลงาน
        </a>
        <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>
          ติดต่อ
        </a>
        {session?.user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>สวัสดี, {session.user.name}</span>
            <button
              onClick={() => signOut()}
              style={{
                padding: '0.55rem 1rem',
                background: '#ffb733',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            style={{
              padding: '0.55rem 1rem',
              background: '#fff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            เข้าสู่ระบบ
          </button>
        )}
      </div>
    </nav>
  );
}
