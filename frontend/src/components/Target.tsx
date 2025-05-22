
import React from 'react';

interface TargetProps {
  position: { x: number; y: number };
}

const Target: React.FC<TargetProps> = ({ position }) => {
  return (
    <div 
      className="absolute w-10 h-10 flex items-center justify-center"
      style={{ 
        left: `${position.x * 40}px`, 
        top: `${position.y * 40}px`,
        zIndex: 5
      }}
    >
      <div className="w-6 h-6 rounded-full border-2 border-green-500"></div>
    </div>
  );
};

export default Target;
