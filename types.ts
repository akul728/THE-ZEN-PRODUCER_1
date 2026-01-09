
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: string; // ISO date string
  priority: Priority;
  penalized?: boolean; // True if this task already caused a level loss
}

export interface TaskTemplate {
  id: string;
  text: string;
  priority: Priority;
}

export interface UserStats {
  level: number;
  xp: number;
  totalTasksCompleted: number;
  streak: number;
  lastCompletedAt?: number; // Timestamp of last completion for streak logic
}

export interface FeedbackData {
  rating: number;
  comment: string;
  timestamp: number;
}
