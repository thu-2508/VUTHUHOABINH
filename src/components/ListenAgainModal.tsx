import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, Volume2, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { audioService } from '../utils/audio';

interface ListenAgainModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export const ListenAgainModal: React.FC<ListenAgainModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredVerbs = questions
    .map((q) => q.verb)
    // Filter duplicates
    .filter((v, idx, arr) => arr.findIndex((item) => item.id === v.id) === idx)
    .filter(
      (v) =>
        v.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.meaningVi.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 uppercase">
                LISTEN AGAIN & PRACTICE
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Listen to standard UK/US pronunciation for base and past forms.
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

        {/* Search Input */}
        <div className="my-3 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by English verb or Vietnamese meaning..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Verb audio cards */}
        <div className="my-2 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredVerbs.map((verb) => (
            <div
              key={verb.id}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-cyan-400 flex items-center justify-center font-bold">
                  {verb.id}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white font-sans">
                      {verb.base}
                    </span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-base font-black text-cyan-300 font-sans">
                      {verb.pastDisplay}
                    </span>
                  </div>
                  <div className="text-xs text-pink-300 italic">
                    {verb.meaningVi}
                  </div>
                </div>
              </div>

              {/* Audio triggers */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => audioService.speak(verb.base)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-900/40 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title={`Pronounce base "${verb.base}"`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Base</span>
                </button>

                <button
                  type="button"
                  onClick={() => audioService.speak(verb.past, verb.pronounceContext)}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  title={`Pronounce past "${verb.pastDisplay}"`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Past</span>
                </button>
              </div>
            </div>
          ))}

          {filteredVerbs.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No matching verbs found.
            </div>
          )}
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
