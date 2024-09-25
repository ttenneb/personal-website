import React, { useState, useEffect, useRef, useCallback } from "react";
import "./GameOfLife.css";

const GameOfLife = ({
  speed = 1250,
  maxRotation = 1,
  rotationPeriod = 30000,
  cellSize = 50,
}) => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const gridRef = useRef(null);
  const rotationAngle = useRef(0);
  const animationFrameRef = useRef(null);

  const calculateGridSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const diagonal = Math.sqrt(width * width + height * height);
    const newCols = Math.ceil(diagonal / cellSize) * 2;
    const newRows = Math.ceil(diagonal / cellSize) * 2;

    setCols(newCols);
    setRows(newRows);

    return Array.from({ length: newRows }, () =>
      Array(newCols)
        .fill(0)
        .map(() => (Math.random() > 0.7 ? 1 : 0))
    );
  }, [cellSize]);

  useEffect(() => {
    setGrid(calculateGridSize());
    const handleResize = () => {
      setGrid(calculateGridSize());
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [calculateGridSize]);

  const countNeighbors = useCallback((grid, x, y) => {
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
  }, [rows, cols]);

  const runSimulation = useCallback(() => {
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
  }, [countNeighbors]);

  useEffect(() => {
    let startTime = performance.now();

    const animateRotation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      rotationAngle.current =
        maxRotation * Math.sin((2 * Math.PI * elapsedTime) / rotationPeriod);

      if (gridRef.current) {
        gridRef.current.style.transform = `rotate(${rotationAngle.current}deg)`;
      }

      animationFrameRef.current = requestAnimationFrame(animateRotation);
    };

    animationFrameRef.current = requestAnimationFrame(animateRotation);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [maxRotation, rotationPeriod]);

  useEffect(() => {
    let intervalId = setInterval(runSimulation, speed);
    return () => clearInterval(intervalId);
  }, [runSimulation, speed]);

  return (
    <div className="game-of-life-background">
      <div
        className="grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          top: "-20vh",
          left: "-20vw",
          position: "absolute",
          transformOrigin: "center",
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
