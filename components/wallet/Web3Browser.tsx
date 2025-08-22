import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { GlobeIcon, ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon, LockIcon, HomeIcon } from '../icons/Icons';

const FAVORITE_DAPPS = [
    { name: 'Uniswap', url: 'https://app.uniswap.org/', icon: 'https://app.uniswap.org/favicon.ico' },
    { name: 'OpenSea', url: 'https://opensea.io/', icon: 'https://opensea.io/favicon.ico' },
    { name: 'Aave', url: 'https://app.aave.com/', icon: 'https://app.aave.com/favicon.ico' },
    { name: 'Etherscan', url: 'https://etherscan.io/', icon: 'https://etherscan.io/favicon.ico' },
    { name: 'Magic Eden', url: 'https://magiceden.io/', icon: 'https://magiceden.io/favicon.ico' },
];

const Web3Browser: React.FC = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [inputUrl, setInputUrl] = useState('');
    const [iframeKey, setIframeKey] = useState(Date.now());

    const currentUrl = history[historyIndex];

    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < history.length - 1;

    const navigateTo = (url: string) => {
        let fullUrl = url.trim();
        if (!fullUrl) return;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = `https://${fullUrl}`;
        }

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(fullUrl);
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigateTo(inputUrl);
    };
    
    const handleBack = () => {
        if (canGoBack) {
            setHistoryIndex(prev => prev - 1);
        }
    };
    
    const handleForward = () => {
        if (canGoForward) {
            setHistoryIndex(prev => prev + 1);
        }
    };

    const handleRefresh = () => {
        if (currentUrl) {
            setIframeKey(Date.now());
        }
    };

    const handleHome = () => {
        setHistory([]);
        setHistoryIndex(-1);
    };
    
    useEffect(() => {
        setInputUrl(currentUrl || '');
    }, [currentUrl]);

    return (
        <Card className="!p-0 flex flex-col h-[calc(100vh-22rem)] min-h-[500px]">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 p-3 border-b border-[var(--border-color)]">
                <button onClick={handleBack} disabled={!canGoBack} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                    <ArrowLeftIcon className="w-5 h-5"/>
                </button>
                <button onClick={handleForward} disabled={!canGoForward} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                    <ArrowRightIcon className="w-5 h-5"/>
                </button>
                <button onClick={handleRefresh} disabled={!currentUrl} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] disabled:opacity-50 transition-colors">
                    <RefreshCwIcon className="w-5 h-5"/>
                </button>
                 <button onClick={handleHome} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] transition-colors">
                    <HomeIcon className="w-5 h-5"/>
                </button>
                <form onSubmit={handleFormSubmit} className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                        <LockIcon className="w-4 h-4"/>
                    </span>
                    <input 
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Search or enter website"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none"
                    />
                </form>
            </div>

            {/* Content */}
            {currentUrl ? (
                <iframe
                    key={iframeKey}
                    src={currentUrl}
                    className="flex-1 w-full h-full border-0 bg-white"
                    title="Web3 Browser"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
            ) : (
                 <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-secondary)] p-8">
                     <GlobeIcon className="w-24 h-24 text-[var(--bg-glass)] mb-6"/>
                     <h2 className="text-2xl font-bold">Web3 Browser</h2>
                     <p className="text-[var(--text-secondary)] mt-2 mb-8">Navigate to your favorite dApps or explore the decentralized web.</p>
                     
                     <div className="w-full max-w-lg">
                         <h3 className="text-sm font-semibold text-center text-[var(--text-secondary)] mb-4">FAVORITES</h3>
                         <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                             {FAVORITE_DAPPS.map(dapp => (
                                 <button key={dapp.name} onClick={() => navigateTo(dapp.url)} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[var(--bg-glass)] transition-colors text-center">
                                     <img src={dapp.icon} alt={dapp.name} className="w-10 h-10 rounded-full bg-white object-cover"/>
                                     <span className="text-xs">{dapp.name}</span>
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
            )}
        </Card>
    );
};

export default Web3Browser;
