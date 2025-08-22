import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { QrCodeIcon, CopyIcon, CheckIcon } from '../icons/Icons';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ isOpen, onClose, onEnable }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  // In a real app, this secret would be generated securely on the backend
  const mockSecretKey = 'JBSWY3DPEHPK3PXP';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockSecretKey);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleVerify = () => {
    // Mock verification: Check if it's a 6-digit number
    if (/^\d{6}$/.test(verificationCode)) {
      onEnable();
    } else {
      setError('Please enter a valid 6-digit code from your authenticator app.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold">Set Up Two-Factor Authentication</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>

        <div className="space-y-6">
          <div className="p-4 bg-[var(--bg-glass)] rounded-xl inline-block mx-auto">
            <QrCodeIcon className="w-40 h-40 text-white" />
          </div>

          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">Can't scan? Enter this code manually:</p>
            <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-[var(--bg-glass)] rounded-lg">
                <p className="font-mono text-lg tracking-widest">{mockSecretKey}</p>
                <button onClick={handleCopy} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                    {hasCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="2fa-code" className="block text-sm font-medium text-center text-[var(--text-secondary)] mb-2">Enter the 6-digit code to verify</label>
            <input
              id="2fa-code"
              type="text"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                setError('');
              }}
              maxLength={6}
              placeholder="123456"
              className="w-full text-center text-2xl font-mono tracking-[0.5em] bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
            />
            {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleVerify} disabled={!verificationCode} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg disabled:opacity-50">
            Verify & Enable
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default TwoFactorAuthModal;