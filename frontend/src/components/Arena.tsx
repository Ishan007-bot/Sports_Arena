import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('main'); // main, tournament, quick-match, history
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [quickMatches, setQuickMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

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
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');

  // Live Scoring
  const [liveScore1, setLiveScore1] = useState(0);
  const [liveScore2, setLiveScore2] = useState(0);

  // History
  const [historyTab, setHistoryTab] = useState('tournaments');

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
    setActiveView('tournament');
    setSelectedTournament(newTournament);
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
        tournamentId: selectedTournament.id,
        team1: selectedTeam1,
        team2: selectedTeam2,
        score1: 0,
        score2: 0,
        status: 'live',
        startTime: new Date().toISOString()
      };
      setAllMatches([...allMatches, newMatch]);
      setCurrentMatch(newMatch);
      setLiveScore1(0);
      setLiveScore2(0);
    }
  };

  const handleEndMatch = () => {
    if (currentMatch) {
      setAllMatches(allMatches.map(match => 
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

  const handleStartQuickMatch = () => {
    if (selectedTeam1 && selectedTeam2) {
      // Create teams if they don't exist
      const team1 = teams.find(t => t.name === selectedTeam1) || {
        id: Date.now().toString(),
        name: selectedTeam1,
        members: ['Player 1']
      };
      const team2 = teams.find(t => t.name === selectedTeam2) || {
        id: (Date.now() + 1).toString(),
        name: selectedTeam2,
        members: ['Player 1']
      };

      // Add teams to the teams list if they don't exist
      if (!teams.find(t => t.name === selectedTeam1)) {
        setTeams([...teams, team1]);
      }
      if (!teams.find(t => t.name === selectedTeam2)) {
        setTeams([...teams, team2]);
      }

      const newMatch: Match = {
        id: Date.now().toString(),
        tournamentId: '',
        team1: selectedTeam1,
        team2: selectedTeam2,
        score1: 0,
        score2: 0,
        status: 'live',
        startTime: new Date().toISOString()
      };
      setQuickMatches([...quickMatches, newMatch]);
      setAllMatches([...allMatches, newMatch]);
      setCurrentMatch(newMatch);
      setLiveScore1(0);
      setLiveScore2(0);
      setActiveView('quick-match-live');
    }
  };

  const handleCreateTournamentMatch = () => {
    if (selectedTournament && selectedTeam1 && selectedTeam2) {
      const newMatch: Match = {
        id: Date.now().toString(),
        tournamentId: selectedTournament.id,
        team1: selectedTeam1,
        team2: selectedTeam2,
        score1: 0,
        score2: 0,
        status: 'upcoming',
        startTime: new Date().toISOString()
      };
      setAllMatches([...allMatches, newMatch]);
      setSelectedTeam1('');
      setSelectedTeam2('');
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

  const renderMainView = () => (
    <div className="arena-main-view">
      <div className="main-options">
        <div className="main-option-card" onClick={() => setActiveView('create-tournament')}>
          <div className="option-icon">🏆</div>
          <h3>Create Tournament</h3>
          <p>Organize a structured tournament with multiple teams and matches</p>
        </div>
        
        <div className="main-option-card" onClick={() => setActiveView('quick-match')}>
          <div className="option-icon">⚡</div>
          <h3>Quick Match</h3>
          <p>Start a quick match between two teams without tournament structure</p>
        </div>
        
        <div className="main-option-card" onClick={() => setActiveView('history')}>
          <div className="option-icon">📜</div>
          <h3>History</h3>
          <p>View all previous tournaments, matches, and statistics</p>
        </div>
      </div>
      
      {tournaments.length > 0 && (
        <div className="recent-tournaments">
          <h3>Recent Tournaments</h3>
          <div className="tournament-list">
            {tournaments.slice(0, 3).map(tournament => (
              <div key={tournament.id} className="tournament-card" onClick={() => {
                setSelectedTournament(tournament);
                setActiveView('tournament');
              }}>
                <h4>{tournament.name}</h4>
                <p>{tournament.teams.length} teams registered</p>
                <span className="tournament-date">{new Date(tournament.startDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTournamentManagement = () => (
    <div className="tournament-management">
      <div className="tournament-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        <h2>{selectedTournament?.name}</h2>
        <p>{selectedTournament?.description}</p>
      </div>
      
      <div className="tournament-tabs">
        <button 
          className={`tab-button ${activeView === 'tournament' ? 'active' : ''}`}
          onClick={() => setActiveView('tournament')}
        >
          Teams ({selectedTournament?.teams.length || 0})
        </button>
        <button 
          className={`tab-button ${activeView === 'tournament-matches' ? 'active' : ''}`}
          onClick={() => setActiveView('tournament-matches')}
        >
          Matches
        </button>
        <button 
          className={`tab-button ${activeView === 'tournament-live' ? 'active' : ''}`}
          onClick={() => setActiveView('tournament-live')}
        >
          Live Scoring
        </button>
      </div>
      
      {activeView === 'tournament' && renderTeamRegistration()}
      {activeView === 'tournament-matches' && renderTournamentMatches()}
      {activeView === 'tournament-live' && renderLiveScoring()}
    </div>
  );

  const renderTournamentCreation = () => (
    <div className="content-section">
      <div className="section-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        <h2 className="section-title">
          <span className="section-icon">🏆</span>
          Create Tournament
        </h2>
      </div>
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

  const renderQuickMatch = () => (
    <div className="content-section">
      <div className="section-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        <h2 className="section-title">
          <span className="section-icon">⚡</span>
          Quick Match Setup
        </h2>
      </div>
      
      <div className="quick-match-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Team 1 Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Team 1 name"
              value={selectedTeam1}
              onChange={(e) => setSelectedTeam1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Team 2 Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Team 2 name"
              value={selectedTeam2}
              onChange={(e) => setSelectedTeam2(e.target.value)}
            />
          </div>
        </div>
        
        <div className="quick-match-teams">
          <div className="quick-team-section">
            <h3>Team 1 Members</h3>
            <div className="member-list">
              {teams.find(team => team.name === selectedTeam1)?.members.map((member, index) => (
                <div key={index} className="member-item">
                  <input
                    type="text"
                    className="member-input"
                    value={member}
                    onChange={(e) => handleMemberChange(teams.find(team => team.name === selectedTeam1)?.id || '', index, e.target.value)}
                    placeholder={`Player ${index + 1} Name`}
                  />
                </div>
              )) || []}
              <button 
                onClick={() => {
                  const team = teams.find(t => t.name === selectedTeam1);
                  if (team) {
                    handleAddMember(team.id);
                  }
                }}
                className="add-member"
              >
                + Add Member
              </button>
            </div>
          </div>
          
          <div className="quick-team-section">
            <h3>Team 2 Members</h3>
            <div className="member-list">
              {teams.find(team => team.name === selectedTeam2)?.members.map((member, index) => (
                <div key={index} className="member-item">
                  <input
                    type="text"
                    className="member-input"
                    value={member}
                    onChange={(e) => handleMemberChange(teams.find(team => team.name === selectedTeam2)?.id || '', index, e.target.value)}
                    placeholder={`Player ${index + 1} Name`}
                  />
                </div>
              )) || []}
              <button 
                onClick={() => {
                  const team = teams.find(t => t.name === selectedTeam2);
                  if (team) {
                    handleAddMember(team.id);
                  }
                }}
                className="add-member"
              >
                + Add Member
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleStartQuickMatch}
          className="submit-button"
          disabled={!selectedTeam1 || !selectedTeam2}
        >
          Start Quick Match
        </button>
      </div>
    </div>
  );

  const renderTournamentMatches = () => (
    <div className="content-section">
      <div className="section-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        <h2 className="section-title">
          <span className="section-icon">⚽</span>
          Tournament Matches
        </h2>
      </div>
      
      <div className="matches-grid">
        {selectedTournament?.teams && selectedTournament.teams.length >= 2 ? (
          <div className="create-match-section">
            <h3>Create New Match</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Team 1</label>
                <select 
                  className="form-select"
                  value={selectedTeam1}
                  onChange={(e) => setSelectedTeam1(e.target.value)}
                >
                  <option value="">Choose Team 1</option>
                  {selectedTournament?.teams.map(team => (
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
                  {selectedTournament?.teams.map(team => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              onClick={handleCreateTournamentMatch}
              className="submit-button"
              disabled={!selectedTeam1 || !selectedTeam2 || selectedTeam1 === selectedTeam2}
            >
              Create Match
            </button>
          </div>
        ) : (
          <p>Register at least 2 teams to create matches</p>
        )}
        
        <div className="matches-list">
          <h3>Tournament Matches</h3>
          {allMatches
            .filter(match => match.tournamentId === selectedTournament?.id)
            .map(match => (
              <div key={match.id} className="match-card">
                <div className="match-info">
                  <span className="team-name">{match.team1}</span>
                  <span className="vs">VS</span>
                  <span className="team-name">{match.team2}</span>
                </div>
                <div className="match-score">
                  <span>{match.score1} - {match.score2}</span>
                </div>
                <div className="match-status">
                  <span className={`status ${match.status}`}>{match.status}</span>
                </div>
                <button 
                  onClick={() => {
                    setCurrentMatch(match);
                    setActiveView('tournament-live');
                  }}
                  className="score-button"
                >
                  {match.status === 'live' ? 'Update Score' : 'Start Match'}
                </button>
              </div>
            ))}
        </div>
      </div>
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
              value={selectedTournament?.id || ''}
              onChange={(e) => {
                const tournament = tournaments.find(t => t.id === e.target.value);
                setSelectedTournament(tournament || null);
              }}
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
      <div className="section-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        {selectedTournament && (
          <button className="back-to-tournament" onClick={() => setActiveView('tournament')}>
            ← Back to Tournament
          </button>
        )}
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          Live Scoring
        </h2>
      </div>
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
      <div className="section-header">
        <button className="back-to-main" onClick={() => setActiveView('main')}>
          ← Back to Main
        </button>
        <h2 className="section-title">
          <span className="section-icon">📜</span>
          History
        </h2>
      </div>
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
            allMatches.map(match => (
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
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          title="Go back to home"
        >
          ← Back to Home
        </button>
        
        <div className="arena-header">
          <h1 className="arena-title">{sport} Arena</h1>
          <p className="arena-subtitle">Manage tournaments, teams, and live scoring for {sport}</p>
        </div>


        <div className="arena-content">
          {activeView === 'main' && renderMainView()}
          {activeView === 'create-tournament' && renderTournamentCreation()}
          {activeView === 'tournament' && selectedTournament && renderTournamentManagement()}
          {activeView === 'quick-match' && renderQuickMatch()}
          {activeView === 'quick-match-live' && renderLiveScoring()}
          {activeView === 'tournament-live' && renderLiveScoring()}
          {activeView === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
};

export default Arena;