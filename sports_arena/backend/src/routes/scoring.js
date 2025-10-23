const express = require('express');
const { body, validationResult } = require('express-validator');
const Match = require('../models/Match');
const { requireScorer } = require('../middleware/auth');

const router = express.Router();

// Get scoring data for a match
router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    res.json({
      success: true,
      match,
      scoringData: match.scoringData
    });
  } catch (error) {
    console.error('Get scoring data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update match scoring
router.post('/:matchId/update', requireScorer, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { action, data } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Check if user is scorer or admin
    if (match.scorer.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update scoring data based on action
    switch (action) {
      case 'score':
        if (data.team === 'team1') {
          match.score1 += data.points || 1;
        } else {
          match.score2 += data.points || 1;
        }
        break;
      case 'timer':
        match.timeRemaining = data.timeRemaining;
        match.isTimerRunning = data.isTimerRunning;
        match.currentPhase = data.currentPhase;
        break;
      case 'phase':
        match.currentPhase = data.phase;
        break;
    }

    // Update scoring data
    match.scoringData = {
      ...match.scoringData,
      ...data,
      lastUpdated: new Date()
    };

    await match.save();

    res.json({
      success: true,
      message: 'Scoring updated successfully',
      match
    });
  } catch (error) {
    console.error('Update scoring error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

