import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onCloseAndStart: () => void;
  canStartGame?: boolean;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onCloseAndStart,
  canStartGame = true,
}) => {
  if (!isOpen) return null;

  const rules = [
    'Mỗi câu sẽ xuất hiện một động từ ở dạng nguyên thể và bốn dạng quá khứ.',
    'Em hãy kéo dạng quá khứ đúng vào bên cạnh động từ nguyên thể hoặc nhấn chọn hai thẻ tương ứng.',
    'Em có thể nhấn biểu tượng loa để nghe cách phát âm của từng từ.',
    'Mỗi câu có 30 giây để hoàn thành.',
    'Mỗi cặp ghép đúng được 10 điểm.',
    'Trả lời sai không bị trừ điểm và câu đó sẽ được lưu vào Review Round.',
    'Trong Review Round, em được làm lại các câu sai và nhận gợi ý bằng tiếng Việt.',
    'Mỗi lượt chơi có tối đa 50 câu hỏi, được chọn từ ngân hàng động từ của bài.',
    'Đạt từ 70% tổng điểm trở lên, em sẽ nhận được giấy chứng nhận.',
    'Hãy quan sát, lắng nghe và lựa chọn thật chính xác. Chúc em học tốt!',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.35)] text-slate-100"
      >
        {/* Glow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
            HƯỚNG DẪN TRÒ CHƠI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gia sư thông thái Tiếng Anh – Past Form Matching Challenge
          </p>
        </div>

        {/* Rules list */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar text-sm sm:text-base">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/40 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-950/80 border border-purple-400/60 text-purple-300 font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                {idx + 1}
              </div>
              <p className="text-slate-200 leading-relaxed font-normal">{rule}</p>
            </div>
          ))}
        </div>

        {/* Action Button: “TÔI ĐÃ HIỂU – BẮT ĐẦU” */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-understand-start"
            type="button"
            onClick={onCloseAndStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-slate-950 tracking-wider uppercase text-base bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 hover:from-cyan-300 hover:to-pink-300 shadow-[0_0_25px_rgba(34,211,238,0.6)] transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>TÔI ĐÃ HIỂU – BẮT ĐẦU</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
