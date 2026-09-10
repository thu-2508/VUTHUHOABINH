import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Settings,
  Save,
  Eye,
  Volume2,
  BookOpen,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { TeacherConfig } from '../types';
import { VERB_BANK } from '../data/verbBank';

interface TeacherSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TeacherConfig;
  onSaveAndRestart: (newConfig: TeacherConfig) => void;
}

export const TeacherSetupModal: React.FC<TeacherSetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveAndRestart,
}) => {
  const [localConfig, setLocalConfig] = useState<TeacherConfig>(config);
  const [showPreviewTable, setShowPreviewTable] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAndRestart(localConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase">
                TEACHER SETUP (CHẾ ĐỘ GIÁO VIÊN)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Teacher: VŨ THỊ MAI THU • Customize parameters without modifying source code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Options */}
        <div className="my-4 overflow-y-auto space-y-5 pr-2 custom-scrollbar text-sm">
          {/* 1. Number of Questions */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Number of Questions (Số lượng câu hỏi):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 20, 30, 40, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() =>
                    setLocalConfig({ ...localConfig, questionCount: num as TeacherConfig['questionCount'] })
                  }
                  className={`py-2.5 rounded-xl font-bold font-mono text-sm border transition-all cursor-pointer ${
                    localConfig.questionCount === num
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {num} Verbs
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Target Grade (Khối lớp THCS):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['all', 6, 7, 8, 9] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, gradeFilter: grade })}
                  className={`py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
                    localConfig.gradeFilter === grade
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Verb Group Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              3. Verb Bank Scope (Phạm vi nhóm từ):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', title: 'All 79 Verbs', desc: 'Toàn bộ ngân hàng 79 cặp' },
                { id: 'same_form', title: 'Identical Forms', desc: 'cut, put, hit, hurt, let...' },
                { id: 'variant', title: 'Two Valid Forms', desc: 'learn, dream, smell' },
                { id: 'to_be', title: 'Verb "To Be"', desc: 'was / were agreement' },
                { id: 'common', title: 'Core Top 35', desc: 'Từ thông dụng nhất' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() =>
                    setLocalConfig({ ...localConfig, verbGroup: grp.id as TeacherConfig['verbGroup'] })
                  }
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    localConfig.verbGroup === grp.id
                      ? 'bg-purple-950/80 text-purple-200 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-100">{grp.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{grp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Level Focus */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              4. Difficulty / Level Focus (Trọng tâm mức độ):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Balanced (3 Levels)' },
                { id: 'recognize', label: 'Recognize Only' },
                { id: 'understand', label: 'Understand Only' },
                { id: 'apply', label: 'Apply (Sentences)' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() =>
                    setLocalConfig({ ...localConfig, levelFocus: lvl.id as TeacherConfig['levelFocus'] })
                  }
                  className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all cursor-pointer text-center ${
                    localConfig.levelFocus === lvl.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Toggles: Vietnamese Meaning & Speaker Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-200 block">
                  Vietnamese Meaning (Nghĩa tiếng Việt)
                </span>
                <span className="text-xs text-slate-400">Hiển thị nghĩa dưới thẻ từ</span>
              </div>
              <input
                type="checkbox"
                checked={localConfig.showVietnameseMeaning}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, showVietnameseMeaning: e.target.checked })
                }
                className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-200 block">
                  Speaker Icon (Biểu tượng phát âm loa)
                </span>
                <span className="text-xs text-slate-400">Cho phép học sinh nhấn nghe</span>
              </div>
              <input
                type="checkbox"
                checked={localConfig.showSpeakerIcons}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, showSpeakerIcons: e.target.checked })
                }
                className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Preview Bank Table */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPreviewTable(!showPreviewTable)}
              className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreviewTable ? 'Hide' : 'Show'} Full Verb Bank Preview ({VERB_BANK.length} verbs)</span>
            </button>

            {showPreviewTable && (
              <div className="mt-3 max-h-60 overflow-y-auto border border-slate-700 rounded-2xl custom-scrollbar">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 sticky top-0 uppercase font-mono">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Base (V-inf)</th>
                      <th className="p-2.5">Past (V2)</th>
                      <th className="p-2.5">Meaning</th>
                      <th className="p-2.5">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-sans">
                    {VERB_BANK.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono text-slate-500">{v.id}</td>
                        <td className="p-2.5 font-bold text-white">{v.base}</td>
                        <td className="p-2.5 font-bold text-cyan-300">{v.pastDisplay}</td>
                        <td className="p-2.5 text-pink-300">{v.meaningVi}</td>
                        <td className="p-2.5 text-slate-400">Gr.{v.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-apply-teacher-setup"
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Start New Session</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
