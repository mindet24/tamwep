import { getCsrfToken } from 'next-auth/react';

export default function SignIn({ csrfToken }: { csrfToken: string | null }) {
  return (
    <div style={{ padding: '3rem', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <h1>เข้าสู่ระบบ TAMWEP</h1>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken ?? ''} />
        <label>
          อีเมล
          <input name="email" type="email" required />
        </label>
        <label>
          รหัสผ่าน
          <input name="password" type="password" required />
        </label>
        <button type="submit">เข้าสู่ระบบด้วยอีเมล</button>
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
