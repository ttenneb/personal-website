import React from "react";
import "./ProjectsCard.css"; // Import the CSS for projects card
import MediaComponent from './MediaComponent'; // Import the MediaComponent

const ProjectsCard = () => {
  const projects = [
    {
        title: "React Survey Platform",
        description: "Built a survey platform in React using SurveyJS with a Node.js and Postgres backend. The platform features dynamic survey creation from csv/json files, a dashboard for modifying surveys and pulling results, and a email notification system with Resend. Deployed on AWS.",
        images: [
          "https://raw.githubusercontent.com/ttenneb/personal-website/main/SurveyExample.png", // Example image 1
          "https://raw.githubusercontent.com/ttenneb/personal-website/main/EmailExample.png", // Example image 2
        ],
    },
    {
        title: "Java 2D Game Engine",
        description: "Developed a 2D game engine in Java with collision detection, physics, and rendering.",
        images: [
          "https://bennetts.work/java-game-engine-1.mp4", // Example GIF 1
          "https://bennetts.work/java-game-engine-2.mp4", // Example GIF 2
        ],
    },
    {
      title: "PyTorch Orbit Estimation using Variational Inference",
      description: "A physics simulation and probabilistic model written in PyTorch. Optimizes the initial distributions of objects to enter an orbit using variational Bayesian inference (E.L.B.O Maximization through gradient descent). The simulation can process 100s of objects in parallel and is fully written in Pytorch to leverage a GPU.",
      images: [
        "https://bennetts.work/orbit-elbo-1.mp4", // Example GIF 1
        "https://bennetts.work/orbit-elbo-2.mp4", // Example GIF 2
      ],
    },
    {
      title: "Real-Time Multiplayer Game",
      description: "Developed a real-time multiplayer game using Godot and Elixir. The game features client-side prediction and authoritative server architecture.",
      images: [
        "https://via.placeholder.com/100", // Example image 1
        "https://via.placeholder.com/100", // Example image 2
      ],
    },
    // Add more projects as needed
  ];

  return (
    <div className="projects-card">
      <h2>Projects</h2>
      {projects.map((project, index) => (
        <div key={index} className="project">
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          {/* Display images or videos in a row using MediaComponent */}
          <div className="project-images">
            {project.images.map((mediaSrc, mediaIndex) => (
              <MediaComponent
                key={mediaIndex}
                src={mediaSrc}
                alt={`Project ${index + 1} Media ${mediaIndex + 1}`}
                width="100%" // Set appropriate width
                height="auto" // Maintain aspect ratio
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsCard;
