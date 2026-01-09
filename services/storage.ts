
import { Task, UserStats, TaskTemplate } from '../types';

const KEYS = {
  TASKS: 'zen_producer_tasks',
  STATS: 'zen_producer_stats',
  TEMPLATES: 'zen_producer_templates'
};

export const storage = {
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },
  loadTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveStats: (stats: UserStats) => {
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  },
  loadStats: (): UserStats => {
    const data = localStorage.getItem(KEYS.STATS);
    return data ? JSON.parse(data) : { level: 1, xp: 0, totalTasksCompleted: 0, streak: 0 };
  },
  saveTemplates: (templates: TaskTemplate[]) => {
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
  },
  loadTemplates: (): TaskTemplate[] => {
    const data = localStorage.getItem(KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [
      { id: '1', text: 'Daily Meditation', priority: 'low' },
      { id: '2', text: 'Deep Work Session', priority: 'high' },
      { id: '3', text: 'Reflective Journaling', priority: 'medium' }
    ];
  }
};
