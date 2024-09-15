import React, { useState, useEffect, useRef } from "react";
import "./GameOfLife.css";

const GameOfLife = ({
  speed = 200,
  maxRotation = 1,
  rotationPeriod = 30000,
  parallaxIntensity = 0,
}) => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const cellSize = 50;
  const gridRef = useRef(null);
  const rotationAngle = useRef(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  // Calculate grid size based on window size
  const calculateGridSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const diagonal = Math.sqrt(width * width + height * height);
    const newCols = Math.ceil(diagonal / cellSize);
    const newRows = Math.ceil(diagonal / cellSize);

    setCols(newCols);
    setRows(newRows);

    // Create a new grid with random initial conditions
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

  // Run the simulation at the specified speed
  useEffect(() => {
    const interval = setInterval(runSimulation, speed);
    return () => clearInterval(interval);
  }, [grid]);

  // Handle animations (rotation and parallax)
  useEffect(() => {
    let startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;

      // Update rotation angle
      rotationAngle.current =
        maxRotation * Math.sin((2 * Math.PI * elapsedTime) / rotationPeriod) +
        5;

      // Calculate parallax translation
      const translateX = mousePosition.current.x * parallaxIntensity;
      const translateY = mousePosition.current.y * parallaxIntensity;

      // Apply transforms directly to the grid element
      if (gridRef.current) {
        gridRef.current.style.transform = `rotate(${rotationAngle.current}deg) translate(${translateX}px, ${translateY}px)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [maxRotation, rotationPeriod, parallaxIntensity]);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalize mouse position to range [-1, 1]
      mousePosition.current.x = (clientX - centerX) / centerX;
      mousePosition.current.y = (clientY - centerY) / centerY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="game-of-life-background">
      <div
        className="grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
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
