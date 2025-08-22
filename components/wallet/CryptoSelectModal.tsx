import React from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import type { CryptoCurrency } from '../../types';

interface Asset extends CryptoCurrency {
    balance: number;
}

interface CryptoSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  assets: Asset[];
  disabledAssetId?: string;
}

const CryptoSelectModal: React.FC<CryptoSelectModalProps> = ({ isOpen, onClose, onSelect, assets, disabledAssetId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-sm">
        <Card className="!bg-[var(--bg-secondary)]">
            <h2 className="text-xl font-bold mb-4">Select a Token</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {assets.map(asset => {
                    const isDisabled = asset.id === disabledAssetId;
                    return (
                        <button
                            key={asset.id}
                            onClick={() => onSelect(asset)}
                            disabled={isDisabled}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${asset.gradient}`}>
                                    <asset.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-left">{asset.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)] text-left">{asset.symbol}</p>
                                </div>
                            </div>
                            <p className="text-sm font-mono text-right">
                                {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                            </p>
                        </button>
                    )
                })}
            </div>
        </Card>
    </Modal>
  );
};

export default CryptoSelectModal;