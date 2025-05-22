import React, { useState, useMemo } from 'react';
import { useAuth } from '@/services/authContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import PuzzleVisualization from '@/components/PuzzleVisualization'; // Import visualization component
import { useNavigate } from 'react-router-dom';

// Helper to parse position strings like "x,y" into { x, y } object
const parsePosition = (posString: string): { x: number; y: number } | null => {
  const parts = posString.split(',').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { x: parts[0], y: parts[1] };
  }
  return null;
};

// Helper to parse multiple position strings like "x1,y1;x2,y2" into an array of { x, y } objects
const parsePositions = (positionsString: string): { x: number; y: number }[] => {
  if (!positionsString) return [];
  return positionsString.split(';').map(parsePosition).filter(pos => pos !== null) as { x: number; y: number }[];
};

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [levelData, setLevelData] = useState({
    level: '',
    width: '',
    height: '',
    player: '', // Format: x,y
    blocks: '', // Format: x1,y1;x2,y2;...
    targets: '', // Format: x1,y1;x2,y2;...
    walls: '', // User-defined walls: x1,y1;x2,y2;...
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLevelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Memoized parsing of position data for visualization and submission
  const visualizationData = useMemo(() => {
    const width = parseInt(levelData.width, 10);
    const height = parseInt(levelData.height, 10);
    const player = parsePosition(levelData.player);
    const blocks = parsePositions(levelData.blocks);
    const targets = parsePositions(levelData.targets);
    const userWalls = parsePositions(levelData.walls); // User-defined walls

    // Generate border walls
    const borderWalls: { x: number; y: number }[] = [];
    if (width > 0 && height > 0) {
      for (let x = 0; x < width; x++) {
        borderWalls.push({ x, y: 0 });
        borderWalls.push({ x, y: height - 1 });
      }
      for (let y = 1; y < height - 1; y++) {
        borderWalls.push({ x: 0, y });
        borderWalls.push({ x: width - 1, y });
      }
    }

    // Combine user-defined walls with border walls, removing duplicates
    const allWalls = [...borderWalls, ...userWalls];
    const uniqueWalls = Array.from(new Set(allWalls.map(wall => `${wall.x},${wall.y}`))).map(posString => {
      const [x, y] = posString.split(',').map(Number);
      return { x, y };
    });

    return {
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      player: player,
      blocks: blocks,
      targets: targets,
      walls: uniqueWalls, // Use combined unique walls
    };
  }, [levelData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Get the session ID from the auth context
    const sessionId = localStorage.getItem('sessionId'); // Assuming sessionId is stored in localStorage by authContext

    if (!sessionId) {
      setError('Authentication failed: No session ID found. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Basic validation before sending to backend
      if (!levelData.level || !levelData.width || !levelData.height || !levelData.player || !levelData.blocks || !levelData.targets) {
         setError('Level number, width, height, player, blocks, and targets are required.');
         return;
      }
      
      const levelNum = parseInt(levelData.level, 10);
      if (isNaN(levelNum)) {
        setError('Level number must be a valid number.');
        return;
      }

      // Use the same combined walls for submission
      const formattedLevelData = {
        name: `Level ${levelNum}`, // Use level number to generate a name
        data: { // Nest all level configuration inside 'data'
          level: levelNum, // Keep level number inside data
          width: visualizationData.width,
          height: visualizationData.height,
          player: visualizationData.player,
          blocks: visualizationData.blocks,
          targets: visualizationData.targets,
          walls: visualizationData.walls,
          // Add any other properties required by the backend level data structure
        }
      };
      
      // More robust validation can be added here before sending

      await axios.post('/api/levels', formattedLevelData, { // Send formattedLevelData
        headers: {
          'Authorization': `Bearer ${sessionId}` // Include the session ID in headers
        }
      });

      toast({
        title: "Success!",
        description: "New puzzle created successfully.",
      });

      // Clear the form
      setLevelData({
        level: '',
        width: '',
        height: '',
        player: '',
        blocks: '',
        targets: '',
        walls: '',
      });

    } catch (err) {
      console.error('Error creating puzzle:', err);
      setError('Failed to create puzzle. ' + (err as any).response?.data?.error || err.message);
      toast({
        title: "Error",
        description: "Failed to create puzzle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Explicitly navigate to login after logout
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel - Create Puzzle</h1>
        {user && user.role === 'admin' && (
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form on the left */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="level">Level Number</Label>
              <Input id="level" name="level" type="number" value={levelData.level} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="width">Width</Label>
              <Input id="width" name="width" type="number" value={levelData.width} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" name="height" type="number" value={levelData.height} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="player">Player Position (x,y)</Label>
              <Input id="player" name="player" type="text" value={levelData.player} onChange={handleChange} placeholder="e.g., 4,4" required />
            </div>
            <div>
              <Label htmlFor="blocks">Block Positions (x1,y1;x2,y2;...)</Label>
              <Textarea id="blocks" name="blocks" value={levelData.blocks} onChange={handleChange} placeholder="e.g., 3,3;4,3" required />
            </div>
            <div>
              <Label htmlFor="targets">Target Positions (x1,y1;x2,y2;...)</Label>
              <Textarea id="targets" name="targets" value={levelData.targets} onChange={handleChange} placeholder="e.g., 1,1;6,6" required />
            </div>
            <div>
              <Label htmlFor="walls">Additional Wall Positions (x1,y1;x2,y2;...)</Label>
              <Textarea id="walls" name="walls" value={levelData.walls} onChange={handleChange} placeholder="e.g., 0,0;1,0;..." />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Puzzle'}
            </Button>
          </form>
        </div>
        
        {/* Visualization on the right */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Puzzle Preview</h2>
          <PuzzleVisualization
            width={visualizationData.width}
            height={visualizationData.height}
            player={visualizationData.player}
            blocks={visualizationData.blocks}
            targets={visualizationData.targets}
            walls={visualizationData.walls}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 