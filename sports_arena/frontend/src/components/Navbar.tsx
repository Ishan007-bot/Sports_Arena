import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // If already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home page
      navigate('/');
    }
  };

  const handleSportsClick = () => {
    navigate('/sports');
  };

  const handleLiveScoresClick = () => {
    if (location.pathname === '/') {
      // If on home page, scroll to live scores section
      const liveScoresSection = document.getElementById('livescores');
      if (liveScoresSection) {
        liveScoresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page and scroll to live scores
      navigate('/#livescores');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <button className="logo-link" onClick={handleHomeClick} aria-current="page">
            <img className="logo-img" src="/sports-arena-logo.png" alt="Sports Arena logo" />
          </button>
        </div>
        
        <div className="navbar-menu">
          <button className="nav-link" onClick={handleHomeClick}>Home</button>
          <button className="nav-link" onClick={handleSportsClick}>Sports</button>
          <button className="nav-link" onClick={handleLiveScoresClick}>Live Scores</button>
          <button className="nav-link" onClick={handleHomeClick}>History</button>
          <button className="nav-link admin-link" onClick={handleHomeClick}>Admin Login</button>
        </div>
        
        <div className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
