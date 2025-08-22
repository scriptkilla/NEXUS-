

import React from 'react';
import type { View } from '../../types';
import { SIDEBAR_LINKS } from '../../constants';
import { NexusLogoIcon } from '../icons/Icons';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView }) => {
  return (
    <aside className="fixed bottom-0 md:top-0 left-0 h-20 md:h-full w-full md:w-64 bg-[var(--bg-secondary)] backdrop-blur-lg border-t md:border-t-0 md:border-r border-[var(--border-color)] flex md:flex-col md:py-6 z-40 transition-all duration-300">
      <div className="hidden md:flex px-6 mb-10 h-12 items-center justify-start w-full">
        <a href="#" className="flex items-center gap-3" onClick={(e) => { e.preventDefault(); setView('feed'); }}>
          <NexusLogoIcon className="h-9 w-9 text-white" />
          <span className="hidden md:block text-2xl font-bold tracking-tight text-white">
            NEXUS
          </span>
        </a>
      </div>
      <nav className="flex flex-row md:flex-col items-stretch md:items-start w-full h-full md:h-auto">
        {SIDEBAR_LINKS.map((link) => (
          <button
            key={link.name}
            onClick={() => setView(link.view)}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start flex-1 md:flex-none text-center md:text-left md:py-4 md:px-6 md:my-1 rounded-none md:rounded-lg transition-all duration-300 md:hover:translate-x-2
              ${
                activeView === link.view || 
                (activeView === 'stream_detail' && link.view === 'live') ||
                (activeView === 'video_call' && link.view === 'messages')
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white md:shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            <div className="w-6 h-6">{link.icon}</div>
            <span className="mt-1 md:mt-0 md:ml-4 font-semibold text-xs md:text-base">{link.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;