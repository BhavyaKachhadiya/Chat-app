"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket = io();

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input && username) {
      const message = { content: input, sender: username, timestamp: new Date() };
      socket.emit('chat message', message);
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='text-black'
      />
      <input
        type="text"
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
         className='text-black'
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
