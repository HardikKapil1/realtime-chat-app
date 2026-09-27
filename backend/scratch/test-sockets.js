const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:5000';

async function testSocketFlow() {
  console.log('--- STARTING SOCKET.IO INTEGRATION TEST ---');

  // 1. Connect Client 1 (Hardik)
  const client1 = io(SERVER_URL);
  
  await new Promise((resolve) => {
    client1.on('connected', (data) => {
      console.log('Client 1 received "connected":', data);
      resolve();
    });
  });

  // 2. Connect Client 2 (Alice)
  const client2 = io(SERVER_URL);
  
  await new Promise((resolve) => {
    client2.on('connected', (data) => {
      console.log('Client 2 received "connected":', data);
      resolve();
    });
  });

  // Setup Online Users listener for Client 1 & 2
  client1.on('users_online', (users) => {
    console.log('[Client 1 Event] "users_online":', users);
  });

  client2.on('users_online', (users) => {
    console.log('[Client 2 Event] "users_online":', users);
  });

  // 3. Client 1 Joins Chat
  console.log('\n--- Client 1 (Hardik) joining chat ---');
  client1.emit('join_chat', { username: 'Hardik' });
  await new Promise((r) => setTimeout(r, 200));

  // 4. Client 2 Joins Chat
  console.log('\n--- Client 2 (Alice) joining chat ---');
  client2.emit('join_chat', { username: 'Alice' });
  await new Promise((r) => setTimeout(r, 200));

  // 5. Test Typing Indicator
  client2.on('user_typing', (data) => {
    console.log('[Client 2 Event] "user_typing":', data);
  });
  client2.on('user_stop_typing', (data) => {
    console.log('[Client 2 Event] "user_stop_typing":', data);
  });

  console.log('\n--- Client 1 typing indicator test ---');
  client1.emit('typing', { username: 'Hardik' });
  await new Promise((r) => setTimeout(r, 200));
  client1.emit('stop_typing', { username: 'Hardik' });
  await new Promise((r) => setTimeout(r, 200));

  // 6. Setup New Message Listener on both clients
  client1.on('new_message', (msg) => {
    console.log('[Client 1 Event] "new_message":', msg);
  });
  client2.on('new_message', (msg) => {
    console.log('[Client 2 Event] "new_message":', msg);
  });

  // 7. Send Real-Time Message from Client 1
  console.log('\n--- Client 1 sending message ---');
  client1.emit('send_message', {
    username: 'Hardik',
    text: 'Hello everyone!',
  });
  await new Promise((r) => setTimeout(r, 300));

  // 8. Test Error Handling (Invalid Empty Message)
  client1.on('message_error', (err) => {
    console.log('[Client 1 Event] "message_error":', err);
  });

  console.log('\n--- Client 1 sending invalid empty message ---');
  client1.emit('send_message', {
    username: 'Hardik',
    text: '    ',
  });
  await new Promise((r) => setTimeout(r, 300));

  // 9. Client 2 Disconnects
  console.log('\n--- Client 2 disconnecting ---');
  client2.disconnect();
  await new Promise((r) => setTimeout(r, 300));

  client1.disconnect();
  console.log('--- TEST COMPLETE ---');
  process.exit(0);
}

testSocketFlow().catch(console.error);
