const express = require('express');
const { body, validationResult } = require('express-validator');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const { sport, tournament, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    
    if (sport) filter.sport = sport;
    if (tournament) filter.tournament = tournament;

    const teams = await Team.find(filter)
      .populate('createdBy', 'username')
      .populate('tournament', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Team.countDocuments(filter);

    res.json({
      success: true,
      teams,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('tournament', 'name sport');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create team
router.post('/', [
  body('name').notEmpty().withMessage('Team name is required'),
  body('sport').isIn(['Cricket', 'Football', 'Basketball', 'Chess', 'Volleyball', 'Badminton', 'Table Tennis'])
    .withMessage('Invalid sport'),
  body('members').isArray({ min: 1 }).withMessage('At least one member is required'),
  body('captain').notEmpty().withMessage('Captain is required')
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

    const { name, sport, members, captain, viceCaptain, tournament } = req.body;

    // Check if tournament exists and is open for registration
    if (tournament) {
      const tournamentDoc = await Tournament.findById(tournament);
      if (!tournamentDoc) {
        return res.status(404).json({ success: false, message: 'Tournament not found' });
      }
      if (tournamentDoc.status !== 'upcoming') {
        return res.status(400).json({ success: false, message: 'Tournament is not open for registration' });
      }
    }

    // Validate captain is in members list
    if (!members.some(member => member.name === captain)) {
      return res.status(400).json({ success: false, message: 'Captain must be in members list' });
    }

    // Validate vice captain is in members list
    if (viceCaptain && !members.some(member => member.name === viceCaptain)) {
      return res.status(400).json({ success: false, message: 'Vice captain must be in members list' });
    }

    const teamData = {
      name,
      sport,
      members: members.map(member => ({
        name: member.name,
        position: member.position,
        isCaptain: member.name === captain,
        isViceCaptain: member.name === viceCaptain
      })),
      captain,
      viceCaptain,
      createdBy: req.user._id,
      tournament
    };

    const team = new Team(teamData);
    await team.save();

    // Update tournament teams array
    if (tournament) {
      await Tournament.findByIdAndUpdate(tournament, {
        $push: { teams: team._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is creator or admin
    if (team.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(team, req.body);
    await team.save();

    res.json({
      success: true,
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is creator or admin
    if (team.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Remove team from tournament
    if (team.tournament) {
      await Tournament.findByIdAndUpdate(team.tournament, {
        $pull: { teams: team._id }
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

