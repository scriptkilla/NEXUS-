

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { View, Theme, Post, NotificationSettings, PrivacySettings, User, ApiProvider, ApiKeyTier, Wallet, Network, CryptoCurrency, Game, LiveStream, CreatePostData, Conversation, MiningState, LlmService, GameEngineIntegration } from './types';
import { THEMES, TEXT_MODELS, IMAGE_VIDEO_MODELS, VOICE_AUDIO_MODELS, GAME_ENGINE_INTEGRATIONS } from './constants';
import * as api from './api';
import Layout from './components/layout/Layout';
import FeedView from './components/feed/FeedView';
import GamingView from './components/gaming/GamingView';
import { GameCreatorStudioView } from './components/studio/GameCreatorStudioView';
import WalletView from './components/wallet/WalletView';
import ApiKeyManagerView from './components/api_keys/ApiKeyManagerView';
import { ProfileView } from './components/profile/ProfileView';
import MiningView from './components/mining/MiningView';
import GameDetailView from './components/gaming/GameDetailView';
import LiveView from './components/live/LiveView';
import { StreamDetailView } from './components/live/StreamDetailView';
import MessagesView from './components/messages/MessagesView';
import VideoCallView from './components/messages/VideoCallView';
import CreatePostModal from './components/feed/CreatePostModal';
import PostDetailModal from './components/feed/PostDetailModal';
import CustomThemeModal from './components/theme/CustomThemeModal';
import { AppContext } from './components/context/AppContext';
import AuthView from './components/auth/AuthView';
import Spinner from './components/ui/Spinner';
import AssetStoreView from './components/studio/AssetStoreView';

const App: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    // UI State
    const [theme, setTheme] = useState<Theme>(THEMES[0]);
    const [isCustomThemeEditorOpen, setCustomThemeEditorOpen] = useState(false);
    const [view, setView] = useState<View>('feed');
    const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);


    // Data State
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [activeWalletId, setActiveWalletId] = useState('');
    const [networks, setNetworks] = useState<Network[]>([]);
    const [knownCurrencies, setKnownCurrencies] = useState<CryptoCurrency[]>([]);
    const [apiProviders, setApiProviders] = useState<ApiProvider[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    // New API Key Management State
    const [textModels, setTextModels] = useState<LlmService[]>(TEXT_MODELS);
    const [imageVideoModels, setImageVideoModels] = useState<LlmService[]>(IMAGE_VIDEO_MODELS);
    const [voiceAudioModels, setVoiceAudioModels] = useState<LlmService[]>(VOICE_AUDIO_MODELS);
    const [gameEngines, setGameEngines] = useState<GameEngineIntegration[]>(GAME_ENGINE_INTEGRATIONS);

    // Settings State
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ likes: true, comments: true, newFollowers: true });
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({ privateAccount: false, allowDms: 'everyone' });

    // Mining State
    const [miningEndTime, setMiningEndTime] = useState<number | null>(null);
    const [miningState, setMiningState] = useState<MiningState>({
        isMining: false,
        timeLeft: 0,
        sessionStats: { earnings: 0, blocksFound: 0 },
        log: ['Mining session initialized. Ready to start.'],
        hashRate: 0,
    });

    // Computed State
    const activeWallet = useMemo(() => wallets.find(w => w.id === activeWalletId), [wallets, activeWalletId]);
    const nxgBalance = useMemo(() => activeWallet?.balances['NXG'] || 0, [activeWallet]);
    const selectedProfile = useMemo(() => allUsers.find(u => u.id === selectedProfileId) || null, [allUsers, selectedProfileId]);
    const selectedConversation = useMemo(() => conversations.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);

    // Auth and Data Loading
    const handleAuthSuccess = useCallback((user: User) => {
        setCurrentUserState(user);
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!currentUser) return;
            try {
                const data = await api.fetchInitialData();
                setAllUsers(data.users);
                setPosts(data.posts);
                const userWallets = data.wallets.filter(w => w.userId === currentUser.id);
                setWallets(userWallets);
                if (userWallets.length > 0) {
                    setActiveWalletId(userWallets[0].id);
                }
                setGames(data.games);
                setLiveStreams(data.liveStreams);
                setNetworks(data.networks);
                setKnownCurrencies(data.currencies);
                setApiProviders(data.apiProviders);
                setConversations(data.conversations);
                setDataLoaded(true);
            } catch (error) {
                console.error("Failed to load initial data:", error);
                setDataLoaded(true); // Still allow app to render, maybe with an error state
            }
        };
        if (isAuthenticated) {
            loadInitialData();
        }
    }, [isAuthenticated, currentUser]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUserState(null);
        setDataLoaded(false);
        setView('feed');
    };

    // Callback Handlers
    const setCurrentUser = useCallback(async (updates: Partial<User>) => {
        if (!currentUser) return;
        const updatedUser = await api.updateUser(currentUser.id, updates);
        setCurrentUserState(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }, [currentUser]);

    const toggleFollow = useCallback(async (userId: string) => {
        if (!currentUser) return;
        const updatedUser = await api.toggleFollow(currentUser.id, userId);
        setCurrentUserState(updatedUser);
    }, [currentUser]);
    
    const viewProfile = useCallback((user: User) => {
        setSelectedProfileId(user.id);
        setView('profile');
    }, []);

    const viewMyProfile = useCallback(() => {
        setSelectedProfileId(null);
        setView('profile');
    }, []);

    const blockUser = useCallback(async (userId: string) => {
      if (!currentUser) return;
      const updatedUser = await api.blockUser(currentUser.id, userId);
      setCurrentUserState(updatedUser);
    }, [currentUser]);
    
    const unblockUser = useCallback(async (userId: string) => {
      if (!currentUser) return;
      const updatedUser = await api.unblockUser(currentUser.id, userId);
      setCurrentUserState(updatedUser);
    }, [currentUser]);
  
    const reportUser = useCallback(async (userId: string, reason: string, details: string) => {
      if (!currentUser) return;
      await api.reportUser(currentUser.id, userId, reason, details);
      alert('User reported. Our team will review this case.');
    }, [currentUser]);
    
    const createPost = useCallback(async (postData: CreatePostData) => {
      if (!currentUser) return;
      const newPost = await api.createPost({ ...postData, author: currentUser });
      setPosts(prev => [newPost, ...prev]);
      setCreatePostModalOpen(false);
    }, [currentUser]);
  
    const updatePost = useCallback(async (postId: string, updates: Partial<Post>) => {
        const updatedPost = await api.updatePost(postId, updates);
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    }, []);
    
    const viewPost = useCallback((post: Post | null) => {
        setSelectedPost(post);
    }, []);
  
    const addNxg = useCallback(async (amount: number) => {
        if (!activeWalletId) return;
        // Find wallet from the main state, as activeWallet might be stale in closure
        const currentWallet = wallets.find(w => w.id === activeWalletId);
        if (!currentWallet) return;

        const updatedWallet = await api.addNxg(currentWallet.id, amount);
        setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    }, [activeWalletId, wallets]);
    
    const addWallet = useCallback(async (name: string) => {
        if (!currentUser) return;
        const updatedWallets = await api.addWallet(currentUser.id, name);
        setWallets(updatedWallets);
        if (updatedWallets.length === 1) {
            setActiveWalletId(updatedWallets[0].id);
        }
    }, [currentUser]);
  
    const sendCrypto = useCallback(async (symbol: string, amount: number) => {
        if (!activeWallet) return;
        const updatedWallet = await api.sendCrypto(activeWallet.id, symbol, amount);
        setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    }, [activeWallet]);
  
    const swapCrypto = useCallback(async (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
        if (!activeWallet) return;
        const updatedWallet = await api.swapCrypto(activeWallet.id, fromSymbol, toSymbol, fromAmount, toAmount);
        setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    }, [activeWallet]);
  
    const addNetwork = useCallback(async (network: Omit<Network, 'id'>) => {
        const updatedNetworks = await api.addNetwork(network);
        setNetworks(updatedNetworks);
    }, []);
  
    const addCustomCoin = useCallback(async (coinData: Omit<CryptoCurrency, 'id' | 'icon' | 'gradient'>) => {
        const { currencies } = await api.addCustomCoin(coinData);
        setKnownCurrencies(currencies);
    }, []);
    
    const addKnownCoinToWallet = useCallback(async (coinId: string) => {
        if (!activeWallet) return;
        const updatedWallet = await api.addKnownCoinToWallet(activeWallet.id, coinId);
        setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    }, [activeWallet]);
  
    const updateApiTier = useCallback(async (providerId: string, tierId: string, updates: Partial<ApiKeyTier>) => {
        const updatedProviders = await api.updateApiTier(providerId, tierId, updates);
        setApiProviders(updatedProviders);
    }, []);
    
    const updateLlmService = useCallback((modelId: string, category: 'text' | 'image' | 'voice', updates: Partial<LlmService>) => {
        const updater = (setter: React.Dispatch<React.SetStateAction<LlmService[]>>) => {
            setter(prev => prev.map(model => model.id === modelId ? { ...model, ...updates } : model));
        };
        if (category === 'text') updater(setTextModels);
        else if (category === 'image') updater(setImageVideoModels);
        else if (category === 'voice') updater(setVoiceAudioModels);
    }, []);

    const updateGameEngine = useCallback((engineId: string, updates: Partial<GameEngineIntegration>) => {
        setGameEngines(prev => prev.map(engine => engine.id === engineId ? { ...engine, ...updates } : engine));
    }, []);

    const viewGame = useCallback((game: Game) => {
        setSelectedGame(game);
        setView('game_detail');
    }, []);
  
    const playGame = useCallback(async (game: Game) => {
        const { games: updatedGames, wallets: updatedWallets } = await api.playGame(game.id, game.creatorId);
        setGames(updatedGames);
        if (updatedWallets && currentUser) {
            const userWallets = updatedWallets.filter(w => w.userId === currentUser.id);
            setWallets(userWallets);
        }
    }, [currentUser]);
  
    const publishGame = useCallback(async (newGameData: Omit<Game, 'id' | 'creatorId' | 'playCount'>) => {
        if (!currentUser) return;
        const updatedGames = await api.publishGame(currentUser.id, newGameData);
        setGames(updatedGames);
        alert('Game published successfully!');
    }, [currentUser]);
  
    const viewStream = useCallback((stream: LiveStream) => {
        setSelectedStream(stream);
        setView('stream_detail');
    }, []);
  
    const goLive = useCallback(async (title: string, gameId?: string) => {
        if (!currentUser) return;
        const newStreams = await api.goLive(currentUser, title, gameId);
        setLiveStreams(newStreams);
        const newStream = newStreams[0];
        if (newStream) {
            viewStream(newStream);
        }
    }, [currentUser, viewStream]);
    
    const selectConversation = useCallback((conversationId: string | null) => {
        setSelectedConversationId(conversationId);
    }, []);
  
    const sendMessage = useCallback(async (
      conversationId: string, 
      content: string,
      attachment?: { type: 'image', url: string } | { type: 'game', gameId: string }
    ) => {
        if (!currentUser) return;
        const updatedConversation = await api.sendMessage(conversationId, currentUser.id, content, attachment);
        setConversations(prev => prev.map(c => c.id === conversationId ? updatedConversation : c));
    }, [currentUser]);

    // Mining Logic
    const addMiningLog = useCallback((message: string) => {
        setMiningState(prev => ({
            ...prev,
            log: [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.log].slice(0, 100)
        }));
    }, []);

    // Load mining state from localStorage on startup
    useEffect(() => {
        if (!currentUser) return;
        try {
            const storedEndTime = localStorage.getItem(`nexus-mining-endTime-${currentUser.id}`);
            const storedStats = localStorage.getItem(`nexus-mining-stats-${currentUser.id}`);
            const storedLog = localStorage.getItem(`nexus-mining-log-${currentUser.id}`);
            
            if (storedEndTime && parseInt(storedEndTime, 10) > Date.now()) {
                setMiningEndTime(parseInt(storedEndTime, 10));
                if (storedStats) {
                    const stats = JSON.parse(storedStats);
                    setMiningState(prev => ({ ...prev, sessionStats: stats }));
                }
                if (storedLog) {
                    const log = JSON.parse(storedLog);
                    setMiningState(prev => ({ ...prev, log }));
                }
                addMiningLog("Resumed previous mining session.");
            } else {
                localStorage.removeItem(`nexus-mining-endTime-${currentUser.id}`);
                localStorage.removeItem(`nexus-mining-stats-${currentUser.id}`);
                localStorage.removeItem(`nexus-mining-log-${currentUser.id}`);
            }
        } catch (e) {
            console.error("Failed to load mining state from localStorage", e);
        }
    }, [currentUser, addMiningLog]);

    // Save mining state to localStorage on change
    useEffect(() => {
        if (miningState.isMining && currentUser) {
            try {
                localStorage.setItem(`nexus-mining-stats-${currentUser.id}`, JSON.stringify(miningState.sessionStats));
                localStorage.setItem(`nexus-mining-log-${currentUser.id}`, JSON.stringify(miningState.log));
                if (miningEndTime) {
                    localStorage.setItem(`nexus-mining-endTime-${currentUser.id}`, String(miningEndTime));
                }
            } catch (e) {
                console.error("Failed to save mining state to localStorage", e);
            }
        }
    }, [miningState.sessionStats, miningState.log, miningEndTime, miningState.isMining, currentUser]);
    
    // Core mining loop
    useEffect(() => {
        let miningInterval: any = null;
        let rewardInterval: any = null;

        if (miningState.isMining && currentUser) {
            const boost = currentUser.miningBoost || 1;
            const boostPercent = (boost - 1) * 100;
            
            miningInterval = setInterval(() => {
                setMiningState(prev => ({ ...prev, hashRate: (Math.random() * 500 + 2500) * boost }));
            }, 1000);

            rewardInterval = setInterval(() => {
                const baseReward = parseFloat((Math.random() * 0.1).toFixed(4));
                const finalReward = baseReward * boost;
                
                addNxg(finalReward);
                
                setMiningState(prev => ({
                    ...prev,
                    sessionStats: {
                        earnings: prev.sessionStats.earnings + finalReward,
                        blocksFound: prev.sessionStats.blocksFound + 1
                    }
                }));

                const logMessage = `Block found! +${finalReward.toFixed(4)} NXG rewarded.`;
                const boostMessage = boostPercent > 0 ? ` (w/ +${boostPercent.toFixed(0)}% boost)` : '';
                addMiningLog(logMessage + boostMessage);

            }, 8000 + Math.random() * 4000);
        } else {
            setMiningState(prev => ({ ...prev, hashRate: 0 }));
        }

        return () => {
            if (miningInterval) clearInterval(miningInterval);
            if (rewardInterval) clearInterval(rewardInterval);
        };
    }, [miningState.isMining, currentUser, addNxg, addMiningLog]);


    // Countdown timer effect
    useEffect(() => {
        const isCurrentlyMining = miningEndTime !== null && miningEndTime > Date.now();
        setMiningState(prev => ({ ...prev, isMining: isCurrentlyMining }));

        if (!isCurrentlyMining) {
            setMiningState(prev => ({ ...prev, timeLeft: 0 }));
            return;
        }

        const interval = setInterval(() => {
            if (miningEndTime) {
                const remaining = miningEndTime - Date.now();
                if (remaining <= 0) {
                    clearInterval(interval);
                    setMiningEndTime(null);
                    if (currentUser) {
                      localStorage.removeItem(`nexus-mining-endTime-${currentUser.id}`);
                    }
                    addMiningLog('24-hour mining session has ended.');
                } else {
                    setMiningState(prev => ({ ...prev, timeLeft: remaining }));
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [miningEndTime, addMiningLog, currentUser]);


    const startMining = useCallback(() => {
        if (miningState.isMining) return;
        
        const endTime = Date.now() + 24 * 60 * 60 * 1000;
        setMiningEndTime(endTime);
        
        setMiningState(prev => ({
            ...prev,
            isMining: true,
            sessionStats: { earnings: 0, blocksFound: 0 },
            log: []
        }));
        
        addMiningLog("24-hour mining session started... Good luck!");
    }, [miningState.isMining, addMiningLog]);
  
    // Context Value
    const contextValue = useMemo(() => ({
        theme, setTheme,
        isCustomThemeEditorOpen,
        openCustomThemeEditor: () => setCustomThemeEditorOpen(true),
        closeCustomThemeEditor: () => setCustomThemeEditorOpen(false),
        view, setView,
        searchQuery, setSearchQuery,
        currentUser: currentUser!,
        allUsers,
        setCurrentUser,
        toggleFollow,
        selectedProfile,
        viewProfile,
        viewMyProfile,
        blockUser,
        unblockUser,
        reportUser,
        posts,
        setPosts,
        createPost,
        updatePost,
        isCreatePostModalOpen,
        setCreatePostModalOpen,
        selectedPost,
        viewPost,
        nxgBalance,
        addNxg,
        wallets,
        activeWallet,
        activeWalletId,
        setActiveWalletId,
        addWallet,
        sendCrypto,
        swapCrypto,
        networks,
        addNetwork,
        knownCurrencies,
        addCustomCoin,
        addKnownCoinToWallet,
        notificationSettings,
        setNotificationSettings,
        privacySettings,
        setPrivacySettings,
        apiProviders,
        updateApiTier,
        textModels,
        imageVideoModels,
        voiceAudioModels,
        gameEngines,
        updateLlmService,
        updateGameEngine,
        games,
        selectedGame,
        viewGame,
        playGame,
        publishGame,
        liveStreams,
        selectedStream,
        viewStream,
        goLive,
        handleLogout,
        conversations,
        selectedConversation,
        selectConversation,
        sendMessage,
        mining: {
            ...miningState,
            startMining,
            addLog: addMiningLog,
        },
    }), [
        theme, isCustomThemeEditorOpen, view, searchQuery, currentUser, allUsers, setCurrentUser, toggleFollow, selectedProfile,
        viewProfile, viewMyProfile, blockUser, unblockUser, reportUser, posts, createPost, updatePost, isCreatePostModalOpen, selectedPost, viewPost,
        nxgBalance, addNxg, wallets, activeWallet, activeWalletId, sendCrypto, swapCrypto, networks, addNetwork, knownCurrencies,
        addCustomCoin, addKnownCoinToWallet, notificationSettings, privacySettings, apiProviders, updateApiTier,
        textModels, imageVideoModels, voiceAudioModels, gameEngines, updateLlmService, updateGameEngine,
        games, selectedGame, viewGame, playGame, publishGame, liveStreams, selectedStream, viewStream, goLive,
        handleLogout, conversations, selectedConversation, selectConversation, sendMessage, addWallet,
        miningState, startMining, addMiningLog
    ]);

    // Render Logic
    if (!isAuthenticated) {
        return <AuthView onAuthSuccess={handleAuthSuccess} />;
    }

    if (!dataLoaded || !currentUser) {
        return <Spinner fullScreen text="Loading NEXUS..." />;
    }

    const profileToView = view === 'profile' ? (selectedProfile || currentUser) : currentUser;

    const renderView = () => {
        switch (view) {
            case 'feed': return <FeedView />;
            case 'gaming': return <GamingView />;
            case 'studio': return <GameCreatorStudioView />;
            case 'asset_store': return <AssetStoreView />;
            case 'wallet': return <WalletView />;
            case 'apikeys': return <ApiKeyManagerView />;
            case 'profile': return <ProfileView user={profileToView} />;
            case 'mining': return <MiningView />;
            case 'game_detail': return <GameDetailView />;
            case 'live': return <LiveView />;
            case 'stream_detail': return <StreamDetailView />;
            case 'messages': return <MessagesView />;
            case 'video_call': return <VideoCallView />;
            default: return <FeedView />;
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div style={{
                '--bg-primary': theme.colors.bgPrimary,
                '--bg-secondary': theme.colors.bgSecondary,
                '--bg-glass': theme.colors.bgGlass,
                '--text-primary': theme.colors.textPrimary,
                '--text-secondary': theme.colors.textSecondary,
                '--accent-primary': theme.colors.accentPrimary,
                '--accent-secondary': theme.colors.accentSecondary,
                '--border-color': theme.colors.borderColor,
            } as React.CSSProperties}>
                <Layout view={view} setView={setView} setCreatePostModalOpen={setCreatePostModalOpen}>
                    {renderView()}
                </Layout>
                <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setCreatePostModalOpen(false)} />
                <CustomThemeModal isOpen={isCustomThemeEditorOpen} onClose={() => setCustomThemeEditorOpen(false)} />
                <PostDetailModal isOpen={!!selectedPost} onClose={() => viewPost(null)} post={selectedPost} />
            </div>
        </AppContext.Provider>
    );
};

export default App;