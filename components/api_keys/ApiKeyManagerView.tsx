
import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import { AddApiKeyModal } from './AddApiKeyModal';
import type { ApiProvider, ApiKeyTier } from '../../types';
import AnalyticsModal from './AnalyticsModal';
import RateLimitModal from './RateLimitModal';
import CostOptimizationModal from './CostOptimizationModal';


const ApiKeyManagerView: React.FC = () => {
  const context = useContext(AppContext);
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [tierToConnect, setTierToConnect] = useState<{ provider: ApiProvider, tier: ApiKeyTier } | null>(null);

  if (!context) return null;

  const { apiProviders, updateApiTier } = context;
  
  const handleOpenConnectModal = (provider: ApiProvider, tier: ApiKeyTier) => {
    setTierToConnect({ provider, tier });
    setIsAddKeyModalOpen(true);
  };
  
  const handleSaveKey = (apiKey: string) => {
    if (!tierToConnect) return;
    
    updateApiTier(tierToConnect.provider.id, tierToConnect.tier.id, {
      status: 'connected',
      apiKey: apiKey, // In a real app, this would be handled more securely
      usage: Math.floor(Math.random() * 500), // Mock usage on connect
      cost: Math.random() * 10
    });
    setIsAddKeyModalOpen(false);
    setTierToConnect(null);
  };

  const handleDisconnect = (providerId: string, tierId: string) => {
    updateApiTier(providerId, tierId, {
      status: 'disconnected',
      apiKey: undefined,
      usage: 0,
      cost: 0,
      tokensUsed: 0
    });
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
            LLM Management Center
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">Manage your AI provider API keys, track usage, and monitor costs.</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsAnalyticsModalOpen(true)} className="px-5 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-secondary)] hover:text-white transition-colors">Detailed Usage Analytics</button>
            <button onClick={() => setIsRateLimitModalOpen(true)} className="px-5 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-secondary)] hover:text-white transition-colors">Rate Limit Management</button>
            <button onClick={() => setIsCostModalOpen(true)} className="px-5 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-secondary)] hover:text-white transition-colors">Cost Optimization</button>
          </div>
        </Card>

        <div className="space-y-6">
          {apiProviders.map(provider => (
            <Card key={provider.id}>
              <div className="flex items-center gap-4 mb-6">
                <provider.icon className="w-10 h-10" />
                <h2 className="text-2xl font-bold">{provider.name}</h2>
              </div>
              <div className="space-y-3">
                {provider.tiers.map(tier => (
                  <div key={tier.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] gap-4">
                    <div className="flex items-center gap-3">
                       <span className={`w-2 h-2 rounded-full ${tier.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       <h3 className="font-semibold">{tier.name}</h3>
                    </div>
                    
                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:flex md:items-center gap-4 text-sm text-center">
                       <div className="flex-1">
                          <div className="text-[var(--text-secondary)] text-xs">Usage</div>
                          <div className="font-semibold">{tier.usage.toLocaleString()} / {tier.limit.toLocaleString()}</div>
                      </div>
                      <div className="flex-1">
                          <div className="text-[var(--text-secondary)] text-xs">Monthly Cost</div>
                          <div className="font-semibold">${tier.cost.toFixed(2)}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => tier.status === 'connected' ? handleDisconnect(provider.id, tier.id) : handleOpenConnectModal(provider, tier)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-full md:w-auto ${tier.status === 'connected' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'}`}>
                      {tier.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddApiKeyModal
        isOpen={isAddKeyModalOpen}
        onClose={() => setIsAddKeyModalOpen(false)}
        onSave={handleSaveKey}
        providerName={tierToConnect?.provider.name || ''}
        tierName={tierToConnect?.tier.name || ''}
        providerIcon={tierToConnect ? <tierToConnect.provider.icon className="w-6 h-6 text-[var(--text-secondary)]" /> : null}
      />
      <AnalyticsModal 
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        providers={apiProviders}
      />
      <RateLimitModal
        isOpen={isRateLimitModalOpen}
        onClose={() => setIsRateLimitModalOpen(false)}
        providers={apiProviders}
        onUpdate={updateApiTier}
      />
      <CostOptimizationModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        providers={apiProviders}
      />
    </>
  );
};

export default ApiKeyManagerView;
