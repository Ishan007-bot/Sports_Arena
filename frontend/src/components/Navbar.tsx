import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a className="logo-link" href="/" aria-current="page">
            <img className="logo-img" src="/sports-arena-logo.png" alt="Sports Arena logo" />
          </a>
        </div>
        
        <div className="navbar-menu">
          <a href="#home" className="nav-link">Home</a>
          <a href="#sports" className="nav-link">Sports</a>
          <a href="#livescores" className="nav-link">Live Scores</a>
          <a href="#history" className="nav-link">History</a>
          <a href="#admin" className="nav-link admin-link">Admin Login</a>
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
