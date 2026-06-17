import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>TAMWEP - รับทำเว็บไซต์</title>
        <meta name="description" content="บริการรับทำเว็บไซต์ โดย วีระศักดิ์ และ ศักดิ์ดินนท์" />
      </Head>
      <main style={{padding: '4rem', fontFamily: 'Segoe UI, Tahoma, sans-serif'}}>
        <h1>TAMWEP</h1>
        <p>Welcome to the frontend scaffold. Run `npm run dev` inside `apps/frontend`.</p>
      </main>
    </>
  );
}
