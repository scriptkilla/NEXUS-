

import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../ui/Card';
import { VerifiedIcon, EyeIcon, ArrowLeftIcon, GiftIcon, SendIcon } from '../icons/Icons';
import type { User, LiveStream } from '../../types';
import TipModal from '../feed/TipModal';
import { CRYPTO_CURRENCIES } from '../../constants';

interface ChatMessage {
    user: User;
    text: string;
}

export const StreamDetailView: React.FC = () => {
    const context = useContext(AppContext);
    const [isTipModalOpen, setTipModalOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { selectedStream, currentUser, allUsers, setView, viewProfile } = context || {};

    useEffect(() => {
        if (selectedStream) {
            // Mock initial chat messages
            const mockUsers = allUsers?.filter(u => u.id !== selectedStream.creator.id).slice(0, 3) || [];
            if (mockUsers.length > 0) {
                setMessages([
                    { user: mockUsers[0], text: 'This stream is awesome!' },
                    { user: mockUsers[1], text: `Let's gooo ${selectedStream.creator.name}!` },
                    { user: mockUsers[2], text: 'What game is this?' },
                ]);
            }
        }
    }, [selectedStream, allUsers]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!selectedStream || !currentUser) {
        return (
            <div className="text-center p-8">
                <p>Stream not found or still loading...</p>
                <button onClick={() => setView?.('live')} className="mt-4 px-4 py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
                    Back to Live Hub
                </button>
            </div>
        );
    }
    
    const nxgCurrency = CRYPTO_CURRENCIES.find(c => c.symbol === 'NXG') || CRYPTO_CURRENCIES[0];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages(prev => [...prev, { user: currentUser, text: newMessage }]);
            setNewMessage('');
        }
    };
    
    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <button onClick={() => setView?.('live')} className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-4 h-4"/>
                    Back to Live
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div className="lg:col-span-2 xl:col-span-3">
                        {/* Mock Video Player */}
                        <div className="aspect-video bg-[var(--bg-secondary)] rounded-2xl relative overflow-hidden flex items-center justify-center">
                            <img src={selectedStream.thumbnail} alt="Live stream" className="w-full h-full object-cover blur-sm scale-110"/>
                             <div className="absolute inset-0 bg-black/40"></div>
                            <p className="absolute text-2xl font-bold text-white/50">-- MOCK VIDEO PLAYER --</p>
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold tracking-wider animate-pulse">LIVE</div>
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                                <EyeIcon className="w-4 h-4" /> {selectedStream.viewerCount.toLocaleString()}
                            </div>
                        </div>

                        {/* Stream Info */}
                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <img src={selectedStream.creator.avatar} alt={selectedStream.creator.name} className="w-16 h-16 rounded-full"/>
                                <div>
                                    <h1 className="text-2xl font-bold">{selectedStream.title}</h1>
                                    <div className="flex items-center gap-2 text-sm mt-1">
                                        <button onClick={() => viewProfile?.(selectedStream.creator)} className="font-semibold hover:underline">{selectedStream.creator.name}</button>
                                        {selectedStream.creator.verified && <VerifiedIcon />}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setTipModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg hover:scale-105 transition-transform">
                                <GiftIcon className="w-5 h-5"/>
                                Tip Creator
                            </button>
                        </div>
                    </div>

                    {/* Chat */}
                    <Card className="lg:col-span-1 xl:col-span-1 !p-0 flex flex-col h-[70vh] lg:h-[80vh] max-h-[500px] lg:max-h-[800px]">
                        <h2 className="text-lg font-bold p-4 border-b border-[var(--border-color)] flex-shrink-0">Live Chat</h2>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-2.5">
                                    <img src={msg.user.avatar} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="text-xs text-[var(--text-secondary)]">{msg.user.name}</p>
                                        <p className="text-sm bg-[var(--bg-glass)] px-3 py-2 rounded-lg mt-0.5 inline-block">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-color)] flex-shrink-0 flex gap-2">
                             <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Send a message..."
                                className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                            />
                            <button type="submit" className="p-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg text-white disabled:opacity-50" disabled={!newMessage.trim()}>
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
            
            <TipModal
                isOpen={isTipModalOpen}
                onClose={() => setTipModalOpen(false)}
                crypto={nxgCurrency}
                recipient={selectedStream.creator}
            />
        </>
    );
};
