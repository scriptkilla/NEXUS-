
import React, { useState, useRef, useEffect, useContext } from 'react';
import { CRYPTO_CURRENCIES, MOCK_GAMES } from '../../constants';
import type { Post, Game, TipGoal, User, EngagementRewards, CreatePostData } from '../../types';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { ImageIcon, GamepadIcon, BarChartIcon, DollarSignIcon, XIcon, SparklesIcon } from '../icons/Icons';
import { AppContext } from '../context/AppContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGameModal: React.FC<{ isOpen: boolean, onClose: () => void, onSelect: (game: Game) => void }> = ({ isOpen, onClose, onSelect }) => (
  <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
    <Card className="!bg-[var(--bg-secondary)]">
      <h2 className="text-xl font-bold mb-4">Attach a Game</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
        {MOCK_GAMES.map(game => (
          <button key={game.id} onClick={() => onSelect(game)} className="text-left bg-[var(--bg-glass)] rounded-lg overflow-hidden group hover:border-[var(--accent-primary)] border border-transparent transition-all">
            <img src={game.thumbnail} alt={game.title} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
            <div className="p-3">
              <h3 className="font-semibold text-sm">{game.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </Card>
  </Modal>
);

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  const [postContent, setPostContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedGame, setAttachedGame] = useState<Game | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [tipGoal, setTipGoal] = useState<TipGoal | null>(null);
  const [showTipGoalCreator, setShowTipGoalCreator] = useState(false);
  const [tipGoalInput, setTipGoalInput] = useState({ cryptoId: 'nxg', amount: '' });
  const [isGameModalOpen, setGameModalOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [engagementRewards, setEngagementRewards] = useState<EngagementRewards | null>(null);
  const [showMonetizeCreator, setShowMonetizeCreator] = useState(false);
  const [monetizeInput, setMonetizeInput] = useState({ budget: '', perLike: '0.001', perComment: '0.01', perRepost: '0.05' });

  const resetAllState = () => {
    setPostContent('');
    setAttachedImage(null);
    setAttachedGame(null);
    setShowPollCreator(false);
    setPollOptions(['', '']);
    setTipGoal(null);
    setShowTipGoalCreator(false);
    setTipGoalInput({ cryptoId: 'nxg', amount: '' });
    setEngagementRewards(null);
    setShowMonetizeCreator(false);
    setMonetizeInput({ budget: '', perLike: '0.001', perComment: '0.01', perRepost: '0.05' });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  
  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetAllState, 300);
    }
  }, [isOpen]);

  if (!context) return null;

  const { createPost, nxgBalance } = context;

  const resetAttachments = () => {
    setAttachedImage(null);
    setAttachedGame(null);
    setShowPollCreator(false);
    setPollOptions(['', '']);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resetAttachments();
      setAttachedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSelectGame = (game: Game) => {
    resetAttachments();
    setAttachedGame(game);
    setGameModalOpen(false);
  };

  const togglePollCreator = () => {
    const isCreatingPoll = !showPollCreator;
    resetAttachments();
    setShowPollCreator(isCreatingPoll);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) setPollOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetTipGoal = () => {
    const amount = parseFloat(tipGoalInput.amount);
    const crypto = CRYPTO_CURRENCIES.find(c => c.id === tipGoalInput.cryptoId);
    if (amount > 0 && crypto) {
      setTipGoal({ crypto, goalAmount: amount, currentAmount: 0 });
      setShowTipGoalCreator(false);
    }
  };

  const handleSetMonetization = () => {
    const budget = parseFloat(monetizeInput.budget);
    if (!budget || budget <= 0) return;
    if (nxgBalance < budget) {
      alert("Insufficient NXG balance to set this budget.");
      return;
    }
    setEngagementRewards({
      totalBudget: budget,
      spentBudget: 0,
      rewardPerLike: parseFloat(monetizeInput.perLike) || 0,
      rewardPerComment: parseFloat(monetizeInput.perComment) || 0,
      rewardPerRepost: parseFloat(monetizeInput.perRepost) || 0,
    });
    setShowMonetizeCreator(false);
  }

  const handlePost = () => {
    const isPollValid = showPollCreator && pollOptions.filter(opt => opt.trim() !== '').length >= 2;
    if (!postContent.trim() && !attachedImage && !isPollValid && !attachedGame) return;

    const postData: CreatePostData = {
      content: postContent,
      image: attachedImage || undefined,
      attachedGame: attachedGame || undefined,
      poll: isPollValid ? { options: pollOptions.filter(opt => opt.trim() !== ''), votes: pollOptions.filter(opt => opt.trim() !== '').map(() => 0) } : undefined,
      tipGoal: tipGoal || undefined,
      engagementRewards: engagementRewards || undefined,
    };
    createPost(postData);
  };

  const hasAttachment = !!attachedImage || showPollCreator || !!attachedGame;
  const isPollValid = showPollCreator && pollOptions.filter(opt => opt.trim() !== '').length >= 2;
  const canPost = postContent.trim() || !!attachedImage || isPollValid || !!attachedGame;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
      <AddGameModal isOpen={isGameModalOpen} onClose={() => setGameModalOpen(false)} onSelect={handleSelectGame} />
      <Card className="!bg-[var(--bg-secondary)]">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Create Post</h2>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" rows={4} placeholder="What's happening in the NEXUS?" />

          {/* Previews */}
          {attachedImage && (
            <div className="relative mt-4 animate-fade-in"><img src={attachedImage} alt="Preview" className="rounded-lg w-full object-cover max-h-80 border border-[var(--border-color)]" /><button onClick={resetAttachments} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"><XIcon className="w-5 h-5" /></button></div>
          )}
          {attachedGame && (
            <div className="relative mt-4 animate-fade-in p-3 border border-[var(--border-color)] rounded-lg flex items-center gap-4 bg-[var(--bg-secondary)]"><img src={attachedGame.thumbnail} className="w-20 h-14 object-cover rounded" alt={attachedGame.title} /><div><p className="text-sm text-[var(--text-secondary)]">Game Attached</p><h4 className="font-bold text-white">{attachedGame.title}</h4></div><button onClick={resetAttachments} className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"><XIcon className="w-5 h-5" /></button></div>
          )}
          {tipGoal && (
             <div className="relative mt-4 animate-fade-in p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]"><div className="flex justify-between items-center"><p className="text-sm font-semibold">Tip Goal: {tipGoal.goalAmount} {tipGoal.crypto.symbol}</p><div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${tipGoal.crypto.gradient}`}><tipGoal.crypto.icon className="w-5 h-5 text-white"/></div></div></div><button onClick={() => setTipGoal(null)} className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"><XIcon className="w-5 h-5" /></button></div>
          )}
          {engagementRewards && (
             <div className="relative mt-4 animate-fade-in p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]"><div className="flex justify-between items-center"><p className="text-sm font-semibold flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-green-400"/>Engagement Rewards Active</p><span className="text-sm text-[var(--text-secondary)]">Budget: {engagementRewards.totalBudget} NXG</span></div><button onClick={() => setEngagementRewards(null)} className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"><XIcon className="w-5 h-5" /></button></div>
          )}
          
          {/* Creators */}
          {showPollCreator && (
            <div className="mt-4 space-y-3 animate-fade-in">{pollOptions.map((option, index) => (<div key={index} className="flex items-center gap-2"><input type="text" value={option} onChange={(e) => handlePollOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} maxLength={30} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" />{pollOptions.length > 2 && (<button onClick={() => removePollOption(index)} className="text-[var(--text-secondary)] hover:text-red-500"><XIcon className="w-5 h-5" /></button>)}</div>))}{pollOptions.length < 4 && (<button onClick={handleAddPollOption} className="text-sm font-semibold text-[var(--accent-primary)] hover:underline">Add option</button>)}</div>
          )}
          {showTipGoalCreator && (
            <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg animate-fade-in space-y-3">
              <h4 className="text-sm font-semibold">Set Tip Goal</h4>
              <div className="flex items-center gap-2">
                <input type="number" value={tipGoalInput.amount} onChange={(e) => setTipGoalInput({...tipGoalInput, amount: e.target.value})} placeholder="100" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" />
                <select value={tipGoalInput.cryptoId} onChange={(e) => setTipGoalInput({...tipGoalInput, cryptoId: e.target.value})} className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none">
                  {CRYPTO_CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.symbol}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                  <button onClick={() => setShowTipGoalCreator(false)} className="px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-white">Cancel</button>
                  <button onClick={handleSetTipGoal} className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full">Set</button>
              </div>
            </div>
          )}
          {showMonetizeCreator && (
            <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg animate-fade-in space-y-3">
              <h4 className="text-sm font-semibold">Monetize Engagement</h4>
              <p className="text-xs text-[var(--text-secondary)]">Reward users with NXG for interacting. The budget will be deducted from your balance upon posting.</p>
              <div className="space-y-2">
                 <div className="flex items-center gap-2"><label className="text-sm text-[var(--text-secondary)] w-32">Total Budget</label><input type="number" value={monetizeInput.budget} onChange={e => setMonetizeInput({...monetizeInput, budget: e.target.value})} placeholder="e.g., 100" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" /><span className="text-sm font-semibold">NXG</span></div>
                 <div className="flex items-center gap-2"><label className="text-sm text-[var(--text-secondary)] w-32">Reward per Like</label><input type="number" value={monetizeInput.perLike} onChange={e => setMonetizeInput({...monetizeInput, perLike: e.target.value})} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" /><span className="text-sm font-semibold">NXG</span></div>
                 <div className="flex items-center gap-2"><label className="text-sm text-[var(--text-secondary)] w-32">Reward per Comment</label><input type="number" value={monetizeInput.perComment} onChange={e => setMonetizeInput({...monetizeInput, perComment: e.target.value})} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" /><span className="text-sm font-semibold">NXG</span></div>
                 <div className="flex items-center gap-2"><label className="text-sm text-[var(--text-secondary)] w-32">Reward per Repost</label><input type="number" value={monetizeInput.perRepost} onChange={e => setMonetizeInput({...monetizeInput, perRepost: e.target.value})} className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none" /><span className="text-sm font-semibold">NXG</span></div>
              </div>
              <div className="flex justify-end gap-2">
                  <button onClick={() => setShowMonetizeCreator(false)} className="px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-white">Cancel</button>
                  <button onClick={handleSetMonetization} className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full">Set</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-4"><div className="flex items-center gap-5 text-[var(--text-secondary)]">
            <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <button onClick={() => imageInputRef.current?.click()} className={`hover:text-[var(--accent-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${attachedImage ? 'text-[var(--accent-primary)]' : ''}`} title="Add Picture" disabled={hasAttachment && !attachedImage}><ImageIcon className="w-6 h-6" /></button>
            <button onClick={() => setGameModalOpen(true)} className={`hover:text-[var(--accent-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${attachedGame ? 'text-[var(--accent-primary)]' : ''}`} title="Add Game" disabled={hasAttachment && !attachedGame}><GamepadIcon className="w-6 h-6" /></button>
            <button onClick={togglePollCreator} className={`hover:text-[var(--accent-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${showPollCreator ? 'text-[var(--accent-primary)]' : ''}`} title="Create Poll" disabled={hasAttachment && !showPollCreator}><BarChartIcon className="w-6 h-6" /></button>
            <button onClick={() => setShowTipGoalCreator(p => !p)} className={`hover:text-[var(--accent-primary)] transition-colors ${tipGoal || showTipGoalCreator ? 'text-[var(--accent-primary)]' : ''}`} title="Set Tip Goal"><DollarSignIcon className="w-6 h-6" /></button>
            <button onClick={() => setShowMonetizeCreator(p => !p)} className={`hover:text-[var(--accent-primary)] transition-colors ${engagementRewards || showMonetizeCreator ? 'text-[var(--accent-primary)]' : ''}`} title="Monetize Post"><SparklesIcon className="w-6 h-6" /></button>
          </div><button onClick={handlePost} disabled={!canPost} className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Post</button></div>
        </Card>
    </Modal>
  );
};

export default CreatePostModal;
