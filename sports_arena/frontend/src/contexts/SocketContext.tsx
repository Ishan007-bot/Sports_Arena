import React, { createContext, useContext, useEffect, useState } from 'react';

// Socket.IO types (will be available after npm install)
interface Socket {
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  close: () => void;
}

// Mock Socket.IO until package is installed
const createSocket = (url: string) => {
  return {
    on: (event: string, callback: (data: any) => void) => {
      console.log(`Socket event listener: ${event}`);
    },
    off: (event: string, callback?: (data: any) => void) => {
      console.log(`Socket event removed: ${event}`);
    },
    emit: (event: string, data: any) => {
      console.log(`Socket emit: ${event}`, data);
    },
    close: () => {
      console.log('Socket closed');
    }
  };
};

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
    // Create mock socket for now (will be replaced with real Socket.IO after npm install)
    const newSocket = createSocket('http://localhost:5000');
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      console.log('Mock Socket.IO connected');
    }, 1000);

    setSocket(newSocket);

    return () => {
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
      socket.emit('basketball-score-update', data);
    }
  };

  const emitFootballScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      socket.emit('football-score-update', data);
    }
  };

  const emitCricketScoreUpdate = (data: any) => {
    if (socket && isConnected) {
      socket.emit('cricket-score-update', data);
    }
  };

  const joinMatch = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('join-match', matchId);
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
