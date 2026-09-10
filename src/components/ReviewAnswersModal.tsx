import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { Question } from '../types';
import { audioService } from '../utils/audio';

interface ReviewAnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export const ReviewAnswersModal: React.FC<ReviewAnswersModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-purple-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 uppercase">
              REVIEW ALL ANSWERS
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review every verb question, your choices, and the correct past forms.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Answers List */}
        <div className="my-4 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {questions.map((q, idx) => {
            const isCorrect = q.isCorrect || q.reviewCorrect;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-900/80 border-rose-500/40 hover:border-rose-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left info */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white font-sans">
                          {q.verb.base}
                        </span>
                        <span className="text-sm text-slate-400">→</span>
                        <span className="text-lg font-black text-emerald-400 font-sans">
                          {q.correctPastDisplay}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            audioService.speak(q.verb.past, q.verb.pronounceContext)
                          }
                          className="p-1 rounded-md text-cyan-400 hover:text-white hover:bg-cyan-900/40 transition-colors"
                          title="Listen past pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-pink-300 italic">
                        &ldquo;{q.verb.meaningVi}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Level and Result status */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {q.level}
                    </span>

                    {isCorrect ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct (+10 pts)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/40">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect (0 pts)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sentence example if available */}
                {q.applySentence && (
                  <div className="mt-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                    <span className="text-cyan-400">Context: </span>
                    {q.applySentence.replace('_____', `[${q.correctPastDisplay}]`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
