import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Eye, Code2, Trash2 } from 'lucide-react';
import { CourseModule } from '../../data/courseData';

interface FullPageEditorProps {
  activeModule?: CourseModule | null;
}

export const FullPageEditor: React.FC<FullPageEditorProps> = ({ activeModule }) => {
  // Starts completely blank / empty as requested by user ("que n tenha nada escrito")
  const [code, setCode] = useState<string>('');
  const [renderedCode, setRenderedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<'both' | 'code' | 'preview'>('both');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode('');
    setRenderedCode('');
  };

  const handleRun = () => {
    setRenderedCode(code);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 min-h-[calc(100vh-140px)]">
      {/* Editor Top Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] flex items-center justify-center text-white shadow-[0_3px_0_#0284c7]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">
                Editor de Código
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase">
                Página Completa
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Ambiente de programação livre • Digite qualquer código HTML, CSS ou JavaScript
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Mobile Tab Switcher */}
          <div className="flex sm:hidden p-1 bg-gray-100 rounded-xl text-xs font-bold w-full justify-around mb-1">
            <button
              onClick={() => setMobileView('both')}
              className={`flex-1 py-1 rounded-lg transition ${
                mobileView === 'both' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Dividido
            </button>
            <button
              onClick={() => setMobileView('code')}
              className={`flex-1 py-1 rounded-lg transition ${
                mobileView === 'code' ? 'bg-white text-cyan-700 shadow-xs' : 'text-gray-500'
              }`}
            >
              Código
            </button>
            <button
              onClick={() => {
                setRenderedCode(code);
                setMobileView('preview');
              }}
              className={`flex-1 py-1 rounded-lg transition ${
                mobileView === 'preview' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500'
              }`}
            >
              Visualizar
            </button>
          </div>

          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold transition flex items-center gap-1.5"
            title="Limpar editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!code}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
            title="Copiar código"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={handleRun}
            className="px-4 py-2 rounded-xl bg-[#06b6d4] text-white text-xs font-extrabold uppercase tracking-wide shadow-[0_3px_0_#0891b2] hover:bg-[#0891b2] active:translate-y-0.5 active:shadow-none transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Executar Código</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Full Page Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[520px]">
        {/* Left Side: Code Editor Workspace */}
        {(mobileView === 'both' || mobileView === 'code') && (
          <div className="flex flex-col bg-[#1e1e1e] rounded-3xl border-2 border-gray-800 overflow-hidden shadow-lg min-h-[350px]">
            <div className="bg-[#2d2d2d] px-4 py-3 text-xs font-mono text-gray-300 font-bold flex items-center justify-between border-b border-gray-700">
              <span className="flex items-center gap-2 text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>Editor em Branco</span>
              </span>
              <span className="text-[11px] text-gray-400 font-normal">
                {code.length} caracteres
              </span>
            </div>

            <textarea
              value={code}
              onChange={e => {
                setCode(e.target.value);
                setRenderedCode(e.target.value);
              }}
              placeholder="Digite seu código aqui do zero..."
              className="w-full flex-1 p-5 bg-[#1e1e1e] text-green-400 font-mono text-xs sm:text-sm focus:outline-none leading-relaxed resize-none selection:bg-cyan-900 selection:text-white"
              spellCheck="false"
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        {/* Right Side: Live Browser Sandbox */}
        {(mobileView === 'both' || mobileView === 'preview') && (
          <div className="flex flex-col bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-lg min-h-[350px]">
            <div className="bg-gray-100 px-4 py-3 text-xs font-sans text-gray-700 font-extrabold flex items-center justify-between border-b border-gray-200">
              <span className="flex items-center gap-2 text-[#4f46e5]">
                <Eye className="w-4 h-4" />
                <span>Resultado no Navegador</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-black">
                Visualização ao Vivo
              </span>
            </div>

            <div className="w-full flex-1 bg-white relative">
              {renderedCode.trim() ? (
                <iframe
                  title="DevDuo Full Page Live Sandbox"
                  srcDoc={renderedCode}
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full min-h-[350px] border-none"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-600">Editor Vazio</p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Digite qualquer código HTML, estilos CSS ou scripts JS no editor ao lado para visualizar aqui em tempo real.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
