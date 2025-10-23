const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  maxTeams: {
    type: Number,
    min: 2,
    max: 32
  },
  format: {
    type: String,
    trim: true
  },
  rules: {
    type: String,
    trim: true
  },
  prizes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
TournamentSchema.index({ sport: 1, status: 1 });
TournamentSchema.index({ createdBy: 1 });
TournamentSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Tournament', TournamentSchema);

