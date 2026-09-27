const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables from .env file
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000;

// Create HTTP Server wrapping Express application
const server = http.createServer(app);

// Attach Socket.io to the HTTP Server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.io Event Listeners
initializeSocket(io);

// Start Server and Connect to Database
const startServer = () => {
  // Start HTTP Server
  server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🌐 HTTP Server listening on port ${PORT}`);
    console.log(`⚡ Socket.io ready for real-time WebSocket connections`);
    console.log(`🏥 Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });

  // Connect to MongoDB asynchronously
  connectDB();
};

startServer();

// Handle uncaught exceptions and unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Process] Unhandled Promise Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err.message);
  process.exit(1);
});
