import React from 'react';
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, Settings, Music } from 'lucide-react';
import { LevelType } from '../types';

interface GameHeaderProps {
  timeLeft: number;
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  level: LevelType;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bgmPlaying: boolean;
  onToggleBGM: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenInstructions: () => void;
  onOpenTeacherSetup: () => void;
  isReviewRound?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  timeLeft,
  score,
  currentQuestionIndex,
  totalQuestions,
  level,
  soundEnabled,
  onToggleSound,
  bgmPlaying,
  onToggleBGM,
  isFullscreen,
  onToggleFullscreen,
  onOpenInstructions,
  onOpenTeacherSetup,
  isReviewRound = false,
}) => {
  // Timer color & warning logic
  let timerTextColor = 'text-cyan-300';
  let timerBgColor = 'bg-cyan-950/60 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
  let hurryText = '';

  if (timeLeft <= 5) {
    timerTextColor = 'text-rose-400 animate-bounce';
    timerBgColor = 'bg-rose-950/80 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse';
    hurryText = 'Hurry up!';
  } else if (timeLeft <= 10) {
    timerTextColor = 'text-amber-400';
    timerBgColor = 'bg-amber-950/80 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    hurryText = 'Hurry up!';
  }

  // Level badge colors
  const levelBadgeStyles = {
    Recognize: 'bg-blue-900/60 text-blue-300 border-blue-400/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    Understand: 'bg-purple-900/60 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    Apply: 'bg-emerald-900/60 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  };

  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100));

  return (
    <header id="game-header" className="w-full bg-slate-900/90 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-30 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
      {/* Top Banner with branding and utilities */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b border-slate-800/60 text-xs sm:text-sm">
        <div className="flex items-center gap-2 truncate">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="font-extrabold text-cyan-400 tracking-wider">SMART ENGLISH TUTOR</span>
          <span className="text-slate-600">|</span>
          <span className="text-pink-400 font-semibold truncate hidden md:inline">Teacher: VŨ THỊ MAI THU</span>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-instructions"
            onClick={onOpenInstructions}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 border border-slate-700 transition-colors text-xs font-semibold cursor-pointer"
            title="Vietnamese Instructions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Vietnamese Instructions</span>
            <span className="sm:hidden">Help</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Sound Off' : 'Sound On'}
            aria-label="Sound On/Off"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="btn-toggle-bgm"
            onClick={onToggleBGM}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              bgmPlaying
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={bgmPlaying ? 'Mute Background Music' : 'Play Background Music'}
            aria-label="Music Toggle"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-fullscreen"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            aria-label="Full Screen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            id="btn-teacher-setup"
            onClick={onOpenTeacherSetup}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-colors cursor-pointer"
            title="Teacher Setup"
            aria-label="Teacher Setup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main HUD Metrics: TIME | SCORE | QUESTION | PROGRESS | LEVEL */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center">
        {/* TIME */}
        <div id="hud-time" className="flex flex-col items-center sm:items-start">
          <div className="text-[10px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1">
            <span>TIME</span>
            {hurryText && (
              <span className="text-amber-400 font-extrabold animate-pulse text-[10px] sm:text-xs tracking-normal">
                {hurryText}
              </span>
            )}
          </div>
          <div className={`mt-0.5 px-3 py-1 rounded-xl border flex items-center gap-2 ${timerBgColor} transition-all duration-300`}>
            <span className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${timerTextColor}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* SCORE */}
        <div id="hud-score" className="flex flex-col items-center">
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">SCORE</span>
          <div className="mt-0.5 px-3.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-300 tracking-tight">
              {score}
            </span>
            <span className="text-[10px] text-purple-400 font-bold uppercase">pts</span>
          </div>
        </div>

        {/* QUESTION */}
        <div id="hud-question" className="flex flex-col items-center sm:items-center">
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">
            {isReviewRound ? 'REVIEW' : 'QUESTION'}
          </span>
          <div className="mt-0.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-100">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-sm font-semibold text-slate-500">/{totalQuestions}</span>
          </div>
        </div>

        {/* PROGRESS */}
        <div id="hud-progress" className="col-span-2 sm:col-span-1 flex flex-col justify-center">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>PROGRESS</span>
            <span className="text-cyan-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="mt-1 w-full h-2.5 rounded-full bg-slate-800 border border-slate-700/60 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* LEVEL */}
        <div id="hud-level" className="col-span-1 sm:col-span-1 flex flex-col items-end justify-center">
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">LEVEL</span>
          <div className={`mt-0.5 px-3 py-1 rounded-xl border text-xs sm:text-sm font-bold tracking-wide uppercase ${levelBadgeStyles[level]}`}>
            {level}
          </div>
        </div>
      </div>
    </header>
  );
};
