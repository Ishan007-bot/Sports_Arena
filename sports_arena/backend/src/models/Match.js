const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis']
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team1Name: {
    type: String,
    required: true
  },
  team2Name: {
    type: String,
    required: true
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  venue: {
    type: String,
    trim: true
  },
  referee: {
    type: String,
    trim: true
  },
  scorer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score1: {
    type: Number,
    default: 0
  },
  score2: {
    type: Number,
    default: 0
  },
  scoringData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  currentPhase: {
    type: String
  },
  timeRemaining: {
    type: Number
  },
  isTimerRunning: {
    type: Boolean,
    default: false
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  result: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
MatchSchema.index({ sport: 1, status: 1 });
MatchSchema.index({ tournament: 1 });
MatchSchema.index({ scheduledDate: 1 });
MatchSchema.index({ matchId: 1 });

module.exports = mongoose.model('Match', MatchSchema);

