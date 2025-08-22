import React from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import type { Achievement } from '../../types';

interface AchievementListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  achievements: Achievement[];
}

const AchievementListModal: React.FC<AchievementListModalProps> = ({ isOpen, onClose, title, achievements }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4 text-center border-b border-[var(--border-color)] pb-3">{title}</h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {achievements.length > 0 ? (
                achievements.map(ach => (
                    <div key={ach.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors">
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                           <ach.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="font-bold">{ach.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{ach.description}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">From: <span className="font-semibold text-white/80">{ach.gameTitle}</span></p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-[var(--text-secondary)] py-8">No achievements to display.</p>
            )}
        </div>
      </Card>
    </Modal>
  );
};

export default AchievementListModal;