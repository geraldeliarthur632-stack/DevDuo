import React, { useState } from 'react';
import { CourseModule } from '../../data/courseData';
import { User } from '../../types';
import { DevDuoMascot } from '../mascot/DevDuoMascot';
import {
  Check,
  Star,
  Lock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface LanguageSelectionScreenProps {
  modules: CourseModule[];
  user: User;
  onSelectLanguage: (module: CourseModule) => void;
  onCancel?: () => void;
  isMandatoryFirstChoice?: boolean;
  justCompletedModule?: CourseModule | null;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  modules,
  user,
  onSelectLanguage,
  onCancel,
  isMandatoryFirstChoice = false,
  justCompletedModule,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'frontend' | 'backend' | 'devops' | 'projects'>('all');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Helper to calculate module progress percentage
  const getModuleProgress = (mod: CourseModule) => {
    if (mod.lessons.length === 0) return 0;
    const completedCount = mod.lessons.filter(l => user.completedLessons.includes(l.id)).length;
    return Math.round((completedCount / mod.lessons.length) * 100);
  };

  // Check if a module is 100% completed
  const isModuleCompleted = (mod: CourseModule) => {
    return user.completedModules.includes(mod.number) || getModuleProgress(mod) === 100;
  };

  // Filter modules
  const filteredModules = modules.filter(mod => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'frontend') {
      return mod.number >= 1 && mod.number <= 4;
    }
    if (filterCategory === 'backend') {
      return (mod.number >= 5 && mod.number <= 10) || mod.number === 7;
    }
    if (filterCategory === 'devops') {
      return mod.number === 11;
    }
    if (filterCategory === 'projects') {
      return mod.number === 12;
    }
    return true;
  });

  // Current active module
  const currentActiveMod = modules.find(
    m => m.id === (user.selectedLanguageId || user.currentModuleId)
  );

  // Handle clicking a module card
  const handleCardClick = (mod: CourseModule) => {
    setNoticeMessage(null);

    // 1. If user is Admin (or has multiple-use code), they can pick ANY module anytime!
    if (user.isAdmin) {
      onSelectLanguage(mod);
      return;
    }

    // 2. If it's the mandatory first choice, allow picking any track
    if (isMandatoryFirstChoice || !user.selectedLanguageId) {
      onSelectLanguage(mod);
      return;
    }

    // 3. If clicking the current module, allow continuing
    if (mod.id === user.selectedLanguageId) {
      onSelectLanguage(mod);
      return;
    }

    // 4. If current module is already completed, they are free to choose a new one!
    const currentCompleted = currentActiveMod ? isModuleCompleted(currentActiveMod) : true;
    if (currentCompleted) {
      onSelectLanguage(mod);
      return;
    }

    // 5. If target module is already completed, allow revisiting for review
    if (isModuleCompleted(mod)) {
      onSelectLanguage(mod);
      return;
    }

    // 6. Otherwise: Normal student must complete current language first
    setNoticeMessage(
      `🔒 Você está focado na trilha de "${currentActiveMod?.title.split('—')[0].trim() || 'sua linguagem atual'}". Conclua todas as aulas e o quiz dessa trilha para liberar a próxima linguagem! (Usuários Administradores possuem acesso livre a todas simultaneamente).`
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-8 px-4 sm:px-6 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Top Header Card */}
        <div className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex-1 text-center sm:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {justCompletedModule
                  ? `Trilha Concluída: ${justCompletedModule.title.split('—')[0].trim()}`
                  : isMandatoryFirstChoice
                  ? 'Primeiro Acesso — Escolha Sua Linguagem'
                  : 'Seleção de Trilha'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {justCompletedModule
                ? `Parabéns por concluir todos os conceitos! Qual será a sua próxima linguagem?`
                : isMandatoryFirstChoice
                ? 'Qual linguagem você deseja começar agora?'
                : 'Qual linguagem você quer dominar agora?'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1.5 max-w-xl">
              {justCompletedModule
                ? `Você finalizou com 100% de sucesso todos os conceitos e testes de ${justCompletedModule.title.split('—')[0].trim()}! Escolha qualquer uma das outras 11 linguagens para continuar sua evolução.`
                : isMandatoryFirstChoice
                ? 'Seja bem-vindo! Selecione qualquer uma das linguagens abaixo para iniciar seu aprendizado com aulas práticas, explicações simples e quizzes interativos.'
                : 'Cada linguagem possui aulas do zero ao avançado, explicações com analogias simples para iniciantes, código comentado linha por linha, quizzes interativos e laboratório prático.'}
            </p>

            {user.isAdmin && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-amber-950 text-xs font-black shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-950" />
                <span>👑 Acesso Mestre Ativo: Você pode alternar entre qualquer linguagem a qualquer momento!</span>
              </div>
            )}
          </div>

          <div className="shrink-0 z-10">
            <DevDuoMascot
              mood="cheering"
              size="md"
              animate={false}
              speechBubble={
                justCompletedModule
                  ? 'Mandou bem! Escolha a próxima!'
                  : isMandatoryFirstChoice
                  ? 'Escolha sua primeira linguagem!'
                  : 'Vamos para a próxima!'
              }
            />
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Notice Message if student tries to switch before completing */}
        {noticeMessage && (
          <div className="w-full mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-sm animate-shake">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚠️</span>
              <p>{noticeMessage}</p>
            </div>
            <button
              onClick={() => setNoticeMessage(null)}
              className="text-xs font-black underline text-amber-800 hover:text-amber-950 shrink-0"
            >
              Entendido
            </button>
          </div>
        )}

        {/* Current Active Language Highlight (if user already has one) */}
        {currentActiveMod && !isMandatoryFirstChoice && (
          <div className="w-full mt-6 p-4 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl">
                {currentActiveMod.number === 1 ? '📄' : currentActiveMod.number === 2 ? '🎨' : currentActiveMod.number === 3 ? '⚡' : currentActiveMod.number === 4 ? '🔷' : currentActiveMod.number === 5 ? '🐍' : currentActiveMod.number === 6 ? '🐘' : currentActiveMod.number === 7 ? '🗄️' : currentActiveMod.number === 8 ? '🟢' : currentActiveMod.number === 9 ? '☕' : currentActiveMod.number === 10 ? '🔵' : currentActiveMod.number === 11 ? '🔌' : '🚀'}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                  Trilha em Andamento
                </div>
                <h4 className="font-black text-sm sm:text-base text-gray-800">
                  {currentActiveMod.title}
                </h4>
                <div className="text-xs text-gray-500 font-semibold">
                  Progresso: {getModuleProgress(currentActiveMod)}% concluído ({currentActiveMod.lessons.filter(l => user.completedLessons.includes(l.id)).length}/{currentActiveMod.lessons.length} aulas)
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectLanguage(currentActiveMod)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4f46e5] text-white font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-1 transition flex items-center justify-center gap-1.5"
            >
              <span>Continuar Estudando</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar linguagem ou tópico..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#4f46e5] transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-white rounded-2xl border-2 border-gray-200 text-xs font-bold">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterCategory === 'all'
                  ? 'bg-[#4f46e5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todas (12)
            </button>
            <button
              onClick={() => setFilterCategory('frontend')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterCategory === 'frontend'
                  ? 'bg-[#4f46e5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Front-End
            </button>
            <button
              onClick={() => setFilterCategory('backend')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterCategory === 'backend'
                  ? 'bg-[#4f46e5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Back-End & SQL
            </button>
            <button
              onClick={() => setFilterCategory('devops')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterCategory === 'devops'
                  ? 'bg-[#4f46e5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              DevOps
            </button>
            <button
              onClick={() => setFilterCategory('projects')}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterCategory === 'projects'
                  ? 'bg-[#4f46e5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Projetos
            </button>
          </div>
        </div>

        {/* 12 Language Cards Grid */}
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredModules.map(mod => {
            const progress = getModuleProgress(mod);
            const completed = isModuleCompleted(mod);
            const isCurrent = mod.id === user.selectedLanguageId;

            // Icon by module number
            const icons: Record<number, string> = {
              1: '📄',
              2: '🎨',
              3: '⚡',
              4: '🔷',
              5: '🐍',
              6: '🐘',
              7: '🗄️',
              8: '🟢',
              9: '☕',
              10: '🔵',
              11: '🔌',
              12: '🚀',
            };

            const colors: Record<number, string> = {
              1: 'from-orange-500 to-amber-600',
              2: 'from-blue-500 to-indigo-600',
              3: 'from-amber-400 to-yellow-600',
              4: 'from-blue-600 to-cyan-600',
              5: 'from-emerald-500 to-teal-700',
              6: 'from-purple-500 to-indigo-700',
              7: 'from-sky-600 to-cyan-700',
              8: 'from-green-600 to-emerald-800',
              9: 'from-rose-500 to-red-700',
              10: 'from-indigo-600 to-purple-800',
              11: 'from-cyan-600 to-blue-700',
              12: 'from-orange-600 to-pink-600',
            };

            const currentCompleted = currentActiveMod ? isModuleCompleted(currentActiveMod) : true;
            const isLockedForStudent =
              !user.isAdmin &&
              !isMandatoryFirstChoice &&
              user.selectedLanguageId &&
              mod.id !== user.selectedLanguageId &&
              !currentCompleted &&
              !completed;

            return (
              <div
                key={mod.id}
                onClick={() => handleCardClick(mod)}
                className={`relative group rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                    : completed
                    ? 'bg-amber-50/60 border-amber-300 shadow-sm hover:border-amber-400'
                    : isLockedForStudent
                    ? 'bg-gray-50 border-gray-200 opacity-80 hover:opacity-100 hover:border-gray-300'
                    : 'bg-white border-gray-200 hover:border-[#4f46e5] hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top card row */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${
                          colors[mod.number] || 'from-indigo-500 to-cyan-500'
                        } flex items-center justify-center text-2xl shadow-sm text-white`}
                      >
                        {icons[mod.number] || '💻'}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          MÓDULO {mod.number}
                        </div>
                        <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#4f46e5] transition">
                          {mod.title.split('—')[0].trim()}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {completed ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase border border-amber-300">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Concluído</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase border border-indigo-300">
                        Ativa
                      </span>
                    ) : isLockedForStudent ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">
                        <Lock className="w-3 h-3 text-gray-500" />
                        <span>Aguardando</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                        Disponível
                      </span>
                    )}
                  </div>

                  {/* Purpose description */}
                  <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed mb-4">
                    {mod.purpose}
                  </p>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        completed
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Bottom details & Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {mod.lessons.length} aulas
                      </span>
                      <span>•</span>
                      <span>{mod.quizzes.length} quizzes</span>
                    </div>

                    <button
                      type="button"
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#4f46e5] text-white shadow-sm'
                          : completed
                          ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                          : isLockedForStudent
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-gray-900 text-white shadow-sm hover:bg-[#4f46e5]'
                      }`}
                    >
                      <span>
                        {isCurrent
                          ? 'Continuar'
                          : completed
                          ? 'Revisar'
                          : isLockedForStudent
                          ? 'Ver Trilha'
                          : 'Começar Trilha'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel button if opened from header */}
        {onCancel && !isMandatoryFirstChoice && (
          <div className="mt-8">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-2xl bg-white border-2 border-gray-300 text-xs font-extrabold text-gray-700 hover:bg-gray-100 transition shadow-sm"
            >
              ← Voltar para a Aula Atual
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
