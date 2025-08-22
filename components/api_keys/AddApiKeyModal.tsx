import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';

interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  providerName: string;
  tierName: string;
  providerIcon: React.ReactNode;
}

export const AddApiKeyModal: React.FC<AddApiKeyModalProps> = ({ isOpen, onClose, onSave, providerName, tierName, providerIcon }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey) {
      onSave(apiKey);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-1">Connect to {providerName}</h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">Enter the API Key for the <span className="font-semibold text-white">{tierName}</span> tier.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">API Key</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {providerIcon}
              </span>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 pl-11 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={apiKey.trim() === ''}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
        </div>
      </Card>
    </Modal>
  );
};