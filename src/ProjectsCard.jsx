import React from "react";
import "./ProjectsCard.css"; // Import the CSS for projects card

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
          "https://raw.githubusercontent.com/ttenneb/Game-Engine/master/Objects.gif", // Example image 1
          "https://raw.githubusercontent.com/ttenneb/Game-Engine/master/Collision.gif", // Example image 2
        ],
    },
    {
      title: "PyTorch Orbit Estimation using Variational Inference",
      description: "A physics simulation and and probabilistic model written in PyTorch. Optimizes the initial distributions of objects to enter an orbit using variational Bayesian inference (E.L.B.O Maximization through gradient descent). The simulation can process 100s of objects in parallel and is fully written in Pytorch to leverage a GPU.",
      images: [
        "https://raw.githubusercontent.com/ttenneb/bayesian_practice/master/Initial%20Trajectories.gif", // Example image 2
        "https://raw.githubusercontent.com/ttenneb/bayesian_practice/master/Learned%20Initial%20Coniditons.gif", // Example image 3
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

          {/* Display images in a row */}
          <div className="project-images">
            {project.images.map((image, imgIndex) => (
              <img key={imgIndex} src={image} alt={`Project ${index + 1} Image ${imgIndex + 1}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsCard;
