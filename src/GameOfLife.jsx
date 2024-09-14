import React, { useState, useEffect, useRef } from "react";
import "./GameOfLife.css"; // Importing the external CSS file

const GameOfLife = ({ speed = 200, maxRotation = 1, rotationPeriod = 30000, parallaxIntensity = 10 }) => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const cellSize = 50;
  const requestRef = useRef();

  const calculateGridSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const diagonal = Math.sqrt(width * width + height * height);
    const newCols = Math.ceil(diagonal / cellSize);
    const newRows = Math.ceil(diagonal / cellSize);

    setCols(newCols);
    setRows(newRows);

    return Array.from({ length: newRows }, () =>
      Array(newCols).fill(0).map(() => (Math.random() > 0.7 ? 1 : 0))
    );
  };

  useEffect(() => {
    setGrid(calculateGridSize());
    window.addEventListener("resize", () => {
      setGrid(calculateGridSize());
    });

    return () => window.removeEventListener("resize", calculateGridSize);
  }, []);

  const runSimulation = () => {
    setGrid(prevGrid => {
      return prevGrid.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          const neighbors = countNeighbors(prevGrid, rowIndex, colIndex);
          if (col === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (col === 0 && neighbors === 3) return 1;
          return col;
        })
      );
    });
  };

  const countNeighbors = (grid, x, y) => {
    let count = 0;
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        count += grid[newX][newY];
      }
    });

    return count;
  };

  useEffect(() => {
    const interval = setInterval(runSimulation, speed);
    return () => clearInterval(interval);
  }, [grid]);

  useEffect(() => {
    let animationFrameId;
    let startTime = performance.now();

    const animateRotation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const angle =
        maxRotation * Math.sin((2 * Math.PI * elapsedTime) / rotationPeriod)+5;

      setRotationAngle(angle);

      animationFrameId = requestAnimationFrame(animateRotation);
    };

    animationFrameId = requestAnimationFrame(animateRotation);

    return () => cancelAnimationFrame(animationFrameId);
  }, [maxRotation, rotationPeriod]);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX = (clientX - centerX) / centerX;
      mouseY = (clientY - centerY) / centerY;
    };

    const updateParallax = () => {
      setTranslateX(mouseX * parallaxIntensity);
      setTranslateY(mouseY * parallaxIntensity);
      requestRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [parallaxIntensity]);

  return (
    <div className="game-of-life-background">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          transform: `rotate(${rotationAngle}deg) translate(${translateX}px, ${translateY}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${col ? "cell-alive" : "cell-dead"}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
