
import React from 'react';

interface PlayerProps {
  position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div 
      className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
      style={{ 
        left: `${position.x * 40}px`, 
        top: `${position.y * 40}px`,
        transition: 'all 0.2s ease-in-out',
        zIndex: 20
      }}
    >
      <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
    </div>
  );
};

export default Player;
