import React, { useContext } from 'react';
import type { Post } from '../../types';
import PostCard from './PostCard';
import { AppContext } from '../context/AppContext';

interface FeedViewProps {}

const FeedView: React.FC<FeedViewProps> = () => {
  const context = useContext(AppContext);
  
  if (!context) return null;

  const { posts, currentUser } = context;
  const blockedUserIds = new Set(currentUser?.blockedUsers || []);

  const filteredPosts = posts.filter(post => !blockedUserIds.has(post.author.id));

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div className="space-y-6">
        {filteredPosts.map(post => (<PostCard key={post.id} post={post} />))}
      </div>
    </div>
  );
};

export default FeedView;