const http = require('http');
const https = require('https');
const { URL } = require('url');

function request(url, opts = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = typeof url === 'string' ? new URL(url) : url;
    const lib = u.protocol === 'https:' ? https : http;
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: opts.method || 'GET',
      headers: opts.headers || {}
    };
    const req = lib.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const port = process.env.PORT || process.argv[2] || '3003';
  const base = `http://localhost:${port}`;

  // GET CSRF
  const r1 = await request(base + '/api/auth/csrf');
  console.log('CSRF response status:', r1.statusCode);
  console.log('CSRF response headers:', JSON.stringify(r1.headers));
  const cookies = r1.headers['set-cookie'] || [];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  let csrf;
  try {
    csrf = JSON.parse(r1.body).csrfToken;
  } catch (e) {
    console.error('Failed to parse CSRF response:', r1.body);
    process.exit(1);
  }

  // POST credentials
  const params = new URLSearchParams();
  params.append('csrfToken', csrf);
  params.append('email', 'test@example.com');
  params.append('password', 'pass123');
  const postBody = params.toString();

  const r2 = await request(base + '/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postBody),
      'Cookie': cookieHeader
    }
  }, postBody);

  console.log('Callback response status:', r2.statusCode);
  console.log('Callback response headers:', JSON.stringify(r2.headers));

  const cookies2 = r2.headers['set-cookie'] || cookies;
  const cookieHeader2 = (Array.isArray(cookies2) ? cookies2 : [cookies2]).map(c => c.split(';')[0]).join('; ');

  // GET session
  const r3 = await request(base + '/api/auth/session', {
    headers: { 'Cookie': cookieHeader2 }
  });
  let session = {};
  try { session = JSON.parse(r3.body); } catch (e) { session = r3.body; }
  console.log('status:', r3.statusCode);
  console.log('session:', JSON.stringify(session, null, 2));

  // GET debug token endpoint
  try {
    const r4 = await request(base + '/api/debug/token', {
      headers: { 'Cookie': cookieHeader2 }
    });
    let dbg = {};
    try { dbg = JSON.parse(r4.body); } catch (e) { dbg = r4.body; }
    console.log('debug token status:', r4.statusCode);
    console.log('debug token:', JSON.stringify(dbg, null, 2));
  } catch (e) {
    console.error('debug token request failed:', e);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
