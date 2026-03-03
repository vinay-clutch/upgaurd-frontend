import { io } from 'socket.io-client';
import { SOCKET_URL } from './config';

let socket = null;

export function getSocket() {
  if (!socket) {
    console.log("Connecting to socket:", SOCKET_URL);
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
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
