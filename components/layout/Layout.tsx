
import React from 'react';
import type { View } from '../../types';
import Sidebar from './Sidebar';
import Header from './Header';
import { PlusIcon } from '../icons/Icons';

interface LayoutProps {
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
  setCreatePostModalOpen: (isOpen: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, setCreatePostModalOpen }) => {
  const handleFabClick = () => {
    setCreatePostModalOpen(true);
  };

  const showFab = !['wallet', 'apikeys', 'studio', 'mining'].includes(view);

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={view} setView={setView} />
      <main className="flex-1 flex flex-col pb-20 md:pb-0 md:pl-64">
        <Header />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
      {showFab && (
        <button
          onClick={handleFabClick}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-40 animate-fade-in-up"
          title="Create Post"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default Layout;
