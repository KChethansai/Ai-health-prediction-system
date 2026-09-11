import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

// Singleton: call once from server.js with the http server.
// Reminder namespace reserved for live medication notifications.
export const initSocket = (httpServer) => {
  if (io) return io;
  io = new Server(httpServer, {
    cors: { origin: (process.env.FRONTEND_URL || '').split(',').filter(Boolean) || true, credentials: true },
  });
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });
  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.sub}`);
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};
