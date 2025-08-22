import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import { GAME_SIZES, GAME_DIFFICULTIES, GAME_GENRES, AI_OPTIONS, GAME_SIZE_COSTS } from '../../constants';
import { SparklesIcon, GamepadIcon } from '../icons/Icons';
import { GoogleGenAI, Type } from "@google/genai";
import { type ClickerGameConfig, GameSize, GameDifficulty, AppContextType } from '../../types';
import { AppContext } from '../context/AppContext';
import ClickerGame from './ClickerGame';

const SelectInput: React.FC<{ label: string; options: readonly string[]; value: string; onChange: (val: string) => void }> = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const LoadingState: React.FC = () => (
  <Card className="animate-pulse">
      <div className="h-8 bg-[var(--bg-secondary)] rounded w-3/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-full"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-full"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-4/6"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-full mt-4"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"></div>
      </div>
    </Card>
);


export const GameCreatorStudioView: React.FC = () => {
  const context = useContext(AppContext);
  const [gameTitle, setGameTitle] = useState('');
  const [gameDescriptionPrompt, setGameDescriptionPrompt] = useState('');
  const [gameGenre, setGameGenre] = useState(GAME_GENRES[0]);
  const [gameSize, setGameSize] = useState<GameSize>(GAME_SIZES[0] as GameSize);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>(GAME_DIFFICULTIES[0] as GameDifficulty);
  const [selectedAIs, setSelectedAIs] = useState<{ [key: string]: { model: string; version?: string; } }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [generatedGameConfig, setGeneratedGameConfig] = useState<ClickerGameConfig | null>(null);
  const [error, setError] = useState('');

  if (!context) return null;

  const handleModelChange = (category: string, modelName: string) => {
    const group = AI_OPTIONS.find(g => g.title === category);
    const model = group?.models.find(m => m.name === modelName);
    
    setSelectedAIs(prev => ({
      ...prev,
      [category]: {
        model: modelName,
        version: model?.versions?.[0], // Select first version by default
      }
    }));
  };

  const handleVersionChange = (category: string, versionName: string) => {
    setSelectedAIs(prev => {
        const currentSelection = prev[category];
        if (!currentSelection) return prev; // Should not happen
        return {
            ...prev,
            [category]: {
                ...currentSelection,
                version: versionName,
            }
        };
    });
  };

  const handlePublishGame = () => {
    if (!generatedGameConfig) return;
    
    const cost = GAME_SIZE_COSTS[gameSize];
    if (context.nxgBalance < cost) {
      setError(`Insufficient NXG balance. You need ${cost} NXG to publish a game of this size, but you only have ${context.nxgBalance.toFixed(2)} NXG.`);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    context.sendCrypto('NXG', cost);

    const p2pGenres = ["First-Person Shooter (FPS)", "Real-Time Strategy (RTS)", "Turn-Based Strategy", "Fighting", "Sports", "Battle Royale", "MMORPG"];
    const category: 'p2e' | 'p2p' = p2pGenres.includes(gameGenre) ? 'p2p' : 'p2e';

    context.publishGame({
        title: generatedGameConfig.title,
        description: generatedGameConfig.description,
        category,
        thumbnail: `https://picsum.photos/seed/${generatedGameConfig.title.replace(/\s+/g, '-').toLowerCase()}/500/300`,
    });
  };

  const handleGenerateGame = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedGameConfig(null);

    const prompt = `
Create the configuration for a simple web-based clicker game based on the user's specifications. The output must be a valid JSON object matching the provided schema.

User's Game Idea:
- Title Idea: "${gameTitle || 'Not specified'}"
- Genre: ${gameGenre}
- Game Description: ${gameDescriptionPrompt || 'A simple and fun clicker game.'}

Based on this, generate creative and fitting values for the JSON object. The theme of the items and upgrades should directly relate to the user's idea. The upgrade costs should be balanced for a simple game, starting low and increasing.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A creative and fitting title for the clicker game based on the user's prompt."
        },
        description: {
            type: Type.STRING,
            description: "A short, one-sentence description for the game."
        },
        itemName: {
          type: Type.STRING,
          description: "The name of the item the player clicks to earn points (e.g., 'Cookie', 'Gold Coin'). Should be singular."
        },
        itemEmoji: {
            type: Type.STRING,
            description: "A single emoji character that represents the clickable item."
        },
        pointsPerClick: {
          type: Type.INTEGER,
          description: "The number of points earned per click. Start with 1."
        },
        upgrades: {
          type: Type.ARRAY,
          description: "An array of 4 thematically appropriate upgrades the player can buy. Costs should be incremental and make sense for a starter game (e.g., 15, 100, 500, 2000).",
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the upgrade."
              },
              cost: {
                type: Type.INTEGER,
                description: "The initial cost of the upgrade."
              },
              pointsPerSecond: {
                type: Type.INTEGER,
                description: "The number of points this upgrade generates per second."
              }
            }
          }
        }
      }
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
      });
      const config = JSON.parse(response.text) as ClickerGameConfig;
      setGeneratedGameConfig(config);
    } catch (err) {
      console.error('AI game generation failed:', err);
      setError('Failed to generate game. This could be due to an invalid API key, network issues, or a problem with the AI service. Please check your prompt and API key. See developer console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
          AI Game Creator Studio
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Bring your game ideas to life with the power of generative AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Game Blueprint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Game Title</label>
                <input type="text" value={gameTitle} onChange={e => setGameTitle(e.target.value)} placeholder="e.g., Cyberpunk Samurai Quest" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all" />
              </div>
              <SelectInput label="Game Genre" options={GAME_GENRES} value={gameGenre} onChange={setGameGenre} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Game Size (Cost to Publish)</label>
                  <select value={gameSize} onChange={e => setGameSize(e.target.value as GameSize)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all">
                    {Object.values(GameSize).map(size => (
                      <option key={size} value={size}>{`${size} - ${GAME_SIZE_COSTS[size]} NXG`}</option>
                    ))}
                  </select>
                </div>
                <SelectInput label="Difficulty Level" options={GAME_DIFFICULTIES} value={gameDifficulty} onChange={(val) => setGameDifficulty(val as GameDifficulty)} />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-4">Game Description</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Describe the game you want to create. Be as detailed as you like. The more information you provide, the better the AI can generate a concept for you. Include ideas about story, characters, art style, unique features, etc.
            </p>
            <textarea
              value={gameDescriptionPrompt}
              onChange={(e) => setGameDescriptionPrompt(e.target.value)}
              placeholder="e.g., A post-apocalyptic survival game where players build and defend a settlement on a giant, wandering creature. The art style should be inspired by Studio Ghibli, but with a darker, more mature tone..."
              className="w-full h-40 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all resize-y"
            />
          </Card>
          
          <Card>
            <h2 className="text-2xl font-bold mb-4">AI Model Integration</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
                Select the AI models you would hypothetically use to build this game. This choice doesn't affect the mini-game generation but helps frame the creative process.
            </p>
            <div className="space-y-6">
              {AI_OPTIONS.map(group => {
                const selectedForCategory = selectedAIs[group.title];
                const selectedModelName = selectedForCategory?.model;
                const selectedModel = group.models.find(m => m.name === selectedModelName);

                return (
                  <div key={group.title}>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{group.title}</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedModelName || ''}
                        onChange={(e) => handleModelChange(group.title, e.target.value)}
                        className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all ${selectedModel?.versions ? 'w-1/2' : 'w-full'}`}
                      >
                        <option value="" disabled>Select a model...</option>
                        {group.models.map(model => (
                          <option key={model.name} value={model.name}>{model.name} ({model.provider})</option>
                        ))}
                      </select>
                      
                      {selectedModel?.versions && (
                        <select
                          value={selectedForCategory?.version || ''}
                          onChange={(e) => handleVersionChange(group.title, e.target.value)}
                          className="w-1/2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                        >
                          {selectedModel.versions.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Generate</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Once your blueprint is ready, let our AI engine generate a playable mini-game based on your idea.</p>
            <button 
              onClick={handleGenerateGame}
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? 'Generating...' : 'Generate Playable Mini-Game'}
            </button>
          </Card>
        </div>
        
        {(isLoading || error || generatedGameConfig) && (
          <div className="lg:col-span-3">
            {isLoading && <LoadingState />}
            {error && (
               <Card className="border-red-500/50">
                <h2 className="text-xl font-bold text-red-400">Action Failed</h2>
                <p className="text-[var(--text-secondary)] mt-2">{error}</p>
              </Card>
            )}
            {generatedGameConfig && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                      <SparklesIcon className="text-[var(--accent-primary)]" />
                      Generated Game Preview
                  </h2>
                  <button onClick={() => setGeneratedGameConfig(null)} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors">Clear</button>
                </div>
                
                <ClickerGame config={generatedGameConfig} />

                 <div className="mt-6 flex justify-end">
                    <button
                        onClick={handlePublishGame}
                        className="flex items-center gap-2 py-2 px-5 font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-pink-500/30"
                    >
                        <GamepadIcon className="w-5 h-5" />
                        Publish this Game
                    </button>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  );
};