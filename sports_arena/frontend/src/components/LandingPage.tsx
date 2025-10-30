import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../contexts/MatchContext';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { liveMatches } = useMatches();
  
  const sports = [
    { name: 'Cricket', icon: '/cricket-logo.png', description: 'Live cricket scoring and player statistics', path: '/cricket' },
    { name: 'Football', icon: '/football-logo.png', description: 'Real-time football match updates', path: '/football' },
    { name: 'Table Tennis', icon: '/table-tennis-logo.png', description: 'Ping pong scoring and tournament management', path: '/table-tennis' },
    { name: 'Badminton', icon: '/badminton-logo.png', description: 'Badminton match tracking and scoring', path: '/badminton' },
    { name: 'Basketball', icon: '/basketball-logo.png', description: 'Basketball game statistics and live scores', path: '/basketball' },
    { name: 'Chess', icon: '/chess-logo.png', description: 'Chess tournament scoring and rankings', path: '/chess' },
    { name: 'Volleyball', icon: '/volleyball-logo.png', description: 'Volleyball match scoring and team statistics', path: '/volleyball' }
  ];

  const handleSportClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome to <span className="highlight">Sports Arena</span>
              </h1>
              <p className="hero-subtitle">
                Your ultimate destination for live sports scoring and player statistics
              </p>
              <div className="hero-buttons">
                <button className="btn-primary">Get Started</button>
                <button className="btn-secondary">View Live Scores</button>
              </div>
            </div>
            <div className="hero-image">
              <img src="/hero-image.jpeg" alt="Sports Arena" className="hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Sports Grid Section */}
      <section id="sports" className="sports-section">
        <div className="container">
          <div className="section-heading-image">
            <img src="/sports-choose-heading.png" alt="Choose Your Sport" className="heading-img" />
          </div>
          <div className="sports-grid">
            {sports.map((sport, index) => (
              <div key={index} className="sport-card">
                <div className="sport-icon">
                  <img src={sport.icon} alt={`${sport.name} logo`} className="sport-logo" />
                </div>
                <h3 className="sport-name">{sport.name}</h3>
                <p className="sport-description">{sport.description}</p>
                <button 
                  className="sport-btn" 
                  onClick={() => handleSportClick(sport.path)}
                >
                  Enter Arena
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Scoreboard Section */}
      <section id="livescores" className="live-scoreboard-section">
        <div className="container">
          <div className="section-heading-image">
            <img src="/live-scoreboard-heading.png" alt="Live Scoreboard" className="heading-img" />
          </div>
          <div className="scoreboard-grid">
            {liveMatches.length > 0 ? (
              liveMatches.slice(0, 3).map((match) => (
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

      {/* Scrolling Images Section */}
      <section className="scrolling-images-section">
        <div className="container">
          <div className="scrolling-container">
            <div className="scrolling-images">
              <div className="image-item">
                <img src="/sports-img-1.jpg" alt="Sports Action 1" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-2.jpg" alt="Sports Action 2" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-3.jpg" alt="Sports Action 3" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-4.jpg" alt="Sports Action 4" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-5.jpg" alt="Sports Action 5" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-6.jpg" alt="Sports Action 6" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-7.png" alt="Sports Action 7" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              {/* Duplicate images for seamless scrolling */}
              <div className="image-item">
                <img src="/sports-img-1.jpg" alt="Sports Action 1" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-2.jpg" alt="Sports Action 2" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-3.jpg" alt="Sports Action 3" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-4.jpg" alt="Sports Action 4" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-5.jpg" alt="Sports Action 5" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-6.jpg" alt="Sports Action 6" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
              <div className="image-item">
                <img src="/sports-img-7.png" alt="Sports Action 7" onError={(e) => {(e.target as HTMLImageElement).src = '/hero-image.jpeg'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-heading-image">
            <img src="/why-choose-heading.png" alt="Why Choose Sports Arena?" className="heading-img" />
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Scoring</h3>
              <p>Real-time score updates for all your favorite sports</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Player Stats</h3>
              <p>Comprehensive player statistics and performance tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Tournaments</h3>
              <p>Organize and manage tournaments across multiple sports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <p className="footer-issue-text">
              If you find any issues, please contact the <a href="#contact" className="footer-link">developer here.</a>
            </p>
          </div>
          
          <div className="footer-content">
            <div className="footer-card">
              <h3 className="footer-card-title">About Sports Arena</h3>
              <p className="footer-card-description">
                I made this Project as part of my Buildspace N&W's S5 project as well as my MERN Course project.
              </p>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-links">
                <li><a href="#github">Github</a></li>
                <li><a href="#version1">Sports Arena Version 1</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Scaler Resources</h3>
              <ul className="footer-links">
                <li><a href="#interviewbit">InterviewBit</a></li>
                <li><a href="#scaler">Scaler</a></li>
                <li><a href="#scaler-tech">Scaler School of Technology</a></li>
                <li><a href="#scaler-business">Scaler School of Business</a></li>
              </ul>
            </div>
            
            <div className="footer-card developer-card">
              <div className="developer-info">
                <div className="developer-avatar">
                  <img src="/developer-avatar.jpg" alt="Developer" className="avatar-img" />
                </div>
                <div className="developer-details">
                  <p className="developer-role">Developer</p>
                  <h4 className="developer-name">Ishan Ganguly</h4>
                  <p className="developer-batch">Batch of '28 SST</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="connect-text">Connect with me:</p>
            <div className="footer-social">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Portfolio</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
