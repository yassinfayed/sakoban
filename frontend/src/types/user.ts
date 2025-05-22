export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isAnonymous?: boolean;
}

export interface LeaderboardEntry {
  id: number;
  user_id: string;
  username: string;
  level_id: number;
  level_name: string;
  moves: number;
  is_complete: boolean;
  completed_at: string;
  is_anonymous: boolean;
}

export interface GameProgress {
  userId: number;
  levelId: number;
  moves: number;
  completed: boolean;
  completedAt?: string;
} 