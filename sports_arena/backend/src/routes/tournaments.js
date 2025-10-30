const express = require('express');
const { body, validationResult } = require('express-validator');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Match = require('../models/Match');
// Authentication disabled for testing

const router = express.Router();

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const { sport, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (sport) filter.sport = sport;
    if (status) filter.status = status;

    const tournaments = await Tournament.find(filter)
      .populate('createdBy', 'username email')
      .populate('teams', 'name members')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tournament.countDocuments(filter);

    res.json({
      success: true,
      tournaments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('teams', 'name members captain viceCaptain')
      .populate({
        path: 'matches',
        populate: [
          { path: 'team1', select: 'name' },
          { path: 'team2', select: 'name' },
          { path: 'scorer', select: 'username' }
        ]
      });

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.json({ success: true, tournament });
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create tournament
router.post('/', [
  body('name').notEmpty().withMessage('Tournament name is required'),
  body('sport').isIn(['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis'])
    .withMessage('Invalid sport'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
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

    const tournamentData = {
      ...req.body,
      createdBy: 'test-user-id' // No authentication required
    };

    const tournament = new Tournament(tournamentData);
    await tournament.save();

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      tournament
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update tournament
router.put('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Check if user is creator or admin (temporarily disabled for testing)
    // if (tournament.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Not authorized' });
    // }

    Object.assign(tournament, req.body);
    await tournament.save();

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      tournament
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Check if user is creator or admin (temporarily disabled for testing)
    // if (tournament.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Not authorized' });
    // }

    // Delete associated teams and matches
    await Team.deleteMany({ tournament: tournament._id });
    await Match.deleteMany({ tournament: tournament._id });
    await Tournament.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get tournament teams
router.get('/:id/teams', async (req, res) => {
  try {
    const teams = await Team.find({ tournament: req.params.id })
      .populate('createdBy', 'username');

    res.json({ success: true, teams });
  } catch (error) {
    console.error('Get tournament teams error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get tournament matches
router.get('/:id/matches', async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.id })
      .populate('team1', 'name')
      .populate('team2', 'name')
      .populate('scorer', 'username')
      .sort({ scheduledDate: 1 });

    res.json({ success: true, matches });
  } catch (error) {
    console.error('Get tournament matches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

