
import React, { useState, useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import { Game } from '../../types';

interface GoLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoLive: (title: string, gameId?: string) => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ isOpen, onClose, onGoLive }) => {
    const context = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined);

    const createdGames = context?.games.filter(g => g.creatorId === context.currentUser.id) || [];
    
    const handleStartStream = () => {
        if (title.trim()) {
            onGoLive(title.trim(), selectedGameId);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
            <Card className="!bg-[var(--bg-secondary)]">
                <h2 className="text-xl font-bold">Go Live</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">Set up your stream and start broadcasting.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Stream Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., My First NEXUS Stream!"
                            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Playing (Optional)</label>
                        <select
                            value={selectedGameId || ''}
                            onChange={e => setSelectedGameId(e.target.value)}
                            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        >
                            <option value="">Just Chatting</option>
                            {createdGames.map(game => (
                                <option key={game.id} value={game.id}>{game.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleStartStream}
                        disabled={!title.trim()}
                        className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg disabled:opacity-50"
                    >
                        Start Streaming
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default GoLiveModal;
