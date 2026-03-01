import { io } from 'socket.io-client';
import { API_BASE_URL } from './api';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL?.replace('/api/v1', '');

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
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
