"use client"
import { useEffect, useState } from 'react';

import io from 'socket.io-client';

let socket;

const Chat = ({username}) => {

  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (username) {
      socket = io({ query: { username } }); // Connect to Socket.io with username

      // Listen for incoming messages for this specific room (username)
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on('connect', () => {
        console.log('Connected to chat with', username);
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [username]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        content: input,
        sender: 'User', // Replace with actual user data or logged-in user
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      socket.emit('chat message', message);

      // Update local state
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat with {username}</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
