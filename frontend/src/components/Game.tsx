import React from 'react';
import Level from './Level';
import Controls from './Controls';
import { LevelSelector } from './LevelSelector';
import { Button } from "@/components/ui/button";
import { GameState } from '../utils/gameLogic';
import { toast } from '@/hooks/use-toast';

interface GameProps {
  currentLevelIndex: number;
  gameState: GameState | null;
  showLevelComplete: boolean;
  levels: any[];
  completedLevels: number[];
  onMove: (direction: string) => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onLevelSelect: (levelIndex: number) => void;
  isAnonymous: boolean;
  anonymousUserId: string;
}

const Game: React.FC<GameProps> = ({
  currentLevelIndex,
  gameState,
  showLevelComplete,
  levels,
  completedLevels,
  onMove,
  onRestart,
  onNextLevel,
  onLevelSelect,
  isAnonymous,
  anonymousUserId,
}) => {

  if (!gameState || levels.length === 0) {
    return <div className="flex items-center justify-center p-8">Loading levels...</div>;
  }

  const displayedUserId = isAnonymous ? `Anonymous User: ${anonymousUserId.substring(0, 6)}...` : `User ID: ${gameState.userId}`;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-row items-center w-full max-w-2xl justify-between mb-2">
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold">Level {gameState.level}</h2>
          <p className="text-sm text-gray-500">Moves: {gameState.moves}</p>
          <p className="text-xs text-gray-400">{displayedUserId}</p>
        </div>
        <LevelSelector
          currentLevel={currentLevelIndex + 1}
          totalLevels={levels.length}
          onLevelSelect={onLevelSelect}
          completedLevels={completedLevels}
        />
      </div>
      <div className="relative">
        <Level state={gameState} />
        {showLevelComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="bg-slate-800 p-8 rounded-xl text-center shadow-xl border border-slate-700 z-50">
              <h3 className="text-2xl font-bold mb-4 text-white">Level Complete!</h3>
              <p className="text-lg mb-6 text-gray-300">You solved it in {gameState.moves} moves.</p>
              {currentLevelIndex < levels.length - 1 ? (
                <Button 
                  onClick={onNextLevel}
                  className="text-lg px-8 py-6"
                >
                  Next Level
                </Button>
              ) : (
                <p className="text-xl font-bold text-green-500">You completed all levels!</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Controls 
        onMove={onMove}
        onRestart={onRestart}
      />
      <div className="text-center text-sm text-gray-400">
        <p>Move the player with arrow keys and push blocks onto the targets.</p>
        <p>Press 'R' to restart the level.</p>
      </div>
    </div>
  );
};

export default Game;
