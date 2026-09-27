const messageService = require('../services/messageService');

/**
 * In-memory map for tracking online users: socketId -> username
 */
const onlineUsers = new Map();

/**
 * Helper to retrieve a unique list of online usernames.
 * @returns {Array<string>} Array of unique active usernames
 */
const getOnlineUsersList = () => {
  return Array.from(new Set(onlineUsers.values()));
};

/**
 * Configure and attach Socket.io event listeners.
 * @param {Server} io - Socket.io Server instance
 */
const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Emit "connected" event to the newly connected client
    socket.emit('connected', {
      socketId: socket.id,
      message: 'Connected to real-time chat server',
    });

    // 1. Online User Tracking: "join_chat"
    socket.on('join_chat', (data) => {
      const username = typeof data === 'object' && data !== null ? data.username : data;
      const trimmedUsername = typeof username === 'string' ? username.trim() : '';

      if (trimmedUsername) {
        onlineUsers.set(socket.id, trimmedUsername);
        console.log(`[Socket.io] ${trimmedUsername} joined chat (socket: ${socket.id})`);

        // Broadcast updated list of online users to all connected clients
        io.emit('users_online', getOnlineUsersList());
      }
    });

    // 2. Real-Time Messaging: "send_message"
    socket.on('send_message', async (data) => {
      try {
        const rawUsername = data?.username;
        const rawText = data?.text;

        const trimmedUsername = typeof rawUsername === 'string' ? rawUsername.trim() : '';
        const trimmedText = typeof rawText === 'string' ? rawText.trim() : '';

        // Input validation
        if (!trimmedUsername) {
          socket.emit('message_error', { message: 'Username is required and cannot be empty.' });
          return;
        }

        if (!trimmedText) {
          socket.emit('message_error', { message: 'Message text is required and cannot be empty.' });
          return;
        }

        // Persist message to MongoDB FIRST (Database is source of truth)
        const savedMessage = await messageService.createMessage({
          username: trimmedUsername,
          text: trimmedText,
        });

        // Broadcast persisted message to all connected clients
        io.emit('new_message', {
          _id: savedMessage._id,
          username: savedMessage.username,
          text: savedMessage.text,
          createdAt: savedMessage.createdAt,
        });

        console.log(`[Socket.io] Message broadcasted from ${savedMessage.username}`);
      } catch (error) {
        console.error(`[Socket.io] Error saving/broadcasting message: ${error.message}`);
        // Do NOT broadcast on failure; send error to sender socket only
        socket.emit('message_error', { message: error.message || 'Failed to save and send message.' });
      }
    });

    // 3. Typing Indicators: "typing" and "stop_typing"
    socket.on('typing', (data) => {
      const username = typeof data === 'object' && data !== null ? data.username : data;
      if (username) {
        socket.broadcast.emit('user_typing', { username });
      }
    });

    socket.on('stop_typing', (data) => {
      const username = typeof data === 'object' && data !== null ? data.username : data;
      if (username) {
        socket.broadcast.emit('user_stop_typing', { username });
      }
    });

    // 4. Disconnect Handling
    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Client disconnected: ${socket.id} (Reason: ${reason})`);

      if (onlineUsers.has(socket.id)) {
        const username = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        console.log(`[Socket.io] User left chat: ${username}`);

        // Broadcast updated online users list
        io.emit('users_online', getOnlineUsersList());
      }
    });
  });
};

module.exports = initializeSocket;
