
import { Position } from '../utils/gameLogic';

interface LevelData {
  level: number;
  width: number;
  height: number;
  player: Position;
  blocks: Position[];
  targets: Position[];
  walls: Position[];
}

// Level designs
const levels: LevelData[] = [
  // Level 1 - Simple introduction
  {
    level: 1,
    width: 8,
    height: 8,
    player: { x: 4, y: 4 },
    blocks: [
      { x: 3, y: 3 },
      { x: 4, y: 3 }
    ],
    targets: [
      { x: 1, y: 1 },
      { x: 6, y: 6 }
    ],
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 1 }, { x: 7, y: 1 },
      { x: 0, y: 2 }, { x: 7, y: 2 },
      { x: 0, y: 3 }, { x: 7, y: 3 },
      { x: 0, y: 4 }, { x: 7, y: 4 },
      { x: 0, y: 5 }, { x: 7, y: 5 },
      { x: 0, y: 6 }, { x: 7, y: 6 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
    ]
  },
  // Level 2 - A bit more challenging
  {
    level: 2,
    width: 8,
    height: 8,
    player: { x: 1, y: 1 },
    blocks: [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 }
    ],
    targets: [
      { x: 1, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 1 }
    ],
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 1 }, { x: 7, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 },
      { x: 0, y: 3 }, { x: 7, y: 3 },
      { x: 0, y: 4 }, { x: 7, y: 4 },
      { x: 0, y: 5 }, { x: 2, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 },
      { x: 0, y: 6 }, { x: 7, y: 6 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
    ]
  }
];

export default levels;
