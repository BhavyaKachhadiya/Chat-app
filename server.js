// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

const Message = mongoose.model('Message', {
  sender: String,
  receiver: String,
  content: String,
  timestamp: Date,
});
const User = mongoose.model('User', {
  email: String,
  username: String,
  password: String,
});

app.prepare().then(() => {
  const server = express();
  server.use(cors());

  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // You can specify the origin to allow, e.g., "http://localhost:3000"
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
  
 
    socket.on('join', (username) => {
      socket.join(username);
      console.log(`User ${socket.id} joined room: ${username}`);
    });
  
    socket.on('chat message', (msg) => {
      const newMessage = new Message({
        sender: msg.sender,
        receiver: msg.receiver || "Guest",
        content: msg.content,
        timestamp: new Date(),
      });
      newMessage.save()
        .then(() => {
          console.log('Message saved');
          io.to(username).emit('chat message', msg); // Emit message to the specific room (username)
        })
        .catch((err) => console.error(err));
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3001; // Changed to 3001
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
