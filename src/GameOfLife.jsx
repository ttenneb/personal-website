import React, { useState, useEffect, useRef } from "react";
import "./GameOfLife.css";

const GameOfLife = ({
  speed = 1250,
  maxRotation = 1,  // Maximum rotation angle
  rotationPeriod = 30000,  // Time in ms for a full rotation cycle
  cellSize = 50,
}) => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const gridRef = useRef(null);
  const rotationAngle = useRef(0);
  const requestRef = useRef(null);

  // Calculate grid size based on window size
  const calculateGridSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const diagonal = Math.sqrt(width * width + height * height);
    const newCols = Math.ceil(diagonal / cellSize) * 2; // Increase grid size to cover screen
    const newRows = Math.ceil(diagonal / cellSize) * 2; // Increase grid size to cover screen

    setCols(newCols);
    setRows(newRows);

    return Array.from({ length: newRows }, () =>
      Array(newCols)
        .fill(0)
        .map(() => (Math.random() > 0.7 ? 1 : 0))
    );
  };

  // Initialize the grid
  useEffect(() => {
    setGrid(calculateGridSize());
    const handleResize = () => {
      setGrid(calculateGridSize());
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Game of Life simulation
  const runSimulation = () => {
    setGrid((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          const neighbors = countNeighbors(prevGrid, rowIndex, colIndex);
          if (col === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (col === 0 && neighbors === 3) return 1;
          return col;
        })
      )
    );
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

  // Animate rotation over time
  useEffect(() => {
    let startTime = performance.now();

    const animateRotation = (currentTime) => {
      const elapsedTime = currentTime - startTime;

      // Calculate the new rotation angle
      rotationAngle.current =
        maxRotation * Math.sin((2 * Math.PI * elapsedTime) / rotationPeriod);

      // Apply the rotation and transform to the grid
      if (gridRef.current) {
        gridRef.current.style.transform = `rotate(${rotationAngle.current}deg)`;
      }

      requestRef.current = requestAnimationFrame(animateRotation);
    };

    requestRef.current = requestAnimationFrame(animateRotation);

    return () => cancelAnimationFrame(requestRef.current);
  }, [maxRotation, rotationPeriod]);

  // Run the simulation at the specified speed
  useEffect(() => {
    const interval = setInterval(runSimulation, speed);
    return () => clearInterval(interval);
  }, [grid]);

  return (
    <div className="game-of-life-background">
      <div
        className="grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          top: "-20vh", // Offset for vertical coverage
          left: "-20vw", // Offset for horizontal coverage
          position: "absolute",
          transformOrigin: "center", // Rotate around the center
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
