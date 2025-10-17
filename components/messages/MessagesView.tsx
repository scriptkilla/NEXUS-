

import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../ui/Card';
import { type Conversation, type User, type Game, type CryptoCurrency } from '../../types';
import { VideoIcon, PhoneIcon, MessageSquareIcon, ArrowLeftIcon, SendIcon, GiftIcon, PaperclipIcon, XIcon, ImageIcon, GamepadIcon } from '../icons/Icons';
import TipModal from '../feed/TipModal';
import GameAttachmentModal from './GameAttachmentModal';
import TipDropdown from '../feed/TipDropdown';

// Sub-component for the conversation list
const ConversationList: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { conversations, currentUser, selectConversation, selectedConversation } = context;

    return (
        <div className="h-full overflow-y-auto">
            {conversations.map(convo => {
                const otherParticipant = convo.participants.find(p => p.id !== currentUser.id);
                if (!otherParticipant) return null;

                const lastMessage = convo.messages[convo.messages.length - 1];
                const isSelected = selectedConversation?.id === convo.id;

                return (
                    <button
                        key={convo.id}
                        onClick={() => selectConversation(convo.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${isSelected ? 'bg-[var(--bg-glass)]' : 'hover:bg-[var(--bg-glass)]'}`}
                    >
                        <div className="relative flex-shrink-0">
                            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full" />
                            {convo.unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-[var(--accent-primary)] text-white text-[10px] flex items-center justify-center font-bold">
                                    {convo.unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)] truncate">{lastMessage?.content || 'No messages yet'}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

// Sub-component for the main chat window
const ChatWindow: React.FC = () => {
    const context = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [isTipModalOpen, setTipModalOpen] = useState(false);
    const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
    const [attachmentPreview, setAttachmentPreview] = useState<{ type: 'image', url: string } | { type: 'game', game: Game } | null>(null);
    const [isGameModalOpen, setGameModalOpen] = useState(false);
    const [selectedCryptoForTip, setSelectedCryptoForTip] = useState<CryptoCurrency | null>(null);
    const [isTipDropdownOpen, setTipDropdownOpen] = useState(false);
    
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const tipButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [context?.selectedConversation?.messages]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
                setAttachmentMenuOpen(false);
            }
            if (tipButtonRef.current && !tipButtonRef.current.contains(event.target as Node)) {
                setTipDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!context) return null;
    const { selectedConversation, currentUser, sendMessage, startCall, selectConversation, games } = context;

    if (!selectedConversation) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <MessageSquareIcon className="w-24 h-24 text-[var(--bg-glass)]" />
                <h2 className="mt-4 text-2xl font-bold">Your Messages</h2>
                <p className="mt-2 text-[var(--text-secondary)]">Select a conversation to start chatting.</p>
            </div>
        );
    }
    
    const otherParticipant = selectedConversation.participants.find(p => p.id !== currentUser.id) as User;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() || attachmentPreview) {
            let attachmentPayload;
            if (attachmentPreview) {
                if (attachmentPreview.type === 'image') {
                    attachmentPayload = { type: 'image' as const, url: attachmentPreview.url };
                } else {
                    attachmentPayload = { type: 'game' as const, gameId: attachmentPreview.game.id };
                }
            }
            sendMessage(selectedConversation.id, message, attachmentPayload);
            setMessage('');
            setAttachmentPreview(null);
            if(imageInputRef.current) imageInputRef.current.value = "";
        }
    };
    
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setAttachmentPreview({ type: 'image', url: fileUrl });
            setAttachmentMenuOpen(false);
        }
    };

    const handleGameSelect = (game: Game) => {
        setAttachmentPreview({ type: 'game', game: game });
        setGameModalOpen(false);
        setAttachmentMenuOpen(false);
    };

    const handleTipSelect = (crypto: CryptoCurrency) => {
        setSelectedCryptoForTip(crypto);
        setTipModalOpen(true);
        setTipDropdownOpen(false);
    };

    return (
        <>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3 min-w-0">
                        <button onClick={() => selectConversation(null)} className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] flex-shrink-0">
                            <ArrowLeftIcon />
                        </button>
                        <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <h2 className="font-bold text-lg truncate">{otherParticipant.name}</h2>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map(msg => {
                        const isOwnMessage = msg.senderId === currentUser.id;
                        const sender = isOwnMessage ? currentUser : otherParticipant;
                        const gameAttachment = msg.type === 'game' ? games.find(g => g.id === msg.attachedGameId) : null;

                        return (
                            <div key={msg.id} className={`flex items-start gap-3 ${isOwnMessage ? 'justify-end' : ''}`}>
                                {!isOwnMessage && <img src={sender.avatar} className="w-8 h-8 rounded-full" alt={sender.name} />}
                                <div className={`max-w-xs md:max-w-md ${isOwnMessage ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white' : 'bg-[var(--bg-glass)]'} rounded-2xl overflow-hidden`}>
                                    {msg.type === 'image' && msg.attachmentUrl && <img src={msg.attachmentUrl} alt="attachment" className="w-full" />}
                                    {msg.type === 'game' && gameAttachment && (
                                        <div className="p-3">
                                            <img src={gameAttachment.thumbnail} alt={gameAttachment.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                                            <h4 className="font-bold">{gameAttachment.title}</h4>
                                        </div>
                                    )}
                                    {msg.content && <p className="text-sm p-3">{msg.content}</p>}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--border-color)]">
                    {attachmentPreview && (
                        <div className="relative mb-2 p-2 bg-[var(--bg-glass)] rounded-lg">
                            <button onClick={() => setAttachmentPreview(null)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"><XIcon className="w-4 h-4" /></button>
                            {attachmentPreview.type === 'image' ? (
                                <img src={attachmentPreview.url} alt="preview" className="w-20 h-20 object-cover rounded-md" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <img src={attachmentPreview.game.thumbnail} alt={attachmentPreview.game.title} className="w-12 h-12 object-cover rounded-md"/>
                                    <div>
                                        <p className="text-sm font-semibold">{attachmentPreview.game.title}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Game Attachment</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder={attachmentPreview ? "Add a caption..." : "Type a message..."}
                            className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-full px-5 pr-14 py-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() && !attachmentPreview}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                    
                    <div className="flex items-center gap-2 mt-3 pl-1">
                        <div className="relative" ref={attachmentRef}>
                            <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*,video/*" className="hidden" />
                            <button
                                onClick={() => setAttachmentMenuOpen(p => !p)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--text-secondary)] bg-[var(--bg-glass)] border border-[var(--border-color)] hover:text-white hover:border-white/50 transition-colors"
                                title="Add Attachment"
                            >
                                <PaperclipIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold">Attach</span>
                            </button>
                            {attachmentMenuOpen && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-2xl z-20 animate-fade-in-up">
                                    <button onClick={() => imageInputRef.current?.click()} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-glass)]">
                                        <ImageIcon className="w-4 h-4" /> Photo or Video
                                    </button>
                                    <button onClick={() => { setAttachmentMenuOpen(false); setGameModalOpen(true); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-glass)]">
                                        <GamepadIcon className="w-4 h-4" /> Game
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={tipButtonRef}>
                            <button
                                onClick={() => setTipDropdownOpen(p => !p)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--text-secondary)] bg-[var(--bg-glass)] border border-[var(--border-color)] hover:text-yellow-500 hover:border-yellow-500/50 transition-colors"
                                title="Send a Tip"
                                aria-label="Send a Tip"
                            >
                                <GiftIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold">Tip</span>
                            </button>
                            {isTipDropdownOpen && <TipDropdown onSelect={handleTipSelect} />}
                        </div>
                        <button
                            onClick={() => startCall(selectedConversation)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-green-400 bg-[var(--bg-glass)] border border-green-400/50 hover:bg-green-400/10 transition-colors"
                            title="Start Video Call"
                            aria-label="Start Video Call"
                        >
                            <VideoIcon className="w-4 h-4" />
                            <span className="text-xs font-semibold">Video</span>
                        </button>
                        <button
                            onClick={() => startCall(selectedConversation)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-400 bg-[var(--bg-glass)] border border-blue-400/50 hover:bg-blue-400/10 transition-colors"
                            title="Start Voice Call"
                            aria-label="Start Voice Call"
                        >
                            <PhoneIcon className="w-4 h-4" />
                            <span className="text-xs font-semibold">Call</span>
                        </button>
                    </div>
                </div>
            </div>
            {selectedCryptoForTip && <TipModal
                isOpen={isTipModalOpen}
                onClose={() => setTipModalOpen(false)}
                crypto={selectedCryptoForTip}
                recipient={otherParticipant}
            />}
            <GameAttachmentModal
                isOpen={isGameModalOpen}
                onClose={() => setGameModalOpen(false)}
                onSelect={handleGameSelect}
            />
        </>
    );
};


const MessagesView: React.FC = () => {
    const context = useContext(AppContext);
    const { selectedConversation } = context || {};

    // For mobile, show chat window if a conversation is selected
    const showChatOnMobile = !!selectedConversation;
    return (
        <Card className="!p-0 h-[calc(100vh-120px)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full">
                 {/* List View */}
                <div className={`${showChatOnMobile ? 'hidden' : 'block'} md:block md:col-span-1 xl:col-span-1 border-r border-[var(--border-color)] h-full`}>
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <h1 className="text-xl font-bold">Messages</h1>
                    </div>
                    <ConversationList />
                </div>
                {/* Chat Window */}
                <div className={`${showChatOnMobile ? 'block' : 'hidden'} md:block col-span-1 md:col-span-2 xl:col-span-3 h-full`}>
                    <ChatWindow />
                </div>
            </div>
        </Card>
    );
};

export default MessagesView;