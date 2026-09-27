# Real-Time Chat Application

A full-stack real-time chat application built for a 24-hour hiring assignment.

## Tech Stack

- **Backend**: Node.js + Express
- **Real-Time Layer**: Socket.io
- **Database**: MongoDB + Mongoose
- **Frontend**: React Native + Expo (built with built-in React Native components)

---

## Directory Structure

```
realtime-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── healthController.js
│   │   │   └── messageController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Message.js
│   │   ├── routes/
│   │   │   ├── healthRoutes.js
│   │   │   ├── index.js
│   │   │   └── messageRoutes.js
│   │   ├── services/
│   │   │   └── messageService.js
│   │   └── sockets/
│   │       └── socketHandler.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BannerAlert.js
│   │   │   ├── Header.js
│   │   │   ├── MessageBubble.js
│   │   │   ├── MessageInput.js
│   │   │   └── TypingIndicator.js
│   │   ├── constants/
│   │   │   └── config.js
│   │   ├── screens/
│   │   │   ├── ChatScreen.js
│   │   │   └── UsernameScreen.js
│   │   └── services/
│   │       ├── apiService.js
│   │       └── socketService.js
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── index.js
│
└── README.md
```

---

## Quick Start Instructions

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend starts at `http://localhost:5000` (or `http://YOUR_LOCAL_IP:5000`).

- **Health Check Endpoint**: `GET http://localhost:5000/api/health`
- **REST Messages Endpoint**: `GET http://localhost:5000/api/messages`

---

### 2. Configure & Start the Frontend (Expo)

Navigate to the `frontend` folder:

```bash
cd frontend
npm install
```

#### Network Configuration (`frontend/src/constants/config.js`):
Before running Expo, verify host settings in `frontend/src/constants/config.js`:

- **Web Browser**: Use `HOST_IP = 'localhost'`
- **Android Emulator**: Use `HOST_IP = '10.0.2.2'`
- **Physical iOS/Android Device over Wi-Fi**: Use your computer's local IP address (e.g. `HOST_IP = '192.168.1.100'`)

#### Run Expo App:

```bash
npm start
```

Press:
- `w` to open in Web Browser
- `a` to open in Android Emulator
- Scan the QR code with Expo Go app on a physical mobile device.

---

## How REST and Socket.io are Connected

1. **Initial Load (REST)**: When a user joins the chat screen (`ChatScreen.js`), the frontend calls `GET /api/messages` using Axios (`apiService.js`) to load all stored message history from MongoDB sorted from oldest to newest.
2. **Real-Time Communication (Socket.io)**:
   - When the user sends a message, `socket.emit("send_message", { username, text })` sends the payload over WebSockets.
   - The backend `socketHandler.js` validates, trims, and saves the message to MongoDB **first**.
   - Upon successful database persistence, the backend broadcasts `new_message` to all connected clients.
   - The frontend listens for `new_message` and appends the message immediately to the `FlatList` without triggering REST polling or page reloads.
