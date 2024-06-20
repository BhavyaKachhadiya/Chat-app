import { Server } from 'socket.io';
import Message from '@/app/models/Message';
import connectToDatabase from '@/app/lib/mongodb';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: "*", // You can specify the origin you want to allow, e.g., "http://localhost:3000"
      methods: ["GET", "POST"],
    }
  });
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', async (msg) => {
      await connectToDatabase();
      const message = new Message(msg);
      await message.save();
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  res.end();
};

export default SocketHandler;