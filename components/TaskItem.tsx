
import React from 'react';
import { Check, Trash2, Calendar, AlertCircle, BookmarkPlus, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onSaveAsTemplate?: () => void;
  onEdit?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onSaveAsTemplate, onEdit }) => {
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
  
  const priorityColors = {
    low: 'bg-blue-400',
    medium: 'bg-amber-400',
    high: 'bg-rose-500'
  };

  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  }) : null;

  return (
    <div 
      className={`group relative flex items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-300 ${
        task.completed ? 'border-transparent bg-gray-50' : 'border-gray-100 shadow-sm hover:shadow-md'
      } ${task.penalized && !task.completed ? 'border-rose-100 bg-rose-50/30' : ''}`}
    >
      {/* Priority Pip */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full ${priorityColors[task.priority]}`} />

      <div className="flex items-center gap-4 flex-1 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={task.completed}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500 text-white scale-110' 
              : 'border-gray-200 hover:border-emerald-400 text-transparent'
          }`}
        >
          <Check size={14} />
        </button>
        <div 
          className="flex flex-col flex-1 cursor-pointer"
          onClick={() => !task.completed && onEdit?.()}
        >
          <span className={`text-sm font-semibold transition-all leading-tight ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}>
            {task.text}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {formattedDate && (
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                isOverdue ? 'text-rose-500' : 'text-gray-400'
              }`}>
                <Calendar size={10} />
                <span>{isOverdue ? 'Overdue' : `Due ${formattedDate}`}</span>
              </div>
            )}
            {task.penalized && !task.completed && (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                <AlertCircle size={10} />
                <span>Level Lost</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <>
            <button 
              onClick={onEdit}
              className="text-gray-300 hover:text-indigo-500 transition-colors p-2"
              title="Edit Task"
            >
              <Edit2 size={16} />
            </button>
            {onSaveAsTemplate && (
              <button 
                onClick={onSaveAsTemplate}
                className="text-gray-300 hover:text-emerald-500 transition-colors p-2"
                title="Save as Template"
              >
                <BookmarkPlus size={16} />
              </button>
            )}
          </>
        )}
        <button 
          onClick={onDelete}
          className="text-gray-300 hover:text-rose-400 transition-colors p-2"
          aria-label="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
