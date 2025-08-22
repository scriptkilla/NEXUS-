

import React from 'react';
import { type Post, type CryptoCurrency, type Theme, GameSize, GameDifficulty, type AIModel, type ApiProvider, type View, type Game, type User, type Transaction, type Wallet, type Network, type Achievement, type LiveStream, type Conversation } from './types';
import {
  HomeIcon, GamepadIcon, WrenchIcon, WalletIcon, KeyIcon, UserIcon, NexusIcon, BtcIcon, SolIcon, EgldIcon, LtcIcon, TrxIcon, OpenAIIcon, ClaudeIcon, GeminiIcon, HuggingFaceIcon, EthIcon, UsdcIcon, LlamaIcon, SparklesIcon, RadioIcon, MessageSquareIcon,
} from './components/icons/Icons';

export const SIDEBAR_LINKS: { name: string; icon: React.ReactNode; view: View }[] = [
  { name: 'Feed', icon: <HomeIcon />, view: 'feed' },
  { name: 'Live', icon: <RadioIcon />, view: 'live' },
  { name: 'Messages', icon: <MessageSquareIcon />, view: 'messages' },
  { name: 'Gaming', icon: <GamepadIcon />, view: 'gaming' },
  { name: 'AI Studio', icon: <WrenchIcon />, view: 'studio' },
  { name: 'Wallet', icon: <WalletIcon />, view: 'wallet' },
  { name: 'API Keys', icon: <KeyIcon />, view: 'apikeys' },
  { name: 'Profile', icon: <UserIcon />, view: 'profile' },
];

export const MOCK_NETWORKS: Network[] = [
  { id: 'net1', name: 'Ethereum Mainnet', rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID', chainId: 1, currencySymbol: 'ETH', explorerUrl: 'https://etherscan.io' },
  { id: 'net2', name: 'Polygon', rpcUrl: 'https://polygon-rpc.com', chainId: 137, currencySymbol: 'MATIC', explorerUrl: 'https://polygonscan.com' },
  { id: 'solana-mainnet', name: 'Solana Mainnet', rpcUrl: 'https://api.mainnet-beta.solana.com', chainId: 101, currencySymbol: 'SOL', explorerUrl: 'https://explorer.solana.com' },
];

export const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  { id: 'nxg', name: 'NEXUS', symbol: 'NXG', icon: NexusIcon, gradient: 'from-pink-500 to-purple-600', networkId: 'solana-mainnet' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: EthIcon, gradient: 'from-gray-500 to-gray-700', networkId: 'net1' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: UsdcIcon, gradient: 'from-blue-400 to-sky-500', networkId: 'net1', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: BtcIcon, gradient: 'from-orange-400 to-yellow-500', networkId: 'bitcoin-mainnet' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: SolIcon, gradient: 'from-purple-500 to-blue-400', networkId: 'solana-mainnet' },
  { id: 'egld', name: 'MultiversX', symbol: 'EGLD', icon: EgldIcon, gradient: 'from-blue-400 to-cyan-300', networkId: 'multiversx-mainnet' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', icon: LtcIcon, gradient: 'from-gray-400 to-gray-600', networkId: 'litecoin-mainnet' },
  { id: 'trx', name: 'TRON', symbol: 'TRX', icon: TrxIcon, gradient: 'from-red-500 to-pink-500', networkId: 'tron-mainnet' },
];

export const MOCK_WALLETS: Wallet[] = [
  {
    id: 'w1',
    name: 'Main Wallet',
    userId: 'u1',
    address: 'Gf7dG2x2q4qA9yB8c6D5e4F3g2H1j0kL9m8N7p6Q5rS',
    balances: {
      'NXG': 1254.32,
      'ETH': 1.5,
      'USDC': 3500.50,
      'BTC': 0.05,
      'SOL': 15.8,
      'EGLD': 250.1,
      'LTC': 30.5,
      'TRX': 10000,
    },
    seedPhrase: 'galaxy luxury turtle syrup onion chorus screen jungle floor sister tribe leader'
  },
  {
    id: 'w2',
    name: 'Trading Vault',
    userId: 'u1', // Also Aurora's for simplicity
    address: '4BoqV6a1qZ9X8c7v6B5n4M3l2K1j0hGf9e8d7C6b5A4s',
    balances: {
      'NXG': 50000.00,
      'ETH': 10,
      'USDC': 150000,
      'BTC': 1.2,
      'SOL': 1000,
      'LTC': 150,
      'TRX': 250000,
    },
    seedPhrase: 'rapid wolf kiwi praise peanut hazard market quantum fabric valve foam absorb'
  }
];

export const MOCK_GAMES: Game[] = [
  { id: 'g1', title: 'Cosmic Rift', thumbnail: 'https://picsum.photos/seed/cosmicrift/500/300', creatorId: 'u1', playCount: 1204, description: 'Explore a fractured galaxy, trade rare resources, and build your interstellar empire in this open-world space sim.', category: 'p2e' },
  { id: 'g2', title: 'Cyberpunk Samurai Quest', thumbnail: 'https://picsum.photos/seed/csquest/500/300', creatorId: 'u2', playCount: 853, description: 'Hack, slash, and negotiate your way through the neon-drenched streets of Neo-Kyoto in this story-driven RPG.', category: 'p2e' },
  { id: 'g3', title: 'Weekly Hyper-Dash', thumbnail: 'https://picsum.photos/seed/hyperdash/500/300', creatorId: 'u3', playCount: 2509, description: 'A high-speed competitive runner with procedurally generated tracks. Climb the weekly leaderboards for massive prizes.', category: 'p2p' },
  { id: 'g4', title: 'Monthly Siege', thumbnail: 'https://picsum.photos/seed/siege/500/300', creatorId: 'u1', playCount: 488, description: 'Team up with your DAO to attack or defend fortified castles in this massive monthly PvP strategy event.', category: 'p2p' },
  { id: 'g5', title: 'Dungeons & Degens', description: 'Crawl through treacherous dungeons, defeat on-chain monsters, and mint epic loot as NFTs in this classic RPG adventure.', thumbnail: 'https://picsum.photos/seed/dungeons-and-degens/500/300', category: 'p2e', creatorId: 'u3', playCount: 5432 },
  { id: 'g6', title: 'Crypto Tycoon', description: 'Build your digital asset empire from the ground up. Master the art of the trade, manage liquidity pools, and become a mogul.', thumbnail: 'https://picsum.photos/seed/crypto-tycoon/500/300', category: 'p2e', creatorId: 'u4', playCount: 1289 },
  { id: 'g7', title: 'NFT Legends: Genesis Heroes', description: 'Collect and battle with unique, AI-generated NFT heroes. Each victory enhances their attributes and value.', thumbnail: 'https://picsum.photos/seed/nft-legends/500/300', category: 'p2e', creatorId: 'u2', playCount: 8731 },
  { id: 'g8', title: 'Staking Solitaire', description: 'A relaxing card game with a twist. Lock your cards in staking pools to earn yield and unlock new, powerful decks.', thumbnail: 'https://picsum.photos/seed/staking-solitaire/500/300', category: 'p2e', creatorId: 'u1', playCount: 994 },
  { id: 'g9', title: 'Gas War: Battle for the Chain', description: 'A fast-paced, tactical FPS where every transaction costs. Manage your resources to out-gun and out-spend your opponents.', thumbnail: 'https://picsum.photos/seed/gas-war/500/300', category: 'p2p', creatorId: 'u3', playCount: 3488 },
  { id: 'g10', title: 'BitKart Racing', description: 'Race for pink slips! Wager your NFT karts and parts in high-speed, chaotic races where the winner takes all.', thumbnail: 'https://picsum.photos/seed/bitkart-racing/500/300', category: 'p2p', creatorId: 'u4', playCount: 11209 },
  { id: 'g11', title: 'Whale Wars', description: 'A competitive strategy game of market manipulation. Accumulate the most assets and trigger a flash crash to liquidate your rivals.', thumbnail: 'https://picsum.photos/seed/whale-wars/500/300', category: 'p2p', creatorId: 'u2', playCount: 4102 },
  { id: 'g12', title: 'Rug Pull Rumble', description: 'A humorous fighting game where meme coin mascots battle it out. Use special moves like "Exit Scam" and "Honeypot Trap".', thumbnail: 'https://picsum.photos/seed/rug-pull-rumble/500/300', category: 'p2p', creatorId: 'u1', playCount: 765 },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'First Flight', description: 'Played Cosmic Rift for the first time.', icon: SparklesIcon, gameId: 'g1', gameTitle: 'Cosmic Rift' },
  { id: 'a2', name: 'Cyber-Warrior', description: 'Completed a mission in Cyberpunk Samurai Quest.', icon: SparklesIcon, gameId: 'g2', gameTitle: 'Cyberpunk Samurai Quest' },
  { id: 'a3', name: 'High Score', description: 'Reached the top 10 in Weekly Hyper-Dash.', icon: SparklesIcon, gameId: 'g3', gameTitle: 'Weekly Hyper-Dash' },
  { id: 'a4', name: 'Strategist', description: 'Won a match in Monthly Siege.', icon: SparklesIcon, gameId: 'g4', gameTitle: 'Monthly Siege' },
  { id: 'a5', name: 'Dungeon Master', description: 'Cleared a dungeon in Dungeons & Degens.', icon: SparklesIcon, gameId: 'g5', gameTitle: 'Dungeons & Degens' },
  { id: 'a6', name: 'Tycoon', description: 'Reached a net worth of 1,000,000 in Crypto Tycoon.', icon: SparklesIcon, gameId: 'g6', gameTitle: 'Crypto Tycoon' },
];

export const MOCK_USERS: { [key: string]: User } = {
  aurora: { id: 'u1', name: 'Tommy Crypto', username: 'TommyCrypto', avatar: 'https://picsum.photos/seed/aurora/100/100', verified: true, email: 'tommy@nexus.io', coverPhoto: 'https://picsum.photos/seed/aurora-bg/1200/400', following: ['u3'], customCss: '', bio: 'Digital explorer & P2E game creator on NEXUS. Building the future, one block at a time. 🚀', referralCode: 'NEXUSTOMMY', referralCount: 5, miningBoost: 1.5, isMining: true, referredUsers: ['u2', 'u3', 'u4', 'u5', 'u6'], createdGames: [MOCK_GAMES[0], MOCK_GAMES[3], MOCK_GAMES[7], MOCK_GAMES[11]], blockedUsers: [], playedGames: ['g1', 'g2', 'g3', 'g4', 'g8', 'g12'], achievements: ['a1', 'a2', 'a3', 'a4'], isTwoFactorEnabled: false },
  byteflow: { id: 'u2', name: 'ByteFlow', username: 'byteflow', avatar: 'https://picsum.photos/seed/byteflow/100/100', verified: false, email: 'byteflow@example.com', coverPhoto: 'https://picsum.photos/seed/byteflow-bg/1200/400', following: [], customCss: '', bio: 'Full-stack dev exploring the decentralized web. Fascinated by ZK-proofs and on-chain gaming.', referralCode: 'NEXUSBYTE', referralCount: 0, miningBoost: 1.0, isMining: false, referredUsers: [], createdGames: [MOCK_GAMES[1]], blockedUsers: [], playedGames: ['g1', 'g7', 'g11'], achievements: ['a1'], isTwoFactorEnabled: false },
  cypher: { id: 'u3', name: 'Cypher', username: 'cypher', avatar: 'https://picsum.photos/seed/cypher/100/100', verified: true, email: 'cypher@example.com', coverPhoto: 'https://picsum.photos/seed/cypher-bg/1200/400', following: ['u1', 'u4'], customCss: '', bio: 'Security researcher & white-hat hacker. If it can be built, it can be broken.', referralCode: 'NEXUSCYPHER', referralCount: 2, miningBoost: 1.2, isMining: true, referredUsers: [], createdGames: [MOCK_GAMES[2]], blockedUsers: [], playedGames: ['g2', 'g3', 'g9'], achievements: ['a2', 'a3'], isTwoFactorEnabled: true },
  zenith: { id: 'u4', name: 'Zenith', username: 'zenith', avatar: 'https://picsum.photos/seed/zenith/100/100', verified: false, email: 'zenith@example.com', coverPhoto: 'https://picsum.photos/seed/zenith-bg/1200/400', following: [], customCss: '', bio: '', referralCode: 'NEXUSZENITH', referralCount: 0, miningBoost: 1.0, isMining: false, referredUsers: [], createdGames: [], blockedUsers: [], playedGames: ['g5'], achievements: ['a5'], isTwoFactorEnabled: false },
  echo: { id: 'u5', name: 'Echo', username: 'echo', avatar: 'https://picsum.photos/seed/echo/100/100', verified: false, email: 'echo@example.com', coverPhoto: 'https://picsum.photos/seed/echo-bg/1200/400', following: [], customCss: '', bio: 'NFT artist and collector.', referralCode: 'NEXUSECHO', referralCount: 0, miningBoost: 1.0, isMining: true, referredUsers: [], createdGames: [], blockedUsers: [], playedGames: ['g6', 'g10'], achievements: ['a6'], isTwoFactorEnabled: false },
  shard: { id: 'u6', name: 'Shard', username: 'shard', avatar: 'https://picsum.photos/seed/shard/100/100', verified: false, email: 'shard@example.com', coverPhoto: 'https://picsum.photos/seed/shard-bg/1200/400', following: [], customCss: '', bio: '', referralCode: 'NEXUSSHARD', referralCount: 0, miningBoost: 1.0, isMining: false, referredUsers: [], createdGames: [], blockedUsers: [], playedGames: [], achievements: [], isTwoFactorEnabled: false },
};

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo1',
        participants: [MOCK_USERS.aurora, MOCK_USERS.cypher],
        unreadCount: 2,
        messages: [
            { id: 'm1', senderId: 'u3', content: 'Hey, saw your new game demo. Looks incredible!', timestamp: '1h ago', type: 'text' },
            { id: 'm2', senderId: 'u1', content: 'Thanks! A lot of work went into it. The AI Studio is powerful.', timestamp: '58m ago', type: 'text' },
            { id: 'm3', senderId: 'u3', content: 'I can tell. We should collaborate on a PvP map for it sometime.', timestamp: '55m ago', type: 'text' },
            { id: 'm4', senderId: 'u3', content: 'You free for a quick call to discuss?', timestamp: '54m ago', type: 'text' },
        ],
    },
    {
        id: 'convo2',
        participants: [MOCK_USERS.aurora, MOCK_USERS.byteflow],
        unreadCount: 0,
        messages: [
            { id: 'm5', senderId: 'u2', content: 'The synthwave theme you posted about is my favorite too. Did you try the custom CSS yet?', timestamp: '3h ago', type: 'text' },
            { id: 'm6', senderId: 'u1', content: 'Not yet! I need to look into that. Any cool tricks you\'ve found?', timestamp: '3h ago', type: 'text' },
        ],
    },
    {
        id: 'convo3',
        participants: [MOCK_USERS.aurora, MOCK_USERS.zenith],
        unreadCount: 1,
        messages: [
            { id: 'm7', senderId: 'u4', content: 'Thanks for the tip on my post! Really appreciate the support for my game. 🙏', timestamp: '1d ago', type: 'text' },
        ],
    },
];

export const MOCK_LIVE_STREAMS: LiveStream[] = [
  { id: 'ls1', title: '🔴 Chill stream, grinding in Cosmic Rift', creator: MOCK_USERS.aurora, viewerCount: 1250, thumbnail: 'https://picsum.photos/seed/live1/600/400', game: MOCK_GAMES[0] },
  { id: 'ls2', title: 'P2P Arena! High-stakes battles in Hyper-Dash', creator: MOCK_USERS.cypher, viewerCount: 842, thumbnail: 'https://picsum.photos/seed/live2/600/400', game: MOCK_GAMES[2] },
  { id: 'ls3', title: 'Just Chatting & Reviewing new NEXUS features', creator: MOCK_USERS.byteflow, viewerCount: 433, thumbnail: 'https://picsum.photos/seed/live3/600/400' },
  { id: 'ls4', title: 'My first stream! Let\'s play some Rug Pull Rumble', creator: MOCK_USERS.zenith, viewerCount: 78, thumbnail: 'https://picsum.photos/seed/live4/600/400', game: MOCK_GAMES[11] },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p6',
    author: MOCK_USERS.aurora,
    content: 'Just dropped a new playable demo of my latest game created with the NEXUS AI Studio. Check it out and let me know what you think!',
    timestamp: '4d ago',
    likes: 302,
    reposts: 58,
    comments: [],
    attachedGame: MOCK_GAMES[0],
  },
  {
    id: 'p5',
    author: MOCK_USERS.zenith,
    content: 'Help me fund my next indie game project! Every tip helps me get closer to hiring an artist. Let\'s build something cool together!',
    timestamp: '3d ago',
    likes: 150,
    reposts: 20,
    comments: [],
    tipGoal: {
      crypto: CRYPTO_CURRENCIES[0], // NXG
      goalAmount: 500,
      currentAmount: 125.5,
    }
  },
  {
      id: 'p7',
      author: MOCK_USERS.cypher,
      content: 'What feature should we prioritize for the next NEXUS update?',
      timestamp: '5d ago',
      likes: 890,
      reposts: 112,
      comments: [],
      poll: {
          options: ['Decentralized Identity', 'VR Metaverse Rooms', 'Advanced AI NPC Creator', 'Cross-Chain NFT Marketplace'],
          votes: [120, 350, 280, 140]
      }
  },
  {
    id: 'p1',
    author: MOCK_USERS.aurora,
    content: 'Just minted my first P2E game character on the NEXUS CHAIN! The AI Game Creator Studio is a game-changer. Who wants to team up? 🚀 #NEXUS #P2E #CryptoGaming',
    image: 'https://picsum.photos/seed/game1/600/400',
    timestamp: '2h ago',
    likes: 1256,
    reposts: 253,
    comments: [
      { id: 'c1', user: MOCK_USERS.byteflow, content: "Let's go! I'm in.", likes: 12, reposts: 2, timestamp: '1h ago' },
      { id: 'c2', user: MOCK_USERS.cypher, content: 'That looks amazing! The art style is sick.', likes: 25, reposts: 5, timestamp: '1h ago' },
    ],
  },
  {
    id: 'p2',
    author: MOCK_USERS.cypher,
    content: 'The multi-chain wallet integration is seamless. Swapped some $SOL for $NXG in seconds. The future is interoperable. 💎',
    timestamp: '5h ago',
    likes: 834,
    reposts: 98,
    comments: [],
  },
  {
    id: 'p3',
    author: MOCK_USERS.byteflow,
    content: 'Exploring the new themes on my profile. The Retro/Synthwave is my jam. What\'s your favorite? #NEXUS #UIUX',
    image: 'https://picsum.photos/seed/retro/600/400',
    timestamp: '1d ago',
    likes: 412,
    reposts: 45,
    comments: [],
  },
  {
    id: 'p4',
    author: MOCK_USERS.zenith,
    content: 'Big fan of the crypto tipping feature. Just sent some $EGLD to my favorite creator. So easy to support the community!',
    timestamp: '2d ago',
    likes: 2048,
    reposts: 431,
    comments: [
       { id: 'c3', user: MOCK_USERS.aurora, content: 'Thank you for the support! 🙏', likes: 50, reposts: 10, timestamp: '2d ago' },
    ],
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'receive', status: 'completed', crypto: CRYPTO_CURRENCIES[1], amount: 0.005, usdValue: 300, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', timestamp: '2 hours ago', date: '2024-07-20' },
    { id: 't2', type: 'send', status: 'completed', crypto: CRYPTO_CURRENCIES[2], amount: 5.2, usdValue: 780, address: 'So11111111111111111111111111111111111111112', timestamp: '8 hours ago', date: '2024-07-20' },
    { id: 't3', type: 'swap', status: 'completed', crypto: CRYPTO_CURRENCIES[0], amount: 150.75, usdValue: 150.75, timestamp: '1 day ago', date: '2024-07-19' },
    { id: 't4', type: 'mine', status: 'completed', crypto: CRYPTO_CURRENCIES[0], amount: 0.8934, usdValue: 0.89, timestamp: '1 day ago', date: '2024-07-19' },
    { id: 't5', type: 'reward', status: 'completed', crypto: CRYPTO_CURRENCIES[0], amount: 10, usdValue: 10, timestamp: '2 days ago', date: '2024-07-18' },
    { id: 't6', type: 'send', status: 'pending', crypto: CRYPTO_CURRENCIES[3], amount: 100, usdValue: 4500, address: 'erd1qqqqqqqqqqqqqpgq4c9flqg0t8d7qpd5h4q9x3j4h2y5j4h2y5j4h2y5j4h2y5j4h2', timestamp: '3 days ago', date: '2024-07-17' },
    { id: 't7', type: 'receive', status: 'completed', crypto: CRYPTO_CURRENCIES[4], amount: 2.5, usdValue: 250, address: 'ltc1q8s6e5n2x5q4q3z2y7x9f8c6b5a4d3e2f1g0h9', timestamp: '4 days ago', date: '2024-07-16' },
    { id: 't8', type: 'send', status: 'failed', crypto: CRYPTO_CURRENCIES[5], amount: 5000, usdValue: 300, address: 'TX7nCAbx32pCj2e4uBFEA4sS1A1a1a1a1a', timestamp: '5 days ago', date: '2024-07-15' },
    { id: 't9', type: 'mine', status: 'completed', crypto: CRYPTO_CURRENCIES[0], amount: 1.2345, usdValue: 1.23, timestamp: '5 days ago', date: '2024-07-15' },
];

export const GAME_SIZES = Object.values(GameSize);
export const GAME_DIFFICULTIES = Object.values(GameDifficulty);

export const GAME_SIZE_COSTS: { [key in GameSize]: number } = {
  [GameSize.Micro]: 25,
  [GameSize.Small]: 50,
  [GameSize.Medium]: 75,
  [GameSize.Large]: 100,
  [GameSize.AAA]: 125,
};

export const GAME_GENRES: string[] = [
  "Action/Adventure", "Role-Playing Games (RPG)", "First-Person Shooter (FPS)", "Real-Time Strategy (RTS)", "Turn-Based Strategy", "Puzzle/Logic", "Platformer", "Racing/Driving", "Sports", "Fighting", "Simulation", "Survival", "Horror/Thriller", "Casual/Hypercasual", "Battle Royale", "MMORPG", "Card/Board Games", "Music/Rhythm", "Educational", "Sandbox/Creative"
];

export const AI_OPTIONS: { title: string; models: AIModel[] }[] = [
  {
    title: "Game Design AI",
    models: [
      { name: "NEXUS AI (Native)", provider: "NEXUS", versions: ["v1.0", "v1.2 (Beta)"] },
      { name: "Gemini", provider: "Google", versions: ["1.5 Pro", "1.5 Flash", "2.5 Flash Preview"] },
      { name: "GPT-4", provider: "OpenAI", versions: ["Turbo", "Omni", "o-mini"] },
      { name: "Claude 3", provider: "Anthropic", versions: ["Opus", "Sonnet", "Haiku"] },
      { name: "PaLM 2", provider: "Google" },
    ]
  },
  {
    title: "Code Generation AI",
    models: [
      { name: "GitHub Copilot", provider: "Microsoft", versions: ["Individual", "Business"] },
      { name: "Amazon CodeWhisperer", provider: "AWS" },
      { name: "Tabnine", provider: "Tabnine" },
      { name: "Replit Ghostwriter", provider: "Replit" },
    ]
  },
  {
    title: "Art Generation AI",
    models: [
      { name: "DALL-E", provider: "OpenAI", versions: ["2", "3"] },
      { name: "Midjourney", provider: "Midjourney", versions: ["v5.2", "v6.0"] },
      { name: "Stable Diffusion", provider: "Stability AI", versions: ["XL", "3.0"] },
      { name: "Adobe Firefly", provider: "Adobe" },
      { name: "Leonardo AI", provider: "Leonardo" },
    ]
  },
  {
    title: "Audio/Music AI",
    models: [
      { name: "Mubert", provider: "Mubert" },
      { name: "AIVA", provider: "AIVA" },
      { name: "Soundraw", provider: "Soundraw" },
      { name: "Jukebox", provider: "OpenAI" },
    ]
  },
  {
    title: "Game Logic AI",
    models: [
      { name: "Unity ML-Agents", provider: "Unity" },
      { name: "DeepMind Lab", provider: "Google" },
      { name: "Custom Reinforcement Learning", provider: "Custom" },
    ]
  }
];

const glassify = (theme: Theme): Theme => {
    const isLightTheme = parseInt(theme.colors.bgPrimary.replace('#', ''), 16) > 0xaaaaaa;
    const newColors = { ...theme.colors };

    newColors.bgPrimary = '#020204'; // Dark fallback for all
    newColors.bgSecondary = 'rgba(255, 255, 255, 0.05)';
    newColors.bgGlass = 'rgba(255, 255, 255, 0.1)';
    newColors.borderColor = 'rgba(255, 255, 255, 0.2)';

    if (isLightTheme) {
        newColors.textPrimary = '#FFFFFF';
        newColors.textSecondary = '#d1d1d9'; // Slightly brighter secondary text
    }
    
    return { ...theme, colors: newColors };
};

const originalThemes: Theme[] = [
    { name: 'NEXUS Dark', colors: { bgPrimary: '#0D0C1D', bgSecondary: '#16152B', bgGlass: 'rgba(22, 21, 43, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#A09FAD', accentPrimary: '#E91E63', accentSecondary: '#9C27B0', borderColor: 'rgba(255, 255, 255, 0.1)' } },
    { name: 'OLED Dark', colors: { bgPrimary: '#000000', bgSecondary: '#111111', bgGlass: 'rgba(17, 17, 17, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#AAAAAA', accentPrimary: '#BE123C', accentSecondary: '#FFD700', borderColor: 'rgba(255, 255, 255, 0.1)' } },
    { name: 'Classic Light', colors: { bgPrimary: '#F7F9FC', bgSecondary: '#FFFFFF', bgGlass: 'rgba(255, 255, 255, 0.5)', textPrimary: '#1D2129', textSecondary: '#65676B', accentPrimary: '#1877F2', accentSecondary: '#36A420', borderColor: 'rgba(0, 0, 0, 0.1)' } },
    { name: 'Gaming Neon', colors: { bgPrimary: '#1A0B2E', bgSecondary: '#2A0F4A', bgGlass: 'rgba(42, 15, 74, 0.5)', textPrimary: '#F0F0F0', textSecondary: '#A09FAD', accentPrimary: '#00F5D4', accentSecondary: '#FF00A8', borderColor: 'rgba(0, 245, 212, 0.3)' } },
    { name: 'Crypto Gold', colors: { bgPrimary: '#141414', bgSecondary: '#232323', bgGlass: 'rgba(35, 35, 35, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#C0C0C0', accentPrimary: '#F7931A', accentSecondary: '#FFD700', borderColor: 'rgba(247, 147, 26, 0.3)' } },
    { name: 'Synthwave', colors: { bgPrimary: '#201335', bgSecondary: '#392A4D', bgGlass: 'rgba(57, 42, 77, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#D8B4FE', accentPrimary: '#F92672', accentSecondary: '#00E5FF', borderColor: 'rgba(249, 38, 114, 0.3)' } },
    { name: 'Nature', colors: { bgPrimary: '#1E3A3A', bgSecondary: '#2A4E4E', bgGlass: 'rgba(42, 78, 78, 0.5)', textPrimary: '#F0FFF0', textSecondary: '#ADD8E6', accentPrimary: '#34D399', accentSecondary: '#A7F3D0', borderColor: 'rgba(52, 211, 153, 0.3)' } },
    { name: 'Space', colors: { bgPrimary: '#0B0722', bgSecondary: '#191140', bgGlass: 'rgba(25, 17, 64, 0.5)', textPrimary: '#E0E0FF', textSecondary: '#9897D3', accentPrimary: '#6366F1', accentSecondary: '#A5B4FC', borderColor: 'rgba(99, 102, 241, 0.3)' } },
    { name: 'Solar Flare', colors: { bgPrimary: '#1F1008', bgSecondary: '#3B1D0E', bgGlass: 'rgba(59, 29, 14, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#D1C4E9', accentPrimary: '#FF7043', accentSecondary: '#FFB74D', borderColor: 'rgba(255, 112, 67, 0.3)' } },
    { name: 'Cyberpunk Night', colors: { bgPrimary: '#0C0A24', bgSecondary: '#1C164D', bgGlass: 'rgba(28, 22, 77, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#B0AEE6', accentPrimary: '#00F5D4', accentSecondary: '#FF00A8', borderColor: 'rgba(0, 245, 212, 0.3)' } },
    { name: 'Oceanic Deep', colors: { bgPrimary: '#022C43', bgSecondary: '#05445E', bgGlass: 'rgba(5, 68, 94, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#B2DFDB', accentPrimary: '#189AB4', accentSecondary: '#75E6DA', borderColor: 'rgba(24, 154, 180, 0.3)' } },
    { name: 'Forest Floor', colors: { bgPrimary: '#283618', bgSecondary: '#464E2E', bgGlass: 'rgba(70, 78, 46, 0.5)', textPrimary: '#FEFAE0', textSecondary: '#DAE2B6', accentPrimary: '#606C38', accentSecondary: '#BC6C25', borderColor: 'rgba(188, 108, 37, 0.3)' } },
    { name: 'Rose Gold', colors: { bgPrimary: '#4B2E39', bgSecondary: '#724B5F', bgGlass: 'rgba(114, 75, 95, 0.5)', textPrimary: '#FCE4EC', textSecondary: '#F8BBD0', accentPrimary: '#F48FB1', accentSecondary: '#BCAAA4', borderColor: 'rgba(244, 143, 177, 0.3)' } },
    { name: 'Monochrome', colors: { bgPrimary: '#121212', bgSecondary: '#1E1E1E', bgGlass: 'rgba(30, 30, 30, 0.5)', textPrimary: '#FFFFFF', textSecondary: '#B3B3B3', accentPrimary: '#FFFFFF', accentSecondary: '#757575', borderColor: 'rgba(255, 255, 255, 0.2)' } },
    { name: 'Mint Chocolate', colors: { bgPrimary: '#3D2B24', bgSecondary: '#5E4A40', bgGlass: 'rgba(94, 74, 64, 0.5)', textPrimary: '#F0FFF0', textSecondary: '#D1E7DD', accentPrimary: '#6EE7B7', accentSecondary: '#B99378', borderColor: 'rgba(110, 231, 183, 0.3)' } },
    { name: 'Cosmic Latte', colors: { bgPrimary: '#FDF6E3', bgSecondary: '#F5EFE0', bgGlass: 'rgba(245, 239, 224, 0.5)', textPrimary: '#654f3c', textSecondary: '#938271', accentPrimary: '#D2B48C', accentSecondary: '#BC8F8F', borderColor: 'rgba(101, 79, 60, 0.15)' } },
    { name: 'Sakura Dream', colors: { bgPrimary: '#FFF0F5', bgSecondary: '#FFFFFF', bgGlass: 'rgba(255, 255, 255, 0.5)', textPrimary: '#6A5ACD', textSecondary: '#C71585', accentPrimary: '#FFB6C1', accentSecondary: '#FF69B4', borderColor: 'rgba(255, 105, 180, 0.2)' } },
    { name: 'Royal Velvet', colors: { bgPrimary: '#2C0E37', bgSecondary: '#482057', bgGlass: 'rgba(72, 32, 87, 0.5)', textPrimary: '#F3E5F5', textSecondary: '#CE93D8', accentPrimary: '#AB47BC', accentSecondary: '#FFD700', borderColor: 'rgba(171, 71, 188, 0.3)' } },
];

export const THEMES: Theme[] = originalThemes.map(glassify);


export const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'nexus',
    name: 'NEXUS',
    icon: NexusIcon,
    tiers: [
      { id: 'nexus-free', name: 'NEXUS FREE', status: 'connected', apiKey: 'mock_nexus_free_key', usage: 120, limit: 1000, tokensUsed: 120000, cost: 0, rateLimitRpm: 60, rateLimitTpm: 10000 },
      { id: 'nexus-pro', name: 'NEXUS PRO', status: 'disconnected', apiKey: undefined, usage: 0, limit: 10000, tokensUsed: 0, cost: 0, rateLimitRpm: 600, rateLimitTpm: 100000 },
      { id: 'nexus-max', name: 'NEXUS MAX', status: 'disconnected', apiKey: undefined, usage: 0, limit: 100000, tokensUsed: 0, cost: 0, rateLimitRpm: 1200, rateLimitTpm: 200000 },
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: OpenAIIcon,
    tiers: [
      { id: 'gpt-4', name: 'GPT-4', status: 'connected', apiKey: 'mock_openai_gpt4_key', usage: 780, limit: 1000, tokensUsed: 7800000, cost: 25.50, rateLimitRpm: 60, rateLimitTpm: 80000 },
      { id: 'gpt-3.5', name: 'GPT 3.5', status: 'connected', apiKey: 'mock_openai_gpt3.5_key', usage: 250, limit: 10000, tokensUsed: 2500000, cost: 5.10, rateLimitRpm: 1000, rateLimitTpm: 160000 },
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: GeminiIcon,
    tiers: [
       { id: 'gemini-pro', name: 'Gemini Pro', status: 'disconnected', apiKey: undefined, usage: 0, limit: 1000, tokensUsed: 0, cost: 0, rateLimitRpm: 60, rateLimitTpm: 100000 },
    ]
  },
  {
    id: 'llama',
    name: 'Llama',
    icon: LlamaIcon,
    tiers: [
       { id: 'llama-3', name: 'Llama 3', status: 'disconnected', apiKey: undefined, usage: 0, limit: 1000, tokensUsed: 0, cost: 0, rateLimitRpm: 60, rateLimitTpm: 100000 },
    ]
  },
   {
    id: 'claude',
    name: 'Claude',
    icon: ClaudeIcon,
    tiers: [
       { id: 'claude-3-opus', name: 'Claude 3 Opus', status: 'disconnected', apiKey: undefined, usage: 0, limit: 1000, tokensUsed: 0, cost: 0, rateLimitRpm: 60, rateLimitTpm: 100000 },
       { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', status: 'connected', apiKey: 'mock_claude_sonnet_key', usage: 320, limit: 5000, tokensUsed: 320000, cost: 3.20, rateLimitRpm: 100, rateLimitTpm: 40000 },
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: HuggingFaceIcon,
    tiers: [
       { id: 'inference-api', name: 'Inference API', status: 'disconnected', apiKey: undefined, usage: 0, limit: 10000, tokensUsed: 0, cost: 0, rateLimitRpm: 60, rateLimitTpm: 100000 },
    ]
  }
];