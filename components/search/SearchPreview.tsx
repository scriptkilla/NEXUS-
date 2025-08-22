import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import type { User, Post, Game } from '../../types';
import { UserIcon, MessageCircleIcon, GamepadIcon, VerifiedIcon } from '../icons/Icons';

interface SearchPreviewProps {
    onUserClick: (user: User) => void;
    onPostClick: (post: Post) => void;
    onGameClick: (game: Game) => void;
    onHashtagClick: (tag: string) => void;
}

const SearchResult: React.FC<{ children: React.ReactNode, onClick: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors">
        {children}
    </button>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-3 pt-3 pb-1 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{children}</h3>
);

const SearchPreview: React.FC<SearchPreviewProps> = ({ onUserClick, onPostClick, onGameClick, onHashtagClick }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { searchQuery, allUsers, posts, games } = context;
    const lowercasedQuery = searchQuery.toLowerCase();

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return [];
        return allUsers.filter(u => 
            u.name.toLowerCase().includes(lowercasedQuery) || 
            u.username.toLowerCase().includes(lowercasedQuery)
        ).slice(0, 3);
    }, [searchQuery, allUsers, lowercasedQuery]);

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return [];
        return posts.filter(p => p.content.toLowerCase().includes(lowercasedQuery)).slice(0, 3);
    }, [searchQuery, posts, lowercasedQuery]);

    const filteredGames = useMemo(() => {
        if (!searchQuery) return [];
        return games.filter(g => g.title.toLowerCase().includes(lowercasedQuery)).slice(0, 3);
    }, [searchQuery, games, lowercasedQuery]);
    
    const filteredHashtags = useMemo(() => {
        if (searchQuery.length < 2) return [];
        const allHashtags = new Set<string>();
        posts.forEach(post => {
            const matches = post.content.match(/#(\w+)/g);
            if (matches) {
                matches.forEach(match => allHashtags.add(match.toLowerCase()));
            }
        });
        return Array.from(allHashtags).filter(tag => tag.includes(lowercasedQuery)).slice(0, 3);
    }, [searchQuery, posts, lowercasedQuery]);

    const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0 || filteredGames.length > 0 || filteredHashtags.length > 0;

    return (
        <div className="absolute top-full mt-2 w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down z-50">
            <div className="max-h-[60vh] overflow-y-auto">
                {filteredUsers.length > 0 && (
                    <section>
                        <SectionHeader>Users</SectionHeader>
                        {filteredUsers.map(user => (
                            <SearchResult key={user.id} onClick={() => onUserClick(user)}>
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                <div className="overflow-hidden">
                                    <p className="font-semibold truncate flex items-center gap-1.5">{user.name} {user.verified && <VerifiedIcon className="w-4 h-4" />}</p>
                                    <p className="text-sm text-[var(--text-secondary)] truncate">@{user.username}</p>
                                </div>
                            </SearchResult>
                        ))}
                    </section>
                )}
                 {filteredPosts.length > 0 && (
                    <section>
                        <SectionHeader>Posts</SectionHeader>
                        {filteredPosts.map(post => (
                            <SearchResult key={post.id} onClick={() => onPostClick(post)}>
                                <MessageCircleIcon className="w-10 h-10 p-2.5 bg-[var(--bg-glass)] rounded-full text-[var(--text-secondary)] flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="text-sm text-[var(--text-primary)] truncate">{post.content}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">by {post.author.name}</p>
                                </div>
                            </SearchResult>
                        ))}
                    </section>
                )}
                {filteredGames.length > 0 && (
                    <section>
                        <SectionHeader>Games</SectionHeader>
                        {filteredGames.map(game => (
                            <SearchResult key={game.id} onClick={() => onGameClick(game)}>
                                <img src={game.thumbnail} alt={game.title} className="w-16 h-10 object-cover rounded flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="font-semibold truncate">{game.title}</p>
                                </div>
                            </SearchResult>
                        ))}
                    </section>
                )}
                {filteredHashtags.length > 0 && (
                     <section>
                        <SectionHeader>Hashtags</SectionHeader>
                        {filteredHashtags.map(tag => (
                            <SearchResult key={tag} onClick={() => onHashtagClick(tag)}>
                                <div className="w-10 h-10 flex items-center justify-center bg-[var(--bg-glass)] rounded-full font-bold text-lg text-[var(--text-secondary)]">#</div>
                                 <p className="font-semibold">{tag}</p>
                            </SearchResult>
                        ))}
                    </section>
                )}
                {!hasResults && (
                    <div className="p-8 text-center text-[var(--text-secondary)]">
                        <p>No results for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPreview;