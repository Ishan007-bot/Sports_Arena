import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitScoreUpdate: (data: any) => void;
  emitBasketballScoreUpdate: (data: any) => void;
  emitFootballScoreUpdate: (data: any) => void;
  emitCricketScoreUpdate: (data: any) => void;
  joinMatch: (matchId: string) => void;
  leaveMatch: (matchId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Initializing Socket.IO connection...');
    
    // Create real Socket.IO connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected:', newSocket.id);
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      setIsConnected(false);
    });
    
    newSocket.on('connect_error', (error: any) => {
      console.error('❌ Socket.IO connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log('Closing Socket.IO connection...');
      newSocket.close();
    };
  }, []);

  const emitScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      socket.emit('score-update', data);
    }
  };

  const emitBasketballScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      console.log('🚀 Emitting basketball score update:', data);
      socket.emit('basketball-score-update', data);
    } else {
      console.log('❌ Socket not connected, cannot emit basketball score update');
    }
  };

  const emitFootballScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      console.log('🚀 Emitting football score update:', data);
      socket.emit('football-score-update', data);
    } else {
      console.log('❌ Socket not connected, cannot emit football score update');
    }
  };

  const emitCricketScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      socket.emit('cricket-score-update', data);
    }
  };

  const joinMatch = (matchId: string) => {
    if (socket && isConnected) {
      console.log('🚀 Joining match room:', matchId);
      socket.emit('join-match', matchId);
    } else {
      console.log('❌ Socket not connected, cannot join match room');
    }
  };

  const leaveMatch = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-match', matchId);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    emitScoreUpdate,
    emitBasketballScoreUpdate,
    emitFootballScoreUpdate,
    emitCricketScoreUpdate,
    joinMatch,
    leaveMatch
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
