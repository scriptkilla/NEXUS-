import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      onClose();
      setName('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4">Add New Wallet</h2>
        <p className="text-[var(--text-secondary)] mb-4 text-sm">Create a new, empty wallet to manage a separate set of assets.</p>
        <div>
          <label htmlFor="wallet-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Wallet Name</label>
          <input
            id="wallet-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Savings, DeFi Fund"
            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">Cancel</button>
          <button onClick={handleAdd} disabled={!name.trim()} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 disabled:opacity-50">Create Wallet</button>
        </div>
      </Card>
    </Modal>
  );
};

export default AddWalletModal;
