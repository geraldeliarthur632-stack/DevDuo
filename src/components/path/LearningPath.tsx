import React, { useState } from 'react';
import { CourseModule, Lesson } from '../../data/courseData';
import { User } from '../../types';
import { Check, Star, Lock, Sparkles, Trophy, Play, FileQuestion, Globe, Award, HelpCircle } from 'lucide-react';
import { DevDuoMascot } from '../mascot/DevDuoMascot';

interface LearningPathProps {
  module: CourseModule;
  user: User;
  onOpenLesson: (lesson: Lesson) => void;
  onOpenQuiz: () => void;
  onOpenEditor: (code?: string) => void;
  onOpenLanguageSelector: () => void;
  onModuleComplete: (modNum: number) => void;
  onOpenChatWithContext?: (context: string) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  module,
  user,
  onOpenLesson,
  onOpenQuiz,
  onOpenEditor,
  onOpenLanguageSelector,
  onModuleComplete,
  onOpenChatWithContext,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Helper colors and icons by module
  const getTheme = (num: number) => {
    const themes: Record<number, { bg: string; border: string; glow: string; icon: string }> = {
      1: { bg: 'bg-[#ea580c]', border: 'border-[#c2410c]', glow: 'from-orange-500 to-amber-600', icon: '📄' },
      2: { bg: 'bg-[#2563eb]', border: 'border-[#1d4ed8]', glow: 'from-blue-500 to-indigo-600', icon: '🎨' },
      3: { bg: 'bg-[#f59e0b]', border: 'border-[#d97706]', glow: 'from-amber-400 to-yellow-600', icon: '⚡' },
      4: { bg: 'bg-[#3b82f6]', border: 'border-[#1d4ed8]', glow: 'from-blue-600 to-cyan-600', icon: '🔷' },
      5: { bg: 'bg-[#10b981]', border: 'border-[#059669]', glow: 'from-emerald-500 to-teal-700', icon: '🐍' },
      6: { bg: 'bg-[#8b5cf6]', border: 'border-[#7c3aed]', glow: 'from-purple-500 to-indigo-700', icon: '🐘' },
      7: { bg: 'bg-[#0284c7]', border: 'border-[#0369a1]', glow: 'from-sky-600 to-cyan-700', icon: '🗄️' },
      8: { bg: 'bg-[#16a34a]', border: 'border-[#15803d]', glow: 'from-green-600 to-emerald-800', icon: '🟢' },
      9: { bg: 'bg-[#ef4444]', border: 'border-[#dc2626]', glow: 'from-rose-500 to-red-700', icon: '☕' },
      10: { bg: 'bg-[#6366f1]', border: 'border-[#4f46e5]', glow: 'from-indigo-600 to-purple-800', icon: '🔵' },
      11: { bg: 'bg-[#0ea5e9]', border: 'border-[#0284c7]', glow: 'from-cyan-600 to-blue-700', icon: '🔌' },
      12: { bg: 'bg-[#f97316]', border: 'border-[#ea580c]', glow: 'from-orange-600 to-pink-600', icon: '🚀' },
    };
    return themes[num] || { bg: 'bg-[#4f46e5]', border: 'border-[#3730a3]', glow: 'from-indigo-600 to-cyan-600', icon: '💻' };
  };

  const theme = getTheme(module.number);

  // Winding serpentine offset pattern like Duolingo
  const getOffsetClass = (idx: number) => {
    const cycle = idx % 6;
    if (cycle === 0) return 'translate-x-0';
    if (cycle === 1) return 'translate-x-8 sm:translate-x-14';
    if (cycle === 2) return 'translate-x-12 sm:translate-x-20';
    if (cycle === 3) return 'translate-x-8 sm:translate-x-14';
    if (cycle === 4) return 'translate-x-0';
    return '-translate-x-8 sm:-translate-x-14';
  };

  // Lessons progress
  const completedCount = module.lessons.filter(l => user.completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (module.lessons.length || 1)) * 100);
  const isModuleDone = user.completedModules.includes(module.number) || progressPercent === 100;

  // Determine which lesson is currently active (first incomplete lesson)
  const currentActiveLessonIndex = module.lessons.findIndex(l => !user.completedLessons.includes(l.id));
  const activeIndex = currentActiveLessonIndex === -1 ? module.lessons.length : currentActiveLessonIndex;

  // Check if a specific lesson node is locked
  const isLessonLocked = (idx: number) => {
    if (user.isAdmin) return false;
    if (idx === 0) return false;
    const prevLesson = module.lessons[idx - 1];
    return !user.completedLessons.includes(prevLesson.id);
  };

  // Practice & Quiz locks
  const isPracticeLocked = !user.isAdmin && completedCount < module.lessons.length;
  const isQuizLocked = !user.isAdmin && completedCount < module.lessons.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 flex flex-col items-center">
      {/* Top Language Track Banner */}
      <div className={`w-full mb-6 p-5 sm:p-6 bg-gradient-to-r ${theme.glow} rounded-3xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden`}>
        <div className="flex-1 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
            <span className="text-base">{theme.icon}</span>
            <span>Trilha Ativa: Módulo {module.number} de 12</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {module.title}
          </h1>
          <p className="text-xs text-indigo-100 font-medium mt-1 line-clamp-2 max-w-lg">
            {module.purpose}
          </p>

          {/* Progress Bar of Current Language */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-black/25 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-black shrink-0">
              {completedCount}/{module.lessons.length} aulas ({progressPercent}%)
            </span>
          </div>

          {/* Switch language button */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenLanguageSelector}
              className="px-3.5 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-black shadow-md hover:bg-gray-100 transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#4f46e5]" />
              <span>Trocar Trilha / Ver Outras</span>
            </button>
          </div>
        </div>

        <div className="shrink-0 z-10 hidden sm:block">
          <DevDuoMascot
            mood={isModuleDone ? 'excited' : 'cheering'}
            size="md"
            animate={false}
            speechBubble={isModuleDone ? 'Trilha dominada!' : 'Aula por aula!'}
          />
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Completed Track Celebration Banner */}
      {isModuleDone && (
        <div className="w-full mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in border-2 border-amber-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl shrink-0">🏆</span>
            <div>
              <h4 className="font-black text-sm sm:text-base">
                Você concluiu todos os conceitos de {module.title.split('—')[0].trim()}!
              </h4>
              <p className="text-xs text-amber-100 font-medium">
                Parabéns! Clique no botão ao lado para escolher outra linguagem e continuar aprendendo.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenLanguageSelector}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white text-amber-950 font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#b45309] hover:bg-amber-50 active:translate-y-0.5 transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Escolher Próxima Linguagem</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      )}

      {/* Locked Alert Notice */}
      {lockedNotice && (
        <div className="w-full mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-sm animate-shake">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>{lockedNotice}</span>
          </div>
          <button
            onClick={() => setLockedNotice(null)}
            className="text-xs font-black underline text-amber-800 hover:text-amber-950 shrink-0"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* Winding Duolingo Path: Each "pontinho" is ONE LESSON / CONCEPT! */}
      {/* ======================================================== */}
      <div className="relative w-full flex flex-col items-center space-y-10 sm:space-y-12 my-4">
        {/* Serpentine track connector line */}
        <div className="absolute top-10 bottom-10 w-2.5 bg-gray-200 rounded-full z-0" />

        {/* 1. LESSON NODES */}
        {module.lessons.map((lesson, idx) => {
          const isDone = user.completedLessons.includes(lesson.id);
          const isCurrent = idx === activeIndex;
          const isLocked = isLessonLocked(idx);
          const offset = getOffsetClass(idx);

          return (
            <div
              key={lesson.id}
              className={`relative z-10 flex flex-col items-center transition-transform ${offset}`}
            >
              {/* Floating Mascot right above the current active lesson node */}
              {isCurrent && (
                <div className="absolute -top-16 z-30 pointer-events-none animate-bounce">
                  <DevDuoMascot
                    mood="excited"
                    size="sm"
                    speechBubble="Sua vez!"
                  />
                </div>
              )}

              {/* 3D Circular Duolingo Node Button */}
              <button
                type="button"
                onClick={() => {
                  if (isLocked) {
                    setLockedNotice(
                      `Complete a Aula ${idx} antes para desbloquear esta aula! (Admins possuem acesso liberado a todas).`
                    );
                    return;
                  }
                  setLockedNotice(null);
                  onOpenLesson(lesson);
                }}
                className={`group relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isDone
                    ? 'bg-[#ffc800] border-b-6 border-[#e5a500] shadow-md hover:scale-105 active:border-b-0 active:translate-y-1.5'
                    : isLocked
                    ? 'bg-gray-300 border-b-6 border-gray-400 opacity-70 hover:opacity-85'
                    : `${theme.bg} border-b-6 ${theme.border} shadow-lg hover:scale-105 active:border-b-0 active:translate-y-1.5 ring-4 ring-indigo-400/30 animate-pulse`
                }`}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="4"
                  />
                  {isDone && (
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="5"
                      strokeDasharray="280"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Node Center Icon / Number */}
                <div className="flex flex-col items-center justify-center text-white">
                  {isDone ? (
                    <Check className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3.5]" />
                  ) : isLocked ? (
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black">{lesson.number}</span>
                  )}
                </div>

                {/* Star badge on completed node */}
                {isDone && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                )}
              </button>

              {/* Lesson Card Label below the node */}
              <div
                onClick={() => {
                  if (isLocked) {
                    setLockedNotice(`Complete a Aula ${idx} antes para desbloquear esta aula!`);
                    return;
                  }
                  onOpenLesson(lesson);
                }}
                className={`mt-2.5 px-3 py-1.5 rounded-2xl cursor-pointer transition text-center max-w-[190px] sm:max-w-[220px] shadow-xs ${
                  isCurrent
                    ? 'bg-[#4f46e5] text-white shadow-md'
                    : isDone
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 border border-gray-200'
                    : 'bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider opacity-80">
                  AULA {lesson.number}
                </div>
                <div className="font-extrabold text-xs sm:text-sm line-clamp-1 leading-snug">
                  {lesson.title}
                </div>
              </div>
            </div>
          );
        })}

        {/* 2. PRACTICAL EXERCISE / LAB NODE */}
        {module.practicalExercise && (
          <div className={`relative z-10 flex flex-col items-center transition-transform ${getOffsetClass(module.lessons.length)}`}>
            <button
              type="button"
              onClick={() => {
                if (isPracticeLocked) {
                  setLockedNotice('Conclua todas as aulas acima para liberar o laboratório prático!');
                  return;
                }
                onOpenEditor(module.quickExample);
              }}
              className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 ${
                isPracticeLocked
                  ? 'bg-gray-300 border-b-6 border-gray-400 opacity-70'
                  : 'bg-[#06b6d4] border-b-6 border-[#0891b2] shadow-lg hover:scale-105 active:border-b-0 active:translate-y-1.5'
              }`}
            >
              <div className="flex flex-col items-center justify-center text-white">
                {isPracticeLocked ? (
                  <Lock className="w-6 h-6 text-gray-600" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white ml-0.5" />
                )}
              </div>
            </button>

            <div
              onClick={() => {
                if (!isPracticeLocked) onOpenEditor(module.quickExample);
              }}
              className="mt-2.5 px-3 py-1.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-center max-w-[200px] cursor-pointer shadow-xs"
            >
              <div className="text-[10px] font-black uppercase tracking-wider text-cyan-700">
                LABORATÓRIO
              </div>
              <div className="font-extrabold text-xs sm:text-sm line-clamp-1">
                Exercício Prático
              </div>
            </div>
          </div>
        )}

        {/* 3. QUIZ NODE */}
        {module.quizzes.length > 0 && (
          <div className={`relative z-10 flex flex-col items-center transition-transform ${getOffsetClass(module.lessons.length + 1)}`}>
            <button
              type="button"
              onClick={() => {
                if (isQuizLocked) {
                  setLockedNotice('Conclua todas as aulas teóricas antes de realizar o Quiz Final!');
                  return;
                }
                onOpenQuiz();
              }}
              className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 ${
                isQuizLocked
                  ? 'bg-gray-300 border-b-6 border-gray-400 opacity-70'
                  : 'bg-amber-500 border-b-6 border-amber-600 shadow-lg hover:scale-105 active:border-b-0 active:translate-y-1.5 ring-4 ring-amber-300/40 animate-pulse'
              }`}
            >
              <div className="flex flex-col items-center justify-center text-white">
                {isQuizLocked ? (
                  <Lock className="w-6 h-6 text-gray-600" />
                ) : (
                  <FileQuestion className="w-9 h-9 text-white stroke-[2.5]" />
                )}
              </div>
            </button>

            <div
              onClick={() => {
                if (!isQuizLocked) onOpenQuiz();
              }}
              className="mt-2.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-center max-w-[200px] cursor-pointer shadow-xs"
            >
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                AVALIAÇÃO
              </div>
              <div className="font-extrabold text-xs sm:text-sm line-clamp-1">
                Quiz Final ({module.quizzes.length} questões)
              </div>
            </div>
          </div>
        )}

        {/* 4. TROPHY / COMPLETE TRACK NODE (Aparece para selecionar outra linguagem até na chave de admin) */}
        <div className={`relative z-10 flex flex-col items-center transition-transform ${getOffsetClass(module.lessons.length + 2)}`}>
          <button
            type="button"
            onClick={() => {
              // Trigger celebration and pick next language
              onModuleComplete(module.number);
            }}
            className={`relative w-22 h-22 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
              isModuleDone || user.isAdmin
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 border-b-6 border-amber-600 shadow-xl hover:scale-110 active:border-b-0 active:translate-y-2 ring-4 ring-amber-300/50'
                : 'bg-gray-300 border-b-6 border-gray-400 opacity-75'
            }`}
          >
            <Trophy className="w-10 h-10 text-white fill-white" />
          </button>

          <div
            onClick={() => onModuleComplete(module.number)}
            className="mt-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center max-w-[230px] cursor-pointer shadow-md hover:brightness-105 transition"
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-100 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>CONQUISTA</span>
            </div>
            <div className="font-black text-xs sm:text-sm">
              Concluir & Selecionar Próxima
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
