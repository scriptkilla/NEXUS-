
import React, { useState, useContext } from 'react';
import Portfolio from './Portfolio';
import Swap from './Swap';
import TransactionHistory from './TransactionHistory';
import AddWalletModal from './AddWalletModal';
import ExportWalletModal from './ExportWalletModal';
import { AppContext } from '../context/AppContext';
import { PlusCircleIcon, DownloadIcon, ChevronDownIcon, WalletIcon, GlobeIcon } from '../icons/Icons';
import Web3Browser from './Web3Browser';

const WalletView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'swap' | 'transactions' | 'browser'>('portfolio');
  const context = useContext(AppContext);
  const [isAddWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const [isExportWalletModalOpen, setExportWalletModalOpen] = useState(false);

  if (!context) return null;
  const { wallets, activeWallet, setActiveWalletId, addWallet } = context;
  
  const handleAddWallet = (name: string) => {
    addWallet(name);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
              Crypto Wallet
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">Manage your assets and trade seamlessly across chains.</p>
          </div>
           <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                  <select
                      onChange={e => setActiveWalletId(e.target.value)}
                      value={activeWallet?.id || ''}
                      className="appearance-none w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none transition-all cursor-pointer"
                  >
                      {wallets.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
              </div>
              <button onClick={() => setAddWalletModalOpen(true)} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" title="Add Wallet">
                  <PlusCircleIcon className="w-5 h-5" />
              </button>
              <button onClick={() => setExportWalletModalOpen(true)} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" title="Export Wallet">
                  <DownloadIcon className="w-5 h-5" />
              </button>
          </div>
      </div>


      <div className="flex border-b border-[var(--border-color)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-shrink-0 px-4 sm:px-6 py-3 font-semibold transition-colors ${activeTab === 'portfolio' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('swap')}
          className={`flex-shrink-0 px-4 sm:px-6 py-3 font-semibold transition-colors ${activeTab === 'swap' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          Swap (DEX)
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-shrink-0 px-4 sm:px-6 py-3 font-semibold transition-colors ${activeTab === 'transactions' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('browser')}
          className={`flex-shrink-0 px-4 sm:px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'browser' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          <GlobeIcon className="w-5 h-5"/>
          Web3 Browser
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'swap' && <Swap />}
        {activeTab === 'transactions' && <TransactionHistory />}
        {activeTab === 'browser' && <Web3Browser />}
      </div>
      
      <AddWalletModal isOpen={isAddWalletModalOpen} onClose={() => setAddWalletModalOpen(false)} onAdd={handleAddWallet} />
      <ExportWalletModal isOpen={isExportWalletModalOpen} onClose={() => setExportWalletModalOpen(false)} wallet={activeWallet} />
    </div>
  );
};

export default WalletView;
