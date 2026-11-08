import React from 'react';
import { User } from '../../types';
import { CourseModule } from '../../data/courseData';
import { MapPin, Globe, Code, User as UserIcon } from 'lucide-react';

export type NavTab = 'path' | 'languages' | 'editor' | 'settings';

interface DuolingoBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: User;
  activeModule?: CourseModule | null;
}

export const DuolingoBottomNav: React.FC<DuolingoBottomNavProps> = ({
  activeTab,
  onTabChange,
  user,
  activeModule,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-3 sm:px-8 py-2">
      <div className="max-w-xl mx-auto flex items-center justify-around gap-2">
        {/* Tab 1: Trilha (Aprender) */}
        <button
          onClick={() => onTabChange('path')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'path'
              ? 'text-[#4f46e5] font-black scale-105'
              : 'text-gray-400 hover:text-gray-600 font-bold'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === 'path'
                ? 'bg-indigo-50 border-2 border-indigo-200 text-[#4f46e5] shadow-xs'
                : 'hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-extrabold">Trilha</span>
        </button>

        {/* Tab 2: Linguagens (Trocar Trilha) */}
        <button
          onClick={() => onTabChange('languages')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all relative ${
            activeTab === 'languages'
              ? 'text-[#4f46e5] font-black scale-105'
              : 'text-gray-400 hover:text-gray-600 font-bold'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === 'languages'
                ? 'bg-indigo-50 border-2 border-indigo-200 text-[#4f46e5] shadow-xs'
                : 'hover:bg-gray-100'
            }`}
          >
            <Globe className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[75px] font-extrabold">
            {activeModule ? activeModule.title.split('—')[0].trim() : 'Linguagens'}
          </span>
          {activeModule && (
            <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </button>

        {/* Tab 3: Editor Prático de Código */}
        <button
          onClick={() => onTabChange('editor')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'editor'
              ? 'text-[#06b6d4] font-black scale-105'
              : 'text-gray-400 hover:text-gray-600 font-bold'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === 'editor'
                ? 'bg-cyan-50 border-2 border-cyan-200 text-[#06b6d4] shadow-xs'
                : 'hover:bg-gray-100'
            }`}
          >
            <Code className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-extrabold">Editor</span>
        </button>

        {/* Tab 4: Perfil / Configurações */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'text-[#4f46e5] font-black scale-105'
              : 'text-gray-400 hover:text-gray-600 font-bold'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-50 border-2 border-indigo-200 text-[#4f46e5] shadow-xs'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-lg leading-none">{user.avatar || '🦊'}</span>
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[65px] font-extrabold">
            {user.isAdmin ? 'Admin' : 'Perfil'}
          </span>
        </button>
      </div>
    </nav>
  );
};
