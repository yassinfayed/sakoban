import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface PuzzleVisualizationProps {
  width: number;
  height: number;
  player: Position | null;
  blocks: Position[];
  targets: Position[];
  walls: Position[];
}

const PuzzleVisualization: React.FC<PuzzleVisualizationProps> = ({
  width,
  height,
  player,
  blocks,
  targets,
  walls,
}) => {
  // Basic validation
  if (width <= 0 || height <= 0) {
    return <div className="text-center text-gray-500">Enter width and height to see the grid.</div>;
  }

  // Define cell size and grid dimensions (using 40px like the game)
  const cellSize = 40; // px
  const gridWidth = width * cellSize;
  const gridHeight = height * cellSize;

  return (
    <div 
      className="relative border-4 border-gray-700 bg-gray-100 mx-auto overflow-hidden" // Added overflow-hidden
      style={{
        width: gridWidth,
        height: gridHeight,
      }}
    >
      {/* Render grid background (matching game's approach) */}
       <div className="absolute inset-0 grid" 
           style={{
             gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
             gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
           }}>
        {Array.from({ length: width * height }).map((_, index) => {
          const x = index % width;
          const y = Math.floor(index / width);
          const isWall = walls.some(w => w.x === x && w.y === y);
          
          return (
            <div 
              key={index} 
              className={`${isWall ? 'bg-gray-700' : 'bg-gray-200'}`}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            />
          );
        })}
      </div>

      {/* Render targets (matching Target.tsx styling) */}
      {targets.map((target, index) => (
        <div
          key={`target-${index}`}
          className="absolute w-10 h-10 flex items-center justify-center"
          style={{
            left: target.x * cellSize,
            top: target.y * cellSize,
            zIndex: 5, // Ensure targets are below blocks and player
          }}
        >
           <div className="w-6 h-6 rounded-full border-2 border-green-500"></div>
        </div>
      ))}
      {/* Render blocks (matching Block.tsx styling) */}
       {blocks.map((block, index) => (
        <div
          key={`block-${index}`}
          className="absolute w-10 h-10 bg-amber-700 rounded-sm flex items-center justify-center"
          style={{
            left: block.x * cellSize,
            top: block.y * cellSize,
            width: cellSize,
            height: cellSize,
            zIndex: 10, // Ensure blocks are above targets
          }}
        >
          <div className="w-6 h-6 bg-amber-500 rounded-sm"></div>
        </div>
      ))}
      {/* Render player (matching Player.tsx styling) */}
      {player && (
        <div
          className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
          style={{
            left: player.x * cellSize,
            top: player.y * cellSize,
            width: cellSize,
            height: cellSize,
            zIndex: 20, // Ensure player is on top
          }}
        >
          <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default PuzzleVisualization; 