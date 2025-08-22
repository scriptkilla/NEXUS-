

import type React from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  email: string;
  coverPhoto: string;
  following: string[];
  blockedUsers?: string[];
  customCss?: string;
  bio?: string;
  referralCode: string;
  referralCount: number;
  miningBoost: number;
  referredUsers?: string[];
  isMining?: boolean;
  createdGames?: Game[];
  playedGames?: string[];
  achievements?: string[];
  isTwoFactorEnabled?: boolean;
}

export interface Wallet {
  id: string;
  name: string;
  address: string;
  balances: { [symbol: string]: number };
  seedPhrase: string; // This is a mock seed phrase for export simulation
  userId: string;
}

export interface Comment {
  id:string;
  user: User;
  content: string;
  likes: number;
  reposts: number;
  timestamp: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'p2e' | 'p2p';
  thumbnail: string;
  creatorId: string;
  playCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
  gameId: string;
  gameTitle: string;
}

export interface TipGoal {
  crypto: CryptoCurrency;
  goalAmount: number;
  currentAmount: number;
}

export interface Poll {
  options: string[];
  votes: number[];
}

export interface EngagementRewards {
  totalBudget: number;
  spentBudget: number;
  rewardPerLike: number;
  rewardPerComment: number;
  rewardPerRepost: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: Comment[];
  poll?: Poll;
  attachedGame?: Game;
  tipGoal?: TipGoal;
  engagementRewards?: EngagementRewards;
}

export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  currencySymbol: string;
  explorerUrl?: string;
}

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: (props: { className?: string }) => React.ReactNode;
  gradient: string;
  networkId?: string;
  contractAddress?: string;
}

export type TransactionType = 'send' | 'receive' | 'swap' | 'mine' | 'reward';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  crypto: CryptoCurrency;
  amount: number;
  usdValue: number;
  address?: string;
  timestamp: string;
  date: string; // YYYY-MM-DD for easier filtering
}

export interface Theme {
  name: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgGlass: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    borderColor: string;
  };
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  newFollowers: boolean;
}

export interface PrivacySettings {
  privateAccount: boolean;
  allowDms: 'everyone' | 'following' | 'none';
}

export enum GameSize {
  Micro = "Micro (10-100 MB)",
  Small = "Small (100 MB - 1 GB)",
  Medium = "Medium (1-10 GB)",
  Large = "Large (10-50 GB)",
  AAA = "AAA (50-100 GB)",
}

export enum GameDifficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
  Custom = "Custom",
}

export interface AIModel {
  name: string;
  provider: string;
  versions?: string[];
}

export interface ApiKeyTier {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  apiKey?: string;
  usage: number;
  limit: number;
  tokensUsed: number;
  rateLimitRpm: number;
  rateLimitTpm: number;
  cost: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  icon: (props: { className?: string }) => React.ReactNode;
  tiers: ApiKeyTier[];
}

export type View = 'feed' | 'gaming' | 'studio' | 'wallet' | 'apikeys' | 'profile' | 'mining' | 'game_detail' | 'live' | 'stream_detail' | 'messages' | 'video_call' | 'asset_store';

export interface LiveStream {
  id: string;
  title: string;
  creator: User;
  viewerCount: number;
  thumbnail: string;
  game?: Game;
}

export interface ClickerUpgrade {
    name: string;
    cost: number;
    pointsPerSecond: number;
}

export interface ClickerGameConfig {
    title: string;
    description: string;
    itemName: string;
    itemEmoji: string;
    pointsPerClick: number;
    upgrades: ClickerUpgrade[];
}

export type CreatePostData = Omit<Post, 'id' | 'author' | 'timestamp' | 'likes' | 'reposts' | 'comments'>;

export interface DirectMessage {
  id: string;
  senderId: string;
  content: string; // for text messages or captions
  timestamp: string;
  type: 'text' | 'image' | 'game';
  attachmentUrl?: string; // for image attachments
  attachedGameId?: string; // for game attachments
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: DirectMessage[];
  unreadCount: number;
}

export interface MiningState {
  isMining: boolean;
  timeLeft: number;
  sessionStats: {
    earnings: number;
    blocksFound: number;
  };
  log: string[];
  hashRate: number;
}

export interface LlmService {
    id: string;
    company: string;
    icon: (props: { className?: string }) => React.ReactNode;
    modelName: string;
    description: string;
    docsUrl: string;
    actionType: 'Add Key' | 'Join Waitlist';
    status: 'connected' | 'disconnected';
    apiKey?: string;
}

export interface GameEngineIntegration {
    id: string;
    name: string;
    icon: (props: { className?: string }) => React.ReactNode;
    primaryLanguage: string;
    bestFor: string;
    integrationType: string;
    actionType: 'Connect';
    status: 'connected' | 'disconnected';
}


export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isCustomThemeEditorOpen: boolean;
  openCustomThemeEditor: () => void;
  closeCustomThemeEditor: () => void;
  
  view: View;
  setView: (view: View) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (updates: Partial<User>) => void;
  toggleFollow: (userId: string) => void;
  selectedProfile: User | null;
  viewProfile: (user: User) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string, details: string) => void;

  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  createPost: (postData: CreatePostData) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  isCreatePostModalOpen: boolean;
  setCreatePostModalOpen: (isOpen: boolean) => void;
  selectedPost: Post | null;
  viewPost: (post: Post | null) => void;
  
  nxgBalance: number;
  addNxg: (amount: number) => void;
  
  wallets: Wallet[];
  activeWallet: Wallet | undefined;
  activeWalletId: string;
  setActiveWalletId: (id: string) => void;
  addWallet: (name: string) => void;
  sendCrypto: (symbol: string, amount: number) => void;
  swapCrypto: (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => void;

  networks: Network[];
  addNetwork: (network: Omit<Network, 'id'>) => void;
  knownCurrencies: CryptoCurrency[];
  addCustomCoin: (coin: Omit<CryptoCurrency, 'id' | 'icon' | 'gradient'>) => void;
  addKnownCoinToWallet: (coinId: string) => void;
  
  notificationSettings: NotificationSettings;
  setNotificationSettings: (settings: NotificationSettings) => void;
  privacySettings: PrivacySettings;
  setPrivacySettings: (settings: PrivacySettings) => void;

  apiProviders: ApiProvider[];
  updateApiTier: (providerId: string, tierId: string, updates: Partial<ApiKeyTier>) => void;
  
  textModels: LlmService[];
  imageVideoModels: LlmService[];
  voiceAudioModels: LlmService[];
  gameEngines: GameEngineIntegration[];
  updateLlmService: (modelId: string, category: 'text' | 'image' | 'voice', updates: Partial<LlmService>) => void;
  updateGameEngine: (engineId: string, updates: Partial<GameEngineIntegration>) => void;

  games: Game[];
  selectedGame: Game | null;
  viewGame: (game: Game) => void;
  playGame: (game: Game) => void;
  publishGame: (newGameData: Omit<Game, 'id' | 'creatorId' | 'playCount'>) => void;
  
  liveStreams: LiveStream[];
  selectedStream: LiveStream | null;
  viewStream: (stream: LiveStream) => void;
  goLive: (title: string, gameId?: string) => void;

  handleLogout: () => void;

  mining: MiningState & {
    startMining: () => void;
    addLog: (message: string) => void;
  };

  conversations: Conversation[];
  selectedConversation: Conversation | null;
  selectConversation: (conversationId: string | null) => void;
  sendMessage: (
    conversationId: string, 
    content: string, 
    attachment?: { type: 'image'; url: string } | { type: 'game'; gameId: string }
  ) => void;
}