import { useRouter } from 'next/router';

export default function AuthError({ error }: { error?: string | null }) {
  const router = useRouter();
  const errorMessage = error ? String(error) : router.query.error ? String(router.query.error) : 'ไม่ทราบสาเหตุ';

  return (
    <div style={{ padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <h2>เกิดข้อผิดพลาดในการเข้าสู่ระบบ</h2>
      <p>{errorMessage}</p>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      error: context.query.error || null,
    },
  };
}
