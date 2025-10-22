import React, { useState } from 'react';
import './Arena.css';

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Tournament {
  id: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  description: string;
  teams: Team[];
}

interface Match {
  id: string;
  tournamentId: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: 'upcoming' | 'live' | 'finished';
  startTime?: string;
  endTime?: string;
}

interface PlayerStats {
  playerId: string;
  playerName: string;
  teamName: string;
  stats: { [key: string]: number };
}

interface ArenaProps {
  sport: string;
}

const Arena: React.FC<ArenaProps> = ({ sport }) => {
  const [activeTab, setActiveTab] = useState('tournament');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [historyTab, setHistoryTab] = useState('tournaments');

  // Tournament Creation
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Team Registration
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({ name: '', members: [''] });

  // Match Management
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');

  // Live Scoring
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [liveScore1, setLiveScore1] = useState(0);
  const [liveScore2, setLiveScore2] = useState(0);

  const handleTournamentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: tournamentForm.name,
      sport: sport,
      startDate: tournamentForm.startDate,
      endDate: tournamentForm.endDate,
      description: tournamentForm.description,
      teams: []
    };
    setTournaments([...tournaments, newTournament]);
    setTournamentForm({ name: '', startDate: '', endDate: '', description: '' });
  };

  const handleAddTeam = () => {
    if (newTeam.name.trim() && newTeam.members.some(member => member.trim())) {
      const team: Team = {
        id: Date.now().toString(),
        name: newTeam.name,
        members: newTeam.members.filter(member => member.trim())
      };
      setTeams([...teams, team]);
      setNewTeam({ name: '', members: [''] });
    }
  };

  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleAddMember = (teamId: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, ''] }
        : team
    ));
  };

  const handleMemberChange = (teamId: string, memberIndex: number, value: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            members: team.members.map((member, index) => 
              index === memberIndex ? value : member
            )
          }
        : team
    ));
  };

  const handleStartMatch = () => {
    if (selectedTournament && selectedTeam1 && selectedTeam2) {
      const newMatch: Match = {
        id: Date.now().toString(),
        tournamentId: selectedTournament,
        team1: selectedTeam1,
        team2: selectedTeam2,
        score1: 0,
        score2: 0,
        status: 'live',
        startTime: new Date().toISOString()
      };
      setMatches([...matches, newMatch]);
      setCurrentMatch(newMatch);
      setLiveScore1(0);
      setLiveScore2(0);
    }
  };

  const handleEndMatch = () => {
    if (currentMatch) {
      setMatches(matches.map(match => 
        match.id === currentMatch.id 
          ? { ...match, status: 'finished', endTime: new Date().toISOString() }
          : match
      ));
      setCurrentMatch(null);
    }
  };

  const handleScoreUpdate = (team: 'team1' | 'team2', points: number) => {
    if (currentMatch) {
      if (team === 'team1') {
        setLiveScore1(liveScore1 + points);
        setCurrentMatch({ ...currentMatch, score1: liveScore1 + points });
      } else {
        setLiveScore2(liveScore2 + points);
        setCurrentMatch({ ...currentMatch, score2: liveScore2 + points });
      }
    }
  };

  const getSportSpecificStats = () => {
    switch (sport.toLowerCase()) {
      case 'cricket':
        return ['Runs', 'Wickets', 'Overs', 'Fours', 'Sixes'];
      case 'football':
        return ['Goals', 'Assists', 'Yellow Cards', 'Red Cards', 'Saves'];
      case 'basketball':
        return ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks'];
      case 'table tennis':
        return ['Points Won', 'Points Lost', 'Sets Won', 'Aces', 'Errors'];
      case 'badminton':
        return ['Points Won', 'Points Lost', 'Sets Won', 'Aces', 'Smash'];
      case 'chess':
        return ['Wins', 'Losses', 'Draws', 'Rating', 'Moves'];
      case 'volleyball':
        return ['Points', 'Aces', 'Blocks', 'Digs', 'Sets Won'];
      default:
        return ['Points', 'Assists', 'Goals', 'Saves', 'Cards'];
    }
  };

  const renderTournamentCreation = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">🏆</span>
        Create Tournament
      </h2>
      <form onSubmit={handleTournamentSubmit} className="tournament-form">
        <div className="form-group">
          <label className="form-label">Tournament Name</label>
          <input
            type="text"
            className="form-input"
            value={tournamentForm.name}
            onChange={(e) => setTournamentForm({...tournamentForm, name: e.target.value})}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={tournamentForm.startDate}
              onChange={(e) => setTournamentForm({...tournamentForm, startDate: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={tournamentForm.endDate}
              onChange={(e) => setTournamentForm({...tournamentForm, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={tournamentForm.description}
            onChange={(e) => setTournamentForm({...tournamentForm, description: e.target.value})}
            placeholder="Describe the tournament rules and format..."
          />
        </div>
        <button type="submit" className="submit-button">
          Create Tournament
        </button>
      </form>
    </div>
  );

  const renderTeamRegistration = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">👥</span>
        Team Registration
      </h2>
      <div className="team-registration">
        {teams.map(team => (
          <div key={team.id} className="team-form">
            <div className="team-header">
              <h3 className="team-name">{team.name}</h3>
              <button 
                onClick={() => handleRemoveTeam(team.id)}
                className="remove-team"
              >
                Remove Team
              </button>
            </div>
            <div className="member-list">
              {team.members.map((member, index) => (
                <div key={index} className="member-item">
                  <input
                    type="text"
                    className="member-input"
                    value={member}
                    onChange={(e) => handleMemberChange(team.id, index, e.target.value)}
                    placeholder={`Player ${index + 1} Name`}
                  />
                </div>
              ))}
              <button 
                onClick={() => handleAddMember(team.id)}
                className="add-member"
              >
                + Add Member
              </button>
            </div>
          </div>
        ))}
        <div className="team-form">
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <input
              type="text"
              className="form-input"
              value={newTeam.name}
              onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
              placeholder="Enter team name"
            />
          </div>
          <div className="member-list">
            {newTeam.members.map((member, index) => (
              <div key={index} className="member-item">
                <input
                  type="text"
                  className="member-input"
                  value={member}
                  onChange={(e) => setNewTeam({
                    ...newTeam, 
                    members: newTeam.members.map((m, i) => i === index ? e.target.value : m)
                  })}
                  placeholder={`Player ${index + 1} Name`}
                />
              </div>
            ))}
            <button 
              onClick={() => setNewTeam({...newTeam, members: [...newTeam.members, '']})}
              className="add-member"
            >
              + Add Member
            </button>
          </div>
          <button onClick={handleAddTeam} className="add-team-button">
            Add Team
          </button>
        </div>
      </div>
    </div>
  );

  const renderMatchManagement = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">⚽</span>
        Match Management
      </h2>
      <div className="match-controls">
        <form className="match-form">
          <div className="form-group">
            <label className="form-label">Select Tournament</label>
            <select 
              className="form-select"
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
            >
              <option value="">Choose a tournament</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Team 1</label>
              <select 
                className="form-select"
                value={selectedTeam1}
                onChange={(e) => setSelectedTeam1(e.target.value)}
              >
                <option value="">Choose Team 1</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Team 2</label>
              <select 
                className="form-select"
                value={selectedTeam2}
                onChange={(e) => setSelectedTeam2(e.target.value)}
              >
                <option value="">Choose Team 2</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <div className="match-actions">
          <button 
            onClick={handleStartMatch}
            className="action-button start-match"
            disabled={!selectedTournament || !selectedTeam1 || !selectedTeam2}
          >
            Start Match
          </button>
          {currentMatch && (
            <>
              <button 
                onClick={handleEndMatch}
                className="action-button end-match"
              >
                End Match
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderLiveScoring = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">📊</span>
        Live Scoring
      </h2>
      {currentMatch ? (
        <div className="scoring-board">
          <div className="match-info">
            <h3 className="match-title">{currentMatch.team1} vs {currentMatch.team2}</h3>
            <p className="match-status">Status: Live</p>
          </div>
          <div className="score-display">
            <div className="team-score">
              <div className="team-name">{currentMatch.team1}</div>
              <div className="score-value">{liveScore1}</div>
            </div>
            <div className="vs-text">VS</div>
            <div className="team-score">
              <div className="team-name">{currentMatch.team2}</div>
              <div className="score-value">{liveScore2}</div>
            </div>
          </div>
          <div className="scoring-controls">
            <h4>Update Scores</h4>
            <div className="scoring-buttons">
              <button 
                onClick={() => handleScoreUpdate('team1', 1)}
                className="scoring-button"
              >
                {currentMatch.team1} +1
              </button>
              <button 
                onClick={() => handleScoreUpdate('team1', 2)}
                className="scoring-button"
              >
                {currentMatch.team1} +2
              </button>
              <button 
                onClick={() => handleScoreUpdate('team1', 3)}
                className="scoring-button"
              >
                {currentMatch.team1} +3
              </button>
              <button 
                onClick={() => handleScoreUpdate('team2', 1)}
                className="scoring-button"
              >
                {currentMatch.team2} +1
              </button>
              <button 
                onClick={() => handleScoreUpdate('team2', 2)}
                className="scoring-button"
              >
                {currentMatch.team2} +2
              </button>
              <button 
                onClick={() => handleScoreUpdate('team2', 3)}
                className="scoring-button"
              >
                {currentMatch.team2} +3
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="scoring-board">
          <p>No live match in progress. Start a match to begin scoring.</p>
        </div>
      )}
    </div>
  );

  const renderPlayerContributions = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">⭐</span>
        Player Contributions
      </h2>
      <div className="player-stats">
        {teams.map(team => 
          team.members.map(member => (
            <div key={`${team.id}-${member}`} className="player-card">
              <div className="player-header">
                <div className="player-name">{member}</div>
                <div className="player-team">{team.name}</div>
              </div>
              <div className="stats-grid">
                {getSportSpecificStats().map(stat => (
                  <div key={stat} className="stat-item">
                    <div className="stat-label">{stat}</div>
                    <div className="stat-value">0</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="content-section">
      <h2 className="section-title">
        <span className="section-icon">📜</span>
        History
      </h2>
      <div className="history-section">
        <div className="history-tabs">
          <button 
            className={`history-tab ${historyTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setHistoryTab('tournaments')}
          >
            Tournaments
          </button>
          <button 
            className={`history-tab ${historyTab === 'matches' ? 'active' : ''}`}
            onClick={() => setHistoryTab('matches')}
          >
            Matches
          </button>
        </div>
        <div className="history-content">
          {historyTab === 'tournaments' ? (
            tournaments.map(tournament => (
              <div key={tournament.id} className="history-item">
                <div className="history-header">
                  <div className="history-title">{tournament.name}</div>
                  <div className="history-date">
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="history-details">
                  <div className="history-detail">
                    <span>Sport:</span>
                    <strong>{tournament.sport}</strong>
                  </div>
                  <div className="history-detail">
                    <span>Duration:</span>
                    <strong>
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="history-detail">
                    <span>Teams:</span>
                    <strong>{tournament.teams.length}</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            matches.map(match => (
              <div key={match.id} className="history-item">
                <div className="history-header">
                  <div className="history-title">{match.team1} vs {match.team2}</div>
                  <div className="history-date">
                    {match.startTime ? new Date(match.startTime).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
                <div className="history-details">
                  <div className="history-detail">
                    <span>Score:</span>
                    <strong>{match.score1} - {match.score2}</strong>
                  </div>
                  <div className="history-detail">
                    <span>Status:</span>
                    <strong className={match.status === 'live' ? 'text-green-400' : match.status === 'finished' ? 'text-blue-400' : 'text-yellow-400'}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="arena-page">
      <div className="arena-container">
        <div className="arena-header">
          <h1 className="arena-title">{sport} Arena</h1>
          <p className="arena-subtitle">Manage tournaments, teams, and live scoring for {sport}</p>
        </div>

        <nav className="arena-nav">
          <button 
            className={`nav-button ${activeTab === 'tournament' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournament')}
          >
            Create Tournament
          </button>
          <button 
            className={`nav-button ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Register Teams
          </button>
          <button 
            className={`nav-button ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Start Match
          </button>
          <button 
            className={`nav-button ${activeTab === 'scoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('scoring')}
          >
            Live Scoring
          </button>
          <button 
            className={`nav-button ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            Player Stats
          </button>
          <button 
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </nav>

        <div className="arena-content">
          {activeTab === 'tournament' && renderTournamentCreation()}
          {activeTab === 'teams' && renderTeamRegistration()}
          {activeTab === 'matches' && renderMatchManagement()}
          {activeTab === 'scoring' && renderLiveScoring()}
          {activeTab === 'players' && renderPlayerContributions()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
};

export default Arena;