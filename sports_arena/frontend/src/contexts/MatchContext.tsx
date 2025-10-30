import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Match {
  id: string;
  tournamentId: string;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  sport: string;
  status: 'upcoming' | 'live' | 'finished' | 'completed';
  startTime?: string;
  endTime?: string;
  duration?: number;
  phase?: string;
  // Sport-specific data
  basketball?: {
    quarter: number;
    timeRemaining: number;
    isTimerRunning: boolean;
    totalQuarters: number;
  };
  football?: {
    timeRemaining: number;
    isTimerRunning: boolean;
    phase: string;
    goals: Array<{id: string, team: string, player: string, timestamp: string, minute: number}>;
  };
  cricket?: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    extras: {wide: number, noBall: number, bye: number, legBye: number};
  };
}

interface MatchContextType {
  liveMatches: Match[];
  allMatches: Match[];
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  setMatchStatus: (matchId: string, status: Match['status']) => void;
  deleteMatch: (matchId: string) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};

interface MatchProviderProps {
  children: React.ReactNode;
}

export const MatchProvider: React.FC<MatchProviderProps> = ({ children }) => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const { socket, isConnected } = useSocket();

  const liveMatches = allMatches.filter(match => match.status === 'live');

  const addMatch = (match: Match) => {
    setAllMatches(prev => [...prev, match]);
  };

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
    setAllMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, ...updates }
          : match
      )
    );
  };

  const setMatchStatus = (matchId: string, status: Match['status']) => {
    updateMatch(matchId, { status });
  };

  const deleteMatch = (matchId: string) => {
    setAllMatches(prev => prev.filter(match => match.id !== matchId));
  };

  // Listen for real-time match updates
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('match-updated', (data: any) => {
        console.log('Received match update:', data);
        if (data.matchId && data.updates) {
          updateMatch(data.matchId, data.updates);
        }
      });

      socket.on('basketball-score-updated', (data: any) => {
        console.log('🎯 Received basketball score update:', data);
        if (data.matchId && data.scoringData) {
          console.log('🔄 Updating match with new scores:', data.scoringData);
          updateMatch(data.matchId, {
            score1: data.scoringData.score1 || 0,
            score2: data.scoringData.score2 || 0,
            basketball: {
              quarter: data.scoringData.quarter || 1,
              timeRemaining: data.scoringData.timeRemaining || 0,
              isTimerRunning: data.scoringData.isTimerRunning || false,
              totalQuarters: data.scoringData.totalQuarters || 4
            }
          });
          console.log('✅ Match updated successfully');
        } else {
          console.log('❌ Invalid basketball score update data:', data);
        }
      });

      socket.on('football-score-updated', (data: any) => {
        console.log('🎯 Received football score update:', data);
        if (data.matchId && data.scoringData) {
          console.log('🔄 Updating match with new scores:', data.scoringData);
          updateMatch(data.matchId, {
            score1: data.scoringData.score1 || 0,
            score2: data.scoringData.score2 || 0,
            football: {
              timeRemaining: data.scoringData.timeRemaining || 0,
              isTimerRunning: data.scoringData.isTimerRunning || false,
              phase: data.scoringData.phase || 'pre-match',
              goals: data.scoringData.goals || []
            }
          });
          console.log('✅ Match updated successfully');
        } else {
          console.log('❌ Invalid football score update data:', data);
        }
      });

      socket.on('cricket-score-updated', (data: any) => {
        console.log('Received cricket score update:', data);
        if (data.matchId && data.scoringData) {
          updateMatch(data.matchId, {
            cricket: {
              runs: data.scoringData.runs || 0,
              wickets: data.scoringData.wickets || 0,
              overs: data.scoringData.overs || 0,
              balls: data.scoringData.balls || 0,
              extras: data.scoringData.extras || {wide: 0, noBall: 0, bye: 0, legBye: 0}
            }
          });
        }
      });

      return () => {
        socket.off('match-updated');
        socket.off('basketball-score-updated');
        socket.off('football-score-updated');
        socket.off('cricket-score-updated');
      };
    }
  }, [socket, isConnected]);

  const value: MatchContextType = {
    liveMatches,
    allMatches,
    addMatch,
    updateMatch,
    setMatchStatus,
    deleteMatch
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};

