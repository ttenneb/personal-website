import React from "react";
import "./InfoCard.css"; // Import the CSS

const InfoCard = () => {
  return (
    <div className="info-card">
      <h1>Bennett Garcia</h1>
      <p>
        Full-Stack Software Engineering & Mathematics
      </p>
      <p>
        Passionate about ML, Bayesian Mechanics, and distributed systems within software and beyond. Currently exploring opportunities...
      </p>
      <div>
        <a href="https://github.com/ttenneb" target="_blank" rel="noreferrer">
            <img width='30px' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg" />
        </a>
        <a href="https://www.linkedin.com/in/bennett-garcia-85272a197/" target="_blank" rel="noreferrer">
            <img width='30px' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" />
        </a>
      </div>
    </div>
  );
};

export default InfoCard;
