import logo from './logo.svg';
import './App.css';
import GameOfLife from './GameOfLife';
import React from 'react';
import { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import ProjectsCard from './ProjectsCard';

const App = () => {
  // State to control whether the InfoCard or ProjectsCard is shown
  const [showProjects, setShowProjects] = useState(false);

  // Detect URL changes and show the appropriate card
  useEffect(() => {
    const path = window.location.pathname;
    // If URL is "/projects", show ProjectsCard
    if (path === "/projects") {
      setShowProjects(true);
    } else {
      // For root or any other path, show InfoCard
      setShowProjects(false);
    }
  }, []);

  return (
    <div className="app-container">
      {/* Background component */}
      <GameOfLife />

      {/* Conditionally render the InfoCard or ProjectsCard based on the state */}
      <div className="cards-column">
        {!showProjects ? (
          <InfoCard />
        ) : (
          <ProjectsCard />
        )}
      </div>
    </div>
  );
};

export default App;
