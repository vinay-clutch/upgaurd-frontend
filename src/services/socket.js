import { io } from 'socket.io-client';
import { API_BASE_URL } from './api';

let socket = null;

// Derived strictly from the production API URL
const SOCKET_URL = API_BASE_URL?.replace('/api/v1', '');

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true // For production cross-domain sessions
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
