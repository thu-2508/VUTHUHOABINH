import { VERB_BANK } from '../data/verbBank';
import {
  GameStats,
  LevelType,
  PerformanceTier,
  Question,
  QuestionOption,
  StudentInfo,
  TeacherConfig,
  VerbItem,
} from '../types';

// Shuffle helper
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate smart distractors for a verb
function getDistractorsForVerb(verb: VerbItem, allVerbs: VerbItem[], level: LevelType): string[] {
  // If in Apply level and verb has applySentences with prepared distractors:
  if (level === 'Apply' && verb.applySentences.length > 0) {
    const s = verb.applySentences[0];
    return s.distractors;
  }

  // Find other past forms from the bank that are not the same and not valid variants
  const forbiddenForms = new Set<string>([
    verb.past,
    verb.pastDisplay,
    ...verb.pastOptionsAccepted,
    'learnt',
    'learned',
    'dreamt',
    'dreamed',
    'smelt',
    'smelled',
  ]);

  // If this verb is one of the variants, exclude both variant parts from distractors
  if (verb.base === 'learn') {
    forbiddenForms.add('learnt');
    forbiddenForms.add('learned');
  }
  if (verb.base === 'dream') {
    forbiddenForms.add('dreamt');
    forbiddenForms.add('dreamed');
  }
  if (verb.base === 'smell') {
    forbiddenForms.add('smelt');
    forbiddenForms.add('smelled');
  }

  // Prefer similar category or similar vowel/suffix verbs
  const similarCategory = allVerbs.filter(
    (v) => v.id !== verb.id && v.hintCategory === verb.hintCategory && !forbiddenForms.has(v.pastDisplay)
  );

  const otherVerbs = allVerbs.filter(
    (v) => v.id !== verb.id && !forbiddenForms.has(v.pastDisplay)
  );

  const pool = [...shuffleArray(similarCategory), ...shuffleArray(otherVerbs)];
  const distractors: string[] = [];
  const used = new Set<string>([verb.pastDisplay]);

  for (const v of pool) {
    if (distractors.length >= 3) break;
    const text = v.pastDisplay;
    if (!used.has(text) && !forbiddenForms.has(text)) {
      used.add(text);
      distractors.push(text);
    }
  }

  // If still fewer than 3, add regular-sounding or classic distractor forms
  const fallbacks = [
    verb.base + 'ed',
    verb.base.endsWith('e') ? verb.base + 'd' : verb.base + 'ed',
    verb.base + 't',
  ];
  for (const fb of fallbacks) {
    if (distractors.length >= 3) break;
    if (!used.has(fb)) {
      used.add(fb);
      distractors.push(fb);
    }
  }

  return distractors.slice(0, 3);
}

export function generateQuestions(config: TeacherConfig): Question[] {
  let pool = [...VERB_BANK];

  // Apply grade filter
  if (typeof config.gradeFilter === 'number') {
    const targetGrade = config.gradeFilter;
    const filtered = pool.filter((v) => v.grade <= targetGrade);
    if (filtered.length >= 10) {
      pool = filtered;
    }
  }

  // Apply group filter
  if (config.verbGroup === 'same_form') {
    pool = pool.filter((v) => v.hintCategory === 'same');
  } else if (config.verbGroup === 'variant') {
    pool = pool.filter((v) => v.hintCategory === 'variant');
  } else if (config.verbGroup === 'to_be') {
    pool = pool.filter((v) => v.hintCategory === 'be');
  } else if (config.verbGroup === 'common') {
    pool = pool.slice(0, 35);
  }

  // Shuffle pool
  const shuffledVerbs = shuffleArray(pool);
  const totalCount = Math.min(config.questionCount, shuffledVerbs.length);
  const selectedVerbs = shuffledVerbs.slice(0, totalCount);

  // Compute level distributions
  // If 50 questions: 20 Recognize, 18 Understand, 12 Apply
  let recCount: number;
  let undCount: number;
  let appCount: number;

  if (config.levelFocus === 'recognize') {
    recCount = totalCount;
    undCount = 0;
    appCount = 0;
  } else if (config.levelFocus === 'understand') {
    recCount = 0;
    undCount = totalCount;
    appCount = 0;
  } else if (config.levelFocus === 'apply') {
    recCount = 0;
    undCount = 0;
    appCount = totalCount;
  } else if (totalCount === 50) {
    recCount = 20;
    undCount = 18;
    appCount = 12;
  } else {
    // Proportional
    recCount = Math.round(totalCount * 0.4);
    undCount = Math.round(totalCount * 0.36);
    appCount = totalCount - recCount - undCount;
  }

  const levels: LevelType[] = [
    ...Array(recCount).fill('Recognize'),
    ...Array(undCount).fill('Understand'),
    ...Array(appCount).fill('Apply'),
  ];

  const shuffledLevels = shuffleArray(levels);

  const questions: Question[] = selectedVerbs.map((verb, index) => {
    const level = shuffledLevels[index] || 'Recognize';

    let promptText = verb.base;
    let correctPast = verb.pastDisplay;
    let applySentence: string | undefined;

    if (level === 'Understand') {
      promptText = `${verb.base} (${verb.meaningVi})`;
    } else if (level === 'Apply') {
      // Pick an apply sentence
      const s = verb.applySentences[Math.floor(Math.random() * verb.applySentences.length)];
      applySentence = s.sentenceWithBlank;
      promptText = verb.base;
      correctPast = s.correctAnswer;
    }

    // Get 3 distractors
    const rawDistractors = getDistractorsForVerb(verb, VERB_BANK, level);

    // Build options
    const options: QuestionOption[] = [
      {
        id: `opt-${verb.id}-correct`,
        text: correctPast,
        isCorrect: true,
        verbId: verb.id,
        audioText: verb.past,
        pronounceContext: verb.pronounceContext,
      },
      ...rawDistractors.map((dist, dIdx) => ({
        id: `opt-${verb.id}-dist-${dIdx}`,
        text: dist,
        isCorrect: false,
        verbId: verb.id,
        audioText: dist.includes('/') ? dist.split('/')[0].trim() : dist,
      })),
    ];

    return {
      id: `q-${index + 1}-${verb.id}`,
      verb,
      level,
      promptText,
      meaningShown: config.showVietnameseMeaning || level === 'Understand' ? verb.meaningVi : undefined,
      applySentence,
      correctPastDisplay: correctPast,
      options: shuffleArray(options),
      timeSpentSeconds: 0,
    };
  });

  return questions;
}

export function getVietnameseHint(verb: VerbItem): string {
  switch (verb.hintCategory) {
    case 'same':
      return 'Động từ này có dạng hiện tại và quá khứ giống nhau.';
    case 'variant':
      return 'Động từ này có thể có hai dạng quá khứ đều đúng.';
    case 'be':
      return 'Đây là động từ ‘to be’; hãy chú ý chủ ngữ số ít hoặc số nhiều.';
    case 'ought':
      return 'Hãy nghe cách phát âm và quan sát các chữ cái thay đổi (nhóm -ought / -aught).';
    case 'vowel':
      return 'Hãy nhớ lại dạng biến đổi nguyên âm bất quy tắc của động từ này.';
    case 'general':
    default:
      return 'Hãy nhớ lại dạng quá khứ bất quy tắc của động từ này.';
  }
}

export function calculatePerformanceLevel(percentage: number): PerformanceTier {
  if (percentage >= 90) return 'Outstanding';
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Keep Practising';
  return 'More Practice Needed';
}

export function generateParentFeedback(
  student: StudentInfo,
  stats: GameStats,
  incorrectVerbs: VerbItem[]
): string {
  let levelVi = 'rất tốt và thành thạo';
  if (stats.percentage >= 90) {
    levelVi = 'rất xuất sắc và vững vàng';
  } else if (stats.percentage >= 80) {
    levelVi = 'tốt và chính xác';
  } else if (stats.percentage >= 70) {
    levelVi = 'khá tốt';
  } else if (stats.percentage >= 50) {
    levelVi = 'ở mức cơ bản';
  } else {
    levelVi = 'ở mức cần rèn luyện thêm';
  }

  let weakGroupText = 'các động từ đã làm';
  if (incorrectVerbs.length === 0) {
    weakGroupText = 'và phát huy tốt tất cả các động từ đã học';
  } else {
    const names = incorrectVerbs.slice(0, 5).map((v) => `${v.base} (-> ${v.pastDisplay})`).join(', ');
    weakGroupText = `các động từ còn nhầm lẫn: ${names}${incorrectVerbs.length > 5 ? '...' : ''}`;
  }

  return `Em ${student.fullName} đạt ${stats.finalScore}/${stats.maximumScore} điểm, tương ứng ${stats.percentage}%. Em đã ghi nhớ ${levelVi} các dạng quá khứ của động từ. Em cần luyện thêm ${weakGroupText}. Mong phụ huynh tiếp tục động viên em ôn tập và luyện đọc các động từ thường xuyên.`;
}
