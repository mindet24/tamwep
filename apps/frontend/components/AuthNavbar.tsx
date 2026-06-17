'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthNavbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#174477',
      color: 'white'
    }}>
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        TAMWEP
      </Link>
      <div>
        {session?.user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Welcome, {session.user.name}</span>
            <button
              onClick={() => signOut()}
              style={{
                padding: '0.5rem 1rem',
                background: '#ffb733',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => signIn('google')}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
