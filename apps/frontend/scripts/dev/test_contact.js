const http = require('http');

const data = JSON.stringify({ name: 'Tester', email: 'tester@example.com', message: 'สวัสดีครับ ผมทดสอบฟอร์ม' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('status:', res.statusCode);
    try {
      console.log('body:', JSON.parse(body));
    } catch (e) {
      console.log('body raw:', body);
    }
  });
});

req.on('error', (e) => { console.error('request error', e); });
req.write(data);
req.end();
