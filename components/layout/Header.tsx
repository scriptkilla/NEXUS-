

import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { THEMES } from '../../constants';
import type { Theme, Post, Game, User } from '../../types';
import { SunIcon, MoonIcon, ChevronDownIcon, PaintBrushIcon, SearchIcon, NexusLogoIcon } from '../icons/Icons';
import SearchPreview from '../search/SearchPreview';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  if (!context) return null;

  const { theme, setTheme, openCustomThemeEditor, setView, nxgBalance, searchQuery, setSearchQuery, viewProfile, viewGame, viewPost } = context;

  // Click outside handler for theme dropdown and search preview
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
       if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsThemeDropdownOpen(false);
  };
  
  const isLightTheme = parseInt(theme.colors.bgPrimary.replace('#',''), 16) > 0xaaaaaa;

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Keep search open to see results, can be dismissed manually
  };
  
  const handleResultClick = (action: () => void) => {
    action();
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  const handleUserClick = (user: User) => handleResultClick(() => viewProfile(user));
  const handlePostClick = (post: Post) => handleResultClick(() => viewPost(post));
  const handleGameClick = (game: Game) => handleResultClick(() => viewGame(game));
  const handleHashtagClick = (tag: string) => {
      setSearchQuery(tag);
      setIsSearchFocused(false);
  };

  if (isMobileSearchOpen) {
    return (
       <header className="sticky top-0 h-16 md:h-20 bg-[var(--bg-secondary)] backdrop-blur-lg border-b border-[var(--border-color)] flex items-center justify-between w-full px-4 z-30 gap-2 md:hidden">
        <div ref={searchContainerRef} className="relative w-full">
            <form onSubmit={handleMobileSearchSubmit} className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                </span>
                <input
                    ref={mobileSearchInputRef}
                    type="search"
                    placeholder="Search NEXUS..."
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                />
            </form>
            {isSearchFocused && searchQuery && (
                 <SearchPreview 
                    onUserClick={handleUserClick}
                    onPostClick={handlePostClick}
                    onGameClick={handleGameClick}
                    onHashtagClick={handleHashtagClick}
                />
            )}
        </div>
        <button onClick={() => setMobileSearchOpen(false)} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors">
            Cancel
        </button>
       </header>
    );
  }

  return (
    <header className="sticky top-0 h-16 md:h-20 bg-[var(--bg-secondary)] backdrop-blur-lg border-b border-[var(--border-color)] flex items-center justify-between w-full px-4 z-30 gap-4">
      
      {/* Mobile Logo & Desktop Spacer */}
      <div className="flex-shrink-0">
        <button onClick={() => setView('feed')} aria-label="Go to feed" className="md:hidden">
            <NexusLogoIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Desktop Search Bar */}
      <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-2xl mx-auto relative">
        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-[var(--text-secondary)]" />
          </span>
          <input
            type="search"
            placeholder="Search NEXUS..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
          />
        </form>
        {isSearchFocused && searchQuery && (
            <SearchPreview 
                onUserClick={handleUserClick}
                onPostClick={handlePostClick}
                onGameClick={handleGameClick}
                onHashtagClick={handleHashtagClick}
            />
        )}
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button onClick={() => setMobileSearchOpen(true)} className="p-2 md:hidden rounded-lg bg-[var(--bg-glass)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
        </button>

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
        
        <div className="relative" ref={themeDropdownRef}>
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