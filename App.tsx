
import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Bot } from 'lucide-react';
import { Task, UserStats, Priority, TaskTemplate } from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { TaskItem } from './components/TaskItem';
import { AddTask } from './components/AddTask';
import { FeedbackModal } from './components/FeedbackModal';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { LevelDownOverlay } from './components/LevelDownOverlay';
import { SplashScreen } from './components/SplashScreen';
import { TaskTemplates } from './components/TaskTemplates';
import { EditTaskModal } from './components/EditTaskModal';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [stats, setStats] = useState<UserStats>({ level: 1, xp: 0, totalTasksCompleted: 0, streak: 0 });
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showLevelDown, setShowLevelDown] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);
  const [isSplashing, setIsSplashing] = useState(true);

  // Initial Load & Streak Verification
  useEffect(() => {
    setTasks(storage.loadTasks());
    setTemplates(storage.loadTemplates());
    const savedStats = storage.loadStats();
    
    if (savedStats.lastCompletedAt) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const last = new Date(savedStats.lastCompletedAt);
      last.setHours(0, 0, 0, 0);
      
      const diffTime = now.getTime() - last.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      
      if (diffDays > 1) {
        savedStats.streak = 0;
      }
    }

    setStats(savedStats);
    setPrevLevel(savedStats.level);
  }, []);

  // Save changes
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    storage.saveStats(stats);
    if (stats.level > prevLevel) {
      setShowLevelUp(true);
      setPrevLevel(stats.level);
    } else if (stats.level < prevLevel) {
      setShowLevelDown(true);
      setPrevLevel(stats.level);
    }
  }, [stats, prevLevel]);

  // Deadline Penalty Check
  useEffect(() => {
    if (tasks.length === 0 || isSplashing) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let penalties = 0;
    const updatedTasks = tasks.map(task => {
      if (!task.completed && task.dueDate && !task.penalized) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        if (taskDate < today) {
          penalties += 1;
          return { ...task, penalized: true };
        }
      }
      return task;
    });

    if (penalties > 0) {
      setTasks(updatedTasks);
      setStats(prev => ({
        ...prev,
        level: Math.max(1, prev.level - penalties),
        xp: 0 
      }));
    }
  }, [tasks, isSplashing]);

  const addTask = (text: string, priority: Priority, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Pick<Task, 'text' | 'priority' | 'dueDate'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
  };

  const useTemplate = (template: TaskTemplate) => {
    addTask(template.text, template.priority);
  };

  const saveAsTemplate = (task: Task) => {
    if (templates.some(t => t.text === task.text)) return;
    const newTemplate: TaskTemplate = {
      id: crypto.randomUUID(),
      text: task.text,
      priority: task.priority
    };
    setTemplates([newTemplate, ...templates]);
  };

  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        handleTaskCompletion(task.priority);
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleTaskCompletion = (priority: Priority) => {
    setStats(prev => {
      let multiplier = 1;
      if (prev.streak >= 90) multiplier = 2.0;
      else if (prev.streak >= 30) multiplier = 1.5;
      else if (prev.streak >= 7) multiplier = 1.2;

      const baseRewards = { high: 50, medium: 25, low: 10 };
      const xpReward = Math.round(baseRewards[priority] * multiplier);
      
      const newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let finalXp = newXp;

      while (finalXp >= (newLevel * 100)) {
        finalXp -= (newLevel * 100);
        newLevel += 1;
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const last = prev.lastCompletedAt ? new Date(prev.lastCompletedAt) : null;
      if (last) last.setHours(0, 0, 0, 0);

      let newStreak = prev.streak;
      if (!last) {
        newStreak = 1;
      } else {
        const diffTime = now.getTime() - last.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      }

      return {
        ...prev,
        level: newLevel,
        xp: finalXp,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        streak: newStreak,
        lastCompletedAt: Date.now()
      };
    });
  };

  const activeTasks = tasks.filter(t => !t.completed).sort((a, b) => {
    const pMap = { high: 0, medium: 1, low: 2 };
    if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority];
    return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
  });

  const completedTasks = tasks.filter(t => t.completed);

  if (isSplashing) {
    return <SplashScreen onComplete={() => setIsSplashing(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-32 animate-in fade-in duration-1000">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm flex flex-col relative">
        <Header stats={stats} />

        <main className="flex-1 px-6 pt-6 overflow-y-auto pb-20">
          
          <TaskTemplates 
            templates={templates} 
            onUse={useTemplate} 
            onRemove={removeTemplate} 
          />

          <section className="mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Focus Flow</h2>
            {activeTasks.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
                <Sparkles size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">Clear mind, clear tasks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTask(task.id)} 
                    onDelete={() => deleteTask(task.id)}
                    onSaveAsTemplate={() => saveAsTemplate(task)}
                    onEdit={() => setEditingTask(task)}
                  />
                ))}
              </div>
            )}
          </section>

          {completedTasks.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Past Achievements</h2>
              <div className="space-y-3 opacity-50 transition-opacity hover:opacity-100">
                {completedTasks.slice(0, 5).map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => {}} 
                    onDelete={() => deleteTask(task.id)} 
                  />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 flex justify-center p-6 pointer-events-none z-30">
          <div className="max-w-md w-full pointer-events-auto">
             <AddTask onAdd={addTask} />
          </div>
        </div>

        {/* Action Buttons Stack */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 p-3.5 rounded-full shadow-2xl text-white hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 group relative"
            aria-label="Ask Zen Coach"
          >
            <Bot size={22} />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-indigo-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
              Zen Coach
            </span>
          </button>
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="bg-white p-3.5 rounded-full shadow-xl border border-gray-100 text-gray-400 hover:text-emerald-500 transition-all hover:scale-110 active:scale-95"
            aria-label="Feedback"
          >
            <MessageSquare size={20} />
          </button>
        </div>

        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userStats={stats} />
        <EditTaskModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          onSave={updateTask} 
        />
        <LevelUpOverlay level={stats.level} show={showLevelUp} onComplete={() => setShowLevelUp(false)} />
        <LevelDownOverlay level={stats.level} show={showLevelDown} onComplete={() => setShowLevelDown(false)} />
      </div>
    </div>
  );
};

export default App;
