import React from 'react';
import type { View } from '../types';
import { Icon } from './ui';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  imageCount: number;
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
      isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <Icon name={icon} className="w-6 mr-4 text-lg" />
    <span className="font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{badge}</span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, imageCount }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-[#0F172A] border-r border-white/10 p-6 flex-col hidden lg:flex">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-cyan-500 p-2.5 rounded-lg shadow-lg shadow-cyan-500/20">
          <Icon name="wand-magic-sparkles" className="text-white text-xl" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tighter">photoKo</h1>
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

      <div className="mt-auto">
        <div className="bg-slate-800/50 text-cyan-400 text-xs font-mono px-3 py-1.5 rounded-md text-center">
          v1.1 — Gemini 2.5 Flash / Imagen 4
        </div>
      </div>
    </aside>
  );
};
