export type LevelType = 'Recognize' | 'Understand' | 'Apply';

export type PerformanceTier =
  | 'Outstanding'
  | 'Excellent'
  | 'Good'
  | 'Keep Practising'
  | 'More Practice Needed';

export interface VerbItem {
  id: number;
  base: string;
  past: string; // primary display form e.g. "was/were", "read /red/", "learnt/learned"
  pastOptionsAccepted: string[]; // list of valid strings to match
  meaningVi: string;
  pronounceContext?: string; // e.g. "Yesterday, I read a book."
  pastDisplay: string; // formatted text on past card, e.g. "read /red/", "was / were", "learnt / learned"
  hintCategory: 'same' | 'variant' | 'be' | 'vowel' | 'ought' | 'general';
  grade: 6 | 7 | 8 | 9;
  applySentences: {
    sentenceWithBlank: string; // e.g. "Yesterday, she _____ a letter to her friend. (write)"
    correctAnswer: string;     // e.g. "wrote"
    distractors: string[];      // e.g. ["written", "writed", "wroted"]
  }[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  verbId: number;
  audioText: string;
  pronounceContext?: string;
}

export interface Question {
  id: string;
  verb: VerbItem;
  level: LevelType;
  promptText: string;
  meaningShown?: string;
  applySentence?: string;
  correctPastDisplay: string;
  options: QuestionOption[];
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
  isReviewQuestion?: boolean;
  reviewAttempted?: boolean;
  reviewCorrect?: boolean;
}

export interface StudentInfo {
  fullName: string;
  studentClass: string;
  school: string;
}

export interface TeacherConfig {
  questionCount: 10 | 20 | 30 | 40 | 50;
  gradeFilter: 'all' | 6 | 7 | 8 | 9;
  verbGroup: 'all' | 'common' | 'same_form' | 'variant' | 'to_be';
  showVietnameseMeaning: boolean;
  showSpeakerIcons: boolean;
  levelFocus: 'all' | 'recognize' | 'understand' | 'apply';
}

export interface GameStats {
  correctMatches: number;
  incorrectMatches: number;
  initialRoundScore: number;
  reviewRoundScore: number;
  finalScore: number;
  maximumScore: number;
  percentage: number;
  performanceLevel: PerformanceTier;
  completionDate: string;
  recognizeScore: { correct: number; total: number };
  understandScore: { correct: number; total: number };
  applyScore: { correct: number; total: number };
}
