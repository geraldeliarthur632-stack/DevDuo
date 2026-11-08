import React, { useState, useEffect } from 'react';
import { CourseModule, Lesson } from '../../data/courseData';
import { User } from '../../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Code2,
  HelpCircle,
  Award,
  Terminal,
  Eye,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { DevDuoMascot } from '../mascot/DevDuoMascot';

interface FullPageLessonProps {
  lesson: Lesson;
  module: CourseModule;
  user: User;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number) => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNextLesson?: boolean;
  hasPrevLesson?: boolean;
  playSuccessSound: () => void;
  playCompleteSound: () => void;
  playErrorSound?: () => void;
}

// Coddy.tech step types
type LessonStep = 'concept' | 'syntax' | 'interactive' | 'challenge' | 'complete';

export const FullPageLesson: React.FC<FullPageLessonProps> = ({
  lesson,
  module,
  user,
  onClose,
  onCompleteLesson,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
  playSuccessSound,
  playCompleteSound,
  playErrorSound,
}) => {
  const [currentStep, setCurrentStep] = useState<LessonStep>('concept');
  const [copied, setCopied] = useState(false);

  // Interactive Live Playground State (Step 3)
  const [liveCode, setLiveCode] = useState(lesson.codeExample);
  const [renderedPreview, setRenderedPreview] = useState(lesson.codeExample);

  // Challenge / Quiz State (Step 4)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [challengeAnswered, setChallengeAnswered] = useState(false);
  const [challengeCorrect, setChallengeCorrect] = useState<boolean | null>(null);

  const isCompleted = user.completedLessons.includes(lesson.id);

  // Reset step whenever lesson changes
  useEffect(() => {
    setCurrentStep('concept');
    setLiveCode(lesson.codeExample);
    setRenderedPreview(lesson.codeExample);
    setSelectedOption(null);
    setChallengeAnswered(false);
    setChallengeCorrect(null);
  }, [lesson.id]);

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(liveCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run live code in sandbox
  const handleRunCode = () => {
    setRenderedPreview(liveCode);
  };

  // Build element quiz challenge for Step 4
  const challenge = React.useMemo(() => {
    // Determine subject based on lesson title and module
    const title = lesson.title;
    const isHtml = module.id === 'mod-1';
    const isCss = module.id === 'mod-2' || module.id === 'mod-3';
    const isJs = module.id === 'mod-4' || module.id === 'mod-5';
    const isPython = module.id === 'mod-6';
    const isSql = module.id === 'mod-8';

    if (isHtml) {
      return {
        question: `Sobre o elemento/conceito "${title}": qual das afirmações abaixo está correta?`,
        options: [
          `Define a estrutura semântica correta e orienta motores de busca e leitores de tela.`,
          `Serve exclusivamente para aplicar cores e estilização visual ao site.`,
          `Executa lógica de banco de dados diretamente no servidor.`,
          `É uma tag obsoleta que nunca deve ser utilizada no HTML5 moderno.`,
        ],
        correctIndex: 0,
        tip: 'Lembre-se: o HTML5 é o esqueleto estrutural e semântico do conteúdo web!',
      };
    }

    if (isCss) {
      return {
        question: `No aprendizado de "${title}", qual é o papel principal da estilização?`,
        options: [
          `Criar tabelas no banco de dados.`,
          `Controlar a apresentação visual, layout, cores, espaçamento e responsividade.`,
          `Executar cálculos matemáticos e requisições assíncronas via HTTP.`,
          `Substituir a necessidade de utilizar tags HTML na página.`,
        ],
        correctIndex: 1,
        tip: 'CSS define como os elementos HTML são apresentados aos olhos do usuário!',
      };
    }

    if (isJs || isPython) {
      return {
        question: `Na prática de "${title}", qual é a principal finalidade deste comando/recurso?`,
        options: [
          `Apenas mudar a cor de fundo da página.`,
          `Adicionar lógica, processamento de dados e dinamismo ao programa.`,
          `Servir como tag de cabeçalho estático.`,
          `Impedir que outros códigos sejam executados no navegador.`,
        ],
        correctIndex: 1,
        tip: 'Linguagens de programação adicionam inteligência, cálculo e fluxo dinâmico!',
      };
    }

    if (isSql) {
      return {
        question: `Em relação ao comando ou conceito "${title}" em SQL:`,
        options: [
          `Permite consultar, filtrar, inserir ou manipular registros organizados em tabelas.`,
          `Serve para desenhar animações na tela do usuário.`,
          `É usado para compilar arquivos JavaScript.`,
          `Substitui o protocolo TCP/IP da internet.`,
        ],
        correctIndex: 0,
        tip: 'SQL é a linguagem universal de gerenciamento de dados relacionais!',
      };
    }

    return {
      question: `Qual é o objetivo central do elemento "${title}" nesta aula?`,
      options: [
        `Compreender e aplicar corretamente a sintaxe recomendada e suas boas práticas.`,
        `Memorizar termos sem entender a função prática do código.`,
        `Desativar todas as funcionalidades do projeto.`,
        `Usar apenas uma única vez na vida de desenvolvedor.`,
      ],
      correctIndex: 0,
      tip: 'Entender o propósito e a aplicação prática do elemento é a chave do sucesso!',
    };
  }, [lesson, module]);

  // Handle Challenge Answer
  const handleAnswerChallenge = (index: number) => {
    if (challengeAnswered) return;
    setSelectedOption(index);
    setChallengeAnswered(true);

    if (index === challenge.correctIndex) {
      setChallengeCorrect(true);
      playSuccessSound();
    } else {
      setChallengeCorrect(false);
      if (playErrorSound) playErrorSound();
    }
  };

  // Complete lesson celebration
  const handleFinishLesson = () => {
    if (!isCompleted) {
      playCompleteSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#ffc800', '#1cb0f6', '#ff9600', '#ce82ff'],
      });
      onCompleteLesson(lesson.id, 25);
    }
  };

  // Step Progress Calculation (1 to 5)
  const stepsList: LessonStep[] = ['concept', 'syntax', 'interactive', 'challenge', 'complete'];
  const stepIndex = stepsList.indexOf(currentStep);
  const progressPercent = Math.round(((stepIndex + 1) / stepsList.length) * 100);

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep === 'concept') setCurrentStep('syntax');
    else if (currentStep === 'syntax') setCurrentStep('interactive');
    else if (currentStep === 'interactive') setCurrentStep('challenge');
    else if (currentStep === 'challenge') {
      setCurrentStep('complete');
      handleFinishLesson();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'syntax') setCurrentStep('concept');
    else if (currentStep === 'interactive') setCurrentStep('syntax');
    else if (currentStep === 'challenge') setCurrentStep('interactive');
    else if (currentStep === 'complete') setCurrentStep('challenge');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased">
      {/* 1. TOP HEADER (Progress, breadcrumbs, exit button) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Exit / Return to path */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition shrink-0"
            title="Sair e voltar para a trilha"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Sair da Aula</span>
          </button>

          {/* Progress Bar & Steps counter */}
          <div className="flex-1 max-w-md mx-2 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">
              <span>{module.title.split('—')[0].trim()} • Aula {lesson.number}</span>
              <span className="text-[#4f46e5] font-black">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-100">
              <div
                className="h-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* XP Reward Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>+25 XP</span>
          </div>
        </div>

        {/* Bite-Sized Step Pills (Coddy.tech format) */}
        <div className="max-w-4xl mx-auto px-4 pb-2.5 flex items-center gap-1 overflow-x-auto text-[11px] font-extrabold text-gray-500">
          <button
            onClick={() => setCurrentStep('concept')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 shrink-0 ${
              currentStep === 'concept'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>1. Teoria</span>
          </button>

          <button
            onClick={() => setCurrentStep('syntax')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 shrink-0 ${
              currentStep === 'syntax'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>2. Anatomia</span>
          </button>

          <button
            onClick={() => setCurrentStep('interactive')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 shrink-0 ${
              currentStep === 'interactive'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>3. Prática Ao Vivo</span>
          </button>

          <button
            onClick={() => setCurrentStep('challenge')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 shrink-0 ${
              currentStep === 'challenge'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>4. Micro-Desafio</span>
          </button>

          <button
            onClick={() => setCurrentStep('complete')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 shrink-0 ${
              currentStep === 'complete'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>5. Conclusão</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BITE-SIZED LESSON BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28">
        {/* STEP 1: CONCEITO & TEORIA DO ELEMENTO (Coddy format) */}
        {currentStep === 'concept' && (
          <div className="space-y-6 animate-fade-in">
            {/* Element Title Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-[#4f46e5] font-black text-xs uppercase tracking-wider">
                Elemento / Conceito #{lesson.number}
              </span>
              <span className="text-xs text-gray-400 font-bold">
                {module.title}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {lesson.title}
            </h1>

            {/* Daily Life Analogy Card */}
            {lesson.analogy && (
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center shrink-0 text-amber-600 mt-1">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm uppercase text-amber-900 tracking-wide mb-1">
                    Como imaginar no dia a dia:
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                    {lesson.analogy}
                  </p>
                </div>
              </div>
            )}

            {/* Clear Explanation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm uppercase tracking-wide">
                <BookOpen className="w-4 h-4" />
                <span>O que você precisa saber sobre este elemento:</span>
              </div>
              <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed whitespace-pre-line">
                {lesson.explanation}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ANATOMIA E SINTAXE DO ELEMENTO */}
        {currentStep === 'syntax' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-[#4f46e5] font-black text-xs uppercase tracking-wider">
                Anatomia & Sintaxe
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
                Como escrever: {lesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                Observe a estrutura exata, propriedades e convenções recomendadas pelo padrão oficial.
              </p>
            </div>

            {/* Code Syntax Block */}
            <div className="bg-[#1e1e1e] rounded-3xl border-2 border-gray-800 overflow-hidden shadow-xl">
              <div className="bg-[#2d2d2d] px-5 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Sintaxe Recomendada</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-xl bg-gray-700 hover:bg-gray-600 text-xs text-gray-200 font-bold transition flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <pre className="p-5 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono text-green-400 leading-relaxed selection:bg-cyan-900 selection:text-white">
                <code>{lesson.codeExample}</code>
              </pre>
            </div>

            {/* Golden tip highlight */}
            {lesson.goldenTip && (
              <div className="p-5 bg-indigo-50/80 rounded-3xl border-2 border-indigo-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-200/60 flex items-center justify-center shrink-0 text-indigo-700 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-indigo-900 uppercase tracking-wide mb-1">
                    Regra de Ouro do Elemento:
                  </h5>
                  <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                    {lesson.goldenTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: LABORATÓRIO PRÁTICO (Try It / Live Sandbox) */}
        {currentStep === 'interactive' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-black text-xs uppercase tracking-wider">
                  Laboratório Prático (Coddy Sandbox)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
                  Experimente o Código em Tempo Real
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLiveCode(lesson.codeExample);
                    setRenderedPreview(lesson.codeExample);
                  }}
                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1"
                  title="Restaurar código da aula"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
                <button
                  onClick={handleRunCode}
                  className="px-4 py-2 rounded-xl bg-[#06b6d4] text-white text-xs font-extrabold uppercase shadow-[0_3px_0_#0891b2] hover:bg-[#0891b2] active:translate-y-0.5 active:shadow-none transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Executar / Testar</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Altere os textos ou valores no editor abaixo e clique em <strong>Executar</strong> para ver o resultado na hora!
            </p>

            {/* Split Grid: Live Editor + Browser Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[380px]">
              {/* Code editor */}
              <div className="flex flex-col bg-[#1e1e1e] rounded-3xl border-2 border-gray-800 overflow-hidden shadow-md">
                <div className="bg-[#2d2d2d] px-4 py-2.5 text-xs font-mono font-bold text-gray-300 flex items-center justify-between border-b border-gray-700">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Editor da Aula</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Edição permitida</span>
                </div>
                <textarea
                  value={liveCode}
                  onChange={e => {
                    setLiveCode(e.target.value);
                    setRenderedPreview(e.target.value);
                  }}
                  className="w-full flex-1 min-h-[280px] p-4 bg-[#1e1e1e] text-green-400 font-mono text-xs sm:text-sm focus:outline-none leading-relaxed resize-none"
                  spellCheck="false"
                />
              </div>

              {/* Browser Preview Sandbox */}
              <div className="flex flex-col bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-md">
                <div className="bg-gray-100 px-4 py-2.5 text-xs font-sans font-extrabold text-gray-700 flex items-center justify-between border-b border-gray-200">
                  <span className="flex items-center gap-1.5 text-[#4f46e5]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Renderização no Navegador</span>
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-black">Ao Vivo</span>
                </div>
                <div className="w-full flex-1 bg-white min-h-[280px]">
                  <iframe
                    title="Live Lesson Sandbox"
                    srcDoc={renderedPreview}
                    sandbox="allow-scripts allow-modals"
                    className="w-full h-full min-h-[280px] border-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MICRO-DESAFIO DE FIXAÇÃO (Coddy Quiz) */}
        {currentStep === 'challenge' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-black text-xs uppercase tracking-wider">
                Micro-Desafio Interativo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
                Teste de Fixação do Elemento
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                Responda para fixar o conceito deste elemento e desbloquear sua pontuação de experiência (+25 XP).
              </p>
            </div>

            {/* Question Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 leading-snug">
                {challenge.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 mt-4">
                {challenge.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === challenge.correctIndex;

                  let buttonStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-300';
                  if (challengeAnswered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-green-50 border-green-500 text-green-900 shadow-sm';
                    } else if (isSelected) {
                      buttonStyle = 'bg-red-50 border-red-500 text-red-900 shadow-sm';
                    } else {
                      buttonStyle = 'bg-gray-50/50 border-gray-200 text-gray-400 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswerChallenge(idx)}
                      disabled={challengeAnswered}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold transition flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      {challengeAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                      {challengeAnswered && isSelected && !isCorrect && (
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert after answer */}
              {challengeAnswered && (
                <div
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold mt-4 animate-fade-in ${
                    challengeCorrect
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {challengeCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-black text-sm uppercase">Excelente! Resposta Correta!</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                        <span className="font-black text-sm uppercase">Atenção!</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs opacity-90">{challenge.tip}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: CONCLUSÃO & CELEBRAÇÃO (+25 XP) */}
        {currentStep === 'complete' && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#58cc02] to-[#22c55e] flex items-center justify-center text-white mx-auto shadow-[0_4px_0_#16a34a]">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                Aula Concluída!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2">
                Elemento Dominado com Sucesso!
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Você aprendeu o conceito, a anatomia e testou o elemento na prática.
              </p>
            </div>

            {/* XP Earned celebration card */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl border-2 border-amber-200 shadow-sm flex items-center justify-around">
              <div className="text-center">
                <span className="block text-2xl font-black text-amber-600">+25 XP</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Experiência</span>
              </div>
              <div className="h-10 w-px bg-amber-200" />
              <div className="text-center">
                <span className="block text-2xl font-black text-indigo-600">100%</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Precisão</span>
              </div>
              <div className="h-10 w-px bg-amber-200" />
              <div className="text-center">
                <span className="block text-2xl font-black text-green-600">Dominado</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Status</span>
              </div>
            </div>

            {/* Next Lesson or Path buttons */}
            <div className="space-y-3 pt-2">
              {hasNextLesson && onNextLesson ? (
                <button
                  type="button"
                  onClick={onNextLesson}
                  className="w-full py-4 px-6 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm uppercase tracking-wide shadow-[0_4px_0_#16a34a] hover:bg-[#4ade80] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2"
                >
                  <span>Avançar para a Próxima Aula</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-gray-900 text-white font-extrabold text-xs uppercase tracking-wide hover:bg-gray-800 transition shadow-sm"
              >
                Voltar para a Trilha
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM STICKY NAVIGATION BAR (Duolingo / Coddy 3D style) */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back Step */}
          {currentStep !== 'concept' && currentStep !== 'complete' ? (
            <button
              onClick={handlePrevStep}
              className="px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-xs font-black text-gray-700 hover:bg-gray-100 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Passo Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {/* Continue / Next Step button */}
          {currentStep !== 'complete' ? (
            <button
              onClick={handleNextStep}
              disabled={currentStep === 'challenge' && !challengeAnswered}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#4f46e5] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-1 active:shadow-none transition disabled:opacity-40 flex items-center gap-2"
            >
              <span>{currentStep === 'challenge' ? 'Ver Resultado' : 'Continuar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            hasNextLesson && onNextLesson && (
              <button
                onClick={onNextLesson}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#58cc02] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#16a34a] hover:bg-[#4ade80] active:translate-y-1 active:shadow-none transition flex items-center gap-2"
              >
                <span>Próxima Aula</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </footer>
    </div>
  );
};
