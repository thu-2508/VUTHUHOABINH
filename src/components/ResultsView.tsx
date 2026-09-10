import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Volume2,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Calendar,
  School,
  Bookmark,
  User,
  Activity,
} from 'lucide-react';
import { GameStats, Question, StudentInfo, VerbItem } from '../types';
import { generateParentFeedback } from '../utils/gameEngine';

interface ResultsViewProps {
  student: StudentInfo;
  stats: GameStats;
  questions: Question[];
  incorrectVerbs: VerbItem[];
  onPlayAgain: () => void;
  onOpenReviewAnswers: () => void;
  onOpenListenAgain: () => void;
  onOpenCertificate: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  student,
  stats,
  questions,
  incorrectVerbs,
  onPlayAgain,
  onOpenReviewAnswers,
  onOpenListenAgain,
  onOpenCertificate,
}) => {
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);

  const parentFeedbackText = generateParentFeedback(student, stats, incorrectVerbs);

  const handleCopyFeedback = async () => {
    try {
      await navigator.clipboard.writeText(parentFeedbackText);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = parentFeedbackText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    }
  };

  const handlePrintResult = () => {
    window.print();
  };

  const handleDownloadResult = () => {
    const reportText = `=========================================
SMART ENGLISH TUTOR - VŨ THỊ MAI THU
PAST FORM MATCHING CHALLENGE - RESULT
=========================================
Student: ${student.fullName}
Class: ${student.studentClass}
School: ${student.school}
Activity: Past Form Matching Challenge
Completion Date: ${stats.completionDate}

SCORE SUMMARY:
- Initial Round Score: ${stats.initialRoundScore} pts
- Review Round Score: ${stats.reviewRoundScore} pts
- Final Score: ${stats.finalScore} / ${stats.maximumScore} pts
- Percentage: ${stats.percentage}%
- Performance Level: ${stats.performanceLevel}
- Correct Matches: ${stats.correctMatches}
- Incorrect Matches: ${stats.incorrectMatches}

BREAKDOWN BY LEVEL:
- Recognize (Nhận biết): ${stats.recognizeScore.correct} / ${stats.recognizeScore.total}
- Understand (Thông hiểu): ${stats.understandScore.correct} / ${stats.understandScore.total}
- Apply (Vận dụng): ${stats.applyScore.correct} / ${stats.applyScore.total}

NHẬN XÉT GỬI PHỤ HUYNH:
${parentFeedbackText}

Teacher: VŨ THỊ MAI THU
English for Grades 6, 7, 8 and 9
=========================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Result_${student.fullName.replace(/\s+/g, '_')}_PastVerbs.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isEligibleForCertificate = stats.percentage >= 70;

  // Tier styling
  const tierBadges = {
    Outstanding: 'bg-emerald-950/80 text-emerald-300 border-emerald-400 shadow-[0_0_20px_#34d399]',
    Excellent: 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_20px_#22d3ee]',
    Good: 'bg-purple-950/80 text-purple-300 border-purple-400 shadow-[0_0_20px_#a855f7]',
    'Keep Practising': 'bg-amber-950/80 text-amber-300 border-amber-400 shadow-[0_0_20px_#f59e0b]',
    'More Practice Needed': 'bg-rose-950/80 text-rose-300 border-rose-400 shadow-[0_0_20px_#f43f5e]',
  };

  return (
    <div id="results-view" className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 select-none print:p-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-900/80 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(168,85,247,0.25)] space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>PAST FORM MATCHING CHALLENGE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 uppercase tracking-tight">
            GAME COMPLETED
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Teacher: VŨ THỊ MAI THU • English for Grades 6, 7, 8 and 9
          </p>
        </div>

        {/* Student Information Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] block uppercase">Student</span>
              <span className="font-bold text-white text-sm sm:text-base">{student.fullName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] block uppercase">Class</span>
              <span className="font-bold text-slate-100 text-sm sm:text-base">{student.studentClass}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <School className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] block uppercase">School</span>
              <span className="font-bold text-slate-100 text-sm sm:text-base truncate">{student.school}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] block uppercase">Completion Date</span>
              <span className="font-bold text-slate-100 text-xs sm:text-sm font-mono">{stats.completionDate}</span>
            </div>
          </div>
        </div>

        {/* Big Score & Performance Tier Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Final Score */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/70 to-slate-900 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              Final Score / Maximum
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-purple-200 mt-2">
              {stats.finalScore}
              <span className="text-2xl text-purple-400 font-sans"> / {stats.maximumScore}</span>
            </div>
            <div className="text-xs text-purple-400 mt-1 font-semibold">
              Initial: {stats.initialRoundScore} pts • Review: +{stats.reviewRoundScore} pts
            </div>
          </div>

          {/* Percentage */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/70 to-slate-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
              Percentage (Tỉ lệ)
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-cyan-200 mt-2">
              {stats.percentage}%
            </div>
            <div className="text-xs text-cyan-400 mt-1 font-semibold">
              Matches: {stats.correctMatches} correct • {stats.incorrectMatches} incorrect
            </div>
          </div>

          {/* Performance Level */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Performance Level
            </span>
            <div
              className={`mt-2 px-4 py-1.5 rounded-xl border text-xl sm:text-2xl font-black uppercase tracking-wide ${
                tierBadges[stats.performanceLevel]
              }`}
            >
              {stats.performanceLevel}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {isEligibleForCertificate ? 'Eligible for Certificate (≥ 70%)' : 'Needs ≥ 70% for Certificate'}
            </div>
          </div>
        </div>

        {/* Breakdown by Level: Recognize, Understand, Apply */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Performance Breakdown by Level (Kết quả theo mức độ):</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Recognize */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30">
              <div className="flex justify-between items-center text-xs font-bold text-blue-300 uppercase">
                <span>Recognize (Nhận biết)</span>
                <span className="font-mono text-white text-sm">
                  {stats.recognizeScore.correct}/{stats.recognizeScore.total}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{
                    width: `${
                      stats.recognizeScore.total > 0
                        ? (stats.recognizeScore.correct / stats.recognizeScore.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Understand */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
              <div className="flex justify-between items-center text-xs font-bold text-purple-300 uppercase">
                <span>Understand (Thông hiểu)</span>
                <span className="font-mono text-white text-sm">
                  {stats.understandScore.correct}/{stats.understandScore.total}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full"
                  style={{
                    width: `${
                      stats.understandScore.total > 0
                        ? (stats.understandScore.correct / stats.understandScore.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Apply */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-300 uppercase">
                <span>Apply (Vận dụng)</span>
                <span className="font-mono text-white text-sm">
                  {stats.applyScore.correct}/{stats.applyScore.total}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{
                    width: `${
                      stats.applyScore.total > 0
                        ? (stats.applyScore.correct / stats.applyScore.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section XVI: Vietnamese Parent Feedback Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/40 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-pink-400" />
              <span>Nhận xét gửi Phụ huynh (Parent Feedback):</span>
            </span>

            <button
              id="btn-copy-parent-feedback"
              type="button"
              onClick={handleCopyFeedback}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Parent Feedback</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            &ldquo;{parentFeedbackText}&rdquo;
          </div>
        </div>

        {/* All Required Working Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
          {/* Review Answers */}
          <button
            id="btn-review-answers"
            type="button"
            onClick={onOpenReviewAnswers}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Review Answers</span>
          </button>

          {/* Listen Again */}
          <button
            id="btn-listen-again"
            type="button"
            onClick={onOpenListenAgain}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span>Listen Again</span>
          </button>

          {/* Download Certificate (Only if >= 70%) */}
          <button
            id="btn-download-certificate-view"
            type="button"
            onClick={onOpenCertificate}
            disabled={!isEligibleForCertificate}
            className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${
              isEligibleForCertificate
                ? 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 cursor-pointer hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
            title={
              isEligibleForCertificate
                ? 'View and download your official certificate'
                : 'Certificate requires score ≥ 70%'
            }
          >
            <Award className="w-5 h-5" />
            <span>Certificate</span>
          </button>

          {/* Download Result */}
          <button
            id="btn-download-result"
            type="button"
            onClick={handleDownloadResult}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Download className="w-5 h-5 text-purple-400" />
            <span>Download Result</span>
          </button>

          {/* Print Result */}
          <button
            id="btn-print-result"
            type="button"
            onClick={handlePrintResult}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Printer className="w-5 h-5 text-purple-400" />
            <span>Print Result</span>
          </button>

          {/* Copy Parent Feedback */}
          <button
            id="btn-copy-parent-feedback-bottom"
            type="button"
            onClick={handleCopyFeedback}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-pink-300 border border-pink-500/30 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Copy className="w-5 h-5 text-pink-400" />
            <span>{copiedFeedback ? 'Copied!' : 'Parent Feedback'}</span>
          </button>

          {/* Play Again */}
          <button
            id="btn-play-again"
            type="button"
            onClick={onPlayAgain}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 text-xs font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-[1.04]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
