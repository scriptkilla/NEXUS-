import React, { useMemo } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { LightbulbIcon, DollarSignIcon, TrendingUpIcon, CheckIcon } from '../icons/Icons';
import type { ApiProvider } from '../../types';

interface CostOptimizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    providers: ApiProvider[];
}

interface Recommendation {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const CostOptimizationModal: React.FC<CostOptimizationModalProps> = ({ isOpen, onClose, providers }) => {
    
    const recommendations = useMemo((): Recommendation[] => {
        const recs: Recommendation[] = [];
        const connectedTiers = providers.flatMap(p => 
            p.tiers
                .filter(t => t.status === 'connected')
                .map(t => ({ ...t, providerName: p.name }))
        );

        connectedTiers.forEach(tier => {
            // Recommendation for high cost
            if (tier.cost > 20) {
                recs.push({
                    title: `Review ${tier.providerName} (${tier.name}) Costs`,
                    description: `This service has a high monthly cost of $${tier.cost.toFixed(2)}. Consider using a more cost-effective model or setting stricter rate limits.`,
                    icon: <DollarSignIcon />,
                    color: 'yellow'
                });
            }

            // Recommendation for low usage
            if (tier.usage < tier.limit * 0.1 && tier.cost > 0) {
                recs.push({
                    title: `Underutilized ${tier.providerName} (${tier.name}) Key`,
                    description: `This service is using less than 10% of its request limit. You may be able to downgrade to a cheaper plan or use a free tier.`,
                    icon: <TrendingUpIcon className="transform -rotate-45" />,
                    color: 'blue'
                });
            }

            // Recommendation for approaching limit
            if (tier.usage > tier.limit * 0.8) {
                 recs.push({
                    title: `${tier.providerName} (${tier.name}) Approaching Limit`,
                    description: `You have used over 80% of your request limit. Consider upgrading your plan soon to avoid service interruptions.`,
                    icon: <TrendingUpIcon />,
                    color: 'red'
                });
            }
        });
        
        if (recs.length === 0) {
            recs.push({
                title: 'All Systems Optimized',
                description: 'No immediate cost-saving opportunities found. Your API usage appears to be well-managed.',
                icon: <CheckIcon />,
                color: 'green'
            });
        }

        return recs;
    }, [providers]);

    const colors = {
        yellow: 'border-yellow-500/50 text-yellow-300',
        blue: 'border-blue-500/50 text-blue-300',
        red: 'border-red-500/50 text-red-300',
        green: 'border-green-500/50 text-green-300',
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
            <Card className="!bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3 mb-6">
                    <LightbulbIcon className="w-8 h-8 text-[var(--accent-secondary)]" />
                    <div>
                        <h2 className="text-xl font-bold">Cost Optimization</h2>
                        <p className="text-sm text-[var(--text-secondary)]">AI-powered recommendations to help you save on API costs.</p>
                    </div>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {recommendations.map((rec, index) => (
                        <div key={index} className={`flex items-start gap-4 p-4 rounded-lg bg-[var(--bg-glass)] border ${colors[rec.color as keyof typeof colors]}`}>
                            <div className="w-6 h-6 flex-shrink-0 mt-1">
                                {rec.icon}
                            </div>
                            <div>
                                <h3 className="font-bold">{rec.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{rec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-8 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
                        Got It
                    </button>
                </div>

            </Card>
        </Modal>
    );
};

export default CostOptimizationModal;