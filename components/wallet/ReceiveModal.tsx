import React, { useState, useContext, useEffect } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { CryptoCurrency } from '../../types';
import { QrCodeIcon, CopyIcon, CheckIcon } from '../icons/Icons';

interface Asset extends CryptoCurrency {
    balance: number;
    usdValue: number;
}

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, asset }) => {
    const context = useContext(AppContext);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setHasCopied(false);
        }
    }, [isOpen]);

    if (!context || !context.activeWallet) return null;

    const { address } = context.activeWallet;

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
            <Card className="!bg-[var(--bg-secondary)]">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Receive {asset.name}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Share your address to receive funds.</p>

                    <div className="p-4 bg-[var(--bg-glass)] rounded-xl inline-block">
                        <QrCodeIcon className="w-48 h-48" />
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] mt-6 mb-2">Your {asset.name} Address</p>
                    <div className="relative p-3 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg text-center">
                        <p className="font-mono text-sm break-all">{address}</p>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="w-full mt-4 py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                        {hasCopied ? 'Copied!' : 'Copy Address'}
                    </button>
                    
                    <div className="p-3 mt-6 bg-yellow-900/50 border border-yellow-500/50 rounded-lg text-yellow-300 text-xs text-left">
                        <p><strong>Important:</strong> Only send {asset.symbol} to this address. Sending any other coins may result in permanent loss.</p>
                    </div>

                </div>
            </Card>
        </Modal>
    );
};

export default ReceiveModal;