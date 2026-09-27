# Real-Time Chat Application

A modern, full-stack real-time chat application built with **React Native (Expo)** on the frontend and **Node.js, Express, Socket.io, and MongoDB** on the backend.

---

## Overview

This application provides a seamless real-time messaging experience across Mobile (iOS/Android) and Web platforms. On launch, users enter a username to join a live global chat room. Message history is retrieved via a REST API from MongoDB, and subsequent messages, user presence, and typing indicators are handled in real-time over WebSockets powered by Socket.io.

---

## Features

- **Real-Time Messaging**: Instant message delivery and broadcast across all connected clients via Socket.io.
- **Message History Persistence**: Messages are validated and persisted in MongoDB before being broadcasted.
- **Initial State Hydration**: Message history is retrieved via a REST API when joining the chat.
- **Online User Presence**: Live active user counter and online user badge list.
- **Typing Indicators**: Real-time typing status notification with auto-stop debouncing.
- **Cross-Platform Interface**: Responsive, modern dark-themed UI built for iOS, Android, and Web using React Native.
- **Connection Health & Banner Alerts**: Dynamic notification banner for disconnections, reconnection attempts, and server errors.

---

## Tech Stack

### Frontend
- **Framework**: React Native with Expo (SDK 57)
- **Web Support**: React Native Web & React DOM
- **Safe Area Management**: `react-native-safe-area-context`
- **Networking**: Axios (REST API) & `socket.io-client` (WebSockets)

### Backend
- **Runtime**: Node.js & Express.js
- **Real-Time Protocol**: Socket.io v4
- **Database**: MongoDB with Mongoose ORM
- **Utilities**: CORS, dotenv, nodemon

---

## Architecture

```
React Native
     │
     ├── REST API ────────► Express
     │                         │
     │                         ▼
     │                      MongoDB
     │
     └── Socket.io ───────► Socket.io Server
                                │
                                ▼
                         Real-time broadcast
```

### Flow Explanation
1. **Initial Hydration (REST API)**: When a client opens `ChatScreen`, it issues an HTTP `GET /api/messages` request. Express queries MongoDB and returns the message history ordered chronologically.
2. **Real-Time Layer (Socket.io)**: Upon entering the chat, the client establishes a persistent WebSocket connection. When a user sends a message, it is emitted to the server via the `send_message` event.
3. **Database First Pattern**: The backend validates input and saves the message to MongoDB first. Only after successful database insertion does the server broadcast `new_message` to all connected sockets.

---

## Project Structure

```
realtime-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── healthController.js # Server health check logic
│   │   │   └── messageController.js# REST endpoints for fetching & creating messages
│   │   ├── middleware/
│   │   │   └── errorHandler.js    # Global Express error handler
│   │   ├── models/
│   │   │   └── Message.js         # Mongoose schema for chat messages
│   │   ├── routes/
│   │   │   ├── healthRoutes.js    # Health route definition
│   │   │   ├── index.js           # Centralized API router
│   │   │   └── messageRoutes.js   # Message REST endpoints
│   │   ├── services/
│   │   │   └── messageService.js  # Database access layer for messages
│   │   └── sockets/
│   │       └── socketHandler.js   # Socket.io event listeners & presence logic
│   ├── app.js                     # Express app setup and middleware configuration
│   ├── server.js                  # Server entry point (HTTP & Socket.io server listener)
│   ├── .env                       # Environment variables
│   ├── .env.example               # Template environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BannerAlert.js     # Connection status and error banner
│   │   │   ├── Header.js          # Header with online user count and status dot
│   │   │   ├── MessageBubble.js   # Render individual message bubbles with timestamps
│   │   │   ├── MessageInput.js    # Input box with send button and typing emitter
│   │   │   └── TypingIndicator.js # Animated typing indicator bar
│   │   ├── constants/
│   │   │   └── config.js          # Host IP, API, and Socket URLs configuration
│   │   ├── screens/
│   │   │   ├── ChatScreen.js      # Main chat view containing messages list & socket setup
│   │   │   └── UsernameScreen.js  # Entry screen to input username
│   │   └── services/
│   │       ├── apiService.js      # Axios HTTP client calls
│   │       └── socketService.js   # Socket.io client wrapper functions
│   ├── App.js                     # Main application entry point
│   ├── app.json                   # Expo app configuration manifest
│   ├── index.js                   # Expo root component registration
│   └── package.json
│
└── README.md
```

---

## Project Setup

### Steps to Run the Backend
1. Open terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Steps to Run the Frontend
1. Open terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Update host settings in `frontend/src/constants/config.js` if connecting from physical devices (`HOST_IP = "<YOUR_LOCAL_IP>"`).
4. Launch Expo development server:
   ```bash
   npm start
   ```
5. Press `w` to open in browser, or scan the QR code using **Expo Go** on a mobile device.

---

## Backend Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB installed locally OR a MongoDB Atlas connection string

### Steps to Run the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000` (or `http://<YOUR_LOCAL_IP>:5000`).

---

## Frontend Setup

### Prerequisites
- Node.js (v16+ recommended)
- Expo Go app on iOS/Android device (optional for testing on physical phone)

### Steps to Run the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Network Settings in `frontend/src/constants/config.js`:
   - **Web Browser**: Set `HOST_IP = "localhost"`
   - **Android Emulator**: Set `HOST_IP = "10.0.2.2"`
   - **Physical Device**: Set `HOST_IP` to your computer's local Wi-Fi IP address (e.g. `HOST_IP = "192.168.1.3"`).

4. Start the Expo development server:
   ```bash
   npm start
   ```

   - Press `w` to launch in Web Browser.
   - Scan the displayed QR code using the **Expo Go** app on your physical mobile device.
   - To connect from a mobile device on a different network, run:
     ```bash
     npx expo start --tunnel
     ```

---

## Environment Variables Required

### Backend Configuration (`backend/.env`)

| Variable | Description | Default Value | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Port on which the Express & Socket.io server listens | `5000` | Yes |
| `MONGODB_URI` | Connection URI for local or cloud MongoDB instance | `mongodb://localhost:27017/realtime_chat_db` | Yes |
| `CORS_ORIGIN` | Allowed cross-origin domain(s) for HTTP and WebSockets | `*` | Yes |

---

## API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check & DB status | None | `{ status: "OK", timestamp, database: "connected" }` |
| `GET` | `/messages` | Fetch stored message history sorted chronologically | None | `[ { _id, username, text, createdAt }, ... ]` |
| `POST` | `/messages` | Save a new message via REST API | `{ username: string, text: string }` | `{ _id, username, text, createdAt }` |

---

## Socket.io Events

### Client ──► Server Events

| Event Name | Payload Format | Description |
| :--- | :--- | :--- |
| `join_chat` | `{ username: string }` | Registers socket ID with username and updates online users list. |
| `send_message` | `{ username: string, text: string }` | Emits a new chat message to be persisted and broadcasted. |
| `typing` | `{ username: string }` | Triggers active typing status for the user. |
| `stop_typing` | `{ username: string }` | Clears active typing status for the user. |

### Server ──► Client Events

| Event Name | Payload Format | Description |
| :--- | :--- | :--- |
| `connected` | `{ socketId: string, message: string }` | Emitted to newly connected client acknowledging connection. |
| `users_online` | `Array<string>` | Broadcasts updated list of online unique usernames. |
| `new_message` | `{ _id, username, text, createdAt }` | Broadcasts newly saved message to all connected clients. |
| `user_typing` | `{ username: string }` | Broadcasts to other clients that a specific user is typing. |
| `user_stop_typing` | `{ username: string }` | Broadcasts to other clients that user stopped typing. |
| `message_error` | `{ message: string }` | Sent back to sender socket if message saving or validation fails. |

---

## Design Decisions

### Single Global Conversation
The application uses a single global conversation because the assignment requires real-time messaging but does not require multiple rooms or private conversations. Socket.io broadcasts new persisted messages to all connected clients. The architecture can be extended to room-based messaging by introducing a `roomId` and using Socket.io rooms.

### Persistence Before Broadcast
When a `send_message` socket event arrives, the server persists the message to MongoDB **first**. Only upon successful database insertion is the `new_message` payload broadcasted to all connected clients. If database insertion fails, an isolated `message_error` event is returned only to the sender, ensuring data integrity across clients.

### Dual-Protocol Architecture
Using REST API for initial message history hydration and WebSockets (Socket.io) for live messaging reduces initial WebSocket handshake payload sizes and avoids re-sending history over socket streams.

---

## Assumptions Made

1. **Open Room Access**: Users join a global public room upon providing a display username.
2. **Simplified User Authentication**: User identification is based on display usernames. Production deployments can integrate JWT authentication tokens into Socket.io connection handshakes and HTTP authorization headers.
3. **Database Availability**: A reachable MongoDB instance (local or Atlas) is running prior to starting the backend.

---

## Testing

### Manual Functional Testing
1. **Multi-Tab Web Testing**:
   - Open `http://localhost:8081` (or local dev port) in two separate browser windows/incognito tabs with different usernames.
   - Send messages from Window A; verify instant receipt in Window B.
   - Start typing in Window A; verify typing indicator displays in Window B.
2. **Mobile + Web Integration**:
   - Launch the app on an Android/iOS physical device via Expo Go.
   - Connect simultaneously on Web. Verify bi-directional communication between mobile and web clients.
3. **Disconnection & Reconnection Test**:
   - Stop the backend process (`Ctrl+C`). Observe warning banner in frontend.
   - Restart backend (`npm run dev`). Verify socket automatically reconnects without page refresh.

---

## Screenshots

*(Add application screenshots showcasing Username Screen, Live Chat view, and Typing Indicators)*

| Username Screen | Chat Screen |
| :---: | :---: |
| ![Username Screen](https://via.placeholder.com/300x600?text=Username+Screen) | ![Chat Screen](https://via.placeholder.com/300x600?text=Chat+Screen) |

---

## APK

- You can build the production Android APK using EAS CLI:
  ```bash
  cd frontend
  npx eas-cli build -p android --profile preview
  ```
- **Direct APK Download Link**: *(Insert hosted APK link here when built)*

---

## Live Backend URL

- **Production Health Check Endpoint**: `https://your-backend-service.onrender.com/api/health`
- **Production API Base**: `https://your-backend-service.onrender.com/api`
- **Production Socket Server**: `https://your-backend-service.onrender.com`
