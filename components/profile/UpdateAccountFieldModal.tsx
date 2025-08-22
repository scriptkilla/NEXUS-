import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';

interface UpdateAccountFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: 'Display Name' | 'Email' | 'Password';
  currentValue: string;
  onSave: (newValue: string) => void;
  onPasswordSave?: (oldPass: string, newPass: string) => void;
}

const UpdateAccountFieldModal: React.FC<UpdateAccountFieldModalProps> = ({ isOpen, onClose, fieldName, currentValue, onSave, onPasswordSave }) => {
  const [value, setValue] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (fieldName !== 'Password') {
        setValue(currentValue);
      } else {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }
  }, [isOpen, currentValue, fieldName]);

  const handleSave = () => {
    if (fieldName === 'Password' && onPasswordSave) {
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match.");
            return;
        }
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        onPasswordSave(oldPassword, newPassword);
        onClose();
    } else if (fieldName !== 'Password') {
        onSave(value);
        onClose();
    }
  };

  const isPasswordForm = fieldName === 'Password';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4">Change {fieldName}</h2>
        {isPasswordForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Current Password</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{fieldName}</label>
            <input type={fieldName === 'Email' ? 'email' : 'text'} value={value} onChange={e => setValue(e.target.value)} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
            Save
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default UpdateAccountFieldModal;