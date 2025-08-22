import React, { useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { Game } from '../../types';
import { GamepadIcon } from '../icons/Icons';

interface GameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  games: Game[];
}

const GameRow: React.FC<{ game: Game; onCloseModal: () => void }> = ({ game, onCloseModal }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { viewGame } = context;

    const handleGameClick = () => {
        viewGame(game);
        onCloseModal();
    };

    return (
        <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors cursor-pointer"
            onClick={handleGameClick}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <img src={game.thumbnail} alt={game.title} className="w-16 h-10 object-cover rounded-md flex-shrink-0" />
                <div className="overflow-hidden">
                    <p className="font-semibold truncate">{game.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{game.playCount.toLocaleString()} Plays</p>
                </div>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); handleGameClick(); }}
                className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 bg-[var(--bg-glass)] text-[var(--text-primary)] border border-[var(--border-color)] flex items-center gap-1 flex-shrink-0"
            >
                <GamepadIcon className="w-3 h-3" /> View
            </button>
        </div>
    );
}

const GameListModal: React.FC<GameListModalProps> = ({ isOpen, onClose, title, games }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4 text-center border-b border-[var(--border-color)] pb-3">{title}</h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {games.length > 0 ? (
                games.map(game => <GameRow key={game.id} game={game} onCloseModal={onClose} />)
            ) : (
                <p className="text-center text-[var(--text-secondary)] py-8">No games to display.</p>
            )}
        </div>
      </Card>
    </Modal>
  );
};

export default GameListModal;