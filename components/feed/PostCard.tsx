import React, { useState, useContext, useRef, useEffect } from 'react';
import type { Post, CryptoCurrency } from '../../types';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import { HeartIcon, RepeatIcon, MessageCircleIcon, GiftIcon, MoreHorizontalIcon, VerifiedIcon, SparklesIcon, GamepadIcon, UserPlusIcon, UserCheckIcon, SlashIcon } from '../icons/Icons';
import TipDropdown from './TipDropdown';
import TipModal from './TipModal';
import PostDetailModal from './PostDetailModal';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const context = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [isTipDropdownOpen, setTipDropdownOpen] = useState(false);
  const [isTipModalOpen, setTipModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const tipButtonRef = useRef<HTMLButtonElement>(null);

  const [isOptionsOpen, setOptionsOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Poll State
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [currentVotes, setCurrentVotes] = useState(post.poll?.votes || []);
  const totalVotes = currentVotes.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (tipButtonRef.current && !tipButtonRef.current.contains(event.target as Node)) {
        setTipDropdownOpen(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!context) return null;
  const { addNxg, updatePost, currentUser, toggleFollow, viewGame, viewProfile, blockUser, unblockUser } = context;

  const handleLike = () => {
    const rewards = post.engagementRewards;

    if (!isLiked) {
        setLikeCount(prev => prev + 1);
        if (rewards && rewards.rewardPerLike > 0 && rewards.spentBudget + rewards.rewardPerLike <= rewards.totalBudget) {
            addNxg(rewards.rewardPerLike);
            updatePost(post.id, {
                engagementRewards: { ...rewards, spentBudget: rewards.spentBudget + rewards.rewardPerLike }
            });
        } else {
            addNxg(0.001);
        }
    } else {
        setLikeCount(prev => prev - 1);
    }
    setIsLiked(!isLiked);
  };

  const handleRepost = () => {
    if (!isReposted) {
        const rewards = post.engagementRewards;
        setIsReposted(true);
        setRepostCount(prev => prev + 1);

        if (rewards && rewards.rewardPerRepost > 0 && rewards.spentBudget + rewards.rewardPerRepost <= rewards.totalBudget) {
            addNxg(rewards.rewardPerRepost);
            updatePost(post.id, {
                engagementRewards: { ...rewards, spentBudget: rewards.spentBudget + rewards.rewardPerRepost }
            });
        } else {
            addNxg(0.01);
        }
    }
  };

  const handleTipSelect = (crypto: CryptoCurrency) => {
    setSelectedCrypto(crypto);
    setTipModalOpen(true);
    setTipDropdownOpen(false);
  };
  
  const handleContribute = () => {
    if (post.tipGoal) {
      handleTipSelect(post.tipGoal.crypto as CryptoCurrency);
    }
  }

  const openPostModal = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    setPostModalOpen(true);
  };

  const handleVote = (e: React.MouseEvent, optionIndex: number) => {
    e.stopPropagation();
    if (votedOption === null) {
      setVotedOption(optionIndex);
      const newVotes = [...currentVotes];
      newVotes[optionIndex]++;
      setCurrentVotes(newVotes);
      addNxg(0.005);
    }
  };
  
  const isFollowing = currentUser.following.includes(post.author.id);
  const isOwnPost = currentUser.id === post.author.id;
  const isBlocked = currentUser.blockedUsers?.includes(post.author.id) || false;

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow(post.author.id);
    setOptionsOpen(false);
  };

  const handleToggleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBlocked) {
      unblockUser(post.author.id);
    } else {
      blockUser(post.author.id);
    }
    setOptionsOpen(false);
  };

  return (
    <>
      <Card className="hover:border-[var(--accent-primary)] transition-all duration-300 cursor-pointer" onClick={openPostModal}>
        <div className="flex items-start space-x-4">
          <button onClick={(e) => { e.stopPropagation(); viewProfile(post.author); }}>
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-[var(--accent-primary)] transition-all"
              />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                <button className="font-bold text-[var(--text-primary)] hover:underline" onClick={(e) => { e.stopPropagation(); viewProfile(post.author); }}>
                    {post.author.name}
                </button>
                {post.author.verified && <VerifiedIcon />}
                <span className="text-sm text-[var(--text-secondary)]">· {post.timestamp}</span>
                {!isOwnPost && (
                  <>
                    <span className="text-sm text-[var(--text-secondary)]">·</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(post.author.id);
                      }}
                      className={`text-sm font-semibold ${isFollowing ? 'text-[var(--text-secondary)]' : 'text-[var(--accent-primary)]'} hover:underline`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </>
                )}
              </div>
              <div className="relative" ref={optionsMenuRef}>
                  {!isOwnPost && (
                    <button onClick={(e) => { e.stopPropagation(); setOptionsOpen(p => !p); }} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] p-1 rounded-full">
                        <MoreHorizontalIcon />
                    </button>
                  )}
                  {isOptionsOpen && !isOwnPost && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl z-40 animate-fade-in-down">
                      <button onClick={handleToggleFollow} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-glass)]">
                        {isFollowing ? <UserCheckIcon className="w-5 h-5 text-green-500"/> : <UserPlusIcon className="w-5 h-5"/>}
                        <span className="truncate">{isFollowing ? 'Unfollow' : 'Follow'} @{post.author.username}</span>
                      </button>
                      <button onClick={handleToggleBlock} className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--bg-glass)] ${isBlocked ? 'text-yellow-400' : 'text-red-400'}`}>
                        <SlashIcon className="w-5 h-5"/>
                        <span className="truncate">{isBlocked ? 'Unblock' : 'Block'} @{post.author.username}</span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
            <p className="mt-1 text-[var(--text-primary)] whitespace-pre-wrap">{post.content}</p>
            
            {/* Attachments */}
            {post.image && <img src={post.image} alt="Post content" className="mt-4 rounded-lg w-full object-cover max-h-96" />}
            
            {post.poll && (
              <div className="mt-4 space-y-2">
                {post.poll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (currentVotes[index] / totalVotes) * 100 : 0;
                  const isVotedFor = votedOption === index;
                  return (
                    <button key={index} onClick={(e) => handleVote(e, index)} disabled={votedOption !== null} className="w-full text-left rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02] disabled:cursor-default disabled:hover:scale-100">
                      <div className={`relative p-3 border rounded-lg ${isVotedFor ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                        {votedOption !== null && <div style={{width: `${percentage}%`}} className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-30 rounded-lg transition-all duration-500"></div>}
                        <div className="relative flex justify-between items-center font-semibold">
                          <span className={`${isVotedFor ? 'text-[var(--accent-primary)]' : 'text-white'}`}>{option}</span>
                          {votedOption !== null && <span className="text-sm text-[var(--text-secondary)]">{percentage.toFixed(0)}%</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {post.attachedGame && (
              <button
                onClick={(e) => {e.preventDefault(); e.stopPropagation(); viewGame(post.attachedGame!)}} 
                className="mt-4 w-full border border-[var(--border-color)] rounded-lg flex items-center gap-4 p-3 hover:bg-[var(--bg-glass)] transition-colors text-left"
              >
                <img src={post.attachedGame.thumbnail} className="w-24 h-16 object-cover rounded" alt={post.attachedGame.title} />
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-secondary)]">Game Attached</p>
                  <h4 className="font-bold text-white">{post.attachedGame.title}</h4>
                </div>
                <div className="px-4 py-2 font-semibold text-sm text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full hover:opacity-90 flex items-center gap-2">
                  <GamepadIcon className="w-4 h-4" />
                  Play
                </div>
              </button>
            )}

            {post.tipGoal && (
              <div className="mt-4 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-semibold text-sm text-white">Engagement Goal</h4>
                  <p className="text-sm font-bold"><span className="text-[var(--accent-primary)]">{post.tipGoal.currentAmount.toLocaleString()}</span> / {post.tipGoal.goalAmount.toLocaleString()} {post.tipGoal.crypto.symbol}</p>
                </div>
                <div className="w-full bg-[var(--bg-glass)] rounded-full h-2.5"><div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] h-2.5 rounded-full" style={{ width: `${Math.min(100, (post.tipGoal.currentAmount / post.tipGoal.goalAmount) * 100)}%` }}></div></div>
                <button onClick={(e) => { e.stopPropagation(); handleContribute(); }} className="mt-3 w-full py-2 text-sm font-semibold border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-colors">Contribute</button>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center text-[var(--text-secondary)]">
              <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className={`flex items-center gap-2 hover:text-pink-500 transition-colors ${isLiked ? 'text-pink-500' : ''}`}><HeartIcon filled={isLiked} /><span className="text-sm">{likeCount.toLocaleString()}</span></button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRepost(); }} 
                className={`flex items-center gap-2 transition-colors ${isReposted ? 'text-neon-purple cursor-default' : 'hover:text-purple-500'}`}
              >
                <RepeatIcon />
                <span className="text-sm">{repostCount.toLocaleString()}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPostModalOpen(true); }} className="flex items-center gap-2 hover:text-blue-500 transition-colors"><MessageCircleIcon /><span className="text-sm">{post.comments.length.toLocaleString()}</span></button>
              <div className="relative" ref={tipButtonRef as any}>
                <button onClick={(e) => { e.stopPropagation(); setTipDropdownOpen(prev => !prev); }} className="flex items-center gap-2 hover:text-yellow-500 transition-colors"><GiftIcon /><span className="hidden sm:inline text-sm">Tip</span></button>
                {isTipDropdownOpen && <TipDropdown onSelect={handleTipSelect} />}
              </div>
            </div>
            {post.engagementRewards && (
                <div className="mt-3 pt-3 border-t border-[var(--border-color)] text-xs flex items-center gap-2 text-green-400/80">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Earn NXG for likes, reposts, & comments! ({post.engagementRewards.spentBudget.toFixed(4)} / {post.engagementRewards.totalBudget} NXG spent)</span>
                </div>
            )}
          </div>
        </div>
      </Card>
      
      {selectedCrypto && <TipModal isOpen={isTipModalOpen} onClose={() => setTipModalOpen(false)} crypto={selectedCrypto} recipient={post.author} />}
      <PostDetailModal isOpen={isPostModalOpen} onClose={() => setPostModalOpen(false)} post={post} />
    </>
  );
};

export default PostCard;