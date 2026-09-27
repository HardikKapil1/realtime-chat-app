/**
 * Network Configuration for Backend API & Socket.io Connection
 *
 * NOTE FOR MOBILE / EMULATOR DEVELOPMENT:
 * - When testing on Web browser: Use "http://localhost:5000"
 * - When testing on Android Emulator: Use "http://10.0.2.2:5000" (Android routes 10.0.2.2 to host machine's localhost)
 * - When testing on Physical iOS/Android device over Wi-Fi: Replace with your local machine's IP address (e.g. "http://192.168.1.100:5000")
 */

// Change this host IP address when connecting from physical devices or Android Emulator
const HOST_IP = "192.168.1.3";
export const PORT = '5000';

export const API_BASE_URL = `http://${HOST_IP}:${PORT}`;
export const SOCKET_URL = `http://${HOST_IP}:${PORT}`;
