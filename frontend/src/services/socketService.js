import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';

let socket = null;

/**
 * Initialize and connect Socket.io client.
 * @param {string} username - Current user's username
 * @returns {Socket} Socket instance
 */
export const connectSocket = (username) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected with ID:', socket.id);
    if (username) {
      socket.emit('join_chat', { username });
    }
  });

  return socket;
};

/**
 * Disconnect socket and reset instance.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit "send_message" event to server.
 * @param {string} username
 * @param {string} text
 */
export const emitSendMessage = (username, text) => {
  if (socket && socket.connected) {
    socket.emit('send_message', { username, text });
  } else {
    console.warn('[Socket] Cannot send message: Socket is not connected.');
  }
};

/**
 * Emit "typing" indicator event.
 * @param {string} username
 */
export const emitTyping = (username) => {
  if (socket && socket.connected) {
    socket.emit('typing', { username });
  }
};

/**
 * Emit "stop_typing" indicator event.
 * @param {string} username
 */
export const emitStopTyping = (username) => {
  if (socket && socket.connected) {
    socket.emit('stop_typing', { username });
  }
};

/**
 * Get active socket instance.
 */
export const getSocket = () => socket;
