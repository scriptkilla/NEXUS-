import React, { useState, useContext, useEffect } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { CryptoCurrency } from '../../types';
import { SendIcon } from '../icons/Icons';

interface Asset extends CryptoCurrency {
    balance: number;
    usdValue: number;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, asset }) => {
    const context = useContext(AppContext);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAddress('');
            setAmount('');
            setIsSent(false);
        }
    }, [isOpen]);

    if (!context) return null;

    const handleSend = () => {
        const sendAmount = parseFloat(amount);
        if (!address.trim() || !sendAmount || sendAmount <= 0) return;
        if (sendAmount > asset.balance) {
            alert("Insufficient balance.");
            return;
        }
        
        context.sendCrypto(asset.symbol, sendAmount);
        setIsSent(true);
        setTimeout(() => {
            onClose();
        }, 1500);
    };
    
    const mockFee = 0.0005;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
            <Card className="!bg-[var(--bg-secondary)]">
                 <h2 className="text-xl font-bold mb-2">Send {asset.name}</h2>
                 <p className="text-sm text-[var(--text-secondary)] mb-6">Enter the amount and recipient's address below.</p>

                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Recipient Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Amount</label>
                             <span className="text-xs text-[var(--text-secondary)]">
                                Balance: {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                             </span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 pr-28 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button onClick={() => setAmount(asset.balance.toString())} className="text-xs font-semibold text-[var(--accent-primary)] mr-2 hover:underline">MAX</button>
                                <span className="text-sm font-semibold text-white/80">{asset.symbol}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-sm space-y-2 mt-6 p-3 bg-[var(--bg-glass)] rounded-lg">
                    <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Amount:</span><span>{parseFloat(amount || '0').toFixed(6)} {asset.symbol}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Network Fee (est.):</span><span>{mockFee.toFixed(6)} {asset.symbol}</span></div>
                    <div className="flex justify-between font-bold border-t border-[var(--border-color)] pt-2 mt-2"><span className="text-white">Total:</span><span>{(parseFloat(amount || '0') + mockFee).toFixed(6)} {asset.symbol}</span></div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSend}
                        disabled={!address.trim() || !amount || parseFloat(amount) <= 0 || isSent}
                        className="w-full py-3 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {isSent ? 'Sent!' : `Send ${asset.symbol}`}
                         {!isSent && <SendIcon className="w-4 h-4"/>}
                    </button>
                </div>

            </Card>
        </Modal>
    );
};

export default SendModal;