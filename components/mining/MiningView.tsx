
import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import { ZapIcon, CubeIcon, NexusIcon, UsersIcon, CopyIcon, CheckIcon, BellIcon, ChevronDownIcon } from '../icons/Icons';
import type { User } from '../../types';

// Helper to format time
const formatTimeLeft = (ms: number): string => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MiningView: React.FC = () => {
    const context = useContext(AppContext);
    
    // UI-specific state
    const [copySuccess, setCopySuccess] = useState('');
    const [isReferralListOpen, setReferralListOpen] = useState(false);
    const [pingedUsers, setPingedUsers] = useState<string[]>([]);

    if (!context) return null;
    
    const { currentUser, allUsers, mining } = context;
    const { isMining, timeLeft, sessionStats, hashRate, log, startMining, addLog } = mining;
    
    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handlePing = (userToPing: User) => {
        setPingedUsers(prev => [...prev, userToPing.id]);
        addLog(`Pinged user ${userToPing.name} to remind them to start mining.`);
        setTimeout(() => {
            setPingedUsers(p => p.filter(id => id !== userToPing.id));
        }, 2000);
    };
    
    const referralLink = `https://nexus.io/join?ref=${currentUser.referralCode}`;
    const miningBoostPercent = ((currentUser.miningBoost || 1.0) - 1.0) * 100;
    const referredUserObjects = (currentUser.referredUsers || [])
        .map(id => allUsers.find(u => u.id === id))
        .filter((u): u is User => !!u);
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                    NXG Mining Center
                </h1>
                <p className="text-[var(--text-secondary)] mt-2">Participate in the network and earn rewards through Proof-of-Contribution.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Control Panel</h2>
                        <button 
                            onClick={startMining}
                            disabled={isMining}
                            className={`w-full py-3 font-semibold text-lg rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                                isMining 
                                ? 'bg-gradient-to-r from-[var(--accent-primary)]/50 to-[var(--accent-secondary)]/50 text-white' 
                                : 'bg-green-500/80 text-white hover:bg-green-600'
                            }`}
                        >
                            {isMining ? (
                                <div className="font-mono tracking-widest">{formatTimeLeft(timeLeft)}</div>
                            ) : (
                                'Start 24-Hour Mining'
                            )}
                        </button>
                    </Card>
                    <Card>
                         <h2 className="text-xl font-bold mb-4">Session Stats</h2>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <NexusIcon className="w-6 h-6" />
                                    <span className="font-semibold">Session Earnings</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-mono font-bold text-lg text-green-400">{sessionStats.earnings.toFixed(4)}</span>
                                    <span className="font-mono text-sm text-[var(--text-secondary)]">NXG</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ZapIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                                    <span className="font-semibold">Hash Rate</span>
                                </div>
                                <span className="font-mono font-bold text-lg">{hashRate.toFixed(2)} KH/s</span>
                            </div>
                             <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CubeIcon className="w-6 h-6 text-[var(--accent-secondary)]" />
                                    <span className="font-semibold">Blocks Found</span>
                                </div>
                                <span className="font-mono font-bold text-lg">{sessionStats.blocksFound}</span>
                            </div>
                         </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Referral Program</h2>
                        <div className="space-y-4">
                            <p className="text-sm text-[var(--text-secondary)]">Invite friends and earn a permanent 10% mining boost for each successful referral!</p>
                            
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">Your Referral Code</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" readOnly value={currentUser.referralCode} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm font-mono"/>
                                    <button onClick={() => handleCopy(currentUser.referralCode, 'code')} className="p-2 bg-[var(--bg-glass)] rounded-lg hover:bg-white/10 transition-colors">
                                        {copySuccess === 'code' ? <CheckIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">Your Referral Link</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" readOnly value={referralLink} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm font-mono truncate"/>
                                    <button onClick={() => handleCopy(referralLink, 'link')} className="p-2 bg-[var(--bg-glass)] rounded-lg hover:bg-white/10 transition-colors">
                                        {copySuccess === 'link' ? <CheckIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>
                            
                             <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ZapIcon className="w-6 h-6 text-green-400" />
                                    <span className="font-semibold">Total Mining Boost</span>
                                </div>
                                <span className="font-mono font-bold text-lg text-green-400">+{miningBoostPercent.toFixed(0)}%</span>
                            </div>

                             <div className="bg-[var(--bg-secondary)] rounded-lg">
                                <button onClick={() => setReferralListOpen(p => !p)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <UsersIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                                        <span className="font-semibold">Referred Users</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-lg">{currentUser.referralCount}</span>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isReferralListOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                {isReferralListOpen && (
                                    <div className="p-3 border-t border-[var(--border-color)] space-y-2 max-h-60 overflow-y-auto">
                                        {referredUserObjects.map(user => (
                                            <div key={user.id} className="flex items-center justify-between p-2 bg-[var(--bg-glass)] rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="text-sm font-semibold">{user.name}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-2 rounded-full ${user.isMining ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                                            <p className={`text-xs ${user.isMining ? 'text-green-400' : 'text-gray-400'}`}>{user.isMining ? 'Mining' : 'Idle'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!user.isMining && (
                                                    <button 
                                                        onClick={() => handlePing(user)}
                                                        disabled={pingedUsers.includes(user.id)}
                                                        className="px-2 py-1 text-xs font-semibold rounded-md transition-all text-white/80 bg-[var(--accent-secondary)]/50 hover:bg-[var(--accent-secondary)]/80 disabled:bg-[var(--accent-secondary)] disabled:opacity-80"
                                                    >
                                                        {pingedUsers.includes(user.id) ? 'Pinged!' : <div className="flex items-center gap-1"><BellIcon className="w-3 h-3"/> Ping</div>}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                     <Card className="h-full">
                        <h2 className="text-xl font-bold mb-4">Mining Log</h2>
                        <div className="h-[calc(100%-2.5rem)] bg-[var(--bg-secondary)] rounded-lg p-4 overflow-y-auto flex flex-col-reverse font-mono text-sm">
                            {log.map((entry, i) => <p key={i} className={`animate-fade-in-down ${entry.includes('rewarded') ? 'text-green-400' : 'text-[var(--text-secondary)]'}`}>{entry}</p>)}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MiningView;
