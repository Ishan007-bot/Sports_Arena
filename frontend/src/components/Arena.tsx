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
  status: 'upcoming' | 'live' | 'finished' | 'completed';
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
  const [matchDuration, setMatchDuration] = useState(90); // Default 90 minutes
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [matchPhase, setMatchPhase] = useState('pre-match'); // pre-match, first-half, half-time, second-half, full-time
  const [goals, setGoals] = useState<Array<{id: string, team: string, player: string, timestamp: string, minute: number}>>([]);
  
  // Cricket-specific state
  const [cricketRuns, setCricketRuns] = useState(0);
  const [cricketWickets, setCricketWickets] = useState(0);
  const [cricketOvers, setCricketOvers] = useState(0);
  const [cricketBalls, setCricketBalls] = useState(0);
  const [cricketExtras, setCricketExtras] = useState({wide: 0, noBall: 0, bye: 0, legBye: 0});
  const [currentBatsman1, setCurrentBatsman1] = useState({name: '', runs: 0, balls: 0});
  const [currentBatsman2, setCurrentBatsman2] = useState({name: '', runs: 0, balls: 0});
  const [currentBowler, setCurrentBowler] = useState({name: '', overs: 0, balls: 0, runs: 0, wickets: 0});
  const [ballHistory, setBallHistory] = useState<Array<{type: string, runs: number, batsman: string, bowler: string}>>([]);
  
  // Basketball-specific state
  const [basketballScore1, setBasketballScore1] = useState(0);
  const [basketballScore2, setBasketballScore2] = useState(0);
  const [basketballFouls1, setBasketballFouls1] = useState(0);
  const [basketballFouls2, setBasketballFouls2] = useState(0);
  const [basketballQuarter, setBasketballQuarter] = useState(1);
  const [basketballTime, setBasketballTime] = useState(600); // 10 minutes in seconds
  
  // Chess-specific state
  const [chessTime1, setChessTime1] = useState(1800); // 30 minutes in seconds
  const [chessTime2, setChessTime2] = useState(1800);
  const [chessActivePlayer, setChessActivePlayer] = useState<'white' | 'black'>('white');
  const [chessScore1, setChessScore1] = useState(0);
  const [chessScore2, setChessScore2] = useState(0);
  
  // Volleyball-specific state
  const [volleyballScore1, setVolleyballScore1] = useState(0);
  const [volleyballScore2, setVolleyballScore2] = useState(0);
  const [volleyballSets1, setVolleyballSets1] = useState(0);
  const [volleyballSets2, setVolleyballSets2] = useState(0);
  const [volleyballCurrentSet, setVolleyballCurrentSet] = useState(1);
  const [volleyballServing, setVolleyballServing] = useState<'team1' | 'team2'>('team1');
  
  // Badminton-specific state
  const [badmintonScore1, setBadmintonScore1] = useState(0);
  const [badmintonScore2, setBadmintonScore2] = useState(0);
  const [badmintonGames1, setBadmintonGames1] = useState(0);
  const [badmintonGames2, setBadmintonGames2] = useState(0);
  const [badmintonCurrentGame, setBadmintonCurrentGame] = useState(1);
  const [badmintonServing, setBadmintonServing] = useState<'player1' | 'player2'>('player1');
  
  // Table Tennis-specific state
  const [tableTennisScore1, setTableTennisScore1] = useState(0);
  const [tableTennisScore2, setTableTennisScore2] = useState(0);
  const [tableTennisGames1, setTableTennisGames1] = useState(0);
  const [tableTennisGames2, setTableTennisGames2] = useState(0);
  const [tableTennisCurrentGame, setTableTennisCurrentGame] = useState(1);
  const [tableTennisServing, setTableTennisServing] = useState<'player1' | 'player2'>('player1');
  const [tableTennisServiceCount, setTableTennisServiceCount] = useState(0);

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

  // Football-specific functions
  const handleMatchDurationChange = (duration: number) => {
    setMatchDuration(duration);
    setTimeRemaining(duration);
  };

  const startMatch = () => {
    setIsTimerRunning(true);
    setMatchPhase('first-half');
    setTimeRemaining(matchDuration / 2); // First half
  };

  const pauseMatch = () => {
    setIsTimerRunning(false);
  };

  const resumeMatch = () => {
    setIsTimerRunning(true);
  };

  const endFirstHalf = () => {
    setIsTimerRunning(false);
    setMatchPhase('half-time');
    setTimeRemaining(matchDuration / 2); // Reset for second half
  };

  const startSecondHalf = () => {
    setIsTimerRunning(true);
    setMatchPhase('second-half');
  };

  const endMatch = () => {
    setIsTimerRunning(false);
    setMatchPhase('full-time');
    if (currentMatch) {
      setCurrentMatch({ ...currentMatch, status: 'completed' });
    }
  };

  const addGoal = (team: 'team1' | 'team2', player: string) => {
    const now = new Date();
    const minute = Math.floor((matchDuration - timeRemaining) / 2) + (matchPhase === 'second-half' ? matchDuration / 2 : 0);
    
    const newGoal = {
      id: Date.now().toString(),
      team: team,
      player: player,
      timestamp: now.toLocaleTimeString(),
      minute: Math.max(1, minute)
    };
    
    setGoals([...goals, newGoal]);
    
    // Update score
    if (team === 'team1') {
      setLiveScore1(liveScore1 + 1);
      if (currentMatch) {
        setCurrentMatch({ ...currentMatch, score1: liveScore1 + 1 });
      }
    } else {
      setLiveScore2(liveScore2 + 1);
      if (currentMatch) {
        setCurrentMatch({ ...currentMatch, score2: liveScore2 + 1 });
      }
    }
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (matchPhase === 'first-half') {
              endFirstHalf();
            } else if (matchPhase === 'second-half') {
              endMatch();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, matchPhase]);

  // Cricket scoring functions
  const handleCricketRun = (runs: number) => {
    setCricketRuns(prev => prev + runs);
    setCricketBalls(prev => {
      const newBalls = prev + 1;
      if (newBalls >= 6) {
        setCricketOvers(prev => prev + 1);
        setCricketBalls(0);
      }
      return newBalls % 6;
    });
    setBallHistory(prev => [...prev, {type: 'run', runs, batsman: currentBatsman1.name, bowler: currentBowler.name}]);
  };

  const handleCricketWicket = () => {
    setCricketWickets(prev => prev + 1);
    setCricketBalls(prev => {
      const newBalls = prev + 1;
      if (newBalls >= 6) {
        setCricketOvers(prev => prev + 1);
        setCricketBalls(0);
      }
      return newBalls % 6;
    });
    setCurrentBowler(prev => ({...prev, wickets: prev.wickets + 1}));
    setBallHistory(prev => [...prev, {type: 'wicket', runs: 0, batsman: currentBatsman1.name, bowler: currentBowler.name}]);
  };

  const handleCricketExtra = (type: 'wide' | 'noBall' | 'bye' | 'legBye', runs: number = 1) => {
    setCricketRuns(prev => prev + runs);
    setCricketExtras(prev => ({...prev, [type]: prev[type] + 1}));
    // Wide and No Ball don't count as balls
    if (type !== 'wide' && type !== 'noBall') {
      setCricketBalls(prev => {
        const newBalls = prev + 1;
        if (newBalls >= 6) {
          setCricketOvers(prev => prev + 1);
          setCricketBalls(0);
        }
        return newBalls % 6;
      });
    }
    setBallHistory(prev => [...prev, {type, runs, batsman: currentBatsman1.name, bowler: currentBowler.name}]);
  };

  const undoLastBall = () => {
    if (ballHistory.length > 0) {
      const lastBall = ballHistory[ballHistory.length - 1];
      setBallHistory(prev => prev.slice(0, -1));
      
      if (lastBall.type === 'run') {
        setCricketRuns(prev => prev - lastBall.runs);
      } else if (lastBall.type === 'wicket') {
        setCricketWickets(prev => prev - 1);
        setCurrentBowler(prev => ({...prev, wickets: prev.wickets - 1}));
      } else if (lastBall.type === 'wide' || lastBall.type === 'noBall' || lastBall.type === 'bye' || lastBall.type === 'legBye') {
        setCricketRuns(prev => prev - lastBall.runs);
        setCricketExtras(prev => {
          const newExtras = {...prev};
          if (lastBall.type === 'wide') newExtras.wide -= 1;
          else if (lastBall.type === 'noBall') newExtras.noBall -= 1;
          else if (lastBall.type === 'bye') newExtras.bye -= 1;
          else if (lastBall.type === 'legBye') newExtras.legBye -= 1;
          return newExtras;
        });
      }
    }
  };

  // Basketball scoring functions
  const handleBasketballScore = (team: 'team1' | 'team2', points: number) => {
    if (team === 'team1') {
      setBasketballScore1(prev => prev + points);
    } else {
      setBasketballScore2(prev => prev + points);
    }
  };

  const handleBasketballFoul = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setBasketballFouls1(prev => prev + 1);
    } else {
      setBasketballFouls2(prev => prev + 1);
    }
  };

  // Chess functions
  const handleChessMove = () => {
    setChessActivePlayer(prev => prev === 'white' ? 'black' : 'white');
  };

  const handleChessResult = (result: 'white' | 'black' | 'draw') => {
    if (result === 'white') {
      setChessScore1(prev => prev + 1);
    } else if (result === 'black') {
      setChessScore2(prev => prev + 1);
    } else {
      setChessScore1(prev => prev + 0.5);
      setChessScore2(prev => prev + 0.5);
    }
  };

  // Volleyball functions
  const handleVolleyballPoint = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setVolleyballScore1(prev => {
        const newScore = prev + 1;
        if (newScore >= 25 && newScore - volleyballScore2 >= 2) {
          setVolleyballSets1(prev => prev + 1);
          setVolleyballScore1(0);
          setVolleyballScore2(0);
          setVolleyballCurrentSet(prev => prev + 1);
        }
        return newScore;
      });
    } else {
      setVolleyballScore2(prev => {
        const newScore = prev + 1;
        if (newScore >= 25 && newScore - volleyballScore1 >= 2) {
          setVolleyballSets2(prev => prev + 1);
          setVolleyballScore1(0);
          setVolleyballScore2(0);
          setVolleyballCurrentSet(prev => prev + 1);
        }
        return newScore;
      });
    }
    setVolleyballServing(team);
  };

  // Badminton functions
  const handleBadmintonPoint = (player: 'player1' | 'player2') => {
    if (player === 'player1') {
      setBadmintonScore1(prev => {
        const newScore = prev + 1;
        if (newScore >= 21 && newScore - badmintonScore2 >= 2) {
          setBadmintonGames1(prev => prev + 1);
          setBadmintonScore1(0);
          setBadmintonScore2(0);
          setBadmintonCurrentGame(prev => prev + 1);
        }
        return newScore;
      });
    } else {
      setBadmintonScore2(prev => {
        const newScore = prev + 1;
        if (newScore >= 21 && newScore - badmintonScore1 >= 2) {
          setBadmintonGames2(prev => prev + 1);
          setBadmintonScore1(0);
          setBadmintonScore2(0);
          setBadmintonCurrentGame(prev => prev + 1);
        }
        return newScore;
      });
    }
    setBadmintonServing(player);
  };

  // Table Tennis functions
  const handleTableTennisPoint = (player: 'player1' | 'player2') => {
    if (player === 'player1') {
      setTableTennisScore1(prev => {
        const newScore = prev + 1;
        if (newScore >= 11 && newScore - tableTennisScore2 >= 2) {
          setTableTennisGames1(prev => prev + 1);
          setTableTennisScore1(0);
          setTableTennisScore2(0);
          setTableTennisCurrentGame(prev => prev + 1);
          setTableTennisServiceCount(0);
        }
        return newScore;
      });
    } else {
      setTableTennisScore2(prev => {
        const newScore = prev + 1;
        if (newScore >= 11 && newScore - tableTennisScore1 >= 2) {
          setTableTennisGames2(prev => prev + 1);
          setTableTennisScore1(0);
          setTableTennisScore2(0);
          setTableTennisCurrentGame(prev => prev + 1);
          setTableTennisServiceCount(0);
        }
        return newScore;
      });
    }
    
    setTableTennisServiceCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 2) {
        setTableTennisServing(prev => prev === 'player1' ? 'player2' : 'player1');
        return 0;
      }
      return newCount;
    });
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
              {(() => {
                const team1 = teams.find(team => team.name === selectedTeam1);
                if (!team1 && selectedTeam1) {
                  // Create team if it doesn't exist
                  const newTeam = {
                    id: Date.now().toString(),
                    name: selectedTeam1,
                    members: ['Player 1']
                  };
                  setTeams([...teams, newTeam]);
                  return [<div key="0" className="member-item">
                    <input
                      type="text"
                      className="member-input"
                      value="Player 1"
                      onChange={(e) => {
                        const updatedTeam = { ...newTeam, members: [e.target.value] };
                        setTeams(teams.map(t => t.name === selectedTeam1 ? updatedTeam : t));
                      }}
                      placeholder="Player 1 Name"
                    />
                  </div>];
                }
                return team1?.members.map((member, index) => (
                  <div key={index} className="member-item">
                    <input
                      type="text"
                      className="member-input"
                      value={member}
                      onChange={(e) => handleMemberChange(team1.id, index, e.target.value)}
                      placeholder={`Player ${index + 1} Name`}
                    />
                  </div>
                )) || [];
              })()}
              <button 
                onClick={() => {
                  let team1 = teams.find(t => t.name === selectedTeam1);
                  if (!team1 && selectedTeam1) {
                    // Create team if it doesn't exist
                    team1 = {
                      id: Date.now().toString(),
                      name: selectedTeam1,
                      members: ['Player 1']
                    };
                    setTeams([...teams, team1]);
                  }
                  if (team1) {
                    handleAddMember(team1.id);
                  }
                }}
                className="add-member"
                disabled={!selectedTeam1}
              >
                + Add Member
              </button>
            </div>
          </div>
          
          <div className="quick-team-section">
            <h3>Team 2 Members</h3>
            <div className="member-list">
              {(() => {
                const team2 = teams.find(team => team.name === selectedTeam2);
                if (!team2 && selectedTeam2) {
                  // Create team if it doesn't exist
                  const newTeam = {
                    id: (Date.now() + 1).toString(),
                    name: selectedTeam2,
                    members: ['Player 1']
                  };
                  setTeams([...teams, newTeam]);
                  return [<div key="0" className="member-item">
                    <input
                      type="text"
                      className="member-input"
                      value="Player 1"
                      onChange={(e) => {
                        const updatedTeam = { ...newTeam, members: [e.target.value] };
                        setTeams(teams.map(t => t.name === selectedTeam2 ? updatedTeam : t));
                      }}
                      placeholder="Player 1 Name"
                    />
                  </div>];
                }
                return team2?.members.map((member, index) => (
                  <div key={index} className="member-item">
                    <input
                      type="text"
                      className="member-input"
                      value={member}
                      onChange={(e) => handleMemberChange(team2.id, index, e.target.value)}
                      placeholder={`Player ${index + 1} Name`}
                    />
                  </div>
                )) || [];
              })()}
              <button 
                onClick={() => {
                  let team2 = teams.find(t => t.name === selectedTeam2);
                  if (!team2 && selectedTeam2) {
                    // Create team if it doesn't exist
                    team2 = {
                      id: (Date.now() + 1).toString(),
                      name: selectedTeam2,
                      members: ['Player 1']
                    };
                    setTeams([...teams, team2]);
                  }
                  if (team2) {
                    handleAddMember(team2.id);
                  }
                }}
                className="add-member"
                disabled={!selectedTeam2}
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

  const renderLiveScoring = () => {
    if (sport === 'Football') {
      return renderFootballScoring();
    } else if (sport === 'Cricket') {
      return renderCricketScoring();
    } else if (sport === 'Basketball') {
      return renderBasketballScoring();
    } else if (sport === 'Chess') {
      return renderChessScoring();
    } else if (sport === 'Volleyball') {
      return renderVolleyballScoring();
    } else if (sport === 'Badminton') {
      return renderBadmintonScoring();
    } else if (sport === 'Table Tennis') {
      return renderTableTennisScoring();
    }
    
    return (
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
  };

  const renderFootballScoring = () => (
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
          <span className="section-icon">⚽</span>
          Football Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="football-scoring">
          {/* Match Duration Setting */}
          {matchPhase === 'pre-match' && (
            <div className="match-setup">
              <h3>Match Setup</h3>
              <div className="duration-setting">
                <label>Match Duration (minutes):</label>
                <div className="duration-input-group">
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={matchDuration}
                    onChange={(e) => handleMatchDurationChange(parseInt(e.target.value) || 90)}
                    className="duration-input"
                    placeholder="Enter duration in minutes"
                  />
                  <div className="duration-presets">
                    <button 
                      onClick={() => handleMatchDurationChange(5)}
                      className="preset-button"
                    >
                      5 min
                    </button>
                    <button 
                      onClick={() => handleMatchDurationChange(15)}
                      className="preset-button"
                    >
                      15 min
                    </button>
                    <button 
                      onClick={() => handleMatchDurationChange(30)}
                      className="preset-button"
                    >
                      30 min
                    </button>
                    <button 
                      onClick={() => handleMatchDurationChange(60)}
                      className="preset-button"
                    >
                      60 min
                    </button>
                    <button 
                      onClick={() => handleMatchDurationChange(90)}
                      className="preset-button"
                    >
                      90 min
                    </button>
                    <button 
                      onClick={() => handleMatchDurationChange(120)}
                      className="preset-button"
                    >
                      120 min
                    </button>
                  </div>
                </div>
                <button onClick={startMatch} className="start-match-button">
                  Start Match
                </button>
              </div>
            </div>
          )}

          {/* Match Timer and Phase */}
          <div className="match-timer">
            <div className="timer-display">
              <div className="phase-indicator">
                {matchPhase === 'pre-match' && 'Pre-Match'}
                {matchPhase === 'first-half' && 'First Half'}
                {matchPhase === 'half-time' && 'Half Time'}
                {matchPhase === 'second-half' && 'Second Half'}
                {matchPhase === 'full-time' && 'Full Time'}
              </div>
              <div className="time-display">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="timer-controls">
              {matchPhase === 'first-half' && (
                <>
                  {!isTimerRunning ? (
                    <button onClick={resumeMatch} className="timer-button">Resume</button>
                  ) : (
                    <button onClick={pauseMatch} className="timer-button">Pause</button>
                  )}
                  <button onClick={endFirstHalf} className="timer-button">End First Half</button>
                </>
              )}
              {matchPhase === 'half-time' && (
                <button onClick={startSecondHalf} className="timer-button">Start Second Half</button>
              )}
              {matchPhase === 'second-half' && (
                <>
                  {!isTimerRunning ? (
                    <button onClick={resumeMatch} className="timer-button">Resume</button>
                  ) : (
                    <button onClick={pauseMatch} className="timer-button">Pause</button>
                  )}
                  <button onClick={endMatch} className="timer-button">End Match</button>
                </>
              )}
            </div>
          </div>

          {/* Score Display */}
          <div className="football-scoreboard">
            <div className="team-score">
              <span className="team-name">{currentMatch.team1}</span>
              <span className="score">{liveScore1}</span>
            </div>
            <span className="vs">VS</span>
            <div className="team-score">
              <span className="team-name">{currentMatch.team2}</span>
              <span className="score">{liveScore2}</span>
            </div>
          </div>

          {/* Goal Scoring Interface */}
          {(matchPhase === 'first-half' || matchPhase === 'second-half') && (
            <div className="goal-scoring">
              <h3>Record Goal</h3>
              <div className="goal-controls">
                <div className="team-goal-controls">
                  <h4>{currentMatch.team1}</h4>
                  <select className="player-select" id="team1-player">
                    {teams.find(t => t.name === currentMatch.team1)?.members.map((player, index) => (
                      <option key={index} value={player}>{player}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      const player = (document.getElementById('team1-player') as HTMLSelectElement)?.value;
                      if (player) addGoal('team1', player);
                    }}
                    className="goal-button"
                  >
                    Goal!
                  </button>
                </div>
                
                <div className="team-goal-controls">
                  <h4>{currentMatch.team2}</h4>
                  <select className="player-select" id="team2-player">
                    {teams.find(t => t.name === currentMatch.team2)?.members.map((player, index) => (
                      <option key={index} value={player}>{player}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      const player = (document.getElementById('team2-player') as HTMLSelectElement)?.value;
                      if (player) addGoal('team2', player);
                    }}
                    className="goal-button"
                  >
                    Goal!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goals History */}
          {goals.length > 0 && (
            <div className="goals-history">
              <h3>Goals Scored</h3>
              <div className="goals-list">
                {goals.map((goal) => (
                  <div key={goal.id} className="goal-item">
                    <span className="goal-team">{goal.team === 'team1' ? currentMatch.team1 : currentMatch.team2}</span>
                    <span className="goal-player">{goal.player}</span>
                    <span className="goal-minute">{goal.minute}'</span>
                    <span className="goal-time">{goal.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCricketScoring = () => (
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
          <span className="section-icon">🏏</span>
          Cricket Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="cricket-scoring">
          {/* Scoreboard */}
          <div className="cricket-scoreboard">
            <div className="score-display">
              <div className="team-name">{currentMatch.team1}</div>
              <div className="score">{cricketRuns} / {cricketWickets}</div>
              <div className="overs">{cricketOvers}.{cricketBalls}</div>
            </div>
            <div className="extras">
              <div className="extras-breakdown">
                <span>Wide: {cricketExtras.wide}</span>
                <span>No Ball: {cricketExtras.noBall}</span>
                <span>Bye: {cricketExtras.bye}</span>
                <span>Leg Bye: {cricketExtras.legBye}</span>
              </div>
            </div>
          </div>

          {/* Runs Scoring */}
          <div className="runs-scoring">
            <h3>Runs</h3>
            <div className="runs-buttons">
              <button onClick={() => handleCricketRun(1)} className="run-button">+1</button>
              <button onClick={() => handleCricketRun(2)} className="run-button">+2</button>
              <button onClick={() => handleCricketRun(3)} className="run-button">+3</button>
              <button onClick={() => handleCricketRun(4)} className="run-button boundary">+4</button>
              <button onClick={() => handleCricketRun(6)} className="run-button boundary">+6</button>
            </div>
          </div>

          {/* Wickets */}
          <div className="wickets-scoring">
            <h3>Wickets</h3>
            <button onClick={handleCricketWicket} className="wicket-button">Wicket</button>
          </div>

          {/* Extras */}
          <div className="extras-scoring">
            <h3>Extras</h3>
            <div className="extras-buttons">
              <button onClick={() => handleCricketExtra('wide')} className="extra-button">Wide</button>
              <button onClick={() => handleCricketExtra('noBall')} className="extra-button">No Ball</button>
              <button onClick={() => handleCricketExtra('bye')} className="extra-button">Bye</button>
              <button onClick={() => handleCricketExtra('legBye')} className="extra-button">Leg Bye</button>
            </div>
          </div>

          {/* Current Players */}
          <div className="current-players">
            <div className="batsman-info">
              <h4>Current Batsman</h4>
              <div className="player-stats">
                <span>{currentBatsman1.name}: {currentBatsman1.runs} off {currentBatsman1.balls}</span>
              </div>
            </div>
            <div className="bowler-info">
              <h4>Current Bowler</h4>
              <div className="player-stats">
                <span>{currentBowler.name}: {currentBowler.overs}.{currentBowler.balls} - {currentBowler.runs} - {currentBowler.wickets}</span>
              </div>
            </div>
          </div>

          {/* Undo Button */}
          <div className="undo-section">
            <button onClick={undoLastBall} className="undo-button">Undo Last Ball</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderBasketballScoring = () => (
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
          <span className="section-icon">🏀</span>
          Basketball Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="basketball-scoring">
          {/* Scoreboard */}
          <div className="basketball-scoreboard">
            <div className="team-score">
              <div className="team-name">{currentMatch.team1}</div>
              <div className="score">{basketballScore1}</div>
              <div className="fouls">Fouls: {basketballFouls1}</div>
            </div>
            <div className="vs">VS</div>
            <div className="team-score">
              <div className="team-name">{currentMatch.team2}</div>
              <div className="score">{basketballScore2}</div>
              <div className="fouls">Fouls: {basketballFouls2}</div>
            </div>
          </div>

          {/* Quarter and Time */}
          <div className="basketball-timer">
            <div className="quarter">Quarter {basketballQuarter}</div>
            <div className="time">{Math.floor(basketballTime / 60)}:{(basketballTime % 60).toString().padStart(2, '0')}</div>
          </div>

          {/* Scoring Controls */}
          <div className="basketball-scoring-controls">
            <div className="team-controls">
              <h4>{currentMatch.team1}</h4>
              <div className="scoring-buttons">
                <button onClick={() => handleBasketballScore('team1', 1)} className="score-button">+1 (Free Throw)</button>
                <button onClick={() => handleBasketballScore('team1', 2)} className="score-button">+2 (Field Goal)</button>
                <button onClick={() => handleBasketballScore('team1', 3)} className="score-button">+3 (Three Pointer)</button>
                <button onClick={() => handleBasketballFoul('team1')} className="foul-button">+1 Foul</button>
              </div>
            </div>
            <div className="team-controls">
              <h4>{currentMatch.team2}</h4>
              <div className="scoring-buttons">
                <button onClick={() => handleBasketballScore('team2', 1)} className="score-button">+1 (Free Throw)</button>
                <button onClick={() => handleBasketballScore('team2', 2)} className="score-button">+2 (Field Goal)</button>
                <button onClick={() => handleBasketballScore('team2', 3)} className="score-button">+3 (Three Pointer)</button>
                <button onClick={() => handleBasketballFoul('team2')} className="foul-button">+1 Foul</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChessScoring = () => (
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
          <span className="section-icon">♟️</span>
          Chess Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="chess-scoring">
          {/* Scoreboard */}
          <div className="chess-scoreboard">
            <div className="match-score">
              <span>{currentMatch.team1}: {chessScore1}</span>
              <span> - </span>
              <span>{chessScore2}: {currentMatch.team2}</span>
            </div>
          </div>

          {/* Chess Clocks */}
          <div className="chess-clocks">
            <div className={`clock ${chessActivePlayer === 'white' ? 'active' : ''}`}>
              <div className="player-name">{currentMatch.team1} (White)</div>
              <div className="time">{Math.floor(chessTime1 / 60)}:{(chessTime1 % 60).toString().padStart(2, '0')}</div>
            </div>
            <div className={`clock ${chessActivePlayer === 'black' ? 'active' : ''}`}>
              <div className="player-name">{currentMatch.team2} (Black)</div>
              <div className="time">{Math.floor(chessTime2 / 60)}:{(chessTime2 % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>

          {/* Move Controls */}
          <div className="chess-controls">
            <button onClick={handleChessMove} className="move-button">Switch Clock</button>
          </div>

          {/* Result Controls */}
          <div className="chess-results">
            <h3>Game Result</h3>
            <div className="result-buttons">
              <button onClick={() => handleChessResult('white')} className="result-button">White Wins (1-0)</button>
              <button onClick={() => handleChessResult('black')} className="result-button">Black Wins (0-1)</button>
              <button onClick={() => handleChessResult('draw')} className="result-button">Draw (½-½)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVolleyballScoring = () => (
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
          <span className="section-icon">🏐</span>
          Volleyball Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="volleyball-scoring">
          {/* Scoreboard */}
          <div className="volleyball-scoreboard">
            <div className="current-set">
              <div className="set-info">Set {volleyballCurrentSet}</div>
              <div className="serving-indicator">
                Serving: {volleyballServing === 'team1' ? currentMatch.team1 : currentMatch.team2}
              </div>
            </div>
            <div className="score-display">
              <div className="team-score">
                <div className="team-name">{currentMatch.team1}</div>
                <div className="current-score">{volleyballScore1}</div>
                <div className="sets-won">Sets: {volleyballSets1}</div>
              </div>
              <div className="vs">VS</div>
              <div className="team-score">
                <div className="team-name">{currentMatch.team2}</div>
                <div className="current-score">{volleyballScore2}</div>
                <div className="sets-won">Sets: {volleyballSets2}</div>
              </div>
            </div>
          </div>

          {/* Scoring Controls */}
          <div className="volleyball-scoring-controls">
            <div className="team-controls">
              <h4>{currentMatch.team1}</h4>
              <button onClick={() => handleVolleyballPoint('team1')} className="point-button">+1 Point</button>
            </div>
            <div className="team-controls">
              <h4>{currentMatch.team2}</h4>
              <button onClick={() => handleVolleyballPoint('team2')} className="point-button">+1 Point</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBadmintonScoring = () => (
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
          <span className="section-icon">🏸</span>
          Badminton Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="badminton-scoring">
          {/* Scoreboard */}
          <div className="badminton-scoreboard">
            <div className="current-game">
              <div className="game-info">Game {badmintonCurrentGame}</div>
              <div className="serving-indicator">
                Serving: {badmintonServing === 'player1' ? currentMatch.team1 : currentMatch.team2}
              </div>
            </div>
            <div className="score-display">
              <div className="player-score">
                <div className="player-name">{currentMatch.team1}</div>
                <div className="current-score">{badmintonScore1}</div>
                <div className="games-won">Games: {badmintonGames1}</div>
              </div>
              <div className="vs">VS</div>
              <div className="player-score">
                <div className="player-name">{currentMatch.team2}</div>
                <div className="current-score">{badmintonScore2}</div>
                <div className="games-won">Games: {badmintonGames2}</div>
              </div>
            </div>
          </div>

          {/* Scoring Controls */}
          <div className="badminton-scoring-controls">
            <div className="player-controls">
              <h4>{currentMatch.team1}</h4>
              <button onClick={() => handleBadmintonPoint('player1')} className="point-button">+1 Point</button>
            </div>
            <div className="player-controls">
              <h4>{currentMatch.team2}</h4>
              <button onClick={() => handleBadmintonPoint('player2')} className="point-button">+1 Point</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTableTennisScoring = () => (
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
          <span className="section-icon">🏓</span>
          Table Tennis Live Scoring
        </h2>
      </div>
      
      {currentMatch && (
        <div className="table-tennis-scoring">
          {/* Scoreboard */}
          <div className="table-tennis-scoreboard">
            <div className="current-game">
              <div className="game-info">Game {tableTennisCurrentGame}</div>
              <div className="serving-indicator">
                Serving: {tableTennisServing === 'player1' ? currentMatch.team1 : currentMatch.team2}
              </div>
            </div>
            <div className="score-display">
              <div className="player-score">
                <div className="player-name">{currentMatch.team1}</div>
                <div className="current-score">{tableTennisScore1}</div>
                <div className="games-won">Games: {tableTennisGames1}</div>
              </div>
              <div className="vs">VS</div>
              <div className="player-score">
                <div className="player-name">{currentMatch.team2}</div>
                <div className="current-score">{tableTennisScore2}</div>
                <div className="games-won">Games: {tableTennisGames2}</div>
              </div>
            </div>
          </div>

          {/* Scoring Controls */}
          <div className="table-tennis-scoring-controls">
            <div className="player-controls">
              <h4>{currentMatch.team1}</h4>
              <button onClick={() => handleTableTennisPoint('player1')} className="point-button">+1 Point</button>
            </div>
            <div className="player-controls">
              <h4>{currentMatch.team2}</h4>
              <button onClick={() => handleTableTennisPoint('player2')} className="point-button">+1 Point</button>
            </div>
          </div>
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