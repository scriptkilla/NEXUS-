import React, { useState, useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';

const AddNetworkModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  const [network, setNetwork] = useState({
    name: '',
    rpcUrl: '',
    chainId: '',
    currencySymbol: '',
    explorerUrl: '',
  });

  if (!context) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNetwork(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (network.name && network.rpcUrl && network.chainId && network.currencySymbol) {
        context.addNetwork({
            name: network.name,
            rpcUrl: network.rpcUrl,
            chainId: parseInt(network.chainId, 10),
            currencySymbol: network.currencySymbol,
            explorerUrl: network.explorerUrl || undefined,
        });
        onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4">Add a Network</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Manually add an EVM-compatible network.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Network Name</label>
            <input type="text" name="name" value={network.name} onChange={handleChange} placeholder="e.g., Avalanche Mainnet" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New RPC URL</label>
            <input type="url" name="rpcUrl" value={network.rpcUrl} onChange={handleChange} placeholder="https://api.avax.network/ext/bc/C/rpc" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Chain ID</label>
              <input type="number" name="chainId" value={network.chainId} onChange={handleChange} placeholder="43114" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Currency Symbol</label>
              <input type="text" name="currencySymbol" value={network.currencySymbol} onChange={handleChange} placeholder="AVAX" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Block Explorer URL (Optional)</label>
            <input type="url" name="explorerUrl" value={network.explorerUrl} onChange={handleChange} placeholder="https://snowtrace.io" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">Save Network</button>
        </div>
      </Card>
    </Modal>
  );
};

export default AddNetworkModal;