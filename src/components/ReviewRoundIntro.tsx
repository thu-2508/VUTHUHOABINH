import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Lightbulb, Play } from 'lucide-react';

interface ReviewRoundIntroProps {
  questionCount: number;
  onStartReview: () => void;
}

export const ReviewRoundIntro: React.FC<ReviewRoundIntroProps> = ({
  questionCount,
  onStartReview,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center text-slate-100"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <RefreshCw className="w-8 h-8" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          Special Opportunity • +10 pts each
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-wide">
          REVIEW ROUND
        </h2>

        <p className="text-sm sm:text-base font-medium text-slate-300 mt-2">
          Try the incorrect matches again. Read the Vietnamese hint carefully.
        </p>

        <div className="my-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-left flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-100 space-y-1">
            <p>• You have <strong>{questionCount}</strong> verb(s) to review.</p>
            <p>• Each question has <strong>30 seconds</strong> and a Vietnamese hint.</p>
            <p>• Correct answers earn full <strong>+10 points</strong>!</p>
          </div>
        </div>

        <button
          id="btn-start-review-round"
          type="button"
          onClick={onStartReview}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black uppercase tracking-wider text-base shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>START REVIEW ROUND</span>
        </button>
      </motion.div>
    </div>
  );
};
