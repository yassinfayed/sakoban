export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  level: number;
  player: Position;
  blocks: Position[];
  targets: Position[];
  walls: Position[];
  moves: number;
  isComplete: boolean;
  width: number;
  height: number;
  userId?: string | number;
}

// Helper function to check if two positions are equal
export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Check if a position is in an array of positions
export const isInPositions = (pos: Position, positions: Position[]): boolean => {
  return positions.some(p => isSamePosition(p, pos));
};

// Check if a position is valid (within bounds and not a wall)
export const isValidPosition = (pos: Position, state: GameState): boolean => {
  return (
    pos.x >= 0 && 
    pos.x < state.width && 
    pos.y >= 0 && 
    pos.y < state.height && 
    !isInPositions(pos, state.walls)
  );
};

// Get the position in a specific direction
export const getPositionInDirection = (pos: Position, direction: string): Position => {
  switch (direction) {
    case 'up':
      return { x: pos.x, y: pos.y - 1 };
    case 'down':
      return { x: pos.x, y: pos.y + 1 };
    case 'left':
      return { x: pos.x - 1, y: pos.y };
    case 'right':
      return { x: pos.x + 1, y: pos.y };
    default:
      return { ...pos };
  }
};

// Get block at a specific position
export const getBlockAtPosition = (pos: Position, blocks: Position[]): Position | null => {
  const block = blocks.find(b => isSamePosition(b, pos));
  return block ? block : null;
};

// Move player in a direction
export const movePlayer = (state: GameState, direction: string): GameState => {
  const newPlayerPos = getPositionInDirection(state.player, direction);
  
  // Check if the new position is valid
  if (!isValidPosition(newPlayerPos, state)) {
    return state;
  }
  
  // Check if there's a block at the new position
  const blockAtNewPos = getBlockAtPosition(newPlayerPos, state.blocks);
  
  if (blockAtNewPos) {
    // Calculate the position the block would move to
    const newBlockPos = getPositionInDirection(newPlayerPos, direction);
    
    // Check if the block can be moved
    if (!isValidPosition(newBlockPos, state) || getBlockAtPosition(newBlockPos, state.blocks)) {
      return state; // Can't move the block
    }
    
    // Update the block's position
    const newBlocks = state.blocks.map(block => 
      isSamePosition(block, blockAtNewPos) ? newBlockPos : block
    );
    
    // Check if all blocks are on targets
    const allBlocksOnTargets = newBlocks.every(block => 
      isInPositions(block, state.targets)
    );
    
    return {
      ...state,
      player: newPlayerPos,
      blocks: newBlocks,
      moves: state.moves + 1,
      isComplete: allBlocksOnTargets
    };
  }
  
  // No block in the way, just move the player
  return {
    ...state,
    player: newPlayerPos,
    moves: state.moves + 1
  };
};

// Initialize a level
export const initializeLevel = (levelData: any, userId?: string | number): GameState => {
  return {
    level: levelData.level,
    player: levelData.player,
    blocks: levelData.blocks,
    targets: levelData.targets,
    walls: levelData.walls,
    width: levelData.width,
    height: levelData.height,
    moves: 0,
    isComplete: false,
    userId: userId,
  };
};

// Check if a block is on a target
export const isBlockOnTarget = (block: Position, targets: Position[]): boolean => {
  return isInPositions(block, targets);
};
