import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../ui/Card';
import { GamepadIcon, UserIcon, VerifiedIcon, ArrowLeftIcon } from '../icons/Icons';

const GameDetailView: React.FC = () => {
    const context = useContext(AppContext);
    const [playButtonText, setPlayButtonText] = useState('Play Now');
    
    const { selectedGame, allUsers, playGame, setView, viewProfile } = context || {};

    const creator = useMemo(() => {
        if (!selectedGame || !allUsers) return null;
        return allUsers.find(u => u.id === selectedGame.creatorId) || null;
    }, [selectedGame, allUsers]);
    
    if (!selectedGame) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full">
                <h2 className="text-2xl font-bold">No Game Selected</h2>
                <p className="text-[var(--text-secondary)] mt-2">Something went wrong. Please go back and select a game.</p>
                <button onClick={() => setView?.('gaming')} className="mt-4 px-4 py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
                    Back to Gaming Hub
                </button>
            </div>
        );
    }
    
    const handlePlayGame = () => {
        if (playGame && selectedGame) {
            playGame(selectedGame);
            setPlayButtonText('Launching...');
            setTimeout(() => {
                setPlayButtonText(`+0.01 NXG to ${creator?.name || 'creator'}!`);
                setTimeout(() => {
                    setPlayButtonText('Play Now');
                }, 2000);
            }, 1000);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
             <button 
                onClick={() => setView?.('gaming')} 
                className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
             >
                <ArrowLeftIcon className="w-4 h-4"/>
                Back to Gaming Hub
            </button>
            
            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden">
                <img src={selectedGame.thumbnail} alt={selectedGame.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{selectedGame.title}</h1>
                    <p className="text-lg text-white/80 mt-1 capitalize">{selectedGame.category} Game</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">About the Game</h2>
                        <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                            {selectedGame.description}
                        </p>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Creator Info</h3>
                        {creator ? (
                            <button
                                onClick={() => viewProfile?.(creator)}
                                className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors cursor-pointer w-full text-left"
                            >
                                <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <div className="flex items-center gap-1.5 font-semibold">
                                        {creator.name}
                                        {creator.verified && <VerifiedIcon />}
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">@{creator.username}</p>
                                </div>
                            </button>
                        ) : (
                             <div className="flex items-center gap-3">
                                <UserIcon className="w-12 h-12 p-3 bg-[var(--bg-glass)] rounded-full text-[var(--text-secondary)]" />
                                <div>
                                    <p className="font-semibold">Unknown Creator</p>
                                </div>
                            </div>
                        )}
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Stats</h3>
                        <div className="flex justify-between items-center text-center">
                            <div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                                    {selectedGame.playCount.toLocaleString()}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">Total Plays</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                                    #{(selectedGame.playCount % 100) + 1}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">Leaderboard Rank</p>
                            </div>
                        </div>
                    </Card>
                     <button
                        onClick={handlePlayGame}
                        className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <GamepadIcon className="w-7 h-7" />
                        {playButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameDetailView;