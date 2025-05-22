import { LeaderboardEntry } from '@/types/user';

export const dummyLeaderboard: LeaderboardEntry[] = [
  {
    id: 1,
    userId: 1,
    username: "SokobanMaster",
    levelId: 1,
    levelName: "Level 1",
    moves: 15,
    completedAt: "2024-03-15T10:30:00Z",
    isAnonymous: false
  },
  {
    id: 2,
    userId: 2,
    username: "Anonymous Player",
    levelId: 1,
    levelName: "Level 1",
    moves: 18,
    completedAt: "2024-03-15T11:20:00Z",
    isAnonymous: true
  },
  {
    id: 3,
    userId: 3,
    username: "PuzzlePro",
    levelId: 2,
    levelName: "Level 2",
    moves: 25,
    completedAt: "2024-03-15T12:15:00Z",
    isAnonymous: false
  },
  {
    id: 4,
    userId: 4,
    username: "Anonymous Player",
    levelId: 2,
    levelName: "Level 2",
    moves: 28,
    completedAt: "2024-03-15T13:45:00Z",
    isAnonymous: true
  },
  {
    id: 5,
    userId: 5,
    username: "BoxMover",
    levelId: 3,
    levelName: "Level 3",
    moves: 32,
    completedAt: "2024-03-15T14:30:00Z",
    isAnonymous: false
  },
  {
    id: 6,
    userId: 6,
    username: "Anonymous Player",
    levelId: 3,
    levelName: "Level 3",
    moves: 35,
    completedAt: "2024-03-15T15:20:00Z",
    isAnonymous: true
  }
]; 