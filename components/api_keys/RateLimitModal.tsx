import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { ZapOffIcon } from '../icons/Icons';
import type { ApiProvider, ApiKeyTier } from '../../types';

interface RateLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    providers: ApiProvider[];
    onUpdate: (providerId: string, tierId: string, updates: Partial<ApiKeyTier>) => void;
}

interface LimitsState {
    [key: string]: {
        rpm: string;
        tpm: string;
    }
}

const RateLimitModal: React.FC<RateLimitModalProps> = ({ isOpen, onClose, providers, onUpdate }) => {
    const [limits, setLimits] = useState<LimitsState>({});

    const connectedTiers = useMemo(() => {
        return providers.flatMap(p => 
            p.tiers
                .filter(t => t.status === 'connected')
                .map(t => ({ ...t, providerId: p.id, providerName: p.name, providerIcon: p.icon }))
        );
    }, [providers]);

    useEffect(() => {
        if (isOpen) {
            const initialLimits = connectedTiers.reduce((acc, tier) => {
                acc[tier.id] = {
                    rpm: String(tier.rateLimitRpm),
                    tpm: String(tier.rateLimitTpm),
                };
                return acc;
            }, {} as LimitsState);
            setLimits(initialLimits);
        }
    }, [isOpen, connectedTiers]);

    const handleLimitChange = (tierId: string, type: 'rpm' | 'tpm', value: string) => {
        setLimits(prev => ({
            ...prev,
            [tierId]: {
                ...prev[tierId],
                [type]: value,
            }
        }));
    };

    const handleSave = () => {
        for (const tierId in limits) {
            const originalTier = connectedTiers.find(t => t.id === tierId);
            const newLimits = limits[tierId];

            if (originalTier) {
                const newRpm = parseInt(newLimits.rpm, 10);
                const newTpm = parseInt(newLimits.tpm, 10);
                
                const updates: Partial<ApiKeyTier> = {};
                if (!isNaN(newRpm) && newRpm !== originalTier.rateLimitRpm) {
                    updates.rateLimitRpm = newRpm;
                }
                if (!isNaN(newTpm) && newTpm !== originalTier.rateLimitTpm) {
                    updates.rateLimitTpm = newTpm;
                }
                
                if (Object.keys(updates).length > 0) {
                    onUpdate(originalTier.providerId, originalTier.id, updates);
                }
            }
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
            <Card className="!bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3 mb-6">
                    <ZapOffIcon className="w-8 h-8 text-[var(--accent-secondary)]" />
                    <div>
                        <h2 className="text-xl font-bold">Rate Limit Management</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Adjust request and token limits for each service tier.</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {connectedTiers.map(tier => (
                        <div key={tier.id} className="p-3 bg-[var(--bg-glass)] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <tier.providerIcon className="w-5 h-5"/>
                                <h3 className="font-semibold">{tier.providerName} - {tier.name}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Requests / Minute</label>
                                    <input 
                                        type="number" 
                                        value={limits[tier.id]?.rpm || ''}
                                        onChange={(e) => handleLimitChange(tier.id, 'rpm', e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Tokens / Minute</label>
                                    <input 
                                        type="number" 
                                        value={limits[tier.id]?.tpm || ''}
                                        onChange={(e) => handleLimitChange(tier.id, 'tpm', e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
                        Save Changes
                    </button>
                </div>

            </Card>
        </Modal>
    );
};

export default RateLimitModal;