import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { Question } from '../types';
import { audioService } from '../utils/audio';

interface ReviewFailureModalProps {
  question: Question;
  onContinue: () => void;
}

export const ReviewFailureModal: React.FC<ReviewFailureModalProps> = ({
  question,
  onContinue,
}) => {
  const exampleSentence =
    question.verb.applySentences[0]?.sentenceWithBlank.replace(
      '_____',
      `[${question.verb.pastDisplay}]`
    ) || `Yesterday, he ${question.verb.pastDisplay}.`;

  // Auto pronounce base and past form sequentially as required by Section XIII
  useEffect(() => {
    const timer = setTimeout(() => {
      // Pronounce base
      audioService.speak(question.verb.base);
      setTimeout(() => {
        // Then pronounce past
        audioService.speak(question.verb.past, question.verb.pronounceContext);
      }, 1200);
    }, 300);

    return () => clearTimeout(timer);
  }, [question]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-slate-100"
      >
        <div className="text-center mb-5">
          <div className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            Correct Answer Revealed
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-300 to-rose-400">
            KẾT QUẢ ĐÚNG CỦA ĐỘNG TỪ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhớ để sử dụng chính xác trong các bài kiểm tra!
          </p>
        </div>

        {/* Word comparison box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Present Form */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-[11px] font-bold text-cyan-400 uppercase block">
                Present (V-inf)
              </span>
              <div className="text-xl sm:text-2xl font-black text-cyan-200 mt-1 flex items-center justify-center gap-1.5">
                <span>{question.verb.base}</span>
                <button
                  type="button"
                  onClick={() => audioService.speak(question.verb.base)}
                  className="p-1 text-cyan-400 hover:text-white"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Past Form */}
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
              <span className="text-[11px] font-bold text-emerald-400 uppercase block">
                Past (V2)
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 flex items-center justify-center gap-1.5">
                <span>{question.verb.pastDisplay}</span>
                <button
                  type="button"
                  onClick={() => audioService.speak(question.verb.past, question.verb.pronounceContext)}
                  className="p-1 text-emerald-400 hover:text-white"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Vietnamese meaning */}
          <div className="text-center py-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Nghĩa tiếng Việt: </span>
            <span className="text-base font-bold text-pink-300 italic">
              &ldquo;{question.verb.meaningVi}&rdquo;
            </span>
          </div>

          {/* Example past simple sentence */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Example in Past Simple:</span>
            </div>
            <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
              &ldquo;{exampleSentence}&rdquo;
            </p>
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-6">
          <button
            id="btn-continue-review"
            type="button"
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>CONTINUE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
