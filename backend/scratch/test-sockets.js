const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:5000';
const socketOptions = {
  transports: ['websocket'], // Force WebSocket transport to avoid HTTP long-polling upgrade re-transmissions
  forceNew: true,
};

// Helper function to await a specific socket event with timeout
function waitForEvent(socket, eventName, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${eventName}" after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function testSocketFlow() {
  console.log('=== STARTING RELIABLE SOCKET.IO INTEGRATION TEST ===\n');

  // 1. Connect Client 1 (Hardik)
  const client1 = io(SERVER_URL, socketOptions);
  const conn1 = await waitForEvent(client1, 'connected');
  console.log('✔ Client 1 connected:', conn1);

  // 2. Connect Client 2 (Alice)
  const client2 = io(SERVER_URL, socketOptions);
  const conn2 = await waitForEvent(client2, 'connected');
  console.log('✔ Client 2 connected:', conn2);

  // Set up continuous online users logging for visibility
  client1.on('users_online', (users) => {
    console.log('[Client 1 Event] "users_online":', users);
  });
  client2.on('users_online', (users) => {
    console.log('[Client 2 Event] "users_online":', users);
  });

  // 3. Client 1 Joins Chat
  console.log('\n--- Step 1: Client 1 (Hardik) joining chat ---');
  const onlinePromise1 = waitForEvent(client1, 'users_online');
  client1.emit('join_chat', { username: 'Hardik' });
  const users1 = await onlinePromise1;
  console.log('✔ Verified Online Users after Client 1 joins:', users1);

  // 4. Client 2 Joins Chat
  console.log('\n--- Step 2: Client 2 (Alice) joining chat ---');
  const onlinePromise2 = waitForEvent(client1, 'users_online');
  client2.emit('join_chat', { username: 'Alice' });
  const users2 = await onlinePromise2;
  console.log('✔ Verified Online Users after Client 2 joins:', users2);

  // 5. Test Typing Indicator
  console.log('\n--- Step 3: Typing Indicator Test ---');
  const typingPromise = waitForEvent(client2, 'user_typing');
  client1.emit('typing', { username: 'Hardik' });
  const typingData = await typingPromise;
  console.log('✔ Verified Client 2 received "user_typing":', typingData);

  const stopTypingPromise = waitForEvent(client2, 'user_stop_typing');
  client1.emit('stop_typing', { username: 'Hardik' });
  const stopTypingData = await stopTypingPromise;
  console.log('✔ Verified Client 2 received "user_stop_typing":', stopTypingData);

  // 6. Send Real-Time Message from Client 1
  console.log('\n--- Step 4: Real-Time Message Persistence & Broadcast ---');
  const msg1Promise = waitForEvent(client1, 'new_message');
  const msg2Promise = waitForEvent(client2, 'new_message');

  client1.emit('send_message', {
    username: 'Hardik',
    text: 'Hello everyone!',
  });

  const [msg1, msg2] = await Promise.all([msg1Promise, msg2Promise]);
  console.log('✔ Verified Client 1 received "new_message":', msg1);
  console.log('✔ Verified Client 2 received "new_message":', msg2);

  // 7. Test Error Handling (Invalid Empty Message)
  console.log('\n--- Step 5: Error Handling (Empty Message Rejection) ---');
  const errorPromise = waitForEvent(client1, 'message_error');
  client1.emit('send_message', {
    username: 'Hardik',
    text: '    ',
  });
  const errData = await errorPromise;
  console.log('✔ Verified Client 1 received "message_error":', errData);

  // 8. Client 2 Disconnects and Verify Online Users Update
  console.log('\n--- Step 6: Disconnect Handling & Online Users Update ---');
  const disconnectOnlinePromise = waitForEvent(client1, 'users_online');

  console.log('Disconnecting Client 2 (Alice)...');
  client2.disconnect();

  const finalUsers = await disconnectOnlinePromise;
  console.log('✔ Verified Online Users on Client 1 after Client 2 disconnects:', finalUsers);

  // Clean up Client 1
  client1.disconnect();
  console.log('\n=== INTEGRATION TEST SUCCESSFULLY COMPLETED ===');
  process.exit(0);
}

testSocketFlow().catch((err) => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});
