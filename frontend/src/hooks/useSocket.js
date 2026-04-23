import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

/**
 * Custom hook for Socket.IO connection
 * Manages real-time communication for chat and notifications
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const socketRef = useRef(null);

  /**
   * Initialize socket connection
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Create socket connection
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      // Message events
      newSocket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on('message_sent', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Typing events
      newSocket.on('user_typing', ({ sender, bloodRequest }) => {
        setTypingUsers((prev) => new Set([...prev, `${sender}_${bloodRequest}`]));
      });

      newSocket.on('user_stop_typing', ({ sender, bloodRequest }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(`${sender}_${bloodRequest}`);
          return newSet;
        });
      });

      // Interest notification
      newSocket.on('new_interest', (data) => {
        console.log('New interest received:', data);
        // You can trigger a toast notification here
      });

      // Status update notification
      newSocket.on('status_update', (data) => {
        console.log('Request status updated:', data);
        // You can refresh the request list here
      });

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  /**
   * Join a blood request room
   */
  const joinRequest = (requestId) => {
    if (socket) {
      socket.emit('join_request', requestId);
    }
  };

  /**
   * Leave a blood request room
   */
  const leaveRequest = (requestId) => {
    if (socket) {
      socket.emit('leave_request', requestId);
    }
  };

  /**
   * Send a message
   */
  const sendMessage = (recipient, bloodRequest, content) => {
    if (socket) {
      socket.emit('send_message', { recipient, bloodRequest, content });
    }
  };

  /**
   * Emit typing indicator
   */
  const startTyping = (recipient, bloodRequest) => {
    if (socket) {
      socket.emit('typing', { recipient, bloodRequest });
    }
  };

  /**
   * Stop typing indicator
   */
  const stopTyping = (recipient, bloodRequest) => {
    if (socket) {
      socket.emit('stop_typing', { recipient, bloodRequest });
    }
  };

  /**
   * Notify interest expressed
   */
  const notifyInterest = (requestId, recipientId, donorId) => {
    if (socket) {
      socket.emit('interest_expressed', { requestId, recipientId, donorId });
    }
  };

  /**
   * Notify status change
   */
  const notifyStatusChange = (requestId, status) => {
    if (socket) {
      socket.emit('request_status_changed', { requestId, status });
    }
  };

  return {
    socket,
    connected,
    messages,
    typingUsers,
    joinRequest,
    leaveRequest,
    sendMessage,
    startTyping,
    stopTyping,
    notifyInterest,
    notifyStatusChange
  };
};
