import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { MOCK_TRANSACTIONS, CRYPTO_CURRENCIES } from '../../constants';
import type { Transaction, TransactionType } from '../../types';
import { ArrowUpRightIcon, ArrowDownLeftIcon, SwapIcon, ZapIcon, GiftIcon, CheckIcon, ClockIcon, XIcon, CopyIcon } from '../icons/Icons';

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
    const icons: { [key in TransactionType]: React.ReactNode } = {
        send: <ArrowUpRightIcon className="w-5 h-5 text-red-400" />,
        receive: <ArrowDownLeftIcon className="w-5 h-5 text-green-400" />,
        swap: <SwapIcon className="w-5 h-5 text-blue-400" />,
        mine: <ZapIcon className="w-5 h-5 text-yellow-400" />,
        reward: <GiftIcon className="w-5 h-5 text-pink-400" />,
    };
    return <div className="w-10 h-10 rounded-lg bg-[var(--bg-glass)] flex items-center justify-center">{icons[type]}</div>;
};

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const styles = {
        completed: 'bg-green-500/20 text-green-400',
        pending: 'bg-yellow-500/20 text-yellow-400',
        failed: 'bg-red-500/20 text-red-400',
    };
    const icons = {
        completed: <CheckIcon className="w-4 h-4" />,
        pending: <ClockIcon className="w-4 h-4" />,
        failed: <XIcon className="w-4 h-4" />,
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
};

const TransactionHistory: React.FC = () => {
    const [assetFilter, setAssetFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

    const filteredTransactions = useMemo(() => {
        return MOCK_TRANSACTIONS.filter(tx => {
            const assetMatch = assetFilter === 'all' || tx.crypto.id === assetFilter;
            const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
            return assetMatch && typeMatch;
        });
    }, [assetFilter, typeFilter]);

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-[var(--text-secondary)]">Asset</label>
                    <select
                        value={assetFilter}
                        onChange={e => setAssetFilter(e.target.value)}
                        className="w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2 focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none text-sm"
                    >
                        <option value="all">All Assets</option>
                        {CRYPTO_CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-[var(--text-secondary)]">Type</label>
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value as any)}
                        className="w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2 focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="send">Send</option>
                        <option value="receive">Receive</option>
                        <option value="swap">Swap</option>
                        <option value="mine">Mine</option>
                        <option value="reward">Reward</option>
                    </select>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {filteredTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors">
                        <div className="flex items-center gap-4">
                            <TransactionIcon type={tx.type} />
                            <div>
                                <p className="font-semibold capitalize">{tx.type} {tx.crypto.symbol}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{tx.timestamp}</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            {tx.address ? (
                                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
                                    {`${tx.address.slice(0, 6)}...${tx.address.slice(-4)}`}
                                    <button onClick={() => navigator.clipboard.writeText(tx.address)} className="hover:text-white"><CopyIcon className="w-3 h-3"/></button>
                                </div>
                            ) : (
                                <p className="text-xs text-[var(--text-secondary)] italic">Internal</p>
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <StatusBadge status={tx.status} />
                        </div>
                        <div className="text-right">
                             <p className={`font-bold font-mono ${tx.type === 'send' || tx.type === 'swap' ? 'text-red-400' : 'text-green-400'}`}>
                                {tx.type === 'send' ? '-' : '+'}
                                {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {tx.crypto.symbol}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] font-mono">
                                ${tx.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredTransactions.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-[var(--text-secondary)]">No transactions match the current filters.</p>
                </div>
            )}
        </Card>
    );
};

export default TransactionHistory;
