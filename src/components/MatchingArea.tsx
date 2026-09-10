import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  MoveHorizontal,
  Lightbulb,
} from 'lucide-react';
import { Question, QuestionOption } from '../types';
import { SpeakerButton } from './SpeakerButton';
import { audioService } from '../utils/audio';

interface MatchingAreaProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  isReviewRound: boolean;
  vietnameseHint?: string;
  onAnswerSubmit: (option: QuestionOption) => void;
  status: 'active' | 'correct' | 'incorrect' | 'timeout';
  selectedOption: QuestionOption | null;
  feedbackText: string;
  showSpeaker: boolean;
}

export const MatchingArea: React.FC<MatchingAreaProps> = ({
  question,
  isReviewRound,
  vietnameseHint,
  onAnswerSubmit,
  status,
  selectedOption,
  feedbackText,
  showSpeaker,
}) => {
  const [selectedBase, setSelectedBase] = useState<boolean>(false);
  const [dragOverDropzone, setDragOverDropzone] = useState<boolean>(false);

  // Reset base selection on question change
  useEffect(() => {
    setSelectedBase(false);
    setDragOverDropzone(false);
  }, [question.id]);

  // Keyboard shortcut listener (keys 1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    if (status !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      let index = -1;
      if (['1', '2', '3', '4'].includes(key)) {
        index = parseInt(key, 10) - 1;
      } else if (['A', 'B', 'C', 'D'].includes(key)) {
        index = key.charCodeAt(0) - 65;
      }

      if (index >= 0 && index < question.options.length) {
        audioService.playCardSelect();
        onAnswerSubmit(question.options[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, status, onAnswerSubmit]);

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, option: QuestionOption) => {
    if (status !== 'active') return;
    e.dataTransfer.setData('text/plain', option.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (status !== 'active') return;
    e.preventDefault();
    setDragOverDropzone(true);
  };

  const handleDragLeave = () => {
    setDragOverDropzone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (status !== 'active') return;
    e.preventDefault();
    setDragOverDropzone(false);
    const optionId = e.dataTransfer.getData('text/plain');
    const option = question.options.find((opt) => opt.id === optionId);
    if (option) {
      audioService.playCardSelect();
      onAnswerSubmit(option);
    }
  };

  // Handle click on past card
  const handleOptionClick = (option: QuestionOption) => {
    if (status !== 'active') return;
    audioService.playCardSelect();
    onAnswerSubmit(option);
  };

  return (
    <div id="matching-playground" className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 select-none">
      {/* Review Round Vietnamese Hint Banner */}
      {isReviewRound && vietnameseHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-start sm:items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 flex-shrink-0">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Gợi ý từ Gia sư (Review Round Hint):
            </div>
            <div className="text-sm sm:text-base font-semibold text-amber-100 mt-0.5">
              {vietnameseHint}
            </div>
          </div>
        </motion.div>
      )}

      {/* Target Base Verb & Dropzone container */}
      <div className="w-full flex flex-col items-center">
        {/* Apply level sentence context banner if present */}
        {question.level === 'Apply' && question.applySentence && (
          <div className="w-full mb-4 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Complete the past simple sentence:
            </span>
            <p className="text-lg sm:text-2xl font-bold text-slate-100 leading-relaxed font-sans">
              {question.applySentence.split('_____').map((part, pIdx, arr) => (
                <React.Fragment key={pIdx}>
                  <span>{part}</span>
                  {pIdx < arr.length - 1 && (
                    <span
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`inline-flex items-center justify-center px-4 py-1 mx-2 min-w-[120px] rounded-xl font-mono text-lg font-black border-2 transition-all ${
                        selectedOption
                          ? status === 'correct'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-[0_0_15px_#34d399]'
                            : 'bg-rose-950 text-rose-300 border-rose-400 shadow-[0_0_15px_#f43f5e]'
                          : dragOverDropzone
                          ? 'bg-cyan-950 text-cyan-200 border-cyan-400 scale-105 animate-pulse'
                          : 'bg-slate-800/80 text-cyan-400 border-dashed border-cyan-500/50'
                      }`}
                    >
                      {selectedOption ? selectedOption.text : '______'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        )}

        {/* Primary 3D Word Cards Matching Zone */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* LEFT: Present / Base Verb Card */}
          <div
            id="card-base-verb"
            onClick={() => setSelectedBase(!selectedBase)}
            className={`relative p-5 sm:p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between border-2 cursor-pointer ${
              selectedBase
                ? 'bg-gradient-to-br from-purple-950/90 to-slate-900 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-[1.02]'
                : 'bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-cyan-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-cyan-400'
            }`}
          >
            {/* 3D Glass shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 rounded-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                Present Form (V-inf)
              </span>
              {showSpeaker && (
                <SpeakerButton
                  textToSpeak={question.verb.base}
                  size="md"
                  className="relative z-10"
                />
              )}
            </div>

            {/* Base Word Display */}
            <div className="py-6 sm:py-8 text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 tracking-tight">
                {question.verb.base}
              </div>
              {/* Vietnamese meaning display */}
              {(question.meaningShown || status === 'correct') && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm sm:text-base font-semibold text-pink-300 italic"
                >
                  &ldquo;{question.verb.meaningVi}&rdquo;
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Drag to match or click</span>
              </span>
              <span className="text-slate-500 font-mono">Verb #{question.verb.id}</span>
            </div>
          </div>

          {/* RIGHT: Dropzone / Matched Slot */}
          <div
            id="card-match-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative p-5 sm:p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between border-2 ${
              status === 'correct'
                ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.5)]'
                : status === 'incorrect' || status === 'timeout'
                ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.4)]'
                : dragOverDropzone
                ? 'bg-purple-950/70 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-[1.02]'
                : selectedBase
                ? 'bg-slate-900/80 border-dashed border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse'
                : 'bg-slate-900/60 border-dashed border-slate-700 shadow-inner'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                Target: Correct Past Form (V2)
              </span>
              {selectedOption && showSpeaker && (
                <SpeakerButton
                  textToSpeak={selectedOption.audioText}
                  contextPhrase={selectedOption.pronounceContext}
                  size="md"
                  className="relative z-10"
                />
              )}
            </div>

            {/* Content of dropzone */}
            <div className="py-6 sm:py-8 text-center flex flex-col items-center justify-center min-h-[140px]">
              {selectedOption ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                      status === 'correct'
                        ? 'text-emerald-300'
                        : status === 'incorrect' || status === 'timeout'
                        ? 'text-rose-300'
                        : 'text-purple-200'
                    }`}
                  >
                    {selectedOption.text}
                  </div>

                  {/* Icon status indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    {status === 'correct' && (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/50">
                        <CheckCircle className="w-4 h-4" />
                        <span>+10 Points</span>
                      </div>
                    )}
                    {(status === 'incorrect' || status === 'timeout') && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/50">
                        <XCircle className="w-4 h-4" />
                        <span>Review Round</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center text-slate-500 gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    {dragOverDropzone
                      ? 'Drop here to match!'
                      : selectedBase
                      ? 'Now click one of the 4 past cards below!'
                      : 'Drag past card here or click to match'}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom status text */}
            <div className="pt-2 border-t border-slate-800 text-center text-xs font-semibold">
              {status === 'correct' ? (
                <span className="text-emerald-400 font-bold">✨ Matched Successfully!</span>
              ) : status === 'incorrect' ? (
                <span className="text-rose-400 font-bold">Try again in Review Round</span>
              ) : status === 'timeout' ? (
                <span className="text-amber-400 font-bold">Time expired for this question</span>
              ) : (
                <span className="text-slate-500">Press 1-4 on keyboard or tap</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      <AnimatePresence>
        {feedbackText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`w-full py-3.5 px-6 rounded-2xl text-center font-bold text-base sm:text-lg border shadow-lg flex items-center justify-center gap-2 ${
              status === 'correct'
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
            }`}
          >
            {status === 'correct' ? (
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            ) : (
              <span className="text-xl">🥺</span>
            )}
            <span>{feedbackText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 PAST FORM CHOICES */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Select or Drag the Correct Past Form (Dạng quá khứ):</span>
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Shortcuts: [1] [2] [3] [4]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {question.options.map((option, idx) => {
            const isThisSelected = selectedOption?.id === option.id;
            let cardStyle =
              'bg-slate-900/80 border-purple-500/30 text-slate-100 hover:border-cyan-400 hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]';

            if (isThisSelected) {
              if (status === 'correct') {
                cardStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_25px_#34d399]';
              } else if (status === 'incorrect') {
                cardStyle = 'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_25px_#f43f5e]';
              } else {
                cardStyle = 'bg-purple-950 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)]';
              }
            }

            return (
              <motion.div
                key={option.id}
                id={`card-past-option-${idx}`}
                draggable={status === 'active'}
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, option)}
                onClick={() => handleOptionClick(option)}
                whileHover={status === 'active' ? { y: -3, scale: 1.02 } : {}}
                whileTap={status === 'active' ? { scale: 0.97 } : {}}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${cardStyle} ${
                  status !== 'active' ? 'cursor-not-allowed opacity-90' : ''
                }`}
              >
                {/* Option badge 1/2/3/4 */}
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                    {option.text}
                  </span>
                </div>

                {/* Speaker button on each card */}
                {showSpeaker && (
                  <SpeakerButton
                    textToSpeak={option.audioText}
                    contextPhrase={option.pronounceContext}
                    size="sm"
                    className="relative z-10"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
