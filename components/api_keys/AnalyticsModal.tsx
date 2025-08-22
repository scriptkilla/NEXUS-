import React, { useMemo } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { TrendingUpIcon } from '../icons/Icons';
import type { ApiProvider } from '../../types';

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    providers: ApiProvider[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, providers }) => {

    const connectedTiers = useMemo(() => {
        return providers.flatMap(p => 
            p.tiers
                .filter(t => t.status === 'connected')
                .map(t => ({ ...t, providerName: p.name, providerIcon: p.icon }))
        );
    }, [providers]);
    
    const maxTokens = Math.max(...connectedTiers.map(s => s.tokensUsed), 1);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
            <Card className="!bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUpIcon className="w-8 h-8 text-[var(--accent-secondary)]" />
                    <div>
                        <h2 className="text-xl font-bold">Usage Analytics</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Review your API consumption for the current cycle.</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-semibold mb-3">Token Usage by Service Tier</h3>
                    <div className="space-y-2">
                        {connectedTiers.map(tier => (
                            <div key={tier.id} className="flex items-center gap-2">
                                <span className="w-36 text-sm text-[var(--text-secondary)] truncate">{tier.providerName} - {tier.name}</span>
                                <div className="flex-1 bg-[var(--bg-glass)] rounded-full h-5">
                                    <div 
                                        className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] h-5 rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white"
                                        style={{ width: `${(tier.tokensUsed / maxTokens) * 100}%`}}
                                    >
                                        {(tier.tokensUsed / 1_000_000).toFixed(2)}M
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                     <h3 className="font-semibold mb-3">Detailed Breakdown</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-2">Service</th>
                                    <th className="p-2 text-right">Requests</th>
                                    <th className="p-2 text-right">Tokens Used</th>
                                    <th className="p-2 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {connectedTiers.map(tier => (
                                    <tr key={tier.id}>
                                        <td className="p-2 flex items-center gap-2 font-semibold">
                                            <tier.providerIcon className="w-5 h-5" />
                                            {tier.providerName} ({tier.name})
                                        </td>
                                        <td className="p-2 text-right font-mono">{tier.usage.toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono">{tier.tokensUsed.toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono text-green-400">${tier.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </Card>
        </Modal>
    );
};

export default AnalyticsModal;