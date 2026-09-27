const http = require('http');

const testCases = [
  {
    name: 'Reject missing username',
    data: { text: 'Hello!' },
    expectedStatus: 400,
  },
  {
    name: 'Reject empty username (whitespace only)',
    data: { username: '   ', text: 'Hello!' },
    expectedStatus: 400,
  },
  {
    name: 'Reject missing/empty text',
    data: { username: 'Hardik', text: '   ' },
    expectedStatus: 400,
  },
  {
    name: 'Valid message creation',
    data: { username: '  Alice  ', text: '  Welcome to the chat!  ' },
    expectedStatus: 201,
  },
];

async function runTests() {
  for (const tc of testCases) {
    await new Promise((resolve) => {
      const payload = JSON.stringify(tc.data);
      const req = http.request(
        {
          hostname: 'localhost',
          port: 5000,
          path: '/api/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            console.log(`[${tc.name}] Status: ${res.statusCode} (Expected: ${tc.expectedStatus})`);
            console.log(`Response: ${body}\n`);
            resolve();
          });
        }
      );
      req.write(payload);
      req.end();
    });
  }

  // Check GET /api/messages ordering (oldest to newest)
  http.get('http://localhost:5000/api/messages', (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log(`[GET /api/messages] Status: ${res.statusCode}`);
      const json = JSON.parse(body);
      console.log(`Messages count: ${json.messages.length}`);
      console.log('Messages list:', JSON.stringify(json, null, 2));
    });
  });
}

runTests();
