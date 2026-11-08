import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Download,
  Share,
  PlusSquare,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface PWATutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onDirectInstall: () => void;
}

type OSTab = 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'firefox';

export const PWATutorialModal: React.FC<PWATutorialModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onDirectInstall,
}) => {
  const [selectedOS, setSelectedOS] = useState<OSTab>('android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl tracking-tight">
                Como Instalar o App (PWA)
              </h3>
              <p className="text-xs text-indigo-100 font-medium">
                Estude offline e acesse direto da sua tela inicial ou desktop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Direct Install Banner if browser supports it */}
        {!isInstalled && isInstallable && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Seu navegador é compatível com instalação em 1 clique!</span>
            </div>
            <button
              onClick={onDirectInstall}
              className="px-4 py-2 rounded-xl bg-[#4f46e5] text-white text-xs font-black shadow-[0_2px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-0.5 active:shadow-none transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Agora</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="p-3 bg-blue-50 border-b border-blue-200 text-center text-xs font-bold text-blue-800">
            🎉 O aplicativo já está instalado neste dispositivo!
          </div>
        )}

        {/* OS Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50 px-3 py-2 overflow-x-auto shrink-0 text-xs font-black">
          <button
            onClick={() => setSelectedOS('android')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ${
              selectedOS === 'android' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🤖 Android (Chrome)
          </button>
          <button
            onClick={() => setSelectedOS('ios')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ml-1.5 ${
              selectedOS === 'ios' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍏 iOS (Safari)
          </button>
          <button
            onClick={() => setSelectedOS('windows')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ml-1.5 ${
              selectedOS === 'windows' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            💻 Windows (Chrome/Edge)
          </button>
          <button
            onClick={() => setSelectedOS('mac')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ml-1.5 ${
              selectedOS === 'mac' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍎 macOS (Chrome/Safari)
          </button>
          <button
            onClick={() => setSelectedOS('linux')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ml-1.5 ${
              selectedOS === 'linux' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🐧 Linux
          </button>
          <button
            onClick={() => setSelectedOS('firefox')}
            className={`px-3 py-2 rounded-xl transition shrink-0 ml-1.5 ${
              selectedOS === 'firefox' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🦊 Firefox
          </button>
        </div>

        {/* Instructions Content per OS */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-gray-700">
          {selectedOS === 'android' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                Android — Google Chrome
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <p>Abra este curso no <strong>Google Chrome</strong> do seu celular Android.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <p>Toque no menu <strong>(⋮)</strong> localizado no canto superior direito do navegador.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <p>Escolha a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <p>Confirme. O ícone do <strong>DevDuo</strong> aparecerá na sua tela inicial como um app nativo!</p>
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'ios' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                iPhone / iPad — Apple Safari
              </h4>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900">
                ⚠️ No iOS, a Apple exige o uso do <strong>Safari</strong> para adicionar à tela inicial.
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <p>Abra o curso no <strong>Safari</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <p>Toque no botão de <strong>Compartilhar</strong> (ícone de um quadrado com uma seta para cima na barra inferior).</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <p>Role a lista de ações para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> (ícone +).</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <p>Toque em <strong>Adicionar</strong> no canto superior. Pronto! O app abrirá em tela cheia sem as barras do navegador.</p>
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'windows' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                Windows (PC) — Google Chrome ou Microsoft Edge
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <p>Abra o site no <strong>Chrome</strong> ou no <strong>Microsoft Edge</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <p>Na barra de endereço, clique no ícone de instalação <strong>(⊕ ou computador com seta)</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <p>Ou vá no Menu <strong>(⋮)</strong> → <strong>"Instalar Curso Web Completo..."</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-xs sm:text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <p>Confirme. O app aparecerá no Menu Iniciar e você poderá fixá-lo na barra de tarefas!</p>
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'mac' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                macOS — Chrome ou Safari
              </h4>
              <div className="space-y-3">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm font-medium">
                  <strong className="block text-gray-900 font-black mb-1">No Google Chrome:</strong>
                  Abra o menu (⋮) → "Instalar DevDuo Curso Web..." ou clique no ícone de instalação na barra de URL. O atalho irá para a pasta Aplicativos e para o Launchpad.
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm font-medium">
                  <strong className="block text-gray-900 font-black mb-1">No Safari (macOS Sonoma ou superior):</strong>
                  Vá no menu superior <strong>Arquivo</strong> → clique em <strong>"Adicionar ao Dock"</strong>. O site virará um app independente no seu Dock.
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                Linux — Chrome e Firefox
              </h4>
              <div className="space-y-3 text-xs sm:text-sm font-medium">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <strong className="block text-gray-900 font-black mb-1">Chrome / Chromium:</strong>
                  Menu ⋮ → "Instalar Curso Web Completo..." ou ícone na barra de endereços. O atalho é criado no lançador de aplicativos do sistema.
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <strong className="block text-gray-900 font-black mb-1">Firefox no Linux:</strong>
                  Use o ícone de instalação na barra de URL ou use o recurso de atalho web do gerenciador de janelas.
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'firefox' && (
            <div className="space-y-4">
              <h4 className="font-black text-base text-gray-800">
                Firefox em Geral
              </h4>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm font-medium space-y-2">
                <p>1. Abra o curso no Firefox.</p>
                <p>2. Clique no ícone de "Instalar" na barra de endereço (se disponível) ou no menu de opções.</p>
                <p>3. O progresso continua 100% salvo no armazenamento local do navegador.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Progresso offline salvo no seu dispositivo.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-black hover:bg-gray-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
