
import React from 'react';
import { Feather, BookOpen, Scroll, Star, ShieldCheck, GraduationCap, Award, Sparkles } from 'lucide-react';

interface RankBadgeProps {
  level: number;
}

export const getRankInfo = (level: number) => {
  if (level >= 50) return { 
    title: 'Zen Master', 
    icon: Star, 
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    perk: 'Legendary',
    animation: 'animate-spin-slow'
  };
  if (level >= 25) return { 
    title: 'Sage', 
    icon: Scroll, 
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    perk: 'Deep Flow',
    animation: 'animate-bounce-slow'
  };
  if (level >= 10) return { 
    title: 'Scholar', 
    icon: BookOpen, 
    color: 'text-emerald-900', // Adjusted for contrast against dynamic bg
    perk: 'Focus +5%',
    animation: 'animate-pulse-subtle'
  };
  return { 
    title: 'Seeker', 
    icon: Feather, 
    color: 'text-slate-500 bg-slate-50 border-slate-100',
    perk: null,
    animation: ''
  };
};

export const RankBadge: React.FC<RankBadgeProps> = ({ level }) => {
  const { title, icon: Icon, color, perk, animation } = getRankInfo(level);
  const isScholar = level >= 10 && level < 25;

  return (
    <div className="flex items-center gap-2">
      <div className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] shadow-sm transition-all duration-700 relative overflow-hidden ${
        isScholar 
          ? 'border-emerald-400/50 ring-2 ring-emerald-100/30 ring-offset-1 shadow-emerald-200/40 bg-knowledge-flow' 
          : color
      }`}>
        
        {/* Scholar-specific shimmering background */}
        {isScholar && (
          <>
            {/* Animated particles for "Continuous Learning" */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <Sparkles size={8} className="absolute top-1 left-4 animate-ping text-white" />
              <Sparkles size={6} className="absolute bottom-1 right-6 animate-pulse text-white delay-700" />
            </div>
            
            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer-fast pointer-events-none" />
          </>
        )}

        {/* Scholar-only background emblem: Graduation Cap Watermark */}
        {isScholar && (
          <div className="absolute -right-1 -bottom-1 opacity-[0.12] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-700">
             <GraduationCap size={28} className="text-emerald-900" />
          </div>
        )}

        {/* Scholar Rank Background Detail */}
        {level >= 10 && (
          <div className={`absolute right-0 top-0 bottom-0 w-1/3 bg-white/30 -skew-x-12 transform translate-x-2 ${isScholar ? 'bg-emerald-200/20' : ''}`} />
        )}
        
        <div className="relative">
          <Icon size={12} className={`stroke-[3.5px] ${isScholar ? 'text-emerald-900' : ''} ${animation}`} />
          {isScholar && (
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
        
        <span className={`relative z-10 ${isScholar ? 'text-emerald-950' : ''}`}>{title}</span>
        
        {/* Wisdom Seal - Enhanced for Scholar */}
        {level >= 10 && (
          <div className="relative flex items-center justify-center">
             {isScholar ? (
               <Award size={11} className="text-emerald-900 animate-pulse ml-0.5" />
             ) : (
               <ShieldCheck size={10} className="text-emerald-500/50 ml-0.5" />
             )}
             
             {isScholar && (
               <div className="absolute inset-0 border-2 border-emerald-900/10 rounded-full animate-pulse scale-150" />
             )}
          </div>
        )}
      </div>

      {perk && (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-left-2 duration-700 ${
          isScholar ? 'border-emerald-200' : 'border-gray-100'
        }`}>
          <div className={`w-1 h-1 rounded-full ${isScholar ? 'bg-emerald-500 animate-bounce' : 'bg-emerald-400 animate-pulse'}`} />
          <span className={`text-[8px] font-extrabold uppercase tracking-tighter ${isScholar ? 'text-emerald-800' : 'text-emerald-600'}`}>
            {perk}
          </span>
        </div>
      )}

      <style>{`
        @keyframes knowledge-flow {
          0% { background-color: #ecfdf5; background-position: 0% 50%; } /* emerald-50 */
          50% { background-color: #d1fae5; background-position: 100% 50%; } /* emerald-100 */
          100% { background-color: #ecfdf5; background-position: 0% 50%; }
        }
        .bg-knowledge-flow {
          background: linear-gradient(-45deg, #ecfdf5, #d1fae5, #a7f3d0, #ecfdf5);
          background-size: 400% 400%;
          animation: knowledge-flow 8s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        @keyframes shimmer-fast {
          100% { transform: translateX(100%); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
