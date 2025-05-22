
import React from 'react';
import Player from './Player';
import Block from './Block';
import Target from './Target';
import { GameState, isBlockOnTarget } from '../utils/gameLogic';

interface LevelProps {
  state: GameState;
}

const Level: React.FC<LevelProps> = ({ state }) => {
  const { player, blocks, targets, walls, width, height } = state;

  // Calculate the board size in pixels
  const boardWidth = width * 40;
  const boardHeight = height * 40;

  return (
    <div 
      className="relative bg-gray-100 border-4 border-gray-700"
      style={{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
      }}
    >
      {/* Render a grid background */}
      <div className="absolute inset-0 grid" 
           style={{
             gridTemplateColumns: `repeat(${width}, 40px)`,
             gridTemplateRows: `repeat(${height}, 40px)`,
           }}>
        {Array.from({ length: width * height }).map((_, index) => {
          const x = index % width;
          const y = Math.floor(index / width);
          const isWall = walls.some(w => w.x === x && w.y === y);
          
          return (
            <div 
              key={index} 
              className={`${isWall ? 'bg-gray-700' : 'bg-gray-200'}`}
              style={{ width: '40px', height: '40px' }}
            />
          );
        })}
      </div>

      {/* Render targets */}
      {targets.map((target, index) => (
        <Target key={`target-${index}`} position={target} />
      ))}

      {/* Render blocks */}
      {blocks.map((block, index) => (
        <Block 
          key={`block-${index}`} 
          position={block} 
          onTarget={isBlockOnTarget(block, targets)} 
        />
      ))}

      {/* Render player */}
      <Player position={player} />
    </div>
  );
};

export default Level;
