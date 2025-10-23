const express = require('express');
const { body, validationResult } = require('express-validator');
const Match = require('../models/Match');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
  try {
    const { sport, status, tournament, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (sport) filter.sport = sport;
    if (status) filter.status = status;
    if (tournament) filter.tournament = tournament;

    const matches = await Match.find(filter)
      .populate('team1', 'name')
      .populate('team2', 'name')
      .populate('scorer', 'username')
      .populate('tournament', 'name')
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(filter);

    res.json({
      success: true,
      matches,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1', 'name members')
      .populate('team2', 'name members')
      .populate('scorer', 'username')
      .populate('tournament', 'name sport')
      .populate('winner', 'name');

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    res.json({ success: true, match });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create match
router.post('/', [
  body('sport').isIn(['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis'])
    .withMessage('Invalid sport'),
  body('team1').isMongoId().withMessage('Valid team1 ID is required'),
  body('team2').isMongoId().withMessage('Valid team2 ID is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { team1, team2, sport, scheduledDate, venue, referee, tournament } = req.body;

    // Validate teams exist
    const [team1Doc, team2Doc] = await Promise.all([
      Team.findById(team1),
      Team.findById(team2)
    ]);

    if (!team1Doc || !team2Doc) {
      return res.status(404).json({ success: false, message: 'One or both teams not found' });
    }

    if (team1Doc.sport !== sport || team2Doc.sport !== sport) {
      return res.status(400).json({ success: false, message: 'Teams must be for the same sport' });
    }

    // Generate unique match ID
    const matchId = `${sport.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const matchData = {
      matchId,
      sport,
      team1,
      team2,
      team1Name: team1Doc.name,
      team2Name: team2Doc.name,
      scheduledDate: new Date(scheduledDate),
      venue,
      referee,
      scorer: req.user._id,
      tournament
    };

    const match = new Match(matchData);
    await match.save();

    // Update tournament matches array
    if (tournament) {
      await Tournament.findByIdAndUpdate(tournament, {
        $push: { matches: match._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start match
router.post('/:id/start', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Match is not in upcoming status' });
    }

    match.status = 'live';
    match.startTime = new Date();
    await match.save();

    res.json({
      success: true,
      message: 'Match started successfully',
      match
    });
  } catch (error) {
    console.error('Start match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// End match
router.post('/:id/end', async (req, res) => {
  try {
    const { winner, result, notes } = req.body;
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'live') {
      return res.status(400).json({ success: false, message: 'Match is not live' });
    }

    match.status = 'completed';
    match.endTime = new Date();
    match.winner = winner;
    match.result = result;
    match.notes = notes;
    await match.save();

    res.json({
      success: true,
      message: 'Match ended successfully',
      match
    });
  } catch (error) {
    console.error('End match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

