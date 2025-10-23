import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Arena from './components/Arena';
import { SocketProvider } from './contexts/SocketContext';
import { MatchProvider } from './contexts/MatchContext';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <MatchProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/cricket" element={<Arena sport="Cricket" />} />
              <Route path="/football" element={<Arena sport="Football" />} />
              <Route path="/table-tennis" element={<Arena sport="Table Tennis" />} />
              <Route path="/badminton" element={<Arena sport="Badminton" />} />
              <Route path="/basketball" element={<Arena sport="Basketball" />} />
              <Route path="/chess" element={<Arena sport="Chess" />} />
              <Route path="/volleyball" element={<Arena sport="Volleyball" />} />
            </Routes>
          </div>
        </Router>
      </MatchProvider>
    </SocketProvider>
  );
}

export default App;