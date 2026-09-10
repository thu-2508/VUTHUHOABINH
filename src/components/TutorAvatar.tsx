import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Clock, Award } from 'lucide-react';

interface TutorAvatarProps {
  mood: 'happy' | 'celebrating' | 'thinking' | 'worried' | 'cheering';
  message: string;
}

export const TutorAvatar: React.FC<TutorAvatarProps> = ({ mood, message }) => {
  return (
    <div id="tutor-companion" className="flex items-center gap-3 select-none">
      {/* 3D-styled Avatar Circle */}
      <motion.div
        animate={{
          y: mood === 'celebrating' ? [-4, 4, -4] : [-2, 2, -2],
          scale: mood === 'celebrating' ? [1, 1.06, 1] : 1,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex-shrink-0"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden relative">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-cyan-500/20" />

            {/* Custom high-craft 3D Tutor Icon representation */}
            <div className="relative z-10 flex flex-col items-center">
              {mood === 'celebrating' ? (
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">🎉</div>
              ) : mood === 'worried' ? (
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">⏱️</div>
              ) : mood === 'thinking' ? (
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">🤔</div>
              ) : mood === 'cheering' ? (
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">⭐</div>
              ) : (
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">👩‍🏫</div>
              )}
            </div>

            {/* Status indicator pip */}
            <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_8px_#34d399]" />
          </div>
        </div>

        {/* Small floating reaction icon */}
        <div className="absolute -top-2 -right-1 bg-slate-900/90 border border-purple-400/50 rounded-full p-1 shadow-lg text-amber-300">
          {mood === 'celebrating' && <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />}
          {mood === 'happy' && <Heart className="w-3 h-3 text-pink-400" />}
          {mood === 'worried' && <Clock className="w-3 h-3 text-rose-400 animate-pulse" />}
          {mood === 'cheering' && <Award className="w-3 h-3 text-amber-300" />}
          {mood === 'thinking' && <Sparkles className="w-3 h-3 text-cyan-300" />}
        </div>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, x: -6, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 6, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[260px] sm:max-w-sm px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-purple-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-xs sm:text-sm text-slate-200"
        >
          {/* Bubble tail pointing to avatar */}
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45 border-l border-b border-purple-500/30" />
          <div className="font-semibold text-[11px] text-cyan-400 tracking-wide uppercase flex items-center gap-1.5">
            <span>SMART TUTOR</span>
            <span className="text-slate-500">•</span>
            <span className="text-pink-400 font-medium lowercase">vũ thị mai thu</span>
          </div>
          <p className="mt-0.5 leading-snug font-medium text-slate-100">{message}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
