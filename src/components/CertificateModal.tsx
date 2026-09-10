import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Download, Printer, X, Sparkles, Star } from 'lucide-react';
import { GameStats, StudentInfo } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentInfo;
  stats: GameStats;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  stats,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Print function using window.print with targeted print css
  const handlePrint = () => {
    window.print();
  };

  // Download certificate as HTML/SVG standalone printable file
  const handleDownload = () => {
    if (!certRef.current) return;
    const certHtml = certRef.current.outerHTML;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate - ${student.fullName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    @page { size: landscape; margin: 0; }
    body { margin: 0; background: #030712; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .cert-container { width: 1000px; height: 700px; box-sizing: border-box; }
  </style>
</head>
<body>
  <div class="cert-container">${certHtml}</div>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate_${student.fullName.replace(/\s+/g, '_')}_PastVerbs.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-lg overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-5xl flex flex-col items-center">
        {/* Controls bar (Hidden during print) */}
        <div className="w-full flex items-center justify-between pb-3 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm sm:text-base text-amber-300">
              Official Certificate of Achievement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-certificate"
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print</span>
            </button>
            <button
              id="btn-download-certificate"
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Certificate Frame - Strict Landscape 16:10 ratio */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={certRef}
          id="certificate-of-achievement"
          className="w-full aspect-[16/10] max-h-[85vh] bg-gradient-to-br from-slate-950 via-[#0a0f24] to-slate-950 border-[6px] border-double border-amber-400/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.35)] flex flex-col justify-between text-slate-100 print:border-8 print:border-amber-600 print:text-black print:bg-white print:shadow-none"
        >
          {/* Inner 3D Neon Gold & Blue Border */}
          <div className="absolute inset-3 border-2 border-cyan-400/40 rounded-2xl pointer-events-none shadow-[inset_0_0_30px_rgba(6,182,212,0.15)]" />
          <div className="absolute inset-5 border border-purple-500/30 rounded-xl pointer-events-none" />

          {/* Corner Decorative Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Certificate Header */}
          <div className="relative z-10 text-center pt-2">
            <div className="inline-flex items-center gap-1 text-amber-400 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>

            <h1 className="font-['Cinzel'] text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 uppercase">
              CERTIFICATE OF ACHIEVEMENT
            </h1>
            <p className="font-['Playfair_Display'] italic text-xs sm:text-base text-slate-300 mt-1">
              This certificate is proudly presented to
            </p>
          </div>

          {/* Student Name & Class & School */}
          <div className="relative z-10 text-center my-auto py-2">
            <div className="font-['Cinzel'] text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-300 tracking-wide uppercase filter drop-shadow-[0_2px_10px_rgba(34,211,238,0.4)]">
              {student.fullName || 'STUDENT NAME'}
            </div>
            <div className="w-64 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />

            <div className="flex items-center justify-center gap-4 sm:gap-8 mt-2 text-xs sm:text-base font-semibold text-slate-300">
              <div>
                <span className="text-slate-400 uppercase">Class: </span>
                <span className="text-pink-400 font-bold">{student.studentClass}</span>
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <span className="text-slate-400 uppercase">School: </span>
                <span className="text-cyan-400 font-bold">{student.school}</span>
              </div>
            </div>

            <div className="font-['Playfair_Display'] italic text-xs sm:text-sm text-slate-400 mt-2">
              for successfully completing the
            </div>
            <div className="text-base sm:text-2xl font-black text-amber-300 tracking-wider uppercase mt-0.5">
              PAST FORM MATCHING CHALLENGE
            </div>
          </div>

          {/* Score & Performance Banner */}
          <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 my-2 text-center text-xs sm:text-sm">
            <div className="px-3 sm:px-5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/40">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase block">Score</span>
              <span className="font-black text-amber-300 text-sm sm:text-lg font-mono">
                {stats.finalScore} / {stats.maximumScore}
              </span>
            </div>
            <div className="px-3 sm:px-5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400/40">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase block">Percentage</span>
              <span className="font-black text-cyan-300 text-sm sm:text-lg font-mono">
                {stats.percentage}%
              </span>
            </div>
            <div className="px-3 sm:px-5 py-1.5 rounded-xl bg-slate-900/90 border border-purple-400/40">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase block">Performance</span>
              <span className="font-black text-purple-300 text-sm sm:text-lg">
                {stats.performanceLevel}
              </span>
            </div>
          </div>

          {/* Certificate Footer / Signatures as strictly required in Section XV */}
          <div className="relative z-10 pt-2 border-t border-slate-800 flex items-end justify-between text-xs sm:text-sm">
            {/* Left: Teacher */}
            <div className="text-left">
              <div className="font-['Playfair_Display'] italic text-slate-400 text-[11px] sm:text-xs">
                Instructor & Examiner
              </div>
              <div className="font-black text-amber-300 text-sm sm:text-base mt-0.5 uppercase tracking-wide">
                Teacher: VŨ THỊ MAI THU
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                Date: <span className="text-slate-300">{stats.completionDate}</span>
              </div>
            </div>

            {/* Center: Gold 3D Badge */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-amber-300">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Right: Program subtitle */}
            <div className="text-right">
              <div className="font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider">
                SMART ENGLISH TUTOR
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                English for Grades 6, 7, 8 and 9
              </div>
              <div className="text-[9px] sm:text-[10px] text-pink-400 font-semibold mt-0.5">
                Secondary School English Program
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
