const http = require('http');

const samples = [
  {
    title: 'บทความ: วิธีออกแบบเว็บไซต์สำหรับธุรกิจขนาดเล็ก',
    content:
      'การออกแบบเว็บไซต์สำหรับธุรกิจขนาดเล็กควรเน้นความเรียบง่าย ชัดเจน และมุ่งสู่เป้าหมายทางธุรกิจ เช่น การเพิ่มยอดขายหรือการรวบรวมลูกค้าเป้าหมาย ให้ความสำคัญกับการแสดงข้อมูลติดต่อ และการนำเสนอผลิตภัณฑ์/บริการด้วยภาพที่ชัดเจน รวมถึงการโหลดหน้าเร็วและการรองรับมือถือเป็นสิ่งสำคัญ',
  },
  {
    title: 'สถิติ & เทรนด์ 2026 (ตัวอย่าง)',
    content:
      'เทรนด์ล่าสุด: Progressive Web Apps และ Jamstack ยังคงได้รับความนิยมสำหรับเว็บธุรกิจ; ผู้ใช้บนมือถือมากกว่า 60% ใช้ค้นหาบริการธุรกิจ; การโหลดหน้าใน < 2 วินาทีช่วยลด bounce rate อย่างมีนัยสำคัญ',
  },
  {
    title: 'รายการเครื่องมือ & เทคโนโลยี',
    content:
      'Frameworks: Next.js, Astro, SvelteKit; CMS: Strapi, Contentful, Sanity; Hosting: Vercel, Netlify, Cloudflare Pages; DB: SQLite, PostgreSQL; Search/Vector DB: SQLite + embedding store, Pinecone, Milvus',
  },
];

function post(doc, cb) {
  const data = JSON.stringify(doc);
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/rag/ingest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'x-forwarded-for': '9.8.7.6'
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (c) => body += c);
    res.on('end', () => cb(null, res.statusCode, body));
  });
  req.on('error', (e) => cb(e));
  req.write(data);
  req.end();
}

(async () => {
  for (const s of samples) {
    await new Promise((resolve) => {
      post(s, (err, status, body) => {
        if (err) console.error('error', err);
        else console.log('status', status, body);
        resolve(null);
      });
    });
  }
  console.log('done');
})();
