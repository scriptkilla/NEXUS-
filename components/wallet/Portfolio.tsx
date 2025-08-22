import React, { useContext, useMemo, useState } from 'react';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { CryptoCurrency } from '../../types';
import AddCoinModal from './AddCoinModal';
import AddNetworkModal from './AddNetworkModal';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import { PlusIcon, ServerIcon, KeyIcon } from '../icons/Icons';

interface Asset extends CryptoCurrency {
    balance: number;
    usdValue: number;
}

const Portfolio: React.FC = () => {
    const context = useContext(AppContext);
    const [isAddCoinModalOpen, setAddCoinModalOpen] = useState(false);
    const [isAddNetworkModalOpen, setAddNetworkModalOpen] = useState(false);
    const [isSendModalOpen, setSendModalOpen] = useState(false);
    const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const getMockUsdPrice = (symbol: string): number => {
        switch (symbol.toLowerCase()) {
            case 'nxg': return 1;
            case 'btc': return 60000;
            case 'eth': return 3000;
            case 'sol': return 150;
            case 'usdc': return 1;
            case 'egld': return 45;
            case 'ltc': return 100;
            case 'trx': return 0.06;
            default: return 0.01; // Mock price for custom tokens
        }
    };
    
    if (!context) return null;
    const { activeWallet, knownCurrencies } = context;

    const assets = useMemo((): Asset[] => {
        if (!activeWallet) return [];

        return Object.entries(activeWallet.balances).map(([symbol, balance]: [string, number]) => {
            const cryptoDetails = knownCurrencies.find(c => c.symbol === symbol);
            return {
                ...(cryptoDetails || { 
                    id: symbol, 
                    name: symbol, 
                    symbol, 
                    icon: KeyIcon, 
                    gradient: 'from-gray-500 to-gray-700' 
                }),
                balance,
                usdValue: balance * getMockUsdPrice(symbol),
            };
        }) as Asset[];
    }, [activeWallet, knownCurrencies]);

    const handleOpenSend = (asset: Asset) => {
        setSelectedAsset(asset);
        setSendModalOpen(true);
    };

    const handleOpenReceive = (asset: Asset) => {
        setSelectedAsset(asset);
        setReceiveModalOpen(true);
    };

  return (
    <>
      <Card>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Assets</h2>
              <div className="flex gap-2">
                  <button onClick={() => setAddCoinModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                      <PlusIcon className="w-4 h-4" />
                      Add Coin
                  </button>
                  <button onClick={() => setAddNetworkModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                      <ServerIcon className="w-4 h-4" />
                      Add Network
                  </button>
              </div>
          </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-color)]">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Asset</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Balance</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">USD Value</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${asset.gradient}`}>
                              <asset.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[var(--text-primary)]">{asset.name}</div>
                              <div className="text-sm text-[var(--text-secondary)]">{asset.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--text-primary)]">{asset.balance.toLocaleString('en-US', {maximumFractionDigits: 6})} {asset.symbol}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--text-primary)]">$ {asset.usdValue.toLocaleString('en-US', {maximumFractionDigits: 2})}</div>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenSend(asset)} className="px-3 py-1 text-xs font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md hover:border-red-500/50 hover:text-red-400 transition-colors">Send</button>
                                <button onClick={() => handleOpenReceive(asset)} className="px-3 py-1 text-xs font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md hover:border-green-500/50 hover:text-green-400 transition-colors">Receive</button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <AddCoinModal isOpen={isAddCoinModalOpen} onClose={() => setAddCoinModalOpen(false)} />
      <AddNetworkModal isOpen={isAddNetworkModalOpen} onClose={() => setAddNetworkModalOpen(false)} />
      
      {selectedAsset && (
          <>
            <SendModal isOpen={isSendModalOpen} onClose={() => setSendModalOpen(false)} asset={selectedAsset} />
            <ReceiveModal isOpen={isReceiveModalOpen} onClose={() => setReceiveModalOpen(false)} asset={selectedAsset} />
          </>
      )}
    </>
  );
};

export default Portfolio;