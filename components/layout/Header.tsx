
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { THEMES } from '../../constants';
import type { Theme } from '../../types';
import { SunIcon, MoonIcon, ChevronDownIcon, PaintBrushIcon } from '../icons/Icons';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!context) return null;

  const { theme, setTheme, openCustomThemeEditor, setView, nxgBalance } = context;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsThemeDropdownOpen(false);
  };
  
  const isLightTheme = parseInt(theme.colors.bgPrimary.replace('#',''), 16) > 0xaaaaaa;


  return (
    <header className="sticky top-0 h-16 md:h-20 bg-[var(--bg-secondary)] backdrop-blur-lg border-b border-[var(--border-color)] flex items-center justify-end px-4 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setView('mining')}
          className="px-3 py-1.5 text-sm font-semibold bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>Mine</span>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <span className="font-mono text-[var(--accent-primary)]">{nxgBalance.toFixed(2)}</span>
            <span className="hidden sm:inline text-xs text-[var(--text-secondary)]">NXG</span>
          </div>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors"
          >
            {isLightTheme ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            <span className="hidden md:inline text-sm font-medium text-[var(--text-secondary)]">{theme.name}</span>
            <ChevronDownIcon className={`transition-transform w-4 h-4 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isThemeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-y-auto max-h-72 animate-fade-in-down z-50">
              {THEMES.map(t => (
                <button
                  key={t.name}
                  onClick={() => handleThemeChange(t)}
                  className={`w-full text-left px-4 py-2 text-sm ${t.name === theme.name && t.name !== 'Custom' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]'}`}
                >
                  {t.name}
                </button>
              ))}
               <div className="border-t border-[var(--border-color)] my-1"></div>
                <button
                  onClick={() => {
                    openCustomThemeEditor();
                    setIsThemeDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]"
                >
                  <PaintBrushIcon className="w-4 h-4" />
                  <span>Customize...</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
