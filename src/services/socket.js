import { io } from 'socket.io-client';

let socket = null;

const SOCKET_URL = window.location.port === '5173'
  ? 'http://localhost:3005'
  : window.location.origin;

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
