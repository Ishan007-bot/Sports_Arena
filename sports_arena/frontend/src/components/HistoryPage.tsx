import React, { useMemo, useState } from 'react';
import { useMatches } from '../contexts/MatchContext';
import './LandingPage.css';

const HistoryPage: React.FC = () => {
  const { allMatches, deleteMatch } = useMatches();

  const [selectedSport, setSelectedSport] = useState<string>('All');

  const sorted = [...allMatches].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return tb - ta;
  });

  const sportsOptions = useMemo(() => {
    const set = new Set<string>();
    sorted.forEach(m => { if (m.sport) set.add(m.sport); });
    return ['All', ...Array.from(set)];
  }, [sorted]);

  const filtered = useMemo(() => {
    if (selectedSport === 'All') return sorted;
    return sorted.filter(m => m.sport === selectedSport);
  }, [sorted, selectedSport]);

  return (
    <div className="landing-page">
      <section className="live-scoreboard-section">
        <div className="container">
          <div className="section-heading-image">
            <img src="/history-heading.png" alt="Match History" className="heading-img" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
          </div>

          <div className="hero-content" style={{ marginTop: 16, marginBottom: 16 }}>
            <h1 className="hero-title">Match History</h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label htmlFor="sport-filter" style={{ fontWeight: 600 }}>Filter by sport:</label>
              <select id="sport-filter" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                {sportsOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="scoreboard-grid">
            {filtered.length > 0 ? (
              filtered.map(match => (
                <div key={match.id} className={`scoreboard-card ${match.status}`}>
                  <div className="scoreboard-header">
                    <div className="sport-info">
                      <img src={`/${match.sport.toLowerCase()}-logo.png`} alt={match.sport} className="sport-logo-small" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
                      <span className="sport-name">{match.sport}</span>
                    </div>
                    <div className={`match-status ${match.status}`}>{match.status.toUpperCase()}</div>
                  </div>
                  <div className="match-details">
                    <div className="team">
                      <span className="team-name">{match.team1?.name || 'Team 1'}</span>
                      <span className="team-score">{match.score1}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="team">
                      <span className="team-name">{match.team2?.name || 'Team 2'}</span>
                      <span className="team-score">{match.score2}</span>
                    </div>
                  </div>
                  <div className="match-info">
                    {match.startTime && (
                      <span className="time">Start: {new Date(match.startTime).toLocaleString()}</span>
                    )}
                    {match.endTime && (
                      <span className="time" style={{ marginLeft: 12 }}>End: {new Date(match.endTime).toLocaleString()}</span>
                    )}
                    <button 
                      className="sport-btn" 
                      style={{ marginLeft: 'auto' }}
                      onClick={() => deleteMatch(match.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-live-matches">
                <p>No matches yet</p>
                <p>Start a match to build history here!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;


