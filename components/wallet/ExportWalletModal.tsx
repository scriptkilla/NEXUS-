import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import type { Wallet } from '../../types';
import { EyeIcon, CopyIcon, CheckIcon } from '../icons/Icons';

interface ExportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: Wallet;
}

const ExportWalletModal: React.FC<ExportWalletModalProps> = ({ isOpen, onClose, wallet }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state after the modal close animation finishes
      setTimeout(() => {
        setIsRevealed(false);
        setHasCopied(false);
      }, 300);
    }
  }, [isOpen]);
  
  if (!wallet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.seedPhrase);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const seedWords = wallet.seedPhrase.split(' ');

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-2">Export Wallet: {wallet.name}</h2>
        
        {!isRevealed ? (
          <div className="text-center">
            <div className="p-4 my-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
              <h3 className="font-bold text-base mb-2">SECURITY WARNING</h3>
              <p>NEVER share your seed phrase with anyone. Anyone with this phrase can take full control of your assets. We will NEVER ask for it.</p>
            </div>
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full flex items-center justify-center gap-2 mt-4 px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <EyeIcon />
              I understand the risks, show seed phrase
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[var(--text-secondary)] mb-4 text-sm">
              Write down or copy these words in the correct order and keep them in a safe place.
            </p>
            <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--bg-glass)] rounded-lg font-mono text-center">
              {seedWords.map((word, index) => (
                <div key={index} className="text-sm">
                  <span className="text-[var(--text-secondary)] mr-2">{index + 1}.</span>
                  <span className="text-white">{word}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 mt-6 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90"
            >
              {hasCopied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy to Clipboard</>}
            </button>
          </div>
        )}
      </Card>
    </Modal>
  );
};

export default ExportWalletModal;
