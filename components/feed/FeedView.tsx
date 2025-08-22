import React, { useContext, useState, useMemo } from 'react';
import type { Post } from '../../types';
import PostCard from './PostCard';
import { AppContext } from '../context/AppContext';

type Tab = 'forYou' | 'following' | 'trending';

const FeedView: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<Tab>('forYou');

  if (!context) return null;

  const { posts, currentUser, searchQuery } = context;

  const displayedPosts = useMemo(() => {
    const blockedUserIds = new Set(currentUser?.blockedUsers || []);
    let basePosts = posts.filter(post => !blockedUserIds.has(post.author.id));

    // Apply search filter first
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        basePosts = basePosts.filter(post =>
            post.content.toLowerCase().includes(lowercasedQuery) ||
            post.author.name.toLowerCase().includes(lowercasedQuery) ||
            post.author.username.toLowerCase().includes(lowercasedQuery)
        );
    }

    switch (activeTab) {
      case 'following':
        return basePosts.filter(post =>
          currentUser.following.includes(post.author.id)
        );
      case 'trending':
        return [...basePosts].sort(
          (a, b) => (b.likes + b.reposts) - (a.likes + a.reposts)
        );
      case 'forYou':
      default:
        return basePosts;
    }
  }, [posts, currentUser, activeTab, searchQuery]);

  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full py-4 text-center font-semibold transition-colors duration-300 ${
        activeTab === tab
          ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
          : 'text-[var(--text-secondary)] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
  
  return (
    <div className="w-full">
      <div className="sticky top-16 md:top-20 z-20 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-lg">
          <nav className="flex max-w-3xl mx-auto border-b border-[var(--border-color)]">
            <TabButton tab="forYou" label="For You" />
            <TabButton tab="following" label="Following" />
            <TabButton tab="trending" label="Trending" />
          </nav>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full space-y-6 mt-6">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-20 text-[var(--text-secondary)]">
            <p className="text-lg font-semibold">
                {searchQuery ? 'No Results Found' : "It's quiet in here..."}
            </p>
            <p className="mt-1">
              {searchQuery 
                ? `Your search for "${searchQuery}" did not return any results.`
                : activeTab === 'forYou' 
                ? 'Follow some people or check back later for new posts!'
                : activeTab === 'following'
                ? 'Posts from people you follow will appear here.'
                : 'There are no trending posts right now.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedView;
