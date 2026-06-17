export default function AuthError({ error }: { error?: string | null }) {
  return (
    <div style={{ padding: '3rem', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <h1>เกิดข้อผิดพลาดในการเข้าสู่ระบบ</h1>
      <p>{error ? `ข้อผิดพลาด: ${error}` : 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองอีกครั้ง'}</p>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      error: context.query.error || null
    }
  };
}
