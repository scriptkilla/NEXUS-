import React from 'react';
import type { CryptoCurrency } from '../../types';
import { CRYPTO_CURRENCIES } from '../../constants';

interface TipDropdownProps {
  onSelect: (crypto: CryptoCurrency) => void;
}

const TipDropdown: React.FC<TipDropdownProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full mb-2 right-0 w-48 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-2xl max-h-48 overflow-y-auto animate-fade-in-up z-20">
      <div className="p-2 text-xs text-[var(--text-secondary)] font-semibold sticky top-0 bg-[var(--bg-primary)] z-10 border-b border-[var(--border-color)]">Tip with</div>
      <div className="p-1">
        {CRYPTO_CURRENCIES.map(crypto => (
          <button
            key={crypto.id}
            onClick={() => onSelect(crypto)}
            className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-colors duration-200 rounded-md"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br ${crypto.gradient} flex-shrink-0`}>
              <crypto.icon className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-sm truncate">{crypto.name}</div>
              <div className="text-xs text-[var(--text-secondary)]">{crypto.symbol}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TipDropdown;
