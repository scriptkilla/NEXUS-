import React, { useState, useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { User } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToReport: User;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, userToReport }) => {
  const context = useContext(AppContext)!;
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  
  const reportReasons = [
      'Spam',
      'Harassment or hate speech',
      'Impersonation',
      'Posting inappropriate content',
      'Other'
  ];

  const handleSubmitReport = () => {
    if (!reason) {
        alert('Please select a reason for the report.');
        return;
    }
    context.reportUser(userToReport.id, reason, details);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
        <Card className="!bg-[var(--bg-secondary)]">
            <h2 className="text-xl font-bold">Report @{userToReport.username}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">Your report is anonymous. What is the issue?</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Reason</label>
                    <select value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all">
                        <option value="" disabled>Select a reason...</option>
                        {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Additional details (optional)</label>
                     <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-24 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all text-sm resize-y"
                        placeholder={`Provide more information about why you are reporting this user...`}
                    />
                </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmitReport} disabled={!reason} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                Submit Report
              </button>
            </div>
        </Card>
    </Modal>
  );
};

export default ReportModal;