
import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Priority } from '../types';

interface AddTaskProps {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority, dueDate || undefined);
      setText('');
      setPriority('low');
      setDueDate('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden transition-all">
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => setText(e.target.value)}
            placeholder="Plan your next achievement..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-semibold text-gray-800 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-20 disabled:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4 px-2 pb-1 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Focus Level</span>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      priority === p 
                        ? 'bg-gray-900 border-gray-900 text-white shadow-md' 
                        : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {p === 'low' ? 'Calm' : p === 'medium' ? 'Focus' : 'Urgent'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</span>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
