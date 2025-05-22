import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/services/authContext';
import Game from './Game';
import LeaderboardTable from './LeaderboardTable';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { initializeLevel, movePlayer, GameState } from '../utils/gameLogic';
import { getLevels, saveGameProgress } from '../services/api';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const GameLayout: React.FC = () => {
  const { user, logout, setUser, isLoading: isAuthenticating } = useAuth();

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Generate a temporary user ID for anonymous play
  const anonymousUserId = 'anon_' + (localStorage.getItem('anonymousUserId') || Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (!localStorage.getItem('anonymousUserId')) {
      localStorage.setItem('anonymousUserId', anonymousUserId);
    }
  }, [anonymousUserId]);

  // Fetch levels from API
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setIsLoading(true);
        const levelsData = await getLevels();
        setLevels(levelsData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load levels. Using fallback levels.');
        console.error('Error loading levels:', err);
        // Fallback to local levels if API fails
        import('../data/levels').then(module => {
          setLevels(module.default);
          setIsLoading(false);
        });
      }
    };
    
    // Only fetch levels after authentication check is complete
    if (!isAuthenticating) {
      fetchLevels();
    }
  }, [isAuthenticating]);

  // Initialize the game
  useEffect(() => {
    // Initialize game only after levels are loaded and authentication check is complete
    if (levels.length > 0 && currentLevelIndex < levels.length && !isAuthenticating) {
      const userId = isAnonymous ? anonymousUserId : user?.id;
      const initialState = initializeLevel(levels[currentLevelIndex], userId);
      setGameState(initialState);
      setShowLevelComplete(false);
    }
  }, [currentLevelIndex, levels, isAnonymous, user?.id, anonymousUserId, isAuthenticating]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState || gameState.isComplete) return;
      
      switch (e.key) {
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        case 'r':
          restartLevel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Check for level completion and save progress
  useEffect(() => {
    if (gameState?.isComplete) {
      setShowLevelComplete(true);
      
      // Add level to completed levels if not already there
      if (gameState.level && !completedLevels.includes(gameState.level)) {
        setCompletedLevels(prev => [...prev, gameState.level]);
      }
      
      // Save progress to the server if not anonymous
      const userIdToSave = isAnonymous ? anonymousUserId : user?.id?.toString();
      if (gameState.level && userIdToSave) {
        // Get the correct username based on auth state
        let usernameToSave;
        if (isAnonymous) {
          usernameToSave = 'Anonymous Player';
        } else if (user && user.username) {
          usernameToSave = user.username;
        } else {
          usernameToSave = 'Player';
        }

        saveGameProgress(
          userIdToSave,
          gameState.level,
          gameState.moves,
          true,
          usernameToSave
        ).then(() => {
          // Increment updateTrigger to refresh leaderboard
          setUpdateTrigger(prev => prev + 1);
        }).catch(err => {
          console.error('Failed to save progress:', err);
        });
      }
    }
  }, [gameState?.isComplete, completedLevels, isAnonymous, user?.id, anonymousUserId]);

  const handleMove = useCallback((direction: string) => {
    if (!gameState || gameState.isComplete) return;
    
    const newState = movePlayer(gameState, direction);
    setGameState(newState);
  }, [gameState]);

  const restartLevel = useCallback(() => {
    if (!gameState || levels.length === 0) return;
    
    const initialState = initializeLevel(levels[currentLevelIndex]);
    setGameState(initialState);
    setShowLevelComplete(false);
  }, [currentLevelIndex, gameState, levels]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      toast({
        title: "Level Complete!",
        description: "Starting the next level...",
      });
    } else {
      toast({
        title: "Game Complete!",
        description: "You've completed all available levels!",
      });
    }
  }, [currentLevelIndex, levels.length]);

  const handleLevelSelect = useCallback((level: number) => {
    // Subtract 1 to convert from 1-based level number to 0-based array index
    setCurrentLevelIndex(level - 1);
    setShowLevelComplete(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    // Clear anonymous mode when logging out
    setIsAnonymous(false);
    // Clear anonymous user ID from localStorage
    localStorage.removeItem('anonymousUserId');
  };

  // Handle anonymous mode toggle
  const handleAnonymousToggle = (checked: boolean) => {
    setIsAnonymous(checked);
  };

  // Redirect to login if not authenticated AND not anonymous, AND authentication is not loading
  if (!isAuthenticating && !user && !isAnonymous) {
    return <Navigate to="/login" replace />;
  }

  // Show loading indicator if authentication is in progress
  if (isAuthenticating || isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">{error}</div>;
  }

  if (!gameState || levels.length === 0) {
    return <div className="flex items-center justify-center p-8">No levels available.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-end mb-4 space-x-4">
         {(user || isAnonymous) && (
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className={`${user?.role === 'admin' ? 'bg-red-500 text-white hover:bg-red-600' : 'text-blue-500 border-blue-500 hover:bg-blue-50'}`}
            >
              {isAnonymous ? 'Logout' : 'Logout'}
            </Button>
         )}
         <div className="flex items-center space-x-2">
           <Switch
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={handleAnonymousToggle}
            />
           <Label htmlFor="anonymous-mode">Play Anonymously</Label>
         </div>
      </div>
      <Tabs defaultValue="game" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="space-y-4">
          <Game
            currentLevelIndex={currentLevelIndex}
            gameState={gameState}
            showLevelComplete={showLevelComplete}
            levels={levels}
            completedLevels={completedLevels}
            onMove={handleMove}
            onRestart={restartLevel}
            onNextLevel={nextLevel}
            onLevelSelect={handleLevelSelect}
            isAnonymous={isAnonymous} // Pass isAnonymous prop
            anonymousUserId={anonymousUserId} // Pass anonymousUserId prop
          />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTable updateTrigger={updateTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameLayout; 