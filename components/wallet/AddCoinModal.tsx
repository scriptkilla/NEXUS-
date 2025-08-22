import React, { useState, useMemo, useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { CryptoCurrency, Network } from '../../types';
import { KeyIcon } from '../icons/Icons';

const AddCoinModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);
    const [mode, setMode] = useState<'search' | 'custom'>('search');
    const [searchQuery, setSearchQuery] = useState('');

    const [customCoin, setCustomCoin] = useState({
        networkId: '',
        contractAddress: '',
        name: '',
        symbol: '',
    });

    if (!context) return null;
    const { activeWallet, knownCurrencies, networks, addKnownCoinToWallet, addCustomCoin } = context;

    const availableToAdd = useMemo(() => {
        if (!activeWallet) return [];
        const heldSymbols = new Set(Object.keys(activeWallet.balances));
        return knownCurrencies.filter(c => 
            !heldSymbols.has(c.symbol) && 
            (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [activeWallet, knownCurrencies, searchQuery]);
    
    const handleAddKnown = (coinId: string) => {
        addKnownCoinToWallet(coinId);
        onClose();
    };

    const handleAddCustom = () => {
        if(customCoin.contractAddress && customCoin.name && customCoin.symbol && customCoin.networkId){
            addCustomCoin({
                name: customCoin.name,
                symbol: customCoin.symbol,
                contractAddress: customCoin.contractAddress,
                networkId: customCoin.networkId
            });
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
            <Card className="!bg-[var(--bg-secondary)]">
                <h2 className="text-xl font-bold mb-4">Add Coin</h2>
                
                <div className="flex p-1 rounded-lg bg-[var(--bg-glass)] mb-4">
                    <button onClick={() => setMode('search')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'search' ? 'bg-[var(--bg-secondary)] text-white shadow' : 'text-[var(--text-secondary)]'}`}>Search</button>
                    <button onClick={() => setMode('custom')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'custom' ? 'bg-[var(--bg-secondary)] text-white shadow' : 'text-[var(--text-secondary)]'}`}>Custom Coin</button>
                </div>

                {mode === 'search' ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Search by name or symbol"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 mb-4 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        />
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {availableToAdd.map(coin => (
                                <div key={coin.id} className="flex items-center justify-between p-2 bg-[var(--bg-glass)] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${coin.gradient}`}><coin.icon className="w-5 h-5 text-white" /></div>
                                        <div>
                                            <p className="font-semibold">{coin.name}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{coin.symbol}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAddKnown(coin.id)} className="px-3 py-1 text-xs font-semibold border border-[var(--border-color)] rounded-full hover:bg-[var(--bg-glass)] transition-colors">Add</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-[var(--text-secondary)]">Manually add a token. Make sure you trust the source of the token information.</p>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Network</label>
                            <select value={customCoin.networkId} onChange={e => setCustomCoin(p => ({...p, networkId: e.target.value}))} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all">
                                <option value="" disabled>Select a network</option>
                                {networks.map(net => <option key={net.id} value={net.id}>{net.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Token Contract Address</label>
                            <input type="text" placeholder="0x..." value={customCoin.contractAddress} onChange={e => setCustomCoin(p => ({...p, contractAddress: e.target.value}))} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Token Symbol</label>
                                <input type="text" placeholder="e.g., MYT" value={customCoin.symbol} onChange={e => setCustomCoin(p => ({...p, symbol: e.target.value}))} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Token Name</label>
                                <input type="text" placeholder="e.g., My Token" value={customCoin.name} onChange={e => setCustomCoin(p => ({...p, name: e.target.value}))} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"/>
                            </div>
                        </div>
                        <button onClick={handleAddCustom} className="w-full py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90">Add Custom Coin</button>
                    </div>
                )}
            </Card>
        </Modal>
    );
};

export default AddCoinModal;