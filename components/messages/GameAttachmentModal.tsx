import React, { useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { Game } from '../../types';

interface GameAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (game: Game) => void;
}

const GameAttachmentModal: React.FC<GameAttachmentModalProps> = ({ isOpen, onClose, onSelect }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { games } = context;

  const handleSelect = (game: Game) => {
    onSelect(game);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4">Attach a Game</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {games.map(game => (
            <button key={game.id} onClick={() => handleSelect(game)} className="text-left bg-[var(--bg-glass)] rounded-lg overflow-hidden group hover:border-[var(--accent-primary)] border border-transparent transition-all">
              <img src={game.thumbnail} alt={game.title} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{game.title}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{game.playCount.toLocaleString()} plays</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </Modal>
  );
};

export default GameAttachmentModal;