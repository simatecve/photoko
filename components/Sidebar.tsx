import React from 'react';
import type { View } from '../types';
import { Icon } from './ui';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  imageCount: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg text-base relative ${
      isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
    }`}
  >
    <Icon name={icon} className="w-6 mr-4 text-lg" />
    <span className="font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{badge}</span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, imageCount, theme, setTheme }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/10 p-6 flex-col hidden lg:flex">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-cyan-500 p-2.5 rounded-lg shadow-lg shadow-cyan-500/20">
          <Icon name="wand-magic-sparkles" className="text-white text-xl" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">photoKo</h1>
      </div>

      <nav className="flex flex-col gap-3">
        <NavItem
          icon="layer-group"
          label="Generador de Sets"
          isActive={currentView === 'set-generator'}
          onClick={() => setCurrentView('set-generator')}
        />
         <NavItem
          icon="image"
          label="Generador Individual"
          isActive={currentView === 'single-generator'}
          onClick={() => setCurrentView('single-generator')}
        />
        <NavItem
          icon="images"
          label="Galería y Edición"
          isActive={currentView === 'gallery'}
          onClick={() => setCurrentView('gallery')}
          badge={imageCount}
        />
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 pl-2">
                Tema
            </span>
            <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} 
                className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus-ring ${theme === 'dark' ? 'bg-cyan-500' : 'bg-slate-300'}`}
            >
                <span className="sr-only">Switch theme</span>
                <Icon name="sun" className={`absolute left-1.5 text-base text-yellow-500 transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
                <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}/>
                <Icon name="moon" className={`absolute right-1.5 text-base text-white transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800/50 text-cyan-600 dark:text-cyan-400 text-xs font-mono px-3 py-1.5 rounded-md text-center">
          v1.1 — Gemini 2.5 Flash / Imagen 4
        </div>
      </div>
    </aside>
  );
};