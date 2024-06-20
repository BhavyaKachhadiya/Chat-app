// pages/_app.js
import { useEffect } from 'react';
import io from 'socket.io-client';


let socket;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('chat message', (msg) => {
      console.log('message received:', msg);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
