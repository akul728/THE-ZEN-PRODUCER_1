
import React, { useMemo } from 'react';
import { Flame, Quote, Zap, ShieldCheck, Crown } from 'lucide-react';
import { UserStats } from '../types';
import { RankBadge } from './RankBadge';

interface HeaderProps {
  stats: UserStats;
}

const QUOTES = [
  "True knowledge exists in knowing that you know nothing.",
  "The expert in anything was once a beginner.",
  "Wisdom begins in wonder.",
  "Simplicity is the final achievement.",
  "A journey of a thousand miles begins with a single step."
];

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  const xpToNextLevel = stats.level * 100;
  const progressPercent = Math.min((stats.xp / xpToNextLevel) * 100, 100);
  
  const dailyQuote = useMemo(() => {
    const day = new Date().getDate();
    return QUOTES[day % QUOTES.length];
  }, []);

  // Streak Perk Logic
  const streakInfo = useMemo(() => {
    if (stats.streak >= 90) return { 
      label: 'Transcendent', 
      icon: Crown, 
      color: 'text-yellow-600 bg-yellow-50', 
      boost: '2.0x XP',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)] border-yellow-200' 
    };
    if (stats.streak >= 30) return { 
      label: 'Devoted', 
      icon: ShieldCheck, 
      color: 'text-indigo-600 bg-indigo-50', 
      boost: '1.5x XP',
      glow: 'shadow-[0_0_12px_rgba(79,70,229,0.3)] border-indigo-200' 
    };
    if (stats.streak >= 7) return { 
      label: 'Diligent', 
      icon: Zap, 
      color: 'text-orange-600 bg-orange-50', 
      boost: '1.2x XP',
      glow: 'shadow-[0_0_10px_rgba(249,115,22,0.2)] border-orange-200' 
    };
    return { 
      label: 'Consistency', 
      icon: Flame, 
      color: 'text-slate-500 bg-slate-50', 
      boost: null,
      glow: 'border-slate-100' 
    };
  }, [stats.streak]);

  const StreakIcon = streakInfo.icon;

  return (
    <header className="px-6 pt-10 pb-6 sticky top-0 bg-white z-20 border-b border-gray-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Zen Producer</h1>
          <RankBadge level={stats.level} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`flex flex-col items-end transition-all duration-500 group`}>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-700 ${streakInfo.color} ${streakInfo.glow}`}>
              <StreakIcon size={14} className={`${stats.streak > 0 ? 'fill-current animate-pulse' : ''}`} />
              <span className="text-xs font-bold">{stats.streak}d</span>
            </div>
            {streakInfo.boost && (
              <div className="mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${streakInfo.color} ${streakInfo.glow}`}>
                  {streakInfo.boost}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Level</span>
            <span className="text-3xl font-black text-gray-900 leading-none">{stats.level}</span>
          </div>
        </div>
      </div>

      {/* Scholar's Archive Quote Section */}
      <div className="mb-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-3 relative overflow-hidden group">
        <Quote size={32} className="absolute -right-2 -bottom-2 text-slate-100 rotate-12 transition-transform group-hover:rotate-0" />
        <p className="text-[11px] font-medium text-slate-500 italic relative z-10 leading-relaxed pr-6">
          "{dailyQuote}"
        </p>
      </div>
      
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
        {/* Animated flow background for XP bar when streak is high */}
        {stats.streak >= 7 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-xp pointer-events-none z-10" />
        )}
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) relative z-0" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          Mastery Progression
          {streakInfo.boost && <Zap size={10} className="text-orange-400 animate-bounce" />}
        </span>
        <span className="text-[10px] font-bold text-slate-800 tracking-wider">{stats.xp} / {xpToNextLevel} XP</span>
      </div>

      <style>{`
        @keyframes shimmer-xp {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-xp {
          animation: shimmer-xp 2s infinite linear;
        }
      `}</style>
    </header>
  );
};
