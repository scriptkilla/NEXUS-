import type { User } from './types';

// Mock user data to simulate a database and avoid Firebase.
// This is a subset of data from constants.tsx to avoid circular dependencies.
const mockUserDb: { [email: string]: User } = {
  'tommy@nexus.io': { id: 'u1', name: 'Tommy Crypto', username: 'TommyCrypto', avatar: 'https://picsum.photos/seed/aurora/100/100', verified: true, email: 'tommy@nexus.io', coverPhoto: 'https://picsum.photos/seed/aurora-bg/1200/400', following: ['u3'], customCss: '', bio: 'Digital explorer & P2E game creator on NEXUS. Building the future, one block at a time. 🚀', referralCode: 'NEXUSTOMMY', referralCount: 5, miningBoost: 1.5, isMining: true, referredUsers: ['u2', 'u3', 'u4', 'u5', 'u6'], createdGames: [], blockedUsers: [], playedGames: ['g1', 'g2', 'g3', 'g4', 'g8', 'g12'], achievements: ['a1', 'a2', 'a3', 'a4'], isTwoFactorEnabled: false },
  'byteflow@example.com': { id: 'u2', name: 'ByteFlow', username: 'byteflow', avatar: 'https://picsum.photos/seed/byteflow/100/100', verified: false, email: 'byteflow@example.com', coverPhoto: 'https://picsum.photos/seed/byteflow-bg/1200/400', following: [], customCss: '', bio: 'Full-stack dev exploring the decentralized web. Fascinated by ZK-proofs and on-chain gaming.', referralCode: 'NEXUSBYTE', referralCount: 0, miningBoost: 1.0, isMining: false, referredUsers: [], createdGames: [], blockedUsers: [], playedGames: ['g1', 'g7', 'g11'], achievements: ['a1'], isTwoFactorEnabled: false },
  'cypher@example.com': { id: 'u3', name: 'Cypher', username: 'cypher', avatar: 'https://picsum.photos/seed/cypher/100/100', verified: true, email: 'cypher@example.com', coverPhoto: 'https://picsum.photos/seed/cypher-bg/1200/400', following: ['u1', 'u4'], customCss: '', bio: 'Security researcher & white-hat hacker. If it can be built, it can be broken.', referralCode: 'NEXUSCYPHER', referralCount: 2, miningBoost: 1.2, isMining: true, referredUsers: [], createdGames: [], blockedUsers: [], playedGames: ['g2', 'g3', 'g9'], achievements: ['a2', 'a3'], isTwoFactorEnabled: true },
};

export const signUp = async (email: string, password: string, name: string, username: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (mockUserDb[email.toLowerCase()]) {
        throw new Error("This email address is already in use.");
    }
    if (password.length < 6) {
        throw new Error("Password should be at least 6 characters.");
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        username,
        email: email,
        avatar: `https://picsum.photos/seed/${username}/100/100`,
        verified: false,
        coverPhoto: `https://picsum.photos/seed/${username}-bg/1200/400`,
        following: [],
        blockedUsers: [],
        customCss: '',
        bio: 'Just joined NEXUS!',
        referralCode: `NEXUS${username.toUpperCase()}`,
        referralCount: 0,
        miningBoost: 1.0,
        isMining: false,
        referredUsers: [],
        createdGames: [],
        playedGames: [],
        achievements: [],
        isTwoFactorEnabled: false,
    };
    
    // Add to our mock DB for this session so they can log in right after.
    mockUserDb[email.toLowerCase()] = newUser;

    return newUser;
};

export const signIn = async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Password is ignored in this mock implementation for simplicity
    const user = mockUserDb[email.toLowerCase()];

    if (user) {
        return user;
    } else {
        throw new Error("Invalid email or password. Try tommy@nexus.io or sign up.");
    }
};
