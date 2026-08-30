const http = require('http');
const fs = require('fs').promises;

const HOST = 'localhost';
const PORT = process.env.PORT || 3000;
const URL = '/api/contact';
const PAYLOAD = { name: 'Tester', email: 'tester@example.com', message: 'สวัสดีครับ ผมทดสอบฟอร์ม' };
const DATA_FILE = 'apps/frontend/data/submissions.json';

function post(payload) {
  const data = JSON.stringify(payload);
  const options = {
    hostname: HOST,
    port: PORT,
    path: URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) { json = body; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Running contact API smoke test...');

  // 1) Single POST should succeed
  const first = await post(PAYLOAD);
  console.log('first status:', first.status);
  console.log('first body:', first.body);
  if (first.status !== 200) {
    console.error('First request failed');
    process.exit(2);
  }

  // wait a moment for server to persist
  await new Promise((r) => setTimeout(r, 300));

  // 2) Check persistence
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    const found = arr.find((e) => e.email === PAYLOAD.email && e.message && e.message.includes('ทดสอบ'));
    if (!found) {
      console.error('Persistence check FAILED: entry not found in', DATA_FILE);
      process.exit(3);
    }
    console.log('Persistence check passed — entry found.');
  } catch (e) {
    console.error('Failed to read/parse', DATA_FILE, e);
    process.exit(4);
  }

  // 3) Rate-limit: send 11 quick requests and expect the last to be 429 (server limit: 10/hour)
  let lastStatus = null;
  for (let i = 0; i < 11; i++) {
    // small delay to avoid being too aggressive
    await new Promise((r) => setTimeout(r, 50));
    const r = await post(PAYLOAD);
    lastStatus = r.status;
  }
  console.log('status after 11 submissions:', lastStatus);
  if (lastStatus !== 429) {
    console.error('Rate limit check FAILED: expected final status 429');
    process.exit(5);
  }

  console.log('All tests passed.');
}

run().catch((err) => { console.error('Test error', err); process.exit(1); });
