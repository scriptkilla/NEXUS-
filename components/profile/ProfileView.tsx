
import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { VerifiedIcon, SettingsIcon, CameraIcon, ImageIcon, GamepadIcon, MoreHorizontalIcon, SlashIcon, FlagIcon } from '../icons/Icons';
import SettingsModal from './SettingsModal';
import ReportModal from './ReportModal';
import FollowListModal from './FollowListModal';
import GameListModal from './GameListModal';
import AchievementListModal from './AchievementListModal';
import { AppContext } from '../context/AppContext';
import { MOCK_ACHIEVEMENTS } from '../../constants';
import type { User, Game, Achievement } from '../../types';

interface ProfileViewProps {
    user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
    const context = useContext(AppContext);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isOptionsOpen, setOptionsOpen] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    
    const [followListModalState, setFollowListModalState] = useState<{
        isOpen: boolean;
        title: 'Followers' | 'Following';
        users: User[];
    }>({ isOpen: false, title: 'Followers', users: [] });

    const [gameListModalState, setGameListModalState] = useState<{
        isOpen: boolean;
        title: string;
        games: Game[];
    }>({ isOpen: false, title: '', games: [] });

    const [achievementListModalState, setAchievementListModalState] = useState<{
        isOpen: boolean;
        title: string;
        achievements: Achievement[];
    }>({ isOpen: false, title: '', achievements: [] });
    
    const avatarFileInputRef = useRef<HTMLInputElement>(null);
    const coverFileInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const styleId = 'user-profile-custom-css';
        
        const cleanup = () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.parentNode?.removeChild(styleElement);
            }
        };

        cleanup();

        if (user.customCss) {
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.innerHTML = user.customCss;
            document.head.appendChild(styleElement);
        }

        return cleanup;
    }, [user]);

    useEffect(() => {
      const handleClickOutside = (event: globalThis.MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
          setOptionsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!context) return null;

    const { currentUser, setCurrentUser, toggleFollow, viewGame, blockUser, unblockUser, games, allUsers } = context;
    
    const createdGames = useMemo(() => {
        return games.filter(g => g.creatorId === user.id);
    }, [games, user.id]);

    const followingUsers = useMemo(() => {
      return user.following.map(id => allUsers.find(u => u.id === id)).filter((u): u is User => !!u);
    }, [user.following, allUsers]);

    const followerUsers = useMemo(() => {
        return allUsers.filter(u => u.following.includes(user.id));
    }, [user.id, allUsers]);

    const isOwnProfile = currentUser.id === user.id;
    const isFollowing = currentUser.following.includes(user.id);
    const isBlocked = currentUser.blockedUsers?.includes(user.id) || false;

    const handleAvatarClick = () => {
        if (isOwnProfile) avatarFileInputRef.current?.click();
    };

    const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newAvatarUrl = URL.createObjectURL(event.target.files[0]);
            setCurrentUser({ avatar: newAvatarUrl });
        }
    };
    
    const handleCoverClick = () => {
        if (isOwnProfile) coverFileInputRef.current?.click();
    };

    const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newCoverUrl = URL.createObjectURL(event.target.files[0]);
            setCurrentUser({ coverPhoto: newCoverUrl });
        }
    };

    const handleBlockToggle = () => {
      if(isBlocked) {
        unblockUser(user.id);
      } else {
        blockUser(user.id);
      }
      setOptionsOpen(false);
    };

    const handleReport = () => {
        setOptionsOpen(false);
        setReportModalOpen(true);
    };
    
    const handleOpenFollowing = () => {
        setFollowListModalState({
            isOpen: true,
            title: 'Following',
            users: followingUsers
        });
    };

    const handleOpenFollowers = () => {
        setFollowListModalState({
            isOpen: true,
            title: 'Followers',
            users: followerUsers
        });
    };

    const handleOpenGamesPlayed = () => {
        const played = (user.playedGames || []).map(id => games.find(g => g.id === id)).filter((g): g is Game => !!g);
        setGameListModalState({
            isOpen: true,
            title: 'Games Played',
            games: played
        });
    };

    const handleOpenAchievements = () => {
        const unlocked = (user.achievements || []).map(id => MOCK_ACHIEVEMENTS.find(a => a.id === id)).filter((a): a is Achievement => !!a);
        setAchievementListModalState({
            isOpen: true,
            title: 'Achievements',
            achievements: unlocked
        });
    };

  return (
    <>
      <div className="space-y-8 animate-fade-in user-profile-page">
        <div className={`relative group h-48 md:h-64 rounded-2xl overflow-hidden ${isOwnProfile ? 'cursor-pointer' : ''}`} >
            <img src={isOwnProfile ? currentUser.coverPhoto : user.coverPhoto} className="w-full h-full object-cover" alt="Profile background"/>
            {isOwnProfile && (
                <div 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    onClick={handleCoverClick}
                >
                    <div className="flex items-center gap-2 text-white font-semibold p-3 bg-black/50 rounded-lg">
                        <ImageIcon className="w-6 h-6" />
                        <span>Change Cover</span>
                    </div>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        </div>
         <input
            type="file"
            ref={coverFileInputRef}
            onChange={handleCoverFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
        />

        <div className="relative px-4 md:px-6 -mt-16 md:-mt-20">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex items-end gap-4">
                      <div className={`relative group flex-shrink-0 ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
                        <img src={isOwnProfile ? currentUser.avatar : user.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--bg-secondary)] object-cover" alt={user.name}/>
                        {isOwnProfile && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                      />
                      <div className="pb-2">
                          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">{user.name} {user.verified && <VerifiedIcon className="w-6 h-6 md:w-7 md:h-7" />}</h1>
                          <p className="text-[var(--text-secondary)]">@{user.username}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2 self-stretch md:self-auto">
                      {isOwnProfile ? (
                        <button 
                            onClick={() => setSettingsOpen(true)}
                            className="w-full md:w-auto px-5 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors"
                        >
                            Edit Profile
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => toggleFollow(user.id)}
                            className={`w-full flex-1 md:w-auto md:flex-none px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isFollowing ? 'bg-[var(--bg-glass)] text-[var(--text-primary)] border border-[var(--border-color)]' : 'text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-90'}`}
                          >
                              {isFollowing ? 'Following' : 'Follow'}
                          </button>
                          <div className="relative" ref={optionsRef}>
                            <button onClick={() => setOptionsOpen(p => !p)} className="p-2.5 bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-lg hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] h-full">
                              <MoreHorizontalIcon className="w-5 h-5" />
                            </button>
                            {isOptionsOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl z-10 animate-fade-in-down">
                                <button onClick={handleBlockToggle} className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm ${isBlocked ? 'text-yellow-400' : 'text-red-400'} hover:bg-[var(--bg-glass)]`}>
                                  <SlashIcon className="w-5 h-5" />
                                  <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                                </button>
                                <button onClick={handleReport} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-white">
                                  <FlagIcon className="w-5 h-5" />
                                  <span>Report</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                  </div>
              </div>
        </div>
        
        {isBlocked ? (
          <Card className="text-center py-10">
            <SlashIcon className="w-12 h-12 mx-auto text-red-500" />
            <h2 className="mt-4 text-xl font-bold">User Blocked</h2>
            <p className="text-[var(--text-secondary)] mt-1">You have blocked @{user.username}. You will not see their posts or profile.</p>
            <button onClick={handleBlockToggle} className="mt-4 px-4 py-2 text-sm font-semibold border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-glass)]">
              Unblock
            </button>
          </Card>
        ) : (
          <>
            {user.bio && (
                <div className="px-4 md:px-6">
                    <p className="text-[var(--text-primary)] max-w-3xl">{user.bio}</p>
                </div>
            )}
            
            <Card>
              <h2 className="text-2xl font-bold mb-4">Stats Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                 <button onClick={handleOpenFollowers} className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors w-full">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                        {followerUsers.length.toLocaleString()}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">Followers</p>
                </button>
                <button onClick={handleOpenFollowing} className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors w-full">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                        {followingUsers.length.toLocaleString()}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">Following</p>
                </button>
                <button onClick={handleOpenGamesPlayed} className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors w-full">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                    {(user.playedGames || []).length}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">Games Played</p>
                </button>
                <button onClick={handleOpenAchievements} className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-glass)] transition-colors w-full">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                    {(user.achievements || []).length}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">Achievements</p>
                </button>
              </div>
            </Card>

            {createdGames.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold mb-4">Created Games</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {createdGames.map(game => (
                    <div key={game.id} className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden group">
                       <img src={game.thumbnail} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt={game.title} />
                       <div className="p-4">
                          <h3 className="font-bold">{game.title}</h3>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {game.playCount.toLocaleString()} Plays
                          </p>
                          <button 
                            onClick={() => viewGame(game)}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-colors">
                            <GamepadIcon className="w-4 h-4" />
                            View Game
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            <Card>
              <h2 className="text-2xl font-bold mb-4">Achievement Gallery</h2>
              <p className="text-[var(--text-secondary)]">Coming soon: Display your unlocked badges and milestones here.</p>
            </Card>
          </>
        )}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <FollowListModal
        isOpen={followListModalState.isOpen}
        onClose={() => setFollowListModalState(prev => ({ ...prev, isOpen: false }))}
        title={followListModalState.title}
        users={followListModalState.users}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        userToReport={user}
      />
      <GameListModal
        isOpen={gameListModalState.isOpen}
        onClose={() => setGameListModalState(prev => ({ ...prev, isOpen: false }))}
        title={gameListModalState.title}
        games={gameListModalState.games}
      />
      <AchievementListModal
        isOpen={achievementListModalState.isOpen}
        onClose={() => setAchievementListModalState(prev => ({ ...prev, isOpen: false }))}
        title={achievementListModalState.title}
        achievements={achievementListModalState.achievements}
      />
    </>
  );
};
