import React from 'react';
import { CourseModule } from '../../data/courseData';
import { DevDuoMascot } from '../mascot/DevDuoMascot';
import { Sparkles, Trophy, Star, ArrowRight, BookOpen, Zap, Gem } from 'lucide-react';

interface LanguageCompletedModalProps {
  isOpen: boolean;
  module: CourseModule;
  onChooseNextLanguage: () => void;
  onReviewCurrent: () => void;
}

export const LanguageCompletedModal: React.FC<LanguageCompletedModalProps> = ({
  isOpen,
  module,
  onChooseNextLanguage,
  onReviewCurrent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-300 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot cheering */}
        <div className="mb-2 z-10 animate-bounce">
          <DevDuoMascot mood="excited" size="lg" speechBubble="Incrível! Trilha conquistada!" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Trilha Concluída com Sucesso!</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Parabéns! Você concluiu todos os conceitos de {module.title.split('—')[0].trim()}!
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 max-w-sm">
          Você completou todas as aulas conceituais, praticou os exemplos de código e gabaritou os testes! Escolha agora qual outra linguagem você deseja aprender.
        </p>

        {/* Rewards earned box */}
        <div className="w-full my-5 p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 flex items-center justify-around gap-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-600 font-black text-base sm:text-lg">
              <Zap className="w-5 h-5 fill-amber-500" />
              <span>+100 XP</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Experiência</span>
          </div>

          <div className="w-px h-8 bg-amber-200" />

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-sky-600 font-black text-base sm:text-lg">
              <Gem className="w-5 h-5 fill-sky-500" />
              <span>+50 Gemas</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Recompensa</span>
          </div>

          <div className="w-px h-8 bg-amber-200" />

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-500 font-black text-base sm:text-lg">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>100%</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Conclusão</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          {/* Main button: Selecionar outra linguagem */}
          <button
            onClick={onChooseNextLanguage}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] text-white font-black text-sm uppercase tracking-wide shadow-[0_4px_0_#3730a3] hover:brightness-110 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2"
          >
            <span>Selecionar Outra Linguagem</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary button: Revisar */}
          <button
            onClick={onReviewCurrent}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-extrabold text-gray-600 hover:bg-gray-50 transition"
          >
            Revisar Conteúdo Desta Trilha
          </button>
        </div>
      </div>
    </div>
  );
};
