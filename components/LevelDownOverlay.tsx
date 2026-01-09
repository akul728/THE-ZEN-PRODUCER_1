
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface LevelDownOverlayProps {
  level: number;
  show: boolean;
  onComplete: () => void;
}

export const LevelDownOverlay: React.FC<LevelDownOverlayProps> = ({ level, show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-rose-600/95 animate-in fade-in duration-300">
      <div className="text-center text-white p-8 animate-in zoom-in slide-in-from-top-12 duration-500 delay-150 fill-mode-both">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <AlertTriangle size={48} className="text-white" />
        </div>
        <h2 className="text-5xl font-black mb-2 uppercase tracking-tighter">Deadline Missed</h2>
        <p className="text-xl font-medium text-rose-50 mb-4 opacity-90">Dropped to Level {level}</p>
        <div className="h-1 w-24 bg-white/30 rounded-full mx-auto" />
      </div>
    </div>
  );
};
