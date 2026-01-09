
import React from 'react';
import { Bookmark, Plus, X } from 'lucide-react';
import { TaskTemplate, Priority } from '../types';

interface TaskTemplatesProps {
  templates: TaskTemplate[];
  onUse: (template: TaskTemplate) => void;
  onRemove: (id: string) => void;
}

export const TaskTemplates: React.FC<TaskTemplatesProps> = ({ templates, onUse, onRemove }) => {
  const priorityColors: Record<Priority, string> = {
    low: 'border-blue-200 text-blue-600 bg-blue-50/50',
    medium: 'border-amber-200 text-amber-600 bg-amber-50/50',
    high: 'border-rose-200 text-rose-600 bg-rose-50/50'
  };

  if (templates.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Bookmark size={12} className="text-gray-400" />
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rituals & Templates</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`group relative flex-shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${priorityColors[template.priority]}`}
            onClick={() => onUse(template)}
          >
            <span className="text-xs font-bold whitespace-nowrap">{template.text}</span>
            <div className="flex items-center gap-1">
              <Plus size={12} className="opacity-50" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(template.id);
                }}
                className="p-1 rounded-full hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
