# Real-Time Chat Application

A full-stack real-time chat application built as a 24-hour hiring assignment. The app lets users join a live global chat room with real-time messaging, typing indicators, and online presence — running on React Native (Expo) for the frontend and Node.js + Socket.io + MongoDB on the backend.

---

## Overview

Users enter a username to join a shared global chat room. Message history is fetched via a REST API on join, and subsequent messages are delivered instantly via Socket.io WebSockets. The backend validates and persists every message to MongoDB before broadcasting to all connected clients.

---

## Features

- ⚡ **Real-time messaging** — instant delivery via Socket.io
- 📜 **Message history** — persisted in MongoDB, loaded via REST on join
- 👥 **Online presence** — live count of connected users
- ✍️ **Typing indicators** — shows who is typing with auto-stop debounce
- 🌐 **Cross-platform** — iOS, Android, and Web via React Native / Expo
- 🔔 **Connection banners** — live disconnect/reconnect status alerts
- ☁️ **Production-ready** — deployed backend on Render, builds via EAS

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Mobile/Web frontend | React Native + Expo SDK 57 |
| Web renderer | React Native Web |
| REST client | Axios |
| WebSocket client | socket.io-client v4 |
| Backend runtime | Node.js + Express.js |
| Real-time server | Socket.io v4 |
| Database | MongoDB + Mongoose |
| Cloud hosting | Render (backend) |
| Mobile builds | EAS Build (Expo) |

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

### Flow

1. **Initial hydration**: On joining the chat screen, the client calls `GET /api/messages` (Axios → Express → MongoDB) to load chat history.
2. **Real-time messaging**: A persistent WebSocket connection is established. When a user sends a message, it is emitted via the `send_message` Socket.io event.
3. **Persist-then-broadcast**: The server saves the message to MongoDB first. Only after successful persistence does it broadcast `new_message` to all connected clients.

---

## Project Structure

```
realtime-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── healthController.js    # Health check logic
│   │   │   └── messageController.js   # REST message handlers
│   │   ├── middleware/
│   │   │   └── errorHandler.js        # Global error handler
│   │   ├── models/
│   │   │   └── Message.js             # Mongoose schema
│   │   ├── routes/
│   │   │   ├── index.js               # Central router
│   │   │   ├── healthRoutes.js
│   │   │   └── messageRoutes.js
│   │   ├── services/
│   │   │   └── messageService.js      # DB access layer
│   │   └── sockets/
│   │       └── socketHandler.js       # Socket.io event handlers
│   ├── app.js                         # Express app + middleware
│   ├── server.js                      # HTTP + Socket.io server entry
│   ├── .env.example                   # Env variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BannerAlert.js         # Connection error/warning banner
│   │   │   ├── Header.js              # Online count + connection dot
│   │   │   ├── MessageBubble.js       # Chat bubble with timestamp
│   │   │   ├── MessageInput.js        # Text input + send + typing emit
│   │   │   └── TypingIndicator.js     # "X is typing..." bar
│   │   ├── constants/
│   │   │   └── config.js              # API + Socket URLs
│   │   ├── screens/
│   │   │   ├── ChatScreen.js          # Main chat view + socket lifecycle
│   │   │   └── UsernameScreen.js      # Username entry screen
│   │   └── services/
│   │       ├── apiService.js          # Axios REST calls
│   │       └── socketService.js       # Socket.io client wrapper
│   ├── App.js
│   ├── app.json                       # Expo app config + EAS project ID
│   ├── eas.json                       # EAS Build profiles
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## Backend API

### Base URL: `https://realtime-chat-app-etdh.onrender.com/api`

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check + DB status | — | `{ status, timestamp, database }` |
| `GET` | `/messages` | Load all messages (chronological) | — | `[{ _id, username, text, createdAt }]` |
| `POST` | `/messages` | Save a message via REST | `{ username, text }` | `{ _id, username, text, createdAt }` |

---

## Socket.io Events

### Client → Server

| Event | Payload | Description |
| :--- | :--- | :--- |
| `join_chat` | `{ username }` | Register user and broadcast updated online list |
| `send_message` | `{ username, text }` | Save message and broadcast to all clients |
| `typing` | `{ username }` | Notify others that user is typing |
| `stop_typing` | `{ username }` | Notify others that user stopped typing |

### Server → Client

| Event | Payload | Description |
| :--- | :--- | :--- |
| `connected` | `{ socketId, message }` | Sent to newly connected client |
| `users_online` | `string[]` | Updated online user list |
| `new_message` | `{ _id, username, text, createdAt }` | New persisted message for all clients |
| `user_typing` | `{ username }` | Someone is typing |
| `user_stop_typing` | `{ username }` | Someone stopped typing |
| `message_error` | `{ message }` | Error sent only to the failing sender |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

> Copy `backend/.env.example` to `backend/.env` and fill in your values.

---

## Local Setup

### Prerequisites
- Node.js v16+
- MongoDB running locally **or** a MongoDB Atlas URI
- Expo Go installed on your mobile device (optional)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npx expo start
```

> Before starting, update `frontend/src/constants/config.js`:
> - **Browser**: keep `API_BASE_URL = "http://localhost:5000"` or use the Render URL
> - **Physical device**: set your local machine IP
> - **Production**: use `https://realtime-chat-app-etdh.onrender.com`

Press `w` to open in browser, or scan the QR code with Expo Go on your phone.
For cross-network devices:

```bash
npx expo start --tunnel
```

---

## Production

| Service | Provider | URL |
| :--- | :--- | :--- |
| Backend API + Socket.io | Render | `https://realtime-chat-app-etdh.onrender.com` |
| Database | MongoDB Atlas | Managed cloud cluster |
| Mobile builds | Expo EAS | [EAS Dashboard](https://expo.dev/accounts/hardikkapil/projects/realtime-chat) |

### Live URLs

- **Health check**: `https://realtime-chat-app-etdh.onrender.com/api/health`
- **Messages API**: `https://realtime-chat-app-etdh.onrender.com/api/messages`
- **Socket server**: `https://realtime-chat-app-etdh.onrender.com`

> **Note**: The free Render tier spins down after ~15 minutes of inactivity. The first request after a cold start may take 30–60 seconds.

---

## Design Decisions

### Single Global Chat Room
The application uses a single global conversation because the assignment requires a real-time chat application but does not require room-based messaging. Socket.io broadcasts new persisted messages to all connected clients. The architecture can be extended to room-based messaging by introducing a `roomId` field on messages and using Socket.io's `socket.join(roomId)` / `io.to(roomId).emit()` pattern.

### Persist Before Broadcast
Messages are saved to MongoDB before being broadcast to any client. If the database write fails, only the sender receives a `message_error` event — no failed message is ever shown to other users. This ensures database and UI consistency.

### REST + WebSocket Dual-Protocol Design
Using REST to load message history on join and WebSockets for live messaging is a deliberate separation of concerns. REST is ideal for paginated, cacheable history retrieval. WebSockets are ideal for low-latency live events. Mixing them (e.g., sending full history over a socket) would unnecessarily increase WebSocket payload sizes.

### In-Memory Online User Tracking
Online users are tracked in a `Map<socketId, username>` in memory on the server. This is sufficient for a single-server deployment. For a horizontally-scaled backend, this would need to be replaced with a shared store such as Redis.

---

## Assumptions

1. **No authentication required**: Users identify themselves with a self-assigned username. No passwords or sessions are implemented.
2. **Single room**: All connected users share one global chat. No private messages or separate rooms.
3. **MongoDB available**: A running MongoDB instance (local or Atlas) is expected before the backend starts.
4. **Single server instance**: The in-memory online user map works for a single Node.js process.

---

## Testing

### Manual Tests

1. **Multi-tab (Web)**: Open the app in two browser tabs with different usernames. Send a message from Tab A — verify it appears instantly in Tab B.
2. **Typing indicators**: Start typing in Tab A — verify the typing indicator appears in Tab B. Stop typing — verify it disappears.
3. **Mobile + Web**: Run Expo Go on a physical device alongside the web browser. Verify messages send and receive across both.
4. **Disconnect/reconnect**: Stop the backend (`Ctrl+C`). The frontend shows a disconnect warning banner. Restart — socket auto-reconnects.
5. **Message persistence**: Reload the page — historical messages load from MongoDB via REST.

---

## Screenshots

*(Screenshots of the Username Screen, Chat Screen, and Typing Indicator)*

| Username Screen | Chat Screen |
| :---: | :---: |
| *(add screenshot)* | *(add screenshot)* |

---

## APK

Built with EAS Build (Expo Application Services).

```bash
cd frontend
npx eas-cli build --platform android --profile preview
```

**Download APK**: [EAS Build Page](https://expo.dev/accounts/hardikkapil/projects/realtime-chat/builds/7c469c00-1252-46c1-aeea-53c643a60891)
