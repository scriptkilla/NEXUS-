import React, { useState, useContext, useRef } from 'react';
import type { Post, Comment, User } from '../../types';
import Modal from '../ui/Modal';
import { VerifiedIcon, HeartIcon, RepeatIcon, MessageCircleIcon, GiftIcon } from '../icons/Icons';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import TipModal from './TipModal';
import { CRYPTO_CURRENCIES } from '../../constants';

interface CommentItemProps {
  comment: Comment;
  onProfileClick: (user: User) => void;
  onReplyClick: (username: string) => void;
  onTipClick: (user: User) => void;
  onCommentUpdate: (commentId: string, updates: Partial<Comment>) => void;
  addNxg: (amount: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onProfileClick, onReplyClick, onTipClick, onCommentUpdate, addNxg }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  const handleLike = () => {
    const newLikes = isLiked ? comment.likes - 1 : comment.likes + 1;
    onCommentUpdate(comment.id, { likes: newLikes });
    setIsLiked(!isLiked);
    if (!isLiked) {
      addNxg(0.001); // Reward for liking a comment
    }
  };

  const handleRepost = () => {
    if (isReposted) return;
    const newReposts = (comment.reposts || 0) + 1;
    onCommentUpdate(comment.id, { reposts: newReposts });
    setIsReposted(true);
    addNxg(0.01); // Reward for reposting a comment
  };

  return (
    <div className="flex items-start space-x-3 py-4 border-b border-[var(--border-color)]">
      <button onClick={() => onProfileClick(comment.user)}>
        <img 
          src={comment.user.avatar} 
          alt={comment.user.name} 
          className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-[var(--accent-primary)] transition-all"
        />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onProfileClick(comment.user)} className="font-bold text-sm text-[var(--text-primary)] cursor-pointer hover:underline">
            {comment.user.name}
          </button>
          {comment.user.verified && <VerifiedIcon className="w-4 h-4" />}
          <span className="text-xs text-[var(--text-secondary)]">· {comment.timestamp}</span>
        </div>
        <p className="text-sm text-[var(--text-primary)] mt-1 whitespace-pre-wrap">{comment.content}</p>
        <div className="flex items-center gap-x-4 gap-y-1 mt-2 text-xs text-[var(--text-secondary)] flex-wrap">
          <button onClick={handleLike} className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${isLiked ? 'text-pink-500' : ''}`}>
            <HeartIcon filled={isLiked} className="w-4 h-4" /> {comment.likes}
          </button>
          <button onClick={() => onReplyClick(comment.user.username)} className="flex items-center gap-1 font-semibold hover:underline">
            <MessageCircleIcon className="w-4 h-4" /> Reply
          </button>
          <button onClick={handleRepost} disabled={isReposted} className={`flex items-center gap-1 transition-colors ${isReposted ? 'text-neon-purple cursor-default' : 'hover:text-purple-500'}`}>
            <RepeatIcon className="w-4 h-4" /> {comment.reposts || 0}
          </button>
          <button onClick={() => onTipClick(comment.user)} className="flex items-center gap-1 font-semibold hover:text-yellow-500 hover:underline">
            <GiftIcon className="w-4 h-4" /> Tip
          </button>
        </div>
      </div>
    </div>
  );
};

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post }) => {
  const context = useContext(AppContext);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  
  // States for Tip Modal
  const [isTipModalOpen, setTipModalOpen] = useState(false);
  const [tipRecipient, setTipRecipient] = useState<User | null>(null);
  const nxgCurrency = CRYPTO_CURRENCIES.find(c => c.symbol === 'NXG') || CRYPTO_CURRENCIES[0];

  if (!context) return null;
  const { currentUser, addNxg, updatePost, viewProfile } = context;

  const handleProfileClick = (user: User) => {
    onClose();
    viewProfile(user);
  };

  const handleCommentUpdate = (commentId: string, updates: Partial<Comment>) => {
    const updatedComments = comments.map(c => (c.id === commentId ? { ...c, ...updates } : c));
    setComments(updatedComments);
    updatePost(post.id, { comments: updatedComments });
  };

  const handleReplyClick = (username: string) => {
    setNewComment(prev => `@${username} ${prev}`);
    textInputRef.current?.focus();
  };
  
  const handleTipClick = (user: User) => {
    setTipRecipient(user);
    setTipModalOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      const comment: Comment = {
        id: `c${Date.now()}`,
        user: currentUser,
        content: newComment,
        likes: 0,
        reposts: 0,
        timestamp: 'Just now'
      };
      const newComments = [comment, ...comments];
      setComments(newComments);
      setNewComment('');
      
      updatePost(post.id, { comments: newComments });

      const rewards = post.engagementRewards;
      if (rewards && rewards.rewardPerComment > 0 && rewards.spentBudget + rewards.rewardPerComment <= rewards.totalBudget) {
          addNxg(rewards.rewardPerComment);
          updatePost(post.id, {
              engagementRewards: { ...rewards, spentBudget: rewards.spentBudget + rewards.rewardPerComment }
          });
      } else {
        addNxg(0.01); // Standard reward for a comment
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-3xl">
        <Card className="!p-0 !bg-[var(--bg-secondary)]">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <button onClick={() => handleProfileClick(post.author)}>
                  <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-[var(--accent-primary)] transition-all"
                  />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <button onClick={() => handleProfileClick(post.author)} className="font-bold text-[var(--text-primary)] cursor-pointer hover:underline">
                      {post.author.name}
                  </button>
                  {post.author.verified && <VerifiedIcon />}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">{post.timestamp}</span>
              </div>
            </div>
            <p className="mt-4 text-[var(--text-primary)] text-lg whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <img src={post.image} alt="Post content" className="mt-4 rounded-lg w-full object-cover" />
            )}
            <div className="mt-4 flex gap-4 text-sm text-[var(--text-secondary)] border-y border-[var(--border-color)] py-2">
              <span><strong className="text-white">{post.likes.toLocaleString()}</strong> Likes</span>
              <span><strong className="text-white">{post.reposts.toLocaleString()}</strong> Reposts</span>
            </div>
          </div>

          <div className="p-6 border-t border-[var(--border-color)]">
            <form onSubmit={handleAddComment} className="flex items-start gap-3">
              <img src={currentUser?.avatar} alt="current user" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <textarea
                  ref={textInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all text-sm"
                  rows={2}
                  placeholder="Post your reply"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button type="submit" className="px-5 py-1.5 font-semibold text-sm text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!newComment.trim()}>
                    Reply
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="max-h-96 overflow-y-auto px-6">
            {comments.map(comment => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                onProfileClick={handleProfileClick}
                onReplyClick={handleReplyClick}
                onTipClick={handleTipClick}
                onCommentUpdate={handleCommentUpdate}
                addNxg={addNxg}
              />
            ))}
          </div>
        </Card>
      </Modal>

      {isTipModalOpen && tipRecipient && (
        <TipModal 
          isOpen={isTipModalOpen}
          onClose={() => setTipModalOpen(false)}
          crypto={nxgCurrency}
          recipient={tipRecipient}
        />
      )}
    </>
  );
};

export default PostDetailModal;