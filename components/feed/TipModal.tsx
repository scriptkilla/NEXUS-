
import React, { useState, useContext, useEffect } from 'react';
import type { CryptoCurrency, User } from '../../types';
import Modal from '../ui/Modal';
import { VerifiedIcon, SendIcon, CheckIcon, CopyIcon, ArrowUpRightIcon } from '../icons/Icons';
import { AppContext } from '../context/AppContext';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: CryptoCurrency;
  recipient: User;
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
        default: return 1;
    }
};

const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose, crypto, recipient }) => {
  const context = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const quickAmounts = [1, 5, 10, 25, 50, 100];

  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => {
            setIsSent(false);
            setAmount('');
            setTransactionId(null);
            setCopySuccess(false);
        }, 300); // Wait for closing animation
    }
  }, [isOpen])

  if (!context) return null;

  const { sendCrypto, activeWallet, networks } = context;

  const handleSendTip = () => {
    const tipAmount = parseFloat(amount);
    if (tipAmount > 0) {
      const currentBalance = activeWallet?.balances[crypto.symbol] || 0;
      if (tipAmount > currentBalance) {
        alert("Insufficient funds to send this tip.");
        return;
      }
      sendCrypto(crypto.symbol, tipAmount);
      setTransactionId(`tx_${Date.now()}${Math.random().toString(36).substring(2, 9)}`);
      setIsSent(true);
    }
  };
  
  const handleCopy = () => {
    if (!transactionId) return;
    navigator.clipboard.writeText(transactionId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const network = networks.find(n => n.id === crypto.networkId);
  const explorerUrl = transactionId && network?.explorerUrl ? `${network.explorerUrl}/tx/${transactionId}` : null;

  const usdValue = parseFloat(amount || '0') * getMockUsdPrice(crypto.symbol);
  const currentBalance = activeWallet?.balances[crypto.symbol] || 0;
  const hasSufficientBalance = currentBalance >= parseFloat(amount || '0');

  const getButtonText = () => {
    if (amount && !hasSufficientBalance) return "Insufficient Balance";
    return "Send Tip";
  }

  const renderForm = () => (
    <div className={`relative rounded-2xl overflow-hidden border border-[var(--border-color)]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${crypto.gradient} opacity-20`}></div>
      <div className="relative p-8 bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Send a Tip</h2>
          <p className="text-[var(--text-secondary)]">To {recipient.name} {recipient.verified && <VerifiedIcon className="inline-block" />}</p>
        </div>

        <div className="my-8 flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${crypto.gradient} mb-4 shadow-lg`}>
                <crypto.icon className="w-10 h-10 text-white" />
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-5xl font-bold bg-transparent text-white text-center w-full outline-none"
                />
                <span className="absolute top-1/2 -translate-y-1/2 -right-10 text-2xl font-semibold text-white">{crypto.symbol}</span>
            </div>
            <p className="text-[var(--text-secondary)] mt-1">~ ${usdValue.toFixed(2)} USD</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
            {quickAmounts.map(q => (
                <button 
                    key={q}
                    onClick={() => setAmount(q.toString())}
                    className="py-2 bg-[var(--bg-glass)] rounded-lg text-white font-semibold hover:bg-white/10 transition-colors"
                >
                    {q}
                </button>
            ))}
        </div>

        <button
          onClick={handleSendTip}
          disabled={!amount || parseFloat(amount) <= 0 || !hasSufficientBalance}
          className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 text-white bg-gradient-to-r ${crypto.gradient} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/20`}
        >
          {getButtonText()}
          <SendIcon />
        </button>
        <p className="text-xs text-[var(--text-secondary)] text-center mt-4">Balance: {currentBalance.toFixed(4)} {crypto.symbol} / Network Fee: ~0.001 {crypto.symbol}</p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className={`relative rounded-2xl overflow-hidden border border-[var(--border-color)]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${crypto.gradient} opacity-20`}></div>
      <div className="relative p-8 bg-[var(--bg-secondary)]/80 backdrop-blur-xl text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Tip Sent!</h2>
          
          <p className="text-4xl font-bold text-white my-6">
              {amount} {crypto.symbol}
          </p>

          <p className="text-[var(--text-secondary)]">
              Successfully sent to {recipient.name} {recipient.verified && <VerifiedIcon className="inline-block w-4 h-4" />}
          </p>

          <div className="mt-8 p-3 bg-[var(--bg-glass)] rounded-lg text-left text-sm space-y-2">
              <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Status</span>
                  <span className="flex items-center gap-1.5 font-semibold text-green-400">
                      <CheckIcon className="w-4 h-4" /> Completed
                  </span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Transaction ID</span>
                  <div className="flex items-center gap-2 font-mono">
                      <span>{transactionId?.slice(0, 6)}...{transactionId?.slice(-4)}</span>
                      <button onClick={handleCopy} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                          {copySuccess ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                      </button>
                  </div>
              </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {explorerUrl && (
                  <a 
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex-1 py-3 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                      <ArrowUpRightIcon className="w-4 h-4" /> View on Explorer
                  </a>
              )}
              <button
                  onClick={onClose}
                  className="w-full flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity"
              >
                  Done
              </button>
          </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
        {isSent ? renderSuccess() : renderForm()}
    </Modal>
  );
};

export default TipModal;
