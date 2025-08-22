

import { MOCK_POSTS, MOCK_USERS, MOCK_WALLETS, CRYPTO_CURRENCIES, MOCK_NETWORKS, MOCK_GAMES, MOCK_LIVE_STREAMS, API_PROVIDERS, THEMES, MOCK_CONVERSATIONS } from './constants';
import type { Post, User, Wallet, CryptoCurrency, Network, Game, LiveStream, ApiProvider, ApiKeyTier, NotificationSettings, PrivacySettings, Theme, Conversation, DirectMessage } from './types';

function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    if (Array.isArray(obj)) {
        const arrCopy: any[] = [];
        for (const item of obj) {
            arrCopy.push(deepClone(item));
        }
        return arrCopy as any as T;
    }

    const objCopy: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            objCopy[key] = deepClone((obj as any)[key]);
        }
    }
    return objCopy as T;
}


// --- IN-MEMORY "DATABASE" ---
const db = {
  users: deepClone(Object.values(MOCK_USERS)),
  posts: deepClone(MOCK_POSTS),
  wallets: deepClone(MOCK_WALLETS),
  games: deepClone(MOCK_GAMES),
  liveStreams: deepClone(MOCK_LIVE_STREAMS),
  networks: deepClone(MOCK_NETWORKS),
  currencies: deepClone(CRYPTO_CURRENCIES),
  apiProviders: deepClone(API_PROVIDERS),
  conversations: deepClone(MOCK_CONVERSATIONS),
  themes: deepClone(THEMES),
};

const SIMULATED_DELAY = 600;

const simulateDelay = () => new Promise(res => setTimeout(res, SIMULATED_DELAY));

// --- AUTH API ---
export async function login(email: string, password: string): Promise<User> {
    await simulateDelay();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        throw new Error("User not found with that email address.");
    }
    // In a real app, we'd check an encrypted password. Here, we'll just succeed.
    return deepClone(user);
}

export async function signup(data: { name: string, username: string, email: string, password: string }): Promise<User> {
    await simulateDelay();
    const { name, username, email } = data;
    
    // Check if email or username already exists
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
    }
    if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error("This username is already taken.");
    }

    const newUser: User = {
        id: `u${Date.now()}`,
        name,
        username,
        email,
        avatar: `https://picsum.photos/seed/${username}/100/100`,
        coverPhoto: `https://picsum.photos/seed/${username}-bg/1200/400`,
        verified: false,
        following: [],
        blockedUsers: [],
        bio: '',
        customCss: '',
        referralCode: `NEXUS${username.toUpperCase()}`,
        referralCount: 0,
        miningBoost: 1.0,
        isMining: false,
        isTwoFactorEnabled: false,
        playedGames: [],
        achievements: [],
        createdGames: [],
        referredUsers: [],
    };
    
    db.users.push(newUser);
    
    // Also create a default wallet for the new user
    const newWallet: Wallet = {
        id: `w${Date.now()}`,
        name: `${name}'s Wallet`,
        userId: newUser.id,
        address: `Gf${Math.random().toString(36).substring(2, 15)}...`,
        balances: { 'NXG': 1000 }, // Give some starting NXG
        seedPhrase: 'new user seed phrase mock random words apple banana cherry dog elephant',
    };
    db.wallets.push(newWallet);
    
    return deepClone(newUser);
}


// --- FETCH API ---

export async function fetchInitialData() {
    await simulateDelay();
    
    return {
        users: [...db.users],
        posts: [...db.posts],
        wallets: [...db.wallets],
        games: [...db.games],
        liveStreams: [...db.liveStreams],
        networks: [...db.networks],
        currencies: [...db.currencies],
        apiProviders: [...db.apiProviders],
        conversations: [...db.conversations],
    };
}

// --- MUTATION API ---

// User Mutations
export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await simulateDelay();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    return { ...db.users[userIndex] };
}

export async function toggleFollow(currentUserId: string, targetUserId: string): Promise<User> {
    await simulateDelay();
    const user = db.users.find(u => u.id === currentUserId);
    if (!user) throw new Error("Current user not found");

    const isFollowing = user.following.includes(targetUserId);
    user.following = isFollowing
        ? user.following.filter(id => id !== targetUserId)
        : [...user.following, targetUserId];
    
    return { ...user };
}

export async function blockUser(currentUserId: string, targetUserId: string): Promise<User> {
    await simulateDelay();
    const user = db.users.find(u => u.id === currentUserId);
    if (!user) throw new Error("Current user not found");
    
    const blocked = user.blockedUsers || [];
    if (!blocked.includes(targetUserId)) {
        user.blockedUsers = [...blocked, targetUserId];
    }
    return { ...user };
}

export async function unblockUser(currentUserId: string, targetUserId: string): Promise<User> {
    await simulateDelay();
    const user = db.users.find(u => u.id === currentUserId);
    if (!user) throw new Error("Current user not found");
    user.blockedUsers = (user.blockedUsers || []).filter(id => id !== targetUserId);
    return { ...user };
}

export async function reportUser(reporterId: string, reportedId: string, reason: string, details: string): Promise<void> {
    await simulateDelay();
    console.log(`API: User ${reporterId} reported user ${reportedId}. Reason: ${reason}. Details: "${details}"`);
}

// Post Mutations
export async function createPost(postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'reposts' | 'comments'>): Promise<Post> {
    await simulateDelay();
    const newPost: Post = {
        ...postData,
        id: `p${Date.now()}`,
        timestamp: 'Just now',
        likes: 0,
        reposts: 0,
        comments: [],
    };
    db.posts.unshift(newPost);
    return { ...newPost };
}

export async function updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
    await simulateDelay();
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");
    db.posts[postIndex] = { ...db.posts[postIndex], ...updates };
    return { ...db.posts[postIndex] };
}

// Wallet Mutations
export async function addNxg(walletId: string, amount: number): Promise<Wallet> {
    await simulateDelay();
    const wallet = db.wallets.find(w => w.id === walletId);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balances['NXG'] = (wallet.balances['NXG'] || 0) + amount;
    return { ...wallet };
}

export async function sendCrypto(walletId: string, symbol: string, amount: number): Promise<Wallet> {
    await simulateDelay();
    const wallet = db.wallets.find(w => w.id === walletId);
    if (!wallet) throw new Error("Wallet not found");
    if ((wallet.balances[symbol] || 0) < amount) throw new Error("Insufficient funds");
    wallet.balances[symbol] -= amount;
    return { ...wallet };
}

export async function swapCrypto(walletId: string, fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number): Promise<Wallet> {
    await simulateDelay();
    const wallet = db.wallets.find(w => w.id === walletId);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balances[fromSymbol] = (wallet.balances[fromSymbol] || 0) - fromAmount;
    wallet.balances[toSymbol] = (wallet.balances[toSymbol] || 0) + toAmount;
    return { ...wallet };
}

export async function addWallet(userId: string, name: string): Promise<Wallet[]> {
    await simulateDelay();
    const newWallet: Wallet = {
        id: `w${Date.now()}`,
        name,
        userId,
        address: `Gf${Math.random().toString(36).substring(2, 15)}...`,
        balances: { 'NXG': 0 },
        seedPhrase: 'new wallet seed phrase mock random words apple banana cherry dog elephant',
    };
    db.wallets.push(newWallet);
    const userWallets = db.wallets.filter(w => w.userId === userId);
    return [...userWallets];
}

// Config Mutations
export async function addNetwork(network: Omit<Network, 'id'>): Promise<Network[]> {
    await simulateDelay();
    const newNetwork: Network = { ...network, id: `net${Date.now()}` };
    db.networks.push(newNetwork);
    return [...db.networks];
}

export async function addCustomCoin(coin: Omit<CryptoCurrency, 'id' | 'icon' | 'gradient'>): Promise<{currencies: CryptoCurrency[], newCoin: CryptoCurrency}> {
    await simulateDelay();
    const newCoin: CryptoCurrency = {
        ...coin,
        id: `cc-${Date.now()}`,
        icon: () => null, // Icon component reference cannot be stored in "DB"
        gradient: 'from-gray-500 to-gray-700',
    };
    db.currencies.push(newCoin);
    return { currencies: [...db.currencies], newCoin };
}

export async function addKnownCoinToWallet(walletId: string, coinId: string): Promise<Wallet> {
    await simulateDelay();
    const wallet = db.wallets.find(w => w.id === walletId);
    const coin = db.currencies.find(c => c.id === coinId);
    if (!wallet || !coin) throw new Error("Wallet or coin not found");
    
    if (!(coin.symbol in wallet.balances)) {
        wallet.balances[coin.symbol] = 0;
    }
    return { ...wallet };
}

export async function updateApiTier(providerId: string, tierId: string, updates: Partial<ApiKeyTier>): Promise<ApiProvider[]> {
    await simulateDelay();
    const provider = db.apiProviders.find(p => p.id === providerId);
    if (!provider) throw new Error("Provider not found");
    const tier = provider.tiers.find(t => t.id === tierId);
    if (!tier) throw new Error("Tier not found");

    Object.assign(tier, updates);
    return JSON.parse(JSON.stringify(db.apiProviders));
}

// Game Mutations
export async function playGame(gameId: string, creatorId?: string): Promise<{ games: Game[], wallets?: Wallet[] }> {
    await simulateDelay();
    const game = db.games.find(g => g.id === gameId);
    if (!game) throw new Error("Game not found");
    game.playCount += 1;
    
    let updatedWallets;
    if (creatorId) {
        const creatorWallet = db.wallets.find(w => w.userId === creatorId);
        if (creatorWallet) {
            creatorWallet.balances['NXG'] = (creatorWallet.balances['NXG'] || 0) + 0.01;
        }
        updatedWallets = [...db.wallets];
    }

    return { games: [...db.games], wallets: updatedWallets };
}

export async function publishGame(creatorId: string, newGameData: Omit<Game, 'id' | 'creatorId' | 'playCount'>): Promise<Game[]> {
    await simulateDelay();
    const newGame: Game = {
        ...newGameData,
        id: `g${Date.now()}`,
        creatorId: creatorId,
        playCount: 0,
    };
    db.games.unshift(newGame);
    return [...db.games];
}

// Live Stream Mutations
export async function goLive(creator: User, title: string, gameId?: string): Promise<LiveStream[]> {
    await simulateDelay();
    const game = gameId ? db.games.find(g => g.id === gameId) : undefined;
    const newStream: LiveStream = {
        id: `ls${Date.now()}`,
        title,
        creator,
        viewerCount: 1,
        thumbnail: `https://picsum.photos/seed/live${Date.now()}/600/400`,
        game,
    };
    db.liveStreams.unshift(newStream);
    return [...db.liveStreams];
}

export async function sendMessage(
    conversationId: string, 
    senderId: string, 
    content: string,
    attachment?: { type: 'image'; url: string } | { type: 'game'; gameId: string }
): Promise<Conversation> {
    await simulateDelay();
    const conversation = db.conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const newMessage: DirectMessage = {
        id: `m${Date.now()}`,
        senderId,
        content,
        timestamp: 'Just now',
        type: attachment?.type || 'text',
        attachmentUrl: attachment?.type === 'image' ? attachment.url : undefined,
        attachedGameId: attachment?.type === 'game' ? attachment.gameId : undefined,
    };

    conversation.messages.push(newMessage);
    return deepClone(conversation);
}
