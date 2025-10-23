const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Match = require('../models/Match');

const setupSocketHandlers = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user?.username} connected with socket ID: ${socket.id}`);

    // Join match room for real-time updates
    socket.on('join-match', async (matchId) => {
      try {
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        socket.join(`match-${matchId}`);
        socket.emit('joined-match', { matchId, message: 'Successfully joined match room' });
        
        console.log(`User ${socket.user?.username} joined match ${matchId}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join match' });
      }
    });

    // Leave match room
    socket.on('leave-match', (matchId) => {
      socket.leave(`match-${matchId}`);
      socket.emit('left-match', { matchId, message: 'Left match room' });
    });

    // General scoring updates
    socket.on('score-update', async (data) => {
      try {
        const { matchId, action, scoringData } = data;
        
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        // Check if user is scorer or admin
        if (match.scorer.toString() !== socket.user._id && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Not authorized to update scores' });
          return;
        }

        // Update scoring based on action
        switch (action) {
          case 'score':
            if (scoringData.team === 'team1') {
              match.score1 += scoringData.points || 1;
            } else {
              match.score2 += scoringData.points || 1;
            }
            break;
          case 'timer':
            match.timeRemaining = scoringData.timeRemaining;
            match.isTimerRunning = scoringData.isTimerRunning;
            match.currentPhase = scoringData.currentPhase;
            break;
          case 'phase':
            match.currentPhase = scoringData.phase;
            break;
        }

        // Update scoring data
        match.scoringData = {
          ...match.scoringData,
          ...scoringData,
          lastUpdated: new Date()
        };

        await match.save();

        // Broadcast update to all users in the match room
        io.to(`match-${matchId}`).emit('score-updated', {
          matchId,
          scoringData: match.scoringData,
          scores: {
            team1: match.score1,
            team2: match.score2
          },
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Score update error:', error);
        socket.emit('error', { message: 'Failed to update score' });
      }
    });

    // Sport-specific scoring updates
    socket.on('cricket-score-update', async (data) => {
      try {
        const { matchId, action, scoringData } = data;
        
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        // Update cricket-specific scoring logic here
        match.scoringData = {
          ...match.scoringData,
          cricket: {
            ...match.scoringData.cricket,
            ...scoringData,
            lastUpdated: new Date()
          }
        };

        await match.save();

        // Broadcast update
        io.to(`match-${matchId}`).emit('cricket-score-updated', {
          matchId,
          scoringData: match.scoringData.cricket,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Cricket score update error:', error);
        socket.emit('error', { message: 'Failed to update cricket score' });
      }
    });

    // Football scoring updates
    socket.on('football-score-update', async (data) => {
      try {
        const { matchId, action, scoringData } = data;
        
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        // Update football-specific scoring logic here
        match.scoringData = {
          ...match.scoringData,
          football: {
            ...match.scoringData.football,
            ...scoringData,
            lastUpdated: new Date()
          }
        };

        await match.save();

        // Broadcast update
        io.to(`match-${matchId}`).emit('football-score-updated', {
          matchId,
          scoringData: match.scoringData.football,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Football score update error:', error);
        socket.emit('error', { message: 'Failed to update football score' });
      }
    });

    // Basketball scoring updates
    socket.on('basketball-score-update', async (data) => {
      try {
        const { matchId, action, scoringData } = data;
        
        const match = await Match.findById(matchId);
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        // Update basketball-specific scoring logic here
        match.scoringData = {
          ...match.scoringData,
          basketball: {
            ...match.scoringData.basketball,
            ...scoringData,
            lastUpdated: new Date()
          }
        };

        await match.save();

        // Broadcast update
        io.to(`match-${matchId}`).emit('basketball-score-updated', {
          matchId,
          scoringData: match.scoringData.basketball,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Basketball score update error:', error);
        socket.emit('error', { message: 'Failed to update basketball score' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.username} disconnected`);
    });
  });
};

module.exports = { setupSocketHandlers };

