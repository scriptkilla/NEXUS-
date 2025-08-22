import React, { useState, useContext, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import type { CryptoCurrency } from '../../types';
import { ArrowDownIcon, SwapIcon, KeyIcon } from '../icons/Icons';
import { AppContext } from '../context/AppContext';
import CryptoSelectModal from './CryptoSelectModal';

interface Asset extends CryptoCurrency {
    balance: number;
}

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
        default: return 0.01;
    }
};

const CryptoSelectButton: React.FC<{ selected?: Asset; onClick: () => void }> = ({ selected, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-glass)] transition-colors">
        {selected ? (
            <>
                <selected.icon className="w-6 h-6" />
                <span className="font-bold text-lg">{selected.symbol}</span>
            </>
        ) : (
            <span className="font-semibold text-lg">Select</span>
        )}
        <ArrowDownIcon className="w-5 h-5" />
    </button>
);

const Swap: React.FC = () => {
    const context = useContext(AppContext);
    
    const assetsWithBalances = useMemo((): Asset[] => {
        if (!context || !context.activeWallet) return [];
        const { activeWallet, knownCurrencies } = context;

        return Object.entries(activeWallet.balances).map(([symbol, balance]) => {
            const cryptoDetails = knownCurrencies.find(c => c.symbol === symbol);
            return {
                ...(cryptoDetails || { 
                    id: symbol, name: symbol, symbol, 
                    icon: KeyIcon, gradient: 'from-gray-500 to-gray-700' 
                }),
                balance,
            };
        }) as Asset[];
    }, [context]);

    const [fromCrypto, setFromCrypto] = useState<Asset | undefined>(assetsWithBalances.find(a => a.symbol === 'ETH') || assetsWithBalances[1]);
    const [toCrypto, setToCrypto] = useState<Asset | undefined>(assetsWithBalances.find(a => a.symbol === 'NXG') || assetsWithBalances[0]);
    
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');

    const [isSelectingFor, setIsSelectingFor] = useState<'from' | 'to' | null>(null);

    const exchangeRate = useMemo(() => {
        if (!fromCrypto || !toCrypto) return 1;
        return getMockUsdPrice(fromCrypto.symbol) / getMockUsdPrice(toCrypto.symbol);
    }, [fromCrypto, toCrypto]);

    useEffect(() => {
        if (!isNaN(parseFloat(fromAmount))) {
            const result = parseFloat(fromAmount) * exchangeRate;
            setToAmount(result > 0 ? result.toFixed(6) : '');
        } else {
            setToAmount('');
        }
    }, [fromAmount, exchangeRate]);

    useEffect(() => {
        if (assetsWithBalances.length > 1) {
            setFromCrypto(assetsWithBalances.find(a => a.symbol === 'ETH') || assetsWithBalances[1]);
            setToCrypto(assetsWithBalances.find(a => a.symbol === 'NXG') || assetsWithBalances[0]);
        }
    }, [assetsWithBalances]);

    if (!context) return null;
    const { swapCrypto } = context;


    const handleSwapAssets = () => {
        const tempFrom = fromCrypto;
        setFromCrypto(toCrypto);
        setToCrypto(tempFrom);
    };

    const handleSelectCrypto = (crypto: Asset) => {
        if (isSelectingFor === 'from') {
            if (crypto.id === toCrypto?.id) handleSwapAssets();
            else setFromCrypto(crypto);
        } else if (isSelectingFor === 'to') {
            if (crypto.id === fromCrypto?.id) handleSwapAssets();
            else setToCrypto(crypto);
        }
        setIsSelectingFor(null);
    };

    const handleExecuteSwap = () => {
        if (!fromCrypto || !toCrypto || !fromAmount) return;
        const fromNum = parseFloat(fromAmount);
        const toNum = parseFloat(toAmount);
        swapCrypto(fromCrypto.symbol, toCrypto.symbol, fromNum, toNum);
        setFromAmount('');
        setToAmount('');
    };

    const hasSufficientBalance = fromCrypto ? fromCrypto.balance >= parseFloat(fromAmount || '0') : false;
    const isSwapDisabled = !fromAmount || !hasSufficientBalance || parseFloat(fromAmount) <= 0;
    
    if (assetsWithBalances.length < 2) {
      return (
        <div className="max-w-md mx-auto text-center text-[var(--text-secondary)]">
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-center">Swap Tokens</h2>
            <p>You need at least two different assets in your wallet to swap.</p>
          </Card>
        </div>
      )
    }

    return (
        <>
            <div className="max-w-md mx-auto">
                <Card>
                    <h2 className="text-2xl font-bold mb-6 text-center">Swap Tokens</h2>
                    
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--text-secondary)]">You Pay</span>
                            <span className="text-xs text-[var(--text-secondary)]">Balance: {fromCrypto?.balance?.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="0.0" 
                                className="text-3xl font-mono bg-transparent w-full outline-none"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                            />
                            <CryptoSelectButton selected={fromCrypto} onClick={() => setIsSelectingFor('from')} />
                        </div>
                    </div>

                    <div className="flex justify-center my-4">
                        <button onClick={handleSwapAssets} className="p-2 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-white hover:rotate-180 transition-all duration-300">
                            <SwapIcon />
                        </button>
                    </div>
                    
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--text-secondary)]">You Receive</span>
                            <span className="text-xs text-[var(--text-secondary)]">Balance: {toCrypto?.balance?.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="0.0" 
                                className="text-3xl font-mono bg-transparent w-full outline-none" 
                                value={toAmount}
                                readOnly
                            />
                            <CryptoSelectButton selected={toCrypto} onClick={() => setIsSelectingFor('to')} />
                        </div>
                    </div>

                    {fromAmount && fromCrypto && toCrypto && (
                        <div className="text-sm text-[var(--text-secondary)] mt-4 p-3 bg-[var(--bg-glass)] rounded-lg space-y-1">
                            <div className="flex justify-between">
                                <span>Price:</span>
                                <span className="font-mono">1 {fromCrypto.symbol} ≈ {exchangeRate.toFixed(4)} {toCrypto.symbol}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Slippage:</span>
                                <span className="font-mono">0.5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Network Fee:</span>
                                <span className="font-mono">~0.001 ETH</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleExecuteSwap}
                        disabled={isSwapDisabled}
                        className="mt-8 w-full py-4 font-semibold text-xl text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSwapDisabled ? (hasSufficientBalance ? 'Enter an amount' : 'Insufficient Balance') : 'Swap'}
                    </button>
                </Card>
            </div>
            
            <CryptoSelectModal 
                isOpen={!!isSelectingFor}
                onClose={() => setIsSelectingFor(null)}
                onSelect={handleSelectCrypto}
                assets={assetsWithBalances}
                disabledAssetId={isSelectingFor === 'from' ? toCrypto?.id : fromCrypto?.id}
            />
        </>
    );
};

export default Swap;
