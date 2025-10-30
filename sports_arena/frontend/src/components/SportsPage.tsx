import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const SportsPage: React.FC = () => {
  const navigate = useNavigate();

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
      <section className="sports-section" style={{ paddingTop: 24 }}>
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
    </div>
  );
};

export default SportsPage;


