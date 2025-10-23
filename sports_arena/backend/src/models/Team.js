const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  isCaptain: {
    type: Boolean,
    default: false
  },
  isViceCaptain: {
    type: Boolean,
    default: false
  }
});

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis']
  },
  members: [TeamMemberSchema],
  captain: {
    type: String,
    required: true,
    trim: true
  },
  viceCaptain: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
TeamSchema.index({ sport: 1, isActive: 1 });
TeamSchema.index({ tournament: 1 });
TeamSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Team', TeamSchema);

