import React, { useEffect, useRef } from "react";
import "./GameOfLife.css";

const PROFILE_PARAM = "profileGol";
const ALIVE_CLASS = "cell cell-alive";
const DEAD_CLASS = "cell cell-dead";

const shouldProfile = () => {
  if (typeof window === "undefined") return false;

  return (
    new URLSearchParams(window.location.search).has(PROFILE_PARAM) ||
    window.localStorage.getItem(PROFILE_PARAM) === "1"
  );
};

const createGrid = (rows, cols) => {
  const grid = new Uint8Array(rows * cols);

  for (let index = 0; index < grid.length; index += 1) {
    grid[index] = Math.random() > 0.7 ? 1 : 0;
  }

  return grid;
};

const GameOfLife = ({
  speed = 140,
  maxRotation = 2,
  rotationPeriod = 30000,
  cellSize = 32,
}) => {
  const gridElementRef = useRef(null);
  const gridRef = useRef(new Uint8Array(0));
  const nextGridRef = useRef(new Uint8Array(0));
  const cellsRef = useRef([]);
  const dimensionsRef = useRef({ rows: 0, cols: 0 });
  const animationFrameRef = useRef(null);
  const intervalRef = useRef(null);
  const profilerRef = useRef({ enabled: false, ticks: 0, simMs: 0, domMs: 0 });

  useEffect(() => {
    const gridElement = gridElementRef.current;
    if (!gridElement) return undefined;

    profilerRef.current.enabled = shouldProfile();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const diagonal = Math.sqrt(width * width + height * height);
      const cols = Math.ceil(diagonal / cellSize) * 2;
      const rows = Math.ceil(diagonal / cellSize) * 2;
      const grid = createGrid(rows, cols);
      const fragment = document.createDocumentFragment();
      const cells = new Array(rows * cols);

      gridElement.replaceChildren();
      gridElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
      gridElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

      for (let index = 0; index < grid.length; index += 1) {
        const cell = document.createElement("div");
        cell.className = grid[index] === 1 ? ALIVE_CLASS : DEAD_CLASS;
        cells[index] = cell;
        fragment.appendChild(cell);
      }

      gridElement.appendChild(fragment);
      dimensionsRef.current = { rows, cols };
      gridRef.current = grid;
      nextGridRef.current = new Uint8Array(rows * cols);
      cellsRef.current = cells;
    };

    const step = () => {
      const { rows, cols } = dimensionsRef.current;
      const grid = gridRef.current;
      const nextGrid = nextGridRef.current;
      const cells = cellsRef.current;

      const simStart = performance.now();

      for (let row = 0; row < rows; row += 1) {
        const rowOffset = row * cols;

        for (let col = 0; col < cols; col += 1) {
          const index = rowOffset + col;
          let neighbors = 0;

          for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
            const neighborRow = row + rowDelta;
            if (neighborRow < 0 || neighborRow >= rows) continue;

            const neighborRowOffset = neighborRow * cols;

            for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
              if (rowDelta === 0 && colDelta === 0) continue;

              const neighborCol = col + colDelta;
              if (neighborCol >= 0 && neighborCol < cols) {
                neighbors += grid[neighborRowOffset + neighborCol];
              }
            }
          }

          const alive = grid[index] === 1;
          nextGrid[index] = alive
            ? neighbors === 2 || neighbors === 3
              ? 1
              : 0
            : neighbors === 3
              ? 1
              : 0;
        }
      }

      const domStart = performance.now();
      for (let index = 0; index < nextGrid.length; index += 1) {
        if (nextGrid[index] !== grid[index]) {
          cells[index].className = nextGrid[index] === 1 ? ALIVE_CLASS : DEAD_CLASS;
        }
      }

      const profile = profilerRef.current;
      if (profile.enabled) {
        profile.ticks += 1;
        profile.simMs += domStart - simStart;
        profile.domMs += performance.now() - domStart;

        if (profile.ticks % 60 === 0) {
          console.info(
            `[GameOfLife profile] ${nextGrid.length} cells | avg sim ${(
              profile.simMs / profile.ticks
            ).toFixed(3)}ms/tick | avg DOM ${(profile.domMs / profile.ticks).toFixed(3)}ms/tick`
          );
        }
      }

      gridRef.current = nextGrid;
      nextGridRef.current = grid;
    };

    const rotate = (currentTime) => {
      const rotationAngle =
        maxRotation * Math.sin((2 * Math.PI * currentTime) / rotationPeriod) + 1;

      gridElement.style.transform = `rotate(${rotationAngle}deg)`;
      animationFrameRef.current = requestAnimationFrame(rotate);
    };

    resize();
    window.addEventListener("resize", resize);
    intervalRef.current = window.setInterval(step, speed);
    animationFrameRef.current = requestAnimationFrame(rotate);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearInterval(intervalRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cellSize, maxRotation, rotationPeriod, speed]);

  return (
    <div className="game-of-life-background">
      <div ref={gridElementRef} className="grid" />
    </div>
  );
};

export default GameOfLife;
