
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { View, Theme, Post, NotificationSettings, PrivacySettings, User, ApiProvider, ApiKeyTier, Wallet, Network, CryptoCurrency, Game, LiveStream, CreatePostData, Conversation, MiningState, LlmService, GameEngineIntegration, DirectMessage } from './types';
import { THEMES, TEXT_MODELS, IMAGE_VIDEO_MODELS, VOICE_AUDIO_MODELS, GAME_ENGINE_INTEGRATIONS, MOCK_GAMES, MOCK_LIVE_STREAMS, MOCK_CONVERSATIONS, MOCK_WALLETS, CRYPTO_CURRENCIES, MOCK_NETWORKS, API_PROVIDERS, MOCK_USERS, MOCK_POSTS } from './constants';
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
import { KeyIcon } from './components/icons/Icons';

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
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
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
    const [activeCall, setActiveCall] = useState<Conversation | null>(null);

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

        // This app still uses mock data for wallets, etc.
        // We find a wallet by email to bridge the gap for the demo Aurora user.
        // For new users, we create a new wallet.
        const mockUserFromEmail = Object.values(MOCK_USERS).find(u => u.email.toLowerCase() === user.email.toLowerCase());
        const mockWallet = mockUserFromEmail ? MOCK_WALLETS.find(w => w.userId === mockUserFromEmail.id) : undefined;

        if (mockWallet) {
            setActiveWalletId(mockWallet.id);
        } else {
             // New user or a user not in mock data
            const existingWallet = wallets.find(w => w.userId === user.id);
            if(existingWallet) {
                setActiveWalletId(existingWallet.id);
            } else {
                const newWallet: Wallet = {
                    id: `w_${user.id}`,
                    name: `${user.name}'s Wallet`,
                    userId: user.id,
                    address: `NEXUS-addr-${user.username.toLowerCase()}-${Date.now().toString().slice(-4)}`,
                    balances: { 'NXG': 1000 }, // Welcome bonus
                    seedPhrase: `welcome to nexus ${user.username} this is a mock seed phrase for demo`,
                };
                setWallets(prevWallets => [...prevWallets, newWallet]);
                setActiveWalletId(newWallet.id);
            }
        }

        // Add user to allUsers if not present
        if (!allUsers.some(u => u.id === user.id)) {
            setAllUsers(prev => [...prev, user]);
        }

        setDataLoaded(true);
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
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUserState(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
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
      if (!currentUser) return;
      
      if (postData.engagementRewards) {
          const budget = postData.engagementRewards.totalBudget;
          setWallets(prev => prev.map(w => {
              if (w.id === activeWalletId) {
                  // FIX: Correctly update wallet balance by spreading w.balances, not w, and using a string literal for the key. Also added nullish coalescing for safety.
                  return { ...w, balances: { ...w.balances, 'NXG': (w.balances['NXG'] || 0) - budget } };
              }
              return w;
          }));
      }

      const newPost: Post = {
        id: `p${Date.now()}`,
        author: currentUser,
        timestamp: 'Just now',
        likes: 0,
        reposts: 0,
        comments: [],
        ...postData,
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }, [currentUser, activeWalletId]);
  
    const updatePost = useCallback(async (postId: string, updates: Partial<Post>) => {
      setPosts(prev => prev.map(p => p.id === postId ? {...p, ...updates} : p));
    }, []);
    
    const viewPost = useCallback((post: Post | null) => {
        setSelectedPost(post);
    }, []);
  
    const addNxg = useCallback(async (amount: number) => {
      if (!activeWalletId) return;
      setWallets(prev => prev.map(w => {
        if (w.id === activeWalletId) {
          return { ...w, balances: { ...w.balances, 'NXG': (w.balances['NXG'] || 0) + amount } };
        }
        return w;
      }));
    }, [activeWalletId]);
    
    const addWallet = useCallback(async (name: string) => {
      if (!currentUser) return;
      const newWallet: Wallet = {
        id: `w_${name.toLowerCase().replace(' ', '_')}_${Date.now()}`,
        name: name,
        userId: currentUser.id,
        address: `NEXUS-addr-custom-${Date.now().toString().slice(-6)}`,
        balances: { 'NXG': 0 },
        seedPhrase: `mock seed for new wallet named ${name}`,
      };
      setWallets(prev => [...prev, newWallet]);
      setActiveWalletId(newWallet.id);
    }, [currentUser]);
  
    const sendCrypto = useCallback(async (symbol: string, amount: number) => {
      if (!activeWalletId) return;
      setWallets(prev => prev.map(w => {
          if (w.id === activeWalletId) {
              const currentBalance = w.balances[symbol] || 0;
              return { ...w, balances: { ...w.balances, [symbol]: currentBalance - amount } };
          }
          return w;
      }));
    }, [activeWalletId]);
  
    const swapCrypto = useCallback(async (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
      if (!activeWalletId) return;
      setWallets(prev => prev.map(w => {
          if (w.id === activeWalletId) {
              const fromBalance = w.balances[fromSymbol] || 0;
              const toBalance = w.balances[toSymbol] || 0;
              return { 
                  ...w, 
                  balances: { 
                      ...w.balances, 
                      [fromSymbol]: fromBalance - fromAmount,
                      [toSymbol]: toBalance + toAmount
                  } 
              };
          }
          return w;
      }));
    }, [activeWalletId]);
  
    const addNetwork = useCallback(async (network: Omit<Network, 'id'>) => {
      const newNetwork: Network = {
        ...network,
        id: `net_${network.name.toLowerCase().replace(' ', '_')}_${Date.now()}`
      };
      setNetworks(prev => [...prev, newNetwork]);
    }, []);
  
    const addCustomCoin = useCallback(async (coinData: Omit<CryptoCurrency, 'id' | 'icon' | 'gradient'>) => {
      const newCoin: CryptoCurrency = {
        ...coinData,
        id: `custom-${coinData.symbol.toLowerCase()}-${Date.now()}`,
        icon: KeyIcon,
        gradient: 'from-gray-600 to-gray-800',
      };
      
      setKnownCurrencies(prev => [...prev, newCoin]);
      
      if (activeWalletId) {
        setWallets(prevWallets => {
          return prevWallets.map(wallet => {
            if (wallet.id === activeWalletId) {
              if (wallet.balances[newCoin.symbol]) {
                return wallet;
              }
              return {
                ...wallet,
                balances: {
                  ...wallet.balances,
                  [newCoin.symbol]: 0,
                },
              };
            }
            return wallet;
          });
        });
      }
    }, [activeWalletId]);
    
    const addKnownCoinToWallet = useCallback(async (coinId: string) => {
      const coinToAdd = knownCurrencies.find(c => c.id === coinId);
      if (!coinToAdd || !activeWalletId) return;

      setWallets(prevWallets => {
        return prevWallets.map(wallet => {
          if (wallet.id === activeWalletId) {
            if (wallet.balances[coinToAdd.symbol]) {
              return wallet; // Already exists, do nothing
            }
            return {
              ...wallet,
              balances: {
                ...wallet.balances,
                [coinToAdd.symbol]: 0,
              },
            };
          }
          return wallet;
        });
      });
    }, [activeWalletId, knownCurrencies]);
  
    const updateApiTier = useCallback(async (providerId: string, tierId: string, updates: Partial<ApiKeyTier>) => {
      setApiProviders(prev => prev.map(p => {
        if (p.id === providerId) {
          return {
            ...p,
            tiers: p.tiers.map(t => t.id === tierId ? { ...t, ...updates } : t)
          };
        }
        return p;
      }));
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
      const creator = allUsers.find(u => u.id === game.creatorId);
      if (creator) {
        // Mock tipping the creator a small amount for playing
        const creatorWallet = wallets.find(w => w.userId === creator.id);
        if (creatorWallet) {
          setWallets(prev => prev.map(w => {
            if (w.id === creatorWallet.id) {
              return { ...w, balances: { ...w.balances, 'NXG': (w.balances['NXG'] || 0) + 0.01 } };
            }
            return w;
          }));
        }
      }
    }, [allUsers, wallets]);
  
    const publishGame = useCallback(async (newGameData: Omit<Game, 'id' | 'creatorId' | 'playCount'>) => {
      if (!currentUser) return;
      const newGame: Game = {
        ...newGameData,
        id: `g${games.length + 1}`,
        creatorId: currentUser.id,
        playCount: 0,
      };
      setGames(prev => [newGame, ...prev]);
      setCurrentUser({ createdGames: [...(currentUser.createdGames || []), newGame]});
      setView('gaming');
    }, [currentUser, games.length, setView, setCurrentUser]);
  
    const viewStream = useCallback((stream: LiveStream) => {
        setSelectedStream(stream);
        setView('stream_detail');
    }, []);
  
    const goLive = useCallback(async (title: string, gameId?: string) => {
      if (!currentUser) return;
      const game = gameId ? games.find(g => g.id === gameId) : undefined;
      const newStream: LiveStream = {
        id: `ls${Date.now()}`,
        title,
        game,
        creator: currentUser,
        viewerCount: 1,
        thumbnail: game?.thumbnail || `https://picsum.photos/seed/live${Date.now()}/600/400`,
      };
      setLiveStreams(prev => [newStream, ...prev]);
      viewStream(newStream);
    }, [currentUser, games, viewStream]);
    
    const selectConversation = useCallback((conversationId: string | null) => {
        setSelectedConversationId(conversationId);
        if(conversationId) {
            setConversations(prev => prev.map(c => c.id === conversationId ? {...c, unreadCount: 0} : c))
        }
    }, []);
  
    const sendMessage = useCallback(async (
      conversationId: string, 
      content: string,
      attachment?: { type: 'image', url: string } | { type: 'game', gameId: string }
    ) => {
        if (!currentUser) return;
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                const newMessageBase = {
                    id: `m${Date.now()}`,
                    senderId: currentUser.id,
                    content,
                    timestamp: 'Just now',
                };
                let newMessage: DirectMessage;
                if (attachment?.type === 'image') {
                    newMessage = { ...newMessageBase, type: 'image', attachmentUrl: attachment.url };
                } else if (attachment?.type === 'game') {
                    newMessage = { ...newMessageBase, type: 'game', attachedGameId: attachment.gameId };
                } else {
                    newMessage = { ...newMessageBase, type: 'text' };
                }

                return { ...c, messages: [...c.messages, newMessage] };
            }
            return c;
        }));
    }, [currentUser]);
    
    const startCall = useCallback((conversation: Conversation) => {
        setActiveCall(conversation);
    }, []);

    const endCall = useCallback(() => {
        setActiveCall(null);
    }, []);

    // Mining Logic
    const addMiningLog = useCallback((message: string) => {
        setMiningState(prev => ({
            ...prev,
            log: [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.log].slice(0, 100)
        }));
    }, []);

    useEffect(() => {
        if (miningEndTime && miningEndTime > Date.now()) {
            const timer = setInterval(() => {
                const newTimeLeft = miningEndTime - Date.now();
                if (newTimeLeft <= 0) {
                    setMiningState(prev => ({ ...prev, isMining: false, timeLeft: 0 }));
                    addMiningLog("Mining session ended.");
                    setMiningEndTime(null);
                } else {
                    setMiningState(prev => ({ ...prev, timeLeft: newTimeLeft }));
                }
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [miningEndTime, addMiningLog]);

    const startMining = useCallback(() => {
        if (miningState.isMining) return;
        const endTime = Date.now() + 24 * 60 * 60 * 1000;
        setMiningEndTime(endTime);
        setMiningState(prev => ({
            ...prev,
            isMining: true,
            timeLeft: 24 * 60 * 60 * 1000,
            sessionStats: { earnings: 0, blocksFound: 0 },
            hashRate: (Math.random() * 5 + 10) * (currentUser?.miningBoost || 1), // 10-15 KH/s base + boost
        }));
        addMiningLog("Mining session started. Good luck!");
    }, [currentUser, addMiningLog, miningState.isMining]);
  
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
        activeCall,
        startCall,
        endCall,
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
        handleLogout, conversations, selectedConversation, selectConversation, sendMessage, addWallet, activeCall, startCall, endCall,
        miningState, startMining, addMiningLog
    ]);

    if (!currentUser) {
        return <AuthView onAuthSuccess={handleAuthSuccess} />;
    }

    if (!dataLoaded) {
        return <Spinner fullScreen text="Loading NEXUS..." />;
    }

    const renderView = () => {
        switch (view) {
            case 'feed': return <FeedView />;
            case 'gaming': return <GamingView />;
            case 'studio': return <GameCreatorStudioView />;
            case 'asset_store': return <AssetStoreView />;
            case 'wallet': return <WalletView />;
            case 'apikeys': return <ApiKeyManagerView />;
            case 'profile': {
                const userToShow = selectedProfile || currentUser;
                if (!userToShow) {
                    // This should not happen when logged in, but acts as a fallback.
                    setView('feed');
                    return null;
                }
                return <ProfileView user={userToShow} />;
            }
            case 'mining': return <MiningView />;
            case 'game_detail': return <GameDetailView />;
            case 'live': return <LiveView />;
            case 'stream_detail': return <StreamDetailView />;
            case 'messages': return <MessagesView />;
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
                {activeCall && <VideoCallView conversation={activeCall} onEndCall={endCall} />}
            </div>
        </AppContext.Provider>
    );
};

export default App;
