import { getCsrfToken } from 'next-auth/react';

export default function SignIn({ csrfToken }: { csrfToken: string | null }) {
  return (
    <div style={{ padding: '3rem', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <h1>เข้าสู่ระบบ TAMWEP</h1>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken ?? ''} />
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>อีเมล</label>
          <input name="email" type="email" required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>รหัสผ่าน</label>
          <input name="password" type="password" required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: '0.6rem', background: '#111827', color: '#fff', border: 'none', borderRadius: 6 }}>เข้าสู่ระบบด้วยอีเมล</button>
      </form>
      <div style={{ marginTop: '1.5rem' }}>
        <a href="/api/auth/signin/google">เข้าสู่ระบบด้วย Google</a>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <a href="/api/auth/signin/email">เข้าสู่ระบบด้วยลิงก์อีเมล</a>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}
