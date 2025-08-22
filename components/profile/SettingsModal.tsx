import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import ToggleSwitch from '../ui/ToggleSwitch';
import type { NotificationSettings, PrivacySettings } from '../../types';
import UpdateAccountFieldModal from './UpdateAccountFieldModal';
import TwoFactorAuthModal from './TwoFactorAuthModal';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-6 border-b border-[var(--border-color)] last:border-b-0">
    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingRow: React.FC<{ label: string; description: string; control: React.ReactNode }> = ({ label, description, control }) => (
   <div className="flex items-center justify-between">
    <div>
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
    {control}
  </div>
);

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  
  // State for child modals
  const [modalToOpen, setModalToOpen] = useState<'name' | 'email' | 'password' | null>(null);
  const [is2FAModalOpen, set2FAModalOpen] = useState(false);
  
  // Local state for editable fields
  const [localBio, setLocalBio] = useState('');
  const [localCss, setLocalCss] = useState('');
  
  // State for save operation
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!context) return null;

  const {
    currentUser,
    setCurrentUser,
    notificationSettings,
    setNotificationSettings,
    privacySettings,
    setPrivacySettings,
    openCustomThemeEditor,
  } = context;

  // Effect to populate local state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalBio(currentUser.bio || '');
      setLocalCss(currentUser.customCss || '');
      setSaveSuccess(false);
    }
  }, [isOpen, currentUser.bio, currentUser.customCss]);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings({ ...privacySettings, [key]: value });
  };
  
  const handleOpenThemeEditor = () => {
    onClose(); // Close settings modal
    openCustomThemeEditor(); // Open theme editor
  };
  
  const handleSaveField = (field: 'name' | 'email', value: string) => {
    setCurrentUser({ [field]: value });
  };

  const handlePasswordSave = (oldPass: string, newPass: string) => {
    console.log(`Attempting to change password from "${oldPass}" to "${newPass}"`);
    alert("Password updated successfully (mocked).");
  };

  const handle2FAToggle = (enabled: boolean) => {
    if (enabled) {
      set2FAModalOpen(true);
    } else {
      if (window.confirm('Are you sure you want to disable Two-Factor Authentication? This will reduce your account security.')) {
        setCurrentUser({ isTwoFactorEnabled: false });
      }
    }
  };

  const handle2FAEnableSuccess = () => {
    setCurrentUser({ isTwoFactorEnabled: true });
    set2FAModalOpen(false);
  };
  
  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (!local || !domain || local.length < 2) return email;
    return `${local.substring(0, 1)}***@${domain}`;
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await setCurrentUser({ 
        bio: localBio,
        customCss: localCss 
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000); // Reset success state after 2s
    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = (currentUser.bio || '') !== localBio || (currentUser.customCss || '') !== localCss;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
        <Card className="!p-0 !bg-[var(--bg-secondary)]">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-[var(--text-secondary)]">Manage your account and preferences.</p>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <Section title="Account">
              <SettingRow label="Display Name" description={currentUser.name} control={<button onClick={() => setModalToOpen('name')} className="px-4 py-1 text-sm font-semibold border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors">Change</button>} />
              <SettingRow label="Email" description={maskEmail(currentUser.email)} control={<button onClick={() => setModalToOpen('email')} className="px-4 py-1 text-sm font-semibold border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors">Change</button>} />
              <SettingRow label="Password" description="Last changed 1 year ago" control={<button onClick={() => setModalToOpen('password')} className="px-4 py-1 text-sm font-semibold border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors">Change</button>} />
              <div className="pt-4 border-t border-[var(--border-color)]">
                <label htmlFor="bio-textarea" className="font-semibold text-[var(--text-primary)]">Bio</label>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-2">
                    A short description about yourself that will appear on your profile.
                </p>
                <textarea
                    id="bio-textarea"
                    className="w-full h-24 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all text-sm resize-y"
                    value={localBio}
                    onChange={(e) => setLocalBio(e.target.value)}
                    maxLength={160}
                    placeholder="Tell the world about yourself..."
                />
              </div>
            </Section>

            <Section title="Notifications">
              <SettingRow label="Likes" description="When someone likes your post" control={<ToggleSwitch enabled={notificationSettings.likes} onChange={() => handleNotificationChange('likes')} />} />
              <SettingRow label="Comments" description="When someone replies to your post" control={<ToggleSwitch enabled={notificationSettings.comments} onChange={() => handleNotificationChange('comments')} />} />
              <SettingRow label="New Followers" description="When someone starts following you" control={<ToggleSwitch enabled={notificationSettings.newFollowers} onChange={() => handleNotificationChange('newFollowers')} />} />
            </Section>

            <Section title="Privacy & Security">
              <SettingRow label="Private Account" description="Only followers can see your posts" control={<ToggleSwitch enabled={privacySettings.privateAccount} onChange={(val) => handlePrivacyChange('privateAccount', val)} />} />
              <SettingRow label="Direct Messages" description="Control who can send you DMs" control={
                <select value={privacySettings.allowDms} onChange={(e) => handlePrivacyChange('allowDms', e.target.value)} className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none">
                  <option value="everyone">Everyone</option>
                  <option value="following">People you follow</option>
                  <option value="none">No one</option>
                </select>
              } />
               <SettingRow 
                label="Two-Factor Authentication" 
                description={currentUser.isTwoFactorEnabled ? 'Enabled' : 'Disabled. Adds an extra layer of security.'} 
                control={<ToggleSwitch enabled={!!currentUser.isTwoFactorEnabled} onChange={handle2FAToggle} />} 
              />
            </Section>
            
            <Section title="Appearance">
              <SettingRow label="Customize Theme" description="Personalize the look of NEXUS" control={<button onClick={handleOpenThemeEditor} className="px-4 py-1 text-sm font-semibold border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors">Open Editor</button>} />
            </Section>

            <Section title="Profile Customization">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Custom Profile CSS</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-2">
                  Apply custom styles to your profile page. For best results, scope your selectors to <code>.user-profile-page</code>.
                </p>
                <textarea
                  className="w-full h-48 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all font-mono text-sm resize-y"
                  value={localCss}
                  onChange={(e) => setLocalCss(e.target.value)}
                  placeholder={`.user-profile-page h1 {\n  background-image: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));\n  -webkit-background-clip: text;\n  color: transparent;\n}`}
                />
                 <p className="text-xs text-[var(--text-secondary)] mt-2">
                    <strong>Warning:</strong> Invalid CSS may break your profile's appearance. Use with caution. Only CSS is supported.
                </p>
              </div>
            </Section>

          </div>
          <div className="p-6 bg-[var(--bg-glass)]/50 rounded-b-2xl flex justify-end gap-4">
              <button onClick={onClose} className="px-5 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                  Done
              </button>
              <button 
                onClick={handleSaveChanges} 
                disabled={!hasChanges || isSaving || saveSuccess}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isSaving ? 'Saving...' : (saveSuccess ? 'Saved!' : 'Save Changes')}
              </button>
          </div>
        </Card>
      </Modal>

      <UpdateAccountFieldModal
        isOpen={modalToOpen === 'name'}
        onClose={() => setModalToOpen(null)}
        fieldName="Display Name"
        currentValue={currentUser.name}
        onSave={(newValue) => handleSaveField('name', newValue)}
      />
      <UpdateAccountFieldModal
        isOpen={modalToOpen === 'email'}
        onClose={() => setModalToOpen(null)}
        fieldName="Email"
        currentValue={currentUser.email}
        onSave={(newValue) => handleSaveField('email', newValue)}
      />
        <UpdateAccountFieldModal
        isOpen={modalToOpen === 'password'}
        onClose={() => setModalToOpen(null)}
        fieldName="Password"
        currentValue="" // Not needed
        onSave={() => {}} // Not used
        onPasswordSave={handlePasswordSave}
      />
       <TwoFactorAuthModal
        isOpen={is2FAModalOpen}
        onClose={() => set2FAModalOpen(false)}
        onEnable={handle2FAEnableSuccess}
      />
    </>
  );
};

export default SettingsModal;