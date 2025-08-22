import React, { useContext, useMemo } from 'react';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { Game } from '../../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => (
  <div 
    onClick={() => onSelect(game)}
    className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20"
  >
    <div className="relative">
      <img src={game.thumbnail} className="w-full h-40 object-cover" alt={game.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-2 left-3 text-white">
        <h3 className="font-bold text-lg">{game.title}</h3>
      </div>
    </div>
    <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
      <p className="text-sm text-[var(--text-secondary)] mt-1 flex-grow">{game.description}</p>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(game);
        }}
        className="mt-4 w-full py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity"
      >
        View Game
      </button>
    </div>
  </div>
);


const GamingView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { games, viewGame } = context;

  const { p2eGames, p2pGames } = useMemo(() => {
    const p2e = games.filter(g => g.category === 'p2e') || [];
    const p2p = games.filter(g => g.category === 'p2p') || [];
    return { p2eGames: p2e, p2pGames: p2p };
  }, [games]);

  const ongoingTournaments = p2pGames.slice(0, 3).map(g => ({
      name: `${g.title} Championship`,
      prizePool: (g.playCount * 5.23).toFixed(0)
  }));


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
          Gaming Hub
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Play-to-Earn, compete in tournaments, and discover new user-created games.</p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Featured P2E Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {p2eGames.slice(0, 4).map(game => (
            <GameCard key={game.id} game={game} onSelect={viewGame} />
          ))}
        </div>
      </Card>

       <Card>
        <h2 className="text-2xl font-bold mb-4">Competitive P2P Arenas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {p2pGames.slice(0, 4).map(game => (
            <GameCard key={game.id} game={game} onSelect={viewGame} />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Ongoing Tournaments</h2>
        <div className="space-y-4">
          {ongoingTournaments.map(tournament => (
            <div key={tournament.name} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div>
                <h3 className="font-bold">{tournament.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">Prize Pool: {tournament.prizePool} NXG</p>
              </div>
              <button className="px-4 py-2 text-sm font-semibold border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-colors">
                View
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GamingView;