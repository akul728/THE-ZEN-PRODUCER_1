
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fade, setFade] = useState('opacity-0 scale-95');

  useEffect(() => {
    // Start fade in
    const startTimer = setTimeout(() => {
      setFade('opacity-100 scale-100');
    }, 100);

    // Start fade out
    const fadeOutTimer = setTimeout(() => {
      setFade('opacity-0 scale-105');
    }, 2200);

    // Complete splash
    const endTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6">
      <div className={`text-center transition-all duration-1000 ease-out ${fade}`}>
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <div className="w-8 h-8 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight italic">
          Stay true to yourself.
        </h1>
        <p className="mt-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] animate-pulse">
          Zen Producer
        </p>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
