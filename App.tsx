import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { View, Theme, Post, NotificationSettings, PrivacySettings, User, ApiProvider, ApiKeyTier, Wallet, Network, CryptoCurrency, Game, LiveStream, CreatePostData, Conversation, MiningState, LlmService, GameEngineIntegration } from './types';
import { THEMES, TEXT_MODELS, IMAGE_VIDEO_MODELS, VOICE_AUDIO_MODELS, GAME_ENGINE_INTEGRATIONS, MOCK_GAMES, MOCK_LIVE_STREAMS, MOCK_CONVERSATIONS, MOCK_WALLETS, CRYPTO_CURRENCIES, MOCK_NETWORKS, API_PROVIDERS, MOCK_USERS } from './constants';
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
    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    // UI State
    const [theme, setTheme] = useState<Theme>(THEMES[0]);
    const [isCustomThemeEditorOpen, setCustomThemeEditorOpen] = useState(false);
    const [view, setView] = useState<View>('feed');
    const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);


    // Data State (still mock for now)
    const [allUsers, setAllUsers] = useState<User[]>(Object.values(MOCK_USERS));
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS);
    const [activeWalletId, setActiveWalletId] = useState('w1');
    const [networks, setNetworks] = useState<Network[]>(MOCK_NETWORKS);
    const [knownCurrencies, setKnownCurrencies] = useState<CryptoCurrency[]>(CRYPTO_CURRENCIES);
    const [apiProviders, setApiProviders] = useState<ApiProvider[]>(API_PROVIDERS);
    const [games, setGames] = useState<Game[]>(MOCK_GAMES);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>(MOCK_LIVE_STREAMS);
    const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
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

    const handleAuthSuccess = (user: User) => {
        setCurrentUserState(user);
        setDataLoaded(true); // Since we use mock data, we can load instantly
    };

    const handleLogout = () => {
        setCurrentUserState(null);
        setDataLoaded(false);
        setView('feed');
    };

    // Callback Handlers (can be populated with API calls later)
    const setCurrentUser = useCallback(async (updates: Partial<User>) => {
      // Mock user update
      if(currentUser) {
        setCurrentUserState(prev => prev ? {...prev, ...updates} : null);
      }
    }, [currentUser]);

    const toggleFollow = useCallback(async (userId: string) => {
      // Mock follow toggle
      if(currentUser) {
          const isFollowing = currentUser.following.includes(userId);
          const newFollowing = isFollowing 
            ? currentUser.following.filter(id => id !== userId)
            : [...currentUser.following, userId];
          setCurrentUser({ following: newFollowing });
      }
    }, [currentUser, setCurrentUser]);
    
    const viewProfile = useCallback((user: User) => {
        setSelectedProfileId(user.id);
        setView('profile');
    }, []);

    const viewMyProfile = useCallback(() => {
        setSelectedProfileId(null);
        setView('profile');
    }, []);

    const blockUser = useCallback(async (userId: string) => {
      // Mock block user
      setCurrentUser({ blockedUsers: [...(currentUser?.blockedUsers || []), userId] });
    }, [currentUser, setCurrentUser]);
    
    const unblockUser = useCallback(async (userId: string) => {
      // Mock unblock user
      setCurrentUser({ blockedUsers: (currentUser?.blockedUsers || []).filter(id => id !== userId) });
    }, [currentUser, setCurrentUser]);
  
    const reportUser = useCallback(async (userId: string, reason: string, details: string) => {
      console.log('Reporting user:', { userId, reason, details });
      alert('User reported successfully (mocked).');
    }, []);
    
    const createPost = useCallback(async (postData: CreatePostData) => {
      // Mock create post
    }, []);
  
    const updatePost = useCallback(async (postId: string, updates: Partial<Post>) => {
      // Mock update post
    }, []);
    
    const viewPost = useCallback((post: Post | null) => {
        setSelectedPost(post);
    }, []);
  
    const addNxg = useCallback(async (amount: number) => {
      // Mock add NXG
    }, []);
    
    const addWallet = useCallback(async (name: string) => {
      // Mock add wallet
    }, []);
  
    const sendCrypto = useCallback(async (symbol: string, amount: number) => {
      // Mock send crypto
    }, []);
  
    const swapCrypto = useCallback(async (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
      // Mock swap crypto
    }, []);
  
    const addNetwork = useCallback(async (network: Omit<Network, 'id'>) => {
      // Mock add network
    }, []);
  
    const addCustomCoin = useCallback(async (coinData: Omit<CryptoCurrency, 'id' | 'icon' | 'gradient'>) => {
      // Mock add custom coin
    }, []);
    
    const addKnownCoinToWallet = useCallback(async (coinId: string) => {
      // Mock add known coin
    }, []);
  
    const updateApiTier = useCallback(async (providerId: string, tierId: string, updates: Partial<ApiKeyTier>) => {
      // Mock update api tier
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
      // Mock play game
    }, []);
  
    const publishGame = useCallback(async (newGameData: Omit<Game, 'id' | 'creatorId' | 'playCount'>) => {
      // Mock publish game
    }, []);
  
    const viewStream = useCallback((stream: LiveStream) => {
        setSelectedStream(stream);
        setView('stream_detail');
    }, []);
  
    const goLive = useCallback(async (title: string, gameId?: string) => {
      // Mock go live
    }, []);
    
    const selectConversation = useCallback((conversationId: string | null) => {
        setSelectedConversationId(conversationId);
    }, []);
  
    const sendMessage = useCallback(async (
      conversationId: string, 
      content: string,
      attachment?: { type: 'image', url: string } | { type: 'game', gameId: string }
    ) => {
      // Mock send message
    }, []);

    // Mining Logic
    const addMiningLog = useCallback((message: string) => {
        setMiningState(prev => ({
            ...prev,
            log: [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.log].slice(0, 100)
        }));
    }, []);

    useEffect(() => {
        // Mock mining state effect
    }, [currentUser, addMiningLog]);

    const startMining = useCallback(() => {
        // Mock start mining
    }, []);
  
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

    if (!currentUser) {
        return <AuthView onAuthSuccess={handleAuthSuccess} />;
    }

    if (!dataLoaded) {
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