import React from 'react';
import { useMatches } from '../contexts/MatchContext';
import './LandingPage.css';

const LiveScoresPage: React.FC = () => {
  const { liveMatches } = useMatches();

  return (
    <div className="landing-page">
      <section className="live-scoreboard-section">
        <div className="container">
          <div className="section-heading-image">
            <img src="/live-scoreboard-heading.png" alt="Live Scoreboard" className="heading-img" />
          </div>
          <div className="scoreboard-grid">
            {liveMatches.length > 0 ? (
              liveMatches.map(match => (
                <div key={match.id} className="scoreboard-card">
                  <div className="scoreboard-header">
                    <div className="sport-info">
                      <img src={`/${match.sport.toLowerCase()}-logo.png`} alt={match.sport} className="sport-logo-small" />
                      <span className="sport-name">{match.sport}</span>
                    </div>
                    <div className="match-status live">LIVE</div>
                  </div>
                  <div className="match-details">
                    <div className="team">
                      <span className="team-name">{match.team1.name}</span>
                      <span className="team-score">{match.score1}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="team">
                      <span className="team-name">{match.team2.name}</span>
                      <span className="team-score">{match.score2}</span>
                    </div>
                  </div>
                  <div className="match-info">
                    {match.sport === 'Cricket' && match.cricket && (
                      <>
                        <span className="overs">Overs: {match.cricket.overs}.{match.cricket.balls}</span>
                        <span className="run-rate">RR: {match.cricket.runs > 0 ? (match.cricket.runs / (match.cricket.overs + match.cricket.balls / 6)).toFixed(1) : '0.0'}</span>
                      </>
                    )}
                    {match.sport === 'Basketball' && match.basketball && (
                      <>
                        <span className="quarter">Q{match.basketball.quarter}</span>
                        <span className="time">{Math.floor(match.basketball.timeRemaining / 60)}:{(match.basketball.timeRemaining % 60).toString().padStart(2, '0')}</span>
                      </>
                    )}
                    {match.sport === 'Football' && match.football && (
                      <>
                        <span className="phase">{match.football.phase}</span>
                        <span className="time">{Math.floor(match.football.timeRemaining / 60)}:{(match.football.timeRemaining % 60).toString().padStart(2, '0')}</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-live-matches">
                <p>No live matches currently</p>
                <p>Start a match to see live scores here!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveScoresPage;
