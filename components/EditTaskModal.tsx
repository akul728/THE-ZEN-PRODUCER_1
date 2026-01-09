
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, BarChart2 } from 'lucide-react';
import { Task, Priority } from '../types';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<Task, 'text' | 'priority' | 'dueDate'>>) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setText(task.text);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(task.id, {
        text: text.trim(),
        priority,
        dueDate: dueDate || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Refine Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-semibold text-gray-800 outline-none focus:border-emerald-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart2 size={12} /> Priority Level
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    priority === p 
                      ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-[1.02]' 
                      : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {p === 'low' ? 'Calm' : p === 'medium' ? 'Focus' : 'Urgent'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} /> Deadline
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Mastery
          </button>
        </form>
      </div>
    </div>
  );
};
