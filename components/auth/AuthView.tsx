import React, { useState } from 'react';
import { NexusLogoIcon } from '../icons/Icons';
import { MOCK_USERS } from '../../constants';
import type { User } from '../../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockUser = MOCK_USERS.aurora;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Mock login logic
    setTimeout(() => {
        if (email.toLowerCase() === mockUser.email.toLowerCase()) {
            onAuthSuccess(mockUser);
        } else {
            setError(`Invalid credentials. For this demo, use the email "${mockUser.email}" and any password.`);
        }
        setIsLoading(false);
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock sign up logic
    setTimeout(() => {
        const newUser: User = {
            id: `u_${username.toLowerCase()}_${Date.now()}`,
            name: name,
            username: username,
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
        onAuthSuccess(newUser);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <NexusLogoIcon className="h-16 w-16" />
        </div>
        <div className="bg-[var(--bg-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-white mb-2">{isLoginView ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-center text-[var(--text-secondary)] mb-6">{isLoginView ? 'Sign in to continue to NEXUS' : 'Join the future of social media'}</p>
          
          <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
            {!isLoginView && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-[var(--accent-primary)] hover:underline ml-1">
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
