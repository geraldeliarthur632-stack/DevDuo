import React, { useState } from 'react';
import { CourseModule, QuizQuestion } from '../../data/courseData';
import { User } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  FileQuestion,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react';

interface SingleQuizModalProps {
  isOpen: boolean;
  module: CourseModule;
  user: User;
  onClose: () => void;
  onModuleComplete: (modNum: number) => void;
  onHeartLost: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  playCompleteSound: () => void;
}

export const SingleQuizModal: React.FC<SingleQuizModalProps> = ({
  isOpen,
  module,
  user,
  onClose,
  onModuleComplete,
  onHeartLost,
  playSuccessSound,
  playErrorSound,
  playCompleteSound,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  if (!isOpen) return null;

  const handleAnswerQuiz = (q: QuizQuestion, choiceKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [q.id]: choiceKey }));

    if (choiceKey === q.correctAnswer) {
      setQuizFeedback(prev => ({ ...prev, [q.id]: 'correct' }));
      playSuccessSound();
    } else {
      setQuizFeedback(prev => ({ ...prev, [q.id]: 'wrong' }));
      playErrorSound();
      if (!user.isAdmin) {
        onHeartLost();
      }
    }
  };

  const handleRetry = (qId: string) => {
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

  const allAnsweredCorrectly =
    module.quizzes.length > 0 &&
    module.quizzes.every(q => quizFeedback[q.id] === 'correct');

  const handleFinishQuiz = () => {
    playCompleteSound();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#58cc02', '#ffc800', '#1cb0f6', '#ff9600', '#ce82ff'],
    });
    onModuleComplete(module.number);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-2 border-gray-200 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              title="Fechar Quiz"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5" />
              <div>
                <span className="text-[10px] font-black uppercase text-amber-100 tracking-wider">
                  Quiz de Avaliação
                </span>
                <h2 className="text-base sm:text-lg font-black leading-tight line-clamp-1">
                  {module.title.split('—')[0].trim()}
                </h2>
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-white/20 text-xs font-black">
            {module.quizzes.length} {module.quizzes.length === 1 ? 'questão' : 'questões'}
          </span>
        </div>

        {/* Scrollable Questions Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800">
          {module.quizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold">
              Este módulo não possui testes de múltipla escolha.
            </div>
          ) : (
            module.quizzes.map((q, idx) => {
              const currentChoice = selectedAnswers[q.id];
              const feedback = quizFeedback[q.id];
              const isCorrect = feedback === 'correct';
              const isWrong = feedback === 'wrong';

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-gray-50 border-2 border-gray-200/80"
                >
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-800 mb-4 flex items-start gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-[#4f46e5] text-xs font-black shrink-0 mt-0.5">
                      Questão {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h4>

                  <div className="space-y-2.5">
                    {q.options.map(opt => {
                      const isSelected = currentChoice === opt.key;
                      let btnStyle =
                        'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700';

                      if (isSelected) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-green-50 border-2 border-green-500 text-green-900 shadow-sm';
                        } else if (isWrong) {
                          btnStyle =
                            'bg-red-50 border-2 border-red-500 text-red-900 shadow-sm';
                        } else {
                          btnStyle =
                            'bg-blue-50 border-2 border-blue-500 text-blue-900 shadow-sm';
                        }
                      } else if (feedback && opt.key === q.correctAnswer) {
                        btnStyle =
                          'bg-green-50 border-2 border-green-300 text-green-900';
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={isCorrect}
                          onClick={() => handleAnswerQuiz(q, opt.key)}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold transition flex items-center justify-between ${btnStyle}`}
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

                  {isCorrect && (
                    <div className="mt-4 p-3 bg-green-100/80 border-2 border-green-400 rounded-2xl text-green-800 text-xs sm:text-sm font-extrabold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Resposta correta! Excelente raciocínio!</span>
                    </div>
                  )}

                  {isWrong && (
                    <div className="mt-4 p-3 bg-red-100/80 border-2 border-red-300 rounded-2xl text-red-800 text-xs sm:text-sm font-extrabold flex items-center justify-between gap-2">
                      <span>Não foi dessa vez. Reveja o conceito e tente novamente!</span>
                      <button
                        onClick={() => handleRetry(q.id)}
                        className="px-3 py-1 bg-white rounded-xl border border-red-300 text-xs text-red-700 font-black hover:bg-red-50 flex items-center gap-1 shadow-sm shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Tentar de novo</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
          >
            Voltar à Trilha
          </button>

          <button
            disabled={!allAnsweredCorrectly && !user.isAdmin}
            onClick={handleFinishQuiz}
            className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-2 ${
              allAnsweredCorrectly || user.isAdmin
                ? 'bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] text-white shadow-[0_4px_0_#3730a3] hover:brightness-110 active:translate-y-1 active:shadow-none'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Concluir Trilha e Escolher Próxima Linguagem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
