
import React from 'react';

interface BlockProps {
  position: { x: number; y: number };
  onTarget: boolean;
}

const Block: React.FC<BlockProps> = ({ position, onTarget }) => {
  return (
    <div 
      className={`absolute w-10 h-10 ${onTarget ? 'bg-green-600' : 'bg-amber-700'} rounded-sm flex items-center justify-center`}
      style={{ 
        left: `${position.x * 40}px`, 
        top: `${position.y * 40}px`,
        transition: 'all 0.2s ease-in-out',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className={`w-6 h-6 ${onTarget ? 'bg-green-400' : 'bg-amber-500'} rounded-sm`}></div>
    </div>
  );
};

export default Block;
