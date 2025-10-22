import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const sports = [
    { name: 'Cricket', icon: '/cricket-logo.png', description: 'Live cricket scoring and player statistics' },
    { name: 'Football', icon: '/football-logo.png', description: 'Real-time football match updates' },
    { name: 'Table Tennis', icon: '/table-tennis-logo.png', description: 'Ping pong scoring and tournament management' },
    { name: 'Badminton', icon: '/badminton-logo.png', description: 'Badminton match tracking and scoring' },
    { name: 'Basketball', icon: '/basketball-logo.png', description: 'Basketball game statistics and live scores' },
    { name: 'Chess', icon: '/chess-logo.png', description: 'Chess tournament scoring and rankings' },
    { name: 'Volleyball', icon: '/volleyball-logo.png', description: 'Volleyball match scoring and team statistics' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
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
      <section className="sports-section">
        <div className="container">
          <h2 className="section-title">Choose Your Sport</h2>
          <div className="sports-grid">
            {sports.map((sport, index) => (
              <div key={index} className="sport-card">
                <div className="sport-icon">
                  <img src={sport.icon} alt={`${sport.name} logo`} className="sport-logo" />
                </div>
                <h3 className="sport-name">{sport.name}</h3>
                <p className="sport-description">{sport.description}</p>
                <button className="sport-btn">Enter Arena</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Scoreboard Section */}
      <section className="live-scoreboard-section">
        <div className="container">
          <h2 className="section-title">Live Scoreboard</h2>
          <div className="scoreboard-grid">
            <div className="scoreboard-card">
              <div className="scoreboard-header">
                <div className="sport-info">
                  <img src="/cricket-logo.png" alt="Cricket" className="sport-logo-small" />
                  <span className="sport-name">Cricket</span>
                </div>
                <div className="match-status live">LIVE</div>
              </div>
              <div className="match-details">
                <div className="team">
                  <span className="team-name">India</span>
                  <span className="team-score">245/3</span>
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <span className="team-name">Australia</span>
                  <span className="team-score">189/7</span>
                </div>
              </div>
              <div className="match-info">
                <span className="overs">Overs: 35.2</span>
                <span className="run-rate">RR: 6.8</span>
              </div>
            </div>

            <div className="scoreboard-card">
              <div className="scoreboard-header">
                <div className="sport-info">
                  <img src="/football-logo.png" alt="Football" className="sport-logo-small" />
                  <span className="sport-name">Football</span>
                </div>
                <div className="match-status live">LIVE</div>
              </div>
              <div className="match-details">
                <div className="team">
                  <span className="team-name">Barcelona</span>
                  <span className="team-score">2</span>
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <span className="team-name">Real Madrid</span>
                  <span className="team-score">1</span>
                </div>
              </div>
              <div className="match-info">
                <span className="time">75'</span>
                <span className="stadium">Camp Nou</span>
              </div>
            </div>

            <div className="scoreboard-card">
              <div className="scoreboard-header">
                <div className="sport-info">
                  <img src="/basketball-logo.png" alt="Basketball" className="sport-logo-small" />
                  <span className="sport-name">Basketball</span>
                </div>
                <div className="match-status live">LIVE</div>
              </div>
              <div className="match-details">
                <div className="team">
                  <span className="team-name">Lakers</span>
                  <span className="team-score">98</span>
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <span className="team-name">Warriors</span>
                  <span className="team-score">95</span>
                </div>
              </div>
              <div className="match-info">
                <span className="quarter">Q4</span>
                <span className="time-left">2:45</span>
              </div>
            </div>

            <div className="scoreboard-card">
              <div className="scoreboard-header">
                <div className="sport-info">
                  <img src="/table-tennis-logo.png" alt="Table Tennis" className="sport-logo-small" />
                  <span className="sport-name">Table Tennis</span>
                </div>
                <div className="match-status live">LIVE</div>
              </div>
              <div className="match-details">
                <div className="team">
                  <span className="team-name">Ma Long</span>
                  <span className="team-score">3</span>
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <span className="team-name">Fan Zhendong</span>
                  <span className="team-score">2</span>
                </div>
              </div>
              <div className="match-info">
                <span className="set">Set 5</span>
                <span className="score">11-9</span>
              </div>
            </div>
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
          <h2 className="section-title">Why Choose Sports Arena?</h2>
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
