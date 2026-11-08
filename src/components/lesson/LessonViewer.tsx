import React, { useState } from 'react';
import { CourseModule, Lesson, QuizQuestion } from '../../data/courseData';
import { User } from '../../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Code,
  Lightbulb,
  FileQuestion,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { DevDuoMascot } from '../mascot/DevDuoMascot';

interface LessonViewerProps {
  module: CourseModule;
  user: User;
  onBackToPath: () => void;
  onLessonComplete: (lessonId: string, earnedXp: number) => void;
  onModuleComplete: (moduleId: number) => void;
  onHeartLost: () => void;
  onOpenChatWithContext?: (context: string) => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  playCompleteSound: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  module,
  user,
  onBackToPath,
  onLessonComplete,
  onModuleComplete,
  onHeartLost,
  onOpenChatWithContext,
  playSuccessSound,
  playErrorSound,
  playCompleteSound,
}) => {
  // Current active view mode: 'lesson' (individual lesson) | 'overview' (module overview) | 'quiz' | 'playground'
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'lesson' | 'quiz' | 'playground'>('overview');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  // Code copy feedback
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Playground code runner
  const [playgroundHtml, setPlaygroundHtml] = useState<string>(
    module.quickExample || '<h1>Olá, mundo!</h1>\n<p>Teste seu código aqui.</p>'
  );

  const currentLesson: Lesson | undefined = module.lessons[currentLessonIndex];
  const isLessonCompleted = currentLesson ? user.completedLessons.includes(currentLesson.id) : false;
  const isModuleCompleted = user.completedModules.includes(module.number);

  // Copy code helper
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    playCompleteSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#58cc02', '#ffc800', '#1cb0f6', '#ff9600', '#ce82ff'],
    });
  };

  // Handle Mark Current Lesson Complete
  const handleCompleteCurrentLesson = () => {
    if (!currentLesson) return;
    if (!isLessonCompleted) {
      onLessonComplete(currentLesson.id, 25);
      triggerCelebration();
    }
    // Advance to next lesson if available
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // Reached end of all lessons / concepts
      if (module.quizzes.length > 0) {
        setViewMode('quiz');
      } else {
        onModuleComplete(module.number);
        triggerCelebration();
      }
    }
  };

  // Quiz Answer Submit
  const handleAnswerQuiz = (q: QuizQuestion, choiceKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [q.id]: choiceKey }));

    if (choiceKey === q.correctAnswer) {
      setQuizFeedback(prev => ({ ...prev, [q.id]: 'correct' }));
      playSuccessSound();
      onLessonComplete(`quiz_${q.id}`, 15);
    } else {
      setQuizFeedback(prev => ({ ...prev, [q.id]: 'wrong' }));
      playErrorSound();
      if (!user.isAdmin) {
        onHeartLost();
      }
    }
  };

  // Reset quiz question
  const handleRetryQuiz = (qId: string) => {
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setQuizFeedback(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToPath}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border-2 border-gray-200 text-xs sm:text-sm font-extrabold text-gray-700 hover:border-[#58cc02] hover:text-[#58cc02] shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Trilha</span>
        </button>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border-2 border-gray-200 shadow-sm text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'overview' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setViewMode('lesson')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'lesson' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Aulas ({module.lessons.length})
          </button>
          <button
            onClick={() => setViewMode('quiz')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'quiz' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Quiz ({module.quizzes.length})
          </button>
          <button
            onClick={() => setViewMode('playground')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              viewMode === 'playground' ? 'bg-[#1cb0f6] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
        </div>
      </div>

      {/* Progress Bar of Module */}
      <div className="w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden border border-gray-100">
        <div
          className="h-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(
              100,
              (module.lessons.filter(l => user.completedLessons.includes(l.id)).length /
                (module.lessons.length || 1)) *
                100
            )}%`,
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. OVERVIEW MODE: Follows all 10 standard guidelines */}
      {/* ======================================================== */}
      {viewMode === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Module Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-100">
            <div className="flex items-center gap-2 text-xs font-black text-[#4f46e5] uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Módulo {module.number} de 12</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
              {module.title}
            </h1>

            {/* PARA QUE SERVE ESTE MÓDULO */}
            <div className="mt-5 p-4 sm:p-5 bg-blue-50/60 rounded-2xl border-2 border-blue-100">
              <div className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase tracking-wider mb-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Para que serve este módulo</span>
              </div>
              <p className="text-sm sm:text-base text-blue-950 font-medium leading-relaxed">
                {module.purpose || 'Explicação geral do módulo.'}
              </p>
            </div>

            {/* O QUE VOCÊ VAI APRENDER */}
            <div className="mt-5">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                O que você vai aprender:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {module.whatYouWillLearn.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 font-semibold"
                  >
                    <CheckCircle className="w-4 h-4 text-[#58cc02] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXEMPLO RÁPIDO */}
            {module.quickExample && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Exemplo rápido:
                  </h3>
                  <button
                    onClick={() => handleCopyCode(module.quickExample, 'quickEx')}
                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
                  >
                    {copiedCodeId === 'quickEx' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative rounded-2xl bg-[#1e1e1e] p-4 font-mono text-xs sm:text-sm text-gray-100 overflow-x-auto shadow-inner leading-relaxed">
                  <pre>{module.quickExample}</pre>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setViewMode('lesson')}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-[#4f46e5] text-white font-black text-base uppercase tracking-wide shadow-[0_4px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2"
              >
                <span>Iniciar Aulas ({module.lessons.length})</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {module.quizzes.length > 0 && (
                <button
                  onClick={() => setViewMode('quiz')}
                  className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-amber-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_4px_0_#d97706] hover:bg-amber-400 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2"
                >
                  <FileQuestion className="w-4 h-4" />
                  <span>Fazer Quiz ({module.quizzes.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* EXERCÍCIO PRÁTICO */}
          {module.practicalExercise && (
            <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-7 border-2 border-amber-200">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Exercício Prático</span>
              </div>
              <p className="text-sm sm:text-base text-amber-950 font-semibold leading-relaxed">
                {module.practicalExercise}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setViewMode('playground')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-black shadow-[0_2px_0_#d97706] hover:bg-amber-400 active:translate-y-0.5 active:shadow-none transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Abrir no Editor para Praticar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INDIVIDUAL LESSON MODE */}
      {/* ======================================================== */}
      {viewMode === 'lesson' && currentLesson && (
        <div className="space-y-6 animate-fade-in">
          {/* Lesson selector header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                  Módulo {module.number} • Aula {currentLesson.number} de {module.lessons.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
                  {currentLesson.title}
                </h2>
              </div>

              {isLessonCompleted && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-extrabold flex items-center gap-1 border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Concluída
                </span>
              )}
            </div>

            {/* Beginner Analogy Card */}
            {currentLesson.analogy && (
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-start gap-3 shadow-xs">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                    Analogia do Dia a Dia (Para entender de primeira):
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                    {currentLesson.analogy}
                  </p>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed space-y-4">
              <p>{currentLesson.explanation}</p>
            </div>

            {/* Golden Tip / Beginner Warning Card */}
            {currentLesson.goldenTip && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 flex items-start gap-3 shadow-xs">
                <span className="text-2xl shrink-0">🌟</span>
                <div>
                  <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-1">
                    Dica de Ouro & Cuidados de Iniciante:
                  </h4>
                  <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                    {currentLesson.goldenTip}
                  </p>
                </div>
              </div>
            )}

            {/* Code example of this lesson */}
            {currentLesson.codeExample && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Exemplo de código:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(currentLesson.codeExample, currentLesson.id)}
                      className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
                    >
                      {copiedCodeId === currentLesson.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setPlaygroundHtml(currentLesson.codeExample);
                        setViewMode('playground');
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-[#1cb0f6] hover:underline"
                    >
                      <Play className="w-3 h-3" />
                      <span>Testar</span>
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#1e1e1e] p-4 sm:p-5 font-mono text-xs sm:text-sm text-gray-100 overflow-x-auto shadow-inner leading-relaxed">
                  <pre>{currentLesson.codeExample}</pre>
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentLessonIndex === 0}
                onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 font-extrabold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Aula Anterior</span>
              </button>

              <button
                onClick={handleCompleteCurrentLesson}
                className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl bg-[#4f46e5] text-white font-black text-sm uppercase tracking-wide shadow-[0_4px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isLessonCompleted ? 'Próxima Aula' : 'Marcar Concluída (+25 XP)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lesson List Quick Selector Bar */}
          <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-black text-gray-400 shrink-0">Todas as Aulas:</span>
            {module.lessons.map((les, lIdx) => {
              const done = user.completedLessons.includes(les.id);
              const isCurrent = lIdx === currentLessonIndex;
              return (
                <button
                  key={les.id}
                  onClick={() => setCurrentLessonIndex(lIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#4f46e5] text-white shadow-sm'
                      : done
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {done && <Check className="w-3 h-3 text-green-700" />}
                  <span>Aula {les.number}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. QUIZ MODE: Original quiz with feedback and retries */}
      {/* ======================================================== */}
      {viewMode === 'quiz' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Quiz de Avaliação
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-gray-800">
                    Teste o que aprendeu no Módulo {module.number}
                  </h2>
                </div>
              </div>

              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {module.quizzes.length} {module.quizzes.length === 1 ? 'pergunta' : 'perguntas'}
              </span>
            </div>

            {module.quizzes.length === 0 ? (
              <div className="p-6 text-center text-gray-500 font-medium">
                Nenhum quiz cadastrado para este módulo no documento original.
              </div>
            ) : (
              <div className="space-y-8 mt-6">
                {module.quizzes.map((q, qIndex) => {
                  const currentChoice = selectedAnswers[q.id];
                  const feedback = quizFeedback[q.id];
                  const isCorrect = feedback === 'correct';
                  const isWrong = feedback === 'wrong';

                  return (
                    <div
                      key={q.id}
                      className="p-5 sm:p-6 rounded-2xl bg-gray-50 border-2 border-gray-200/80"
                    >
                      <h4 className="text-base sm:text-lg font-extrabold text-gray-800 mb-4 flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-black shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <span>{q.question}</span>
                      </h4>

                      {/* Alternatives */}
                      <div className="space-y-2.5">
                        {q.options.map(opt => {
                          const isSelected = currentChoice === opt.key;
                          let btnStyle = 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700';

                          if (isSelected) {
                            if (isCorrect) {
                              btnStyle = 'bg-green-50 border-2 border-green-500 text-green-900 shadow-sm';
                            } else if (isWrong) {
                              btnStyle = 'bg-red-50 border-2 border-red-500 text-red-900 shadow-sm';
                            } else {
                              btnStyle = 'bg-blue-50 border-2 border-blue-500 text-blue-900 shadow-sm';
                            }
                          } else if (feedback && opt.key === q.correctAnswer) {
                            btnStyle = 'bg-green-50 border-2 border-green-300 text-green-900';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isCorrect}
                              onClick={() => handleAnswerQuiz(q, opt.key)}
                              className={`w-full p-4 rounded-2xl text-left text-sm sm:text-base font-bold transition flex items-center justify-between ${btnStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black shrink-0">
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>

                              {isSelected && isCorrect && (
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback banner */}
                      {isCorrect && (
                        <div className="mt-4 p-3.5 bg-green-100/80 border-2 border-green-400 rounded-2xl text-green-800 text-xs sm:text-sm font-extrabold flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>Correto! Excelente trabalho! (+15 XP)</span>
                          </div>
                        </div>
                      )}

                      {isWrong && (
                        <div className="mt-4 p-3.5 bg-red-100/80 border-2 border-red-300 rounded-2xl text-red-800 text-xs sm:text-sm font-extrabold flex items-center justify-between">
                          <span>Que pena, resposta incorreta! Tente novamente.</span>
                          <button
                            onClick={() => handleRetryQuiz(q.id)}
                            className="px-3 py-1 bg-white rounded-xl border border-red-300 text-xs text-red-700 font-black hover:bg-red-50 flex items-center gap-1 shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Tentar de novo</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Complete Module Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setViewMode('lesson')}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                ← Voltar para as Aulas
              </button>

              <button
                onClick={() => {
                  onModuleComplete(module.number);
                  triggerCelebration();
                  onBackToPath();
                }}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] text-white font-black text-sm uppercase tracking-wide shadow-[0_4px_0_#3730a3] hover:brightness-110 active:translate-y-1 active:shadow-none transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Concluir Conceitos e Escolher Próxima Linguagem (+100 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CODE PLAYGROUND TAB */}
      {/* ======================================================== */}
      {viewMode === 'playground' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#1cb0f6]" />
                <h3 className="text-lg font-black text-gray-800">
                  Laboratório de Código Interativo
                </h3>
              </div>
              <button
                onClick={() => setPlaygroundHtml(module.quickExample || '')}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Exemplo</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Edite o código HTML/CSS/JS e veja o resultado sendo renderizado em tempo real abaixo!
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Code Editor Area */}
              <div className="flex flex-col">
                <div className="bg-gray-800 px-4 py-2 rounded-t-2xl text-xs font-mono text-gray-300 font-bold flex items-center justify-between">
                  <span>Editor de Código</span>
                  <span className="text-[11px] text-gray-400">HTML / CSS / JS</span>
                </div>
                <textarea
                  value={playgroundHtml}
                  onChange={e => setPlaygroundHtml(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-b-2xl bg-[#1e1e1e] text-green-400 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1cb0f6] leading-relaxed resize-y"
                  spellCheck="false"
                />
              </div>

              {/* Live Preview Iframe */}
              <div className="flex flex-col">
                <div className="bg-gray-200 px-4 py-2 rounded-t-2xl text-xs font-sans text-gray-700 font-bold flex items-center justify-between">
                  <span>Resultado ao Vivo (Navegador)</span>
                  <span className="text-[10px] text-gray-500">Sandbox Seguro</span>
                </div>
                <div className="w-full h-full min-h-[280px] bg-white rounded-b-2xl border-2 border-gray-200 overflow-hidden shadow-inner p-1">
                  <iframe
                    title="Live Preview"
                    srcDoc={playgroundHtml}
                    sandbox="allow-scripts"
                    className="w-full h-full min-h-[280px] border-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
