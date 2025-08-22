import React, { useContext } from 'react';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { AppContext } from '../context/AppContext';
import type { User } from '../../types';
import { VerifiedIcon } from '../icons/Icons';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'Followers' | 'Following';
  users: User[];
}

const UserRow: React.FC<{ userToList: User; onCloseModal: () => void }> = ({ userToList, onCloseModal }) => {
    const context = useContext(AppContext);
    if (!context) return null;
    
    const { currentUser, viewProfile, toggleFollow } = context;

    const isOwnProfile = currentUser.id === userToList.id;
    const isFollowing = currentUser.following.includes(userToList.id);

    const handleProfileClick = () => {
        viewProfile(userToList);
        onCloseModal();
    };
    
    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFollow(userToList.id);
    };

    return (
        <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-glass)] transition-colors cursor-pointer"
            onClick={handleProfileClick}
        >
            <div className="flex items-center gap-3">
                <img src={userToList.avatar} alt={userToList.name} className="w-10 h-10 rounded-full" />
                <div>
                    <div className="flex items-center gap-1.5 font-semibold">
                        {userToList.name}
                        {userToList.verified && <VerifiedIcon className="w-4 h-4" />}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">@{userToList.username}</p>
                </div>
            </div>
            {!isOwnProfile && (
                 <button 
                    onClick={handleFollowClick}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${isFollowing ? 'bg-[var(--bg-glass)] text-[var(--text-primary)] border border-[var(--border-color)]' : 'text-white bg-white/90 hover:bg-white text-black'}`}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            )}
        </div>
    );
}


const FollowListModal: React.FC<FollowListModalProps> = ({ isOpen, onClose, title, users }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <Card className="!bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold mb-4 text-center border-b border-[var(--border-color)] pb-3">{title}</h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {users.length > 0 ? (
                users.map(user => <UserRow key={user.id} userToList={user} onCloseModal={onClose} />)
            ) : (
                <p className="text-center text-[var(--text-secondary)] py-8">No users to display.</p>
            )}
        </div>
      </Card>
    </Modal>
  );
};

export default FollowListModal;
