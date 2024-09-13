import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import InfoCard from './InfoCard';
import reportWebVitals from './reportWebVitals';
import GameOfLife from './GameOfLife';
import ThemeToggle from './ThemeToggle';
import ProjectsCard from './ProjectsCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameOfLife />
    <div className="cards-column">
      <InfoCard />
      <ProjectsCard />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
