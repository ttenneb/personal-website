import logo from './logo.svg';
import './App.css';
import GameOfLife from './GameOfLife';
import React from 'react';
import { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import ProjectsCard from './ProjectsCard';
import ContactCard from './ContactCard';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  // State to control which card to display based on the URL
  const [currentPage, setCurrentPage] = useState("/");

  // Detect URL changes and show the appropriate card
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPage(path);
  }, []);

  return (
    <div className="app-container">
      {/* Background component */}
      <GameOfLife />

      {/* Conditionally render the correct card based on the URL */}
      {currentPage === "/" && <InfoCard />}
      {currentPage === "/projects" && <ProjectsCard />}
      {currentPage === "/contact" && <ContactCard />}
      <Analytics/>
      <SpeedInsights/>  
    </div>
  );
};

export default App;