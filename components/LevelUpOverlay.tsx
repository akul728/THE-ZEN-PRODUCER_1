
import React, { useEffect } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { getRankInfo } from './RankBadge';

interface LevelUpOverlayProps {
  level: number;
  show: boolean;
  onComplete: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ level, show, onComplete }) => {
  const { title, icon: RankIcon } = getRankInfo(level);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-600/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="text-center text-white p-8 animate-in zoom-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 animate-pulse">
            <RankIcon size={64} className="text-white drop-shadow-lg" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-xl font-black">
            {level}
          </div>
          <Sparkles className="absolute -top-4 -left-4 text-emerald-200 animate-bounce" size={24} />
        </div>
        
        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-emerald-200">Enlightenment Gained</h2>
        <h3 className="text-5xl font-black mb-4 uppercase tracking-tighter drop-shadow-sm">LEVEL {level}</h3>
        <p className="text-xl font-medium bg-white/20 px-6 py-2 rounded-full inline-block backdrop-blur-sm border border-white/10">
          Rank: {title}
        </p>
        
        <div className="mt-8 flex justify-center gap-1">
          {[1,2,3].map(i => (
            <div key={i} className="h-1 w-8 bg-white/30 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
