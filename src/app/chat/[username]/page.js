"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

let socket;

const Chat = ({params}) => {
  params.username = decodeURIComponent(params.username)
  const {data:session}= useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    
      if (params.username && session) {
        socket = io();
         // Join room based on username
      socket.emit('join', params.username);

      

      // Listen for incoming messages for this specific room (username)
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on('connect', () => {
        console.log('Connected to chat with', params.username);
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [params.username, session]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        content: input,
        sender: session?.user?.name || "Guest", // Replace with actual user data or logged-in user
        receiver: params.username,
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      if (socket) {
        socket.emit('chat message', message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setInput('');
      } else {
        console.error('Socket is not connected');
      }
    }
  };

  return (
    <div>
      <h1>Chat with {params.username}</h1>
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
          className='text-black'
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
