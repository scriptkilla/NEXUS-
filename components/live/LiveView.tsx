
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { LiveStream } from '../../types';
import Card from '../ui/Card';
import { EyeIcon, VerifiedIcon } from '../icons/Icons';
import GoLiveModal from './GoLiveModal';

const StreamCard: React.FC<{ stream: LiveStream; onSelect: (stream: LiveStream) => void; }> = ({ stream, onSelect }) => (
    <div 
        onClick={() => onSelect(stream)} 
        className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20"
    >
        <div className="relative">
            <img src={stream.thumbnail} alt={stream.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold tracking-wider">LIVE</div>
            <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1.5">
                <EyeIcon className="w-4 h-4" /> {stream.viewerCount.toLocaleString()}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        <div className="p-4 flex items-start gap-3">
            <img src={stream.creator.avatar} alt={stream.creator.name} className="w-10 h-10 rounded-full mt-1" />
            <div>
                <h3 className="font-bold leading-tight group-hover:text-[var(--accent-primary)] transition-colors">{stream.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-sm text-[var(--text-secondary)]">{stream.creator.name}</p>
                    {stream.creator.verified && <VerifiedIcon className="w-4 h-4"/>}
                </div>
                 {stream.game && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 bg-[var(--bg-glass)] px-2 py-0.5 rounded-full inline-block">{stream.game.title}</p>
                )}
            </div>
        </div>
    </div>
);


const LiveView: React.FC = () => {
    const context = useContext(AppContext);
    const [isGoLiveModalOpen, setGoLiveModalOpen] = useState(false);

    if (!context) return null;
    const { liveStreams, viewStream, goLive } = context;

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                            Live on NEXUS
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2">Watch live streams, chat with creators, and explore new content.</p>
                    </div>
                    <button 
                        onClick={() => setGoLiveModalOpen(true)}
                        className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
                    >
                        Go Live
                    </button>
                </div>
                
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Recommended Channels</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {liveStreams.map(stream => (
                            <StreamCard key={stream.id} stream={stream} onSelect={viewStream} />
                        ))}
                    </div>
                    {liveStreams.length === 0 && (
                        <div className="text-center py-16 text-[var(--text-secondary)]">
                            <p className="text-lg font-semibold">It's quiet in here...</p>
                            <p>No one is currently live. Why not be the first?</p>
                        </div>
                    )}
                </Card>
            </div>
            <GoLiveModal 
                isOpen={isGoLiveModalOpen}
                onClose={() => setGoLiveModalOpen(false)}
                onGoLive={goLive}
            />
        </>
    );
};

export default LiveView;
