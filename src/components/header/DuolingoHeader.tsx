import React from 'react';
import { User } from '../../types';
import { CourseModule } from '../../data/courseData';
import {
  Smartphone,
  Settings,
  ShieldCheck,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

interface DuolingoHeaderProps {
  user: User;
  activeModule?: CourseModule | null;
  onOpenLanguageSelector?: () => void;
  canSwitchLanguage?: boolean;
  onOpenSettings: () => void;
  onOpenPWAGuide: () => void;
  isPWAInstalled: boolean;
  isPWAInstallable: boolean;
  onInstallPWA: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const DuolingoHeader: React.FC<DuolingoHeaderProps> = ({
  user,
  activeModule,
  onOpenLanguageSelector,
  onOpenSettings,
  onOpenPWAGuide,
  isPWAInstalled,
  isPWAInstallable,
  onInstallPWA,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-gray-200">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-3">
        {/* Left: Brand and Language Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <img
            src="./icon-192.png"
            alt="DevDuo Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-[0_2px_0_#1e1b4b] border border-indigo-900/30 shrink-0 ring-1 ring-white/20"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base sm:text-xl text-[#4f46e5] tracking-tight leading-none">
                DevDuo
              </span>
              {user.isAdmin ? (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black border border-amber-300 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-600" />
                  ADMIN
                </span>
              ) : null}
            </div>
            <span className="text-[9px] font-bold text-gray-400 hidden sm:block truncate">
              Curso Web Completo
            </span>
          </div>

          {/* Active Language Switcher Button */}
          {onOpenLanguageSelector && (
            <button
              onClick={onOpenLanguageSelector}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs font-black transition shadow-xs shrink-0 max-w-[110px] sm:max-w-[140px]"
              title="Alternar Linguagem ou Trilha"
            >
              <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
              <span className="truncate">
                {activeModule ? activeModule.title.split('—')[0].trim() : 'Trilhas'}
              </span>
            </button>
          )}
        </div>

        {/* Right Actions: Fits comfortably without overflowing */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gray-50 text-gray-600 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition shadow-xs"
            title={soundMuted ? 'Ativar Sons' : 'Silenciar'}
          >
            {soundMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4f46e5]" />
            )}
          </button>

          {/* PWA Install Button */}
          {!isPWAInstalled && (
            <button
              onClick={() => {
                if (isPWAInstallable) {
                  onInstallPWA();
                } else {
                  onOpenPWAGuide();
                }
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#4f46e5] text-white text-[11px] sm:text-xs font-black shadow-[0_2px_0_#3730a3] hover:bg-[#6366f1] active:translate-y-0.5 active:shadow-none transition"
              title="Instalar App"
            >
              <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden md:inline">Instalar</span>
              <span className="md:hidden">App</span>
            </button>
          )}

          {/* Profile / Settings Button */}
          <button
            onClick={onOpenSettings}
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl sm:rounded-2xl bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition shadow-xs"
            title="Configurações e Perfil"
          >
            <span className="text-xs sm:text-sm">{user.avatar || '🦊'}</span>
            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
