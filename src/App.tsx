import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameStats,
  Question,
  QuestionOption,
  StudentInfo,
  TeacherConfig,
  VerbItem,
} from './types';
import { audioService } from './utils/audio';
import {
  calculatePerformanceLevel,
  generateQuestions,
  getVietnameseHint,
} from './utils/gameEngine';
import { GameHeader } from './components/GameHeader';
import { StudentStartScreen } from './components/StudentStartScreen';
import { InstructionsModal } from './components/InstructionsModal';
import { MatchingArea } from './components/MatchingArea';
import { TutorAvatar } from './components/TutorAvatar';
import { ReviewRoundIntro } from './components/ReviewRoundIntro';
import { ReviewFailureModal } from './components/ReviewFailureModal';
import { ResultsView } from './components/ResultsView';
import { CertificateModal } from './components/CertificateModal';
import { ReviewAnswersModal } from './components/ReviewAnswersModal';
import { ListenAgainModal } from './components/ListenAgainModal';
import { TeacherSetupModal } from './components/TeacherSetupModal';

const RANDOM_POSITIVE_FEEDBACK = [
  'Excellent!',
  'Great match!',
  'Well done!',
  'Perfect!',
  'Amazing work!',
];

export default function App() {
  // --- Student Information ---
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    const saved = localStorage.getItem('smart_tutor_student_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { fullName: '', studentClass: '', school: '' };
  });

  // Save student info when updated
  useEffect(() => {
    localStorage.setItem('smart_tutor_student_info', JSON.stringify(studentInfo));
  }, [studentInfo]);

  // --- Teacher Configuration ---
  const [teacherConfig, setTeacherConfig] = useState<TeacherConfig>({
    questionCount: 50,
    gradeFilter: 'all',
    verbGroup: 'all',
    showVietnameseMeaning: true,
    showSpeakerIcons: true,
    levelFocus: 'all',
  });

  // --- Game Flow States ---
  const [gameState, setGameState] = useState<
    'start' | 'instructions' | 'playing' | 'review_intro' | 'reviewing' | 'results'
  >('start');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeStatus, setActiveStatus] = useState<'active' | 'correct' | 'incorrect' | 'timeout'>(
    'active'
  );
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Scores
  const [initialScore, setInitialScore] = useState<number>(0);
  const [reviewScore, setReviewScore] = useState<number>(0);

  // Review round questions
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);

  // Modals
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [showTeacherSetup, setShowTeacherSetup] = useState<boolean>(false);
  const [showReviewFailureModal, setShowReviewFailureModal] = useState<boolean>(false);
  const [failedReviewQuestion, setFailedReviewQuestion] = useState<Question | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showReviewAnswersModal, setShowReviewAnswersModal] = useState<boolean>(false);
  const [showListenAgainModal, setShowListenAgainModal] = useState<boolean>(false);

  // Tutor Companion State
  const [tutorMood, setTutorMood] = useState<
    'happy' | 'celebrating' | 'thinking' | 'worried' | 'cheering'
  >('happy');
  const [tutorMessage, setTutorMessage] = useState<string>(
    'Chào mừng em! Hãy sẵn sàng ghép động từ thật chuẩn xác nhé!'
  );

  // Sound & Screen states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Clear timers helper
  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, []);

  // --- Sound & Fullscreen controls ---
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setSoundEnabled(next);
    if (!next) {
      setBgmPlaying(false);
    }
  };

  const handleToggleBGM = () => {
    const playing = audioService.toggleBGM();
    setBgmPlaying(playing);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // --- Start Game Logic ---
  const handleStartGameFromScreen = () => {
    // Show instructions modal first as required by Section III:
    // "Trước khi chơi, tự động hiển thị: HƯỚNG DẪN TRÒ CHƠI... Có nút: TÔI ĐÃ HIỂU – BẮT ĐẦU. Đồng hồ chỉ bắt đầu sau khi học sinh nhấn nút này."
    setShowInstructionsModal(true);
  };

  const handleConfirmInstructionsAndStart = () => {
    setShowInstructionsModal(false);
    clearCurrentTimer();
    clearTransitionTimeout();

    const generated = generateQuestions(teacherConfig);
    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setInitialScore(0);
    setReviewScore(0);
    setReviewQuestions([]);
    setCurrentReviewIndex(0);
    setActiveStatus('active');
    setSelectedOption(null);
    setFeedbackText('');
    setTimeLeft(30);

    setTutorMood('happy');
    setTutorMessage('Let’s match the present verb with its past form!');

    setGameState('playing');
  };

  // --- 30-Second Timer Engine ---
  useEffect(() => {
    // Only run timer when playing or reviewing AND status is 'active'
    if (
      (gameState !== 'playing' && gameState !== 'reviewing') ||
      activeStatus !== 'active'
    ) {
      clearCurrentTimer();
      return;
    }

    clearCurrentTimer();

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearCurrentTimer();
          handleQuestionTimeout();
          return 0;
        }

        // Section X: Audio warning at <= 5s
        if (prev - 1 <= 5) {
          audioService.playTimeWarning();
          setTutorMood('worried');
          setTutorMessage('Time is running out! Hurry up!');
        } else if (prev - 1 <= 10) {
          setTutorMood('worried');
          setTutorMessage('10 seconds left! Choose quickly!');
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearCurrentTimer();
    };
  }, [gameState, activeStatus, currentQuestionIndex, currentReviewIndex]);

  // --- Handle Timeout ---
  const handleQuestionTimeout = () => {
    audioService.playIncorrect();
    setActiveStatus('timeout');
    setTutorMood('worried');
    setFeedbackText('Time’s up! You can try this question again later.');

    const currentQ =
      gameState === 'playing'
        ? questions[currentQuestionIndex]
        : reviewQuestions[currentReviewIndex];

    if (gameState === 'playing') {
      // Mark as incorrect and push to review list
      setQuestions((prev) =>
        prev.map((q, idx) =>
          idx === currentQuestionIndex ? { ...q, isCorrect: false, timeSpentSeconds: 30 } : q
        )
      );
      setReviewQuestions((prev) => [...prev, { ...currentQ, isReviewQuestion: true }]);

      // Transition to next question after 2 seconds
      transitionTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion();
      }, 2000);
    } else {
      // In Review Round
      setReviewQuestions((prev) =>
        prev.map((q, idx) =>
          idx === currentReviewIndex
            ? { ...q, reviewAttempted: true, reviewCorrect: false }
            : q
        )
      );

      // Show Failure explanation modal
      setFailedReviewQuestion(currentQ);
      setShowReviewFailureModal(true);
    }
  };

  // --- Handle Answer Submit ---
  const handleAnswerSubmit = (option: QuestionOption) => {
    if (activeStatus !== 'active') return;

    clearCurrentTimer();
    setSelectedOption(option);

    const isCurrentPlaying = gameState === 'playing';
    const currentQ = isCurrentPlaying
      ? questions[currentQuestionIndex]
      : reviewQuestions[currentReviewIndex];

    const isMatch = option.isCorrect;

    if (isMatch) {
      // --- CORRECT MATCH ---
      setActiveStatus('correct');
      audioService.playCorrect();

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#22d3ee', '#a855f7', '#ec4899', '#facc15', '#34d399'],
      });

      const randomWord =
        RANDOM_POSITIVE_FEEDBACK[
          Math.floor(Math.random() * RANDOM_POSITIVE_FEEDBACK.length)
        ];
      setFeedbackText(`${randomWord} +10 Points! (${currentQ.verb.meaningVi})`);
      setTutorMood('celebrating');
      setTutorMessage(`Tuyệt vời! "${currentQ.verb.base}" → "${currentQ.correctPastDisplay}"!`);

      if (isCurrentPlaying) {
        setInitialScore((s) => s + 10);
        setQuestions((prev) =>
          prev.map((q, idx) =>
            idx === currentQuestionIndex
              ? {
                  ...q,
                  isCorrect: true,
                  userAnswer: option.text,
                  timeSpentSeconds: 30 - timeLeft,
                }
              : q
          )
        );
      } else {
        // In review round
        setReviewScore((s) => s + 10);
        setReviewQuestions((prev) =>
          prev.map((q, idx) =>
            idx === currentReviewIndex
              ? {
                  ...q,
                  reviewAttempted: true,
                  reviewCorrect: true,
                  userAnswer: option.text,
                }
              : q
          )
        );
      }

      // Auto advance after 1.8 seconds
      transitionTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion();
      }, 1800);
    } else {
      // --- INCORRECT MATCH ---
      setActiveStatus('incorrect');
      audioService.playIncorrect();

      setFeedbackText('Not quite. You can try this verb again in the Review Round.');
      setTutorMood('thinking');
      setTutorMessage('Đừng nản lòng, em sẽ được ôn lại câu này ở Review Round!');

      if (isCurrentPlaying) {
        setQuestions((prev) =>
          prev.map((q, idx) =>
            idx === currentQuestionIndex
              ? {
                  ...q,
                  isCorrect: false,
                  userAnswer: option.text,
                  timeSpentSeconds: 30 - timeLeft,
                }
              : q
          )
        );
        // Save for Review Round
        setReviewQuestions((prev) => [
          ...prev,
          { ...currentQ, isReviewQuestion: true },
        ]);

        // Auto transition after 2 seconds
        transitionTimeoutRef.current = window.setTimeout(() => {
          advanceToNextQuestion();
        }, 2000);
      } else {
        // Still incorrect in Review Round
        setReviewQuestions((prev) =>
          prev.map((q, idx) =>
            idx === currentReviewIndex
              ? {
                  ...q,
                  reviewAttempted: true,
                  reviewCorrect: false,
                  userAnswer: option.text,
                }
              : q
          )
        );

        // Show review failure modal with correct answer, pronunciations, and example sentence
        setFailedReviewQuestion(currentQ);
        setShowReviewFailureModal(true);
      }
    }
  };

  // --- Advance to Next Question or Next Phase ---
  const advanceToNextQuestion = () => {
    clearTransitionTimeout();
    clearCurrentTimer();

    if (gameState === 'playing') {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setActiveStatus('active');
        setSelectedOption(null);
        setFeedbackText('');
        setTimeLeft(30);
        setTutorMood('happy');
        setTutorMessage('Ready for the next verb? Listen closely!');
      } else {
        // Initial round completed!
        // Check if there are review questions
        if (reviewQuestions.length > 0) {
          setGameState('review_intro');
        } else {
          finishGameAndShowResults();
        }
      }
    } else if (gameState === 'reviewing') {
      const nextReview = currentReviewIndex + 1;
      if (nextReview < reviewQuestions.length) {
        setCurrentReviewIndex(nextReview);
        setActiveStatus('active');
        setSelectedOption(null);
        setFeedbackText('');
        setTimeLeft(30);
        setTutorMood('thinking');
        setTutorMessage('Đọc kỹ gợi ý tiếng Việt trước khi chọn nhé!');
      } else {
        finishGameAndShowResults();
      }
    }
  };

  // --- Start Review Round ---
  const handleStartReviewRound = () => {
    setCurrentReviewIndex(0);
    setActiveStatus('active');
    setSelectedOption(null);
    setFeedbackText('');
    setTimeLeft(30);
    setTutorMood('cheering');
    setTutorMessage('Hãy cùng xem lại các câu chưa đúng và ghi trọn điểm nhé!');
    setGameState('reviewing');
  };

  // --- Finish Game & Show Results ---
  const finishGameAndShowResults = () => {
    clearCurrentTimer();
    clearTransitionTimeout();
    audioService.playCompletionFanfare();

    // Trigger grand fireworks if score >= 90%
    const totalMax = questions.length * 10;
    const finalEarned = initialScore + reviewScore;
    const pct = totalMax > 0 ? Math.round((finalEarned / totalMax) * 100) : 0;

    if (pct >= 90) {
      // Fireworks sequence
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;
      const interval = window.setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 300);
    } else if (pct >= 70) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    setGameState('results');
  };

  // --- Compute Final Game Statistics ---
  const calculateGameStats = (): GameStats => {
    const maximumScore = questions.length * 10;
    const finalScore = Math.min(maximumScore, initialScore + reviewScore);
    const percentage = maximumScore > 0 ? Math.round((finalScore / maximumScore) * 100) : 0;

    let correctMatches = 0;
    let incorrectMatches = 0;

    let recCorrect = 0;
    let recTotal = 0;
    let undCorrect = 0;
    let undTotal = 0;
    let appCorrect = 0;
    let appTotal = 0;

    questions.forEach((q) => {
      // Find if this question was answered correctly initially or in review
      const rev = reviewQuestions.find((rq) => rq.id === q.id);
      const isWon = q.isCorrect || rev?.reviewCorrect;

      if (isWon) {
        correctMatches++;
      } else {
        incorrectMatches++;
      }

      if (q.level === 'Recognize') {
        recTotal++;
        if (isWon) recCorrect++;
      } else if (q.level === 'Understand') {
        undTotal++;
        if (isWon) undCorrect++;
      } else if (q.level === 'Apply') {
        appTotal++;
        if (isWon) appCorrect++;
      }
    });

    const completionDate = new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return {
      correctMatches,
      incorrectMatches,
      initialRoundScore: initialScore,
      reviewRoundScore: reviewScore,
      finalScore,
      maximumScore,
      percentage,
      performanceLevel: calculatePerformanceLevel(percentage),
      completionDate,
      recognizeScore: { correct: recCorrect, total: recTotal },
      understandScore: { correct: undCorrect, total: undTotal },
      applyScore: { correct: appCorrect, total: appTotal },
    };
  };

  // --- Get List of Failed Verbs for Parent Feedback ---
  const getIncorrectVerbs = (): VerbItem[] => {
    const list: VerbItem[] = [];
    questions.forEach((q) => {
      const rev = reviewQuestions.find((rq) => rq.id === q.id);
      const isWon = q.isCorrect || rev?.reviewCorrect;
      if (!isWon) {
        list.push(q.verb);
      }
    });
    return list;
  };

  // --- Teacher Setup Handler ---
  const handleSaveTeacherSetup = (newConfig: TeacherConfig) => {
    setTeacherConfig(newConfig);
    setShowTeacherSetup(false);

    // If currently playing or on start, restart with new configuration
    if (gameState === 'playing' || gameState === 'reviewing' || gameState === 'review_intro') {
      const generated = generateQuestions(newConfig);
      setQuestions(generated);
      setCurrentQuestionIndex(0);
      setInitialScore(0);
      setReviewScore(0);
      setReviewQuestions([]);
      setCurrentReviewIndex(0);
      setActiveStatus('active');
      setSelectedOption(null);
      setFeedbackText('');
      setTimeLeft(30);
      setGameState('playing');
    }
  };

  // --- Play Again Handler ---
  const handlePlayAgain = () => {
    clearCurrentTimer();
    clearTransitionTimeout();
    setGameState('start');
  };

  const currentQ =
    gameState === 'playing'
      ? questions[currentQuestionIndex]
      : gameState === 'reviewing'
      ? reviewQuestions[currentReviewIndex]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* 1. Header (Sticky HUD during game or available at top) */}
      {gameState !== 'start' && currentQ && (
        <GameHeader
          timeLeft={timeLeft}
          score={initialScore + reviewScore}
          currentQuestionIndex={
            gameState === 'playing' ? currentQuestionIndex : currentReviewIndex
          }
          totalQuestions={
            gameState === 'playing' ? questions.length : reviewQuestions.length
          }
          level={currentQ.level}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          bgmPlaying={bgmPlaying}
          onToggleBGM={handleToggleBGM}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenInstructions={() => setShowInstructionsModal(true)}
          onOpenTeacherSetup={() => setShowTeacherSetup(true)}
          isReviewRound={gameState === 'reviewing'}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-7xl mx-auto">
        {/* START SCREEN */}
        {gameState === 'start' && (
          <StudentStartScreen
            studentInfo={studentInfo}
            onUpdateStudentInfo={setStudentInfo}
            onStartGame={handleStartGameFromScreen}
            onOpenInstructions={() => setShowInstructionsModal(true)}
            onOpenTeacherSetup={() => setShowTeacherSetup(true)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            totalQuestions={teacherConfig.questionCount}
          />
        )}

        {/* ACTIVE GAMEPLAY & REVIEW PLAYGROUND */}
        {(gameState === 'playing' || gameState === 'reviewing') && currentQ && (
          <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
            {/* Tutor Companion Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between px-2">
              <TutorAvatar mood={tutorMood} message={tutorMessage} />
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Question Type
                </span>
                <span className="text-xs font-semibold text-cyan-400">
                  {currentQ.level === 'Recognize'
                    ? 'Nhận biết dạng V2'
                    : currentQ.level === 'Understand'
                    ? 'Thông hiểu & Nghĩa'
                    : 'Vận dụng vào câu'}
                </span>
              </div>
            </div>

            {/* Core Matching Area */}
            <MatchingArea
              question={currentQ}
              questionIndex={
                gameState === 'playing' ? currentQuestionIndex : currentReviewIndex
              }
              totalQuestions={
                gameState === 'playing' ? questions.length : reviewQuestions.length
              }
              isReviewRound={gameState === 'reviewing'}
              vietnameseHint={
                gameState === 'reviewing'
                  ? getVietnameseHint(currentQ.verb)
                  : undefined
              }
              onAnswerSubmit={handleAnswerSubmit}
              status={activeStatus}
              selectedOption={selectedOption}
              feedbackText={feedbackText}
              showSpeaker={teacherConfig.showSpeakerIcons}
            />
          </div>
        )}

        {/* REVIEW ROUND INTRO */}
        {gameState === 'review_intro' && (
          <ReviewRoundIntro
            questionCount={reviewQuestions.length}
            onStartReview={handleStartReviewRound}
          />
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
          <ResultsView
            student={studentInfo}
            stats={calculateGameStats()}
            questions={questions}
            incorrectVerbs={getIncorrectVerbs()}
            onPlayAgain={handlePlayAgain}
            onOpenReviewAnswers={() => setShowReviewAnswersModal(true)}
            onOpenListenAgain={() => setShowListenAgainModal(true)}
            onOpenCertificate={() => setShowCertificateModal(true)}
          />
        )}
      </main>

      {/* --- Modals & Overlays --- */}

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructionsModal}
        onCloseAndStart={handleConfirmInstructionsAndStart}
        canStartGame={Boolean(
          studentInfo.fullName.trim() &&
            studentInfo.studentClass.trim() &&
            studentInfo.school.trim()
        )}
      />

      {/* Review Round Failure Modal (When student fails a review question) */}
      {showReviewFailureModal && failedReviewQuestion && (
        <ReviewFailureModal
          question={failedReviewQuestion}
          onContinue={() => {
            setShowReviewFailureModal(false);
            setFailedReviewQuestion(null);
            advanceToNextQuestion();
          }}
        />
      )}

      {/* Teacher Setup Modal */}
      <TeacherSetupModal
        isOpen={showTeacherSetup}
        onClose={() => setShowTeacherSetup(false)}
        config={teacherConfig}
        onSaveAndRestart={handleSaveTeacherSetup}
      />

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          student={studentInfo}
          stats={calculateGameStats()}
        />
      )}

      {/* Review All Answers Modal */}
      <ReviewAnswersModal
        isOpen={showReviewAnswersModal}
        onClose={() => setShowReviewAnswersModal(false)}
        questions={questions}
      />

      {/* Listen Again Modal */}
      <ListenAgainModal
        isOpen={showListenAgainModal}
        onClose={() => setShowListenAgainModal(false)}
        questions={questions}
      />
    </div>
  );
}
