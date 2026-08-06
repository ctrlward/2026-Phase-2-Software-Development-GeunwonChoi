export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  streakCount: number;
  rankTier: string;
  streakFlameColor: string;
  lastActiveDate: string | null;
  createdAt: string;
  completedQuestCount: number;
  unlockedBadgeCount: number;
}

export type UserProfile = User;

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isCompleted: boolean;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  requiredType: string;
  requiredValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface QuestCompletionResponse {
  quest: Quest;
  xpEarned: number;
  streakMultiplier: number;
  leveledUp: boolean;
  newLevel: number;
  rankTier: string;
  currentXP: number;
  requiredXP: number;
  streakCount: number;
  streakFlameColor: string;
  newlyUnlockedBadges: Badge[];
}

export interface CreateQuestInput {
  title: string;
  description?: string;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate?: string;
}
