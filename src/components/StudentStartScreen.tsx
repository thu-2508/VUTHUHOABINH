import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Settings,
  GraduationCap,
  AlertCircle,
  User,
  School,
  Bookmark,
} from 'lucide-react';
import { StudentInfo } from '../types';

interface StudentStartScreenProps {
  studentInfo: StudentInfo;
  onUpdateStudentInfo: (info: StudentInfo) => void;
  onStartGame: () => void;
  onOpenInstructions: () => void;
  onOpenTeacherSetup: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  totalQuestions: number;
}

export const StudentStartScreen: React.FC<StudentStartScreenProps> = ({
  studentInfo,
  onUpdateStudentInfo,
  onStartGame,
  onOpenInstructions,
  onOpenTeacherSetup,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  totalQuestions,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleStartClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !studentInfo.fullName.trim() ||
      !studentInfo.studentClass.trim() ||
      !studentInfo.school.trim()
    ) {
      setErrorMessage('Please complete all required information before starting.');
      return;
    }
    setErrorMessage('');
    onStartGame();
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* 3D Neon Background Visuals */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-60 h-60 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(147,51,234,0.25)] flex flex-col items-center"
      >
        {/* Top Floating Controls */}
        <div className="w-full flex items-center justify-between gap-2 mb-4">
          <button
            id="btn-teacher-setup-start"
            type="button"
            onClick={onOpenTeacherSetup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Teacher Setup ({totalQuestions} Verbs)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-sound-toggle-start"
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'Sound Off' : 'Sound On'}
              aria-label="Sound On/Off"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              id="btn-fullscreen-toggle-start"
              type="button"
              onClick={onToggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              aria-label="Full Screen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Brand Header with exact naming */}
        <div className="text-center w-full mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SMART ENGLISH TUTOR</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 tracking-tight leading-tight uppercase font-sans">
            GIA SƯ THÔNG THÁI TIẾNG ANH CÁC KHỐI LỚP 6, 7, 8, 9
          </h1>
          <div className="text-sm sm:text-base font-bold text-pink-400 mt-1 uppercase tracking-wider">
            – VŨ THỊ MAI THU –
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
            English for Grades 6, 7, 8 and 9 • Teacher: VŨ THỊ MAI THU
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-pink-950/40 border border-purple-500/30">
            <div className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
              PAST FORM MATCHING CHALLENGE
            </div>
            <div className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium">
              Match each present verb with its correct past form.
            </div>
          </div>
        </div>

        {/* Student Information Form */}
        <form onSubmit={handleStartClick} className="w-full space-y-4">
          <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>STUDENT INFORMATION (THÔNG TIN HỌC SINH)</span>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)] font-semibold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-fullname"
                type="text"
                value={studentInfo.fullName}
                onChange={(e) => {
                  setErrorMessage('');
                  onUpdateStudentInfo({ ...studentInfo, fullName: e.target.value });
                }}
                placeholder="e.g. Nguyễn Hoàng Nam"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Class and School in responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Class <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Bookmark className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="input-class"
                  type="text"
                  value={studentInfo.studentClass}
                  onChange={(e) => {
                    setErrorMessage('');
                    onUpdateStudentInfo({ ...studentInfo, studentClass: e.target.value });
                  }}
                  placeholder="e.g. 7A1, 8B"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                School <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="input-school"
                  type="text"
                  value={studentInfo.school}
                  onChange={(e) => {
                    setErrorMessage('');
                    onUpdateStudentInfo({ ...studentInfo, school: e.target.value });
                  }}
                  placeholder="e.g. THCS Giảng Võ"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons as requested in Section II */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-vietnamese-instructions"
              type="button"
              onClick={onOpenInstructions}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Vietnamese Instructions</span>
            </button>

            <button
              id="btn-start-game"
              type="submit"
              className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 text-base font-black uppercase tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start Game</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          50 Irregular Verbs • 30 Seconds / Question • 3 Levels (Recognize, Understand, Apply)
        </div>
      </motion.div>
    </div>
  );
};
