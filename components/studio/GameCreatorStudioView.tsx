

import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import { GAME_SIZES, GAME_DIFFICULTIES, GAME_GENRES, AI_OPTIONS, GAME_SIZE_COSTS } from '../../constants';
import { SparklesIcon, GamepadIcon, LightbulbIcon, WrenchIcon, PackageIcon } from '../icons/Icons';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';
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
  const { setView } = context;

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
Act as an expert game designer tasked with creating a simplified, web-based clicker game prototype based on a user's more complex game idea. Your goal is to creatively translate the core theme and feeling of the user's concept into the mechanics of a clicker game. The output must be a valid JSON object matching the provided schema.

**User's Game Idea Analysis:**
- **Title Idea:** "${gameTitle || 'Not specified'}"
- **Genre:** ${gameGenre}
- **Detailed Description:** ${gameDescriptionPrompt || 'A simple and fun clicker game.'}

**Your Task:**
1.  **Analyze the core fantasy:** What is the central action or feeling the user is trying to capture (e.g., exploring a galaxy, being a samurai, managing a city)?
2.  **Translate to Clicker Mechanics:**
    -   **itemName/itemEmoji:** What is the most fundamental, repeatable action in the user's game idea? This will be the clickable item. For an FPS, it could be "Target" (🎯) or "Headshot" (💥). For an RPG, it could be "Slime" (몬스터) or "XP Orb" (✨).
    -   **title/description:** Create a catchy title and a one-sentence description for this new *clicker version* of the game that honors the original idea.
    -   **upgrades:** Design 4 thematic upgrades that represent progression in the user's original concept. Their names and effects (pointsPerSecond) should feel like you're getting more powerful within that game world. Costs should be balanced for a simple game, starting low and increasing (e.g., 15, 100, 500, 2000).

**Example Translation:**
-   If the user describes a **"space trading game"**, the \`itemName\` could be "Credits", \`itemEmoji\` could be "💰", and upgrades could be "Bigger Cargo Hold", "Faster Hyperdrive", "Automated Drones", etc.
-   If the user describes a **"farming simulator"**, the \`itemName\` could be "Crop", \`itemEmoji\` could be "🥕", and upgrades could be "Sprinkler System", "Tractor", "Fertilizer", etc.

Now, generate the JSON configuration based on the user's idea provided above.
`;

    try {
      const generateGameCallable = httpsCallable<{ prompt: string }, ClickerGameConfig>(functions, 'generateGame');
      const result = await generateGameCallable({ prompt });
      const config = result.data;
      setGeneratedGameConfig(config);
    } catch (err) {
      console.error('AI game generation via function failed:', err);
      setError('Failed to generate game via cloud function. This could be due to a backend error. Please check the function logs. See developer console for details.');
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

      <div className="flex border-b border-[var(--border-color)]">
        <button
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]`}
        >
          <WrenchIcon className="w-5 h-5"/>
          Blueprint
        </button>
        <button
          onClick={() => setView('asset_store')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors text-[var(--text-secondary)] hover:text-white`}
        >
          <PackageIcon className="w-5 h-5"/>
          Asset Store
        </button>
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

          <Card>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <LightbulbIcon className="w-7 h-7 text-yellow-400"/>
              How Games Are Made: A Look Under the Hood
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed prose prose-invert prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)]">
                <p>
                    Game engines are built on top of low-level Application Programming Interfaces (APIs). Sometimes, for extreme performance or custom needs, developers will bypass the engine and use these APIs directly.
                </p>

                <h3 className="text-base font-bold text-white !mt-6 !mb-2">Graphics APIs (The most important low-level API)</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Vulkan:</strong> A modern, high-performance, low-overhead API for Windows, Linux, Android. Offers the most control but is very complex.</li>
                    <li><strong>DirectX 12 (D3D12):</strong> Microsoft's modern, low-level API (the counterpart to Vulkan). Used primarily on Windows and Xbox.</li>
                    <li><strong>Metal:</strong> Apple's modern, low-level API for macOS and iOS. Similar in philosophy to Vulkan/DX12.</li>
                    <li><strong>WebGPU:</strong> The emerging modern standard for high-performance graphics on the web, designed to translate to Vulkan, Metal, and D3D12.</li>
                </ul>

                <h3 className="text-base font-bold text-white !mt-6 !mb-2">How It All Fits Together</h3>
                <p>Here’s a simplified view of the stack:</p>
                <pre className="bg-[var(--bg-secondary)] p-4 rounded-lg text-xs font-mono select-all">
{`+-------------------------------------------------------+
|        YOUR GAME CODE (C#, GDScript, C++)           |
+-------------------------------------------------------+
|      GAME ENGINE API (Unity, Unreal, Godot)         |
+-------------------------------------------------------+
|    LOW-LEVEL APIS (Vulkan, DirectX, Metal, etc.)    |
+-------------------------------------------------------+
|          OPERATING SYSTEM & HARDWARE DRIVERS          |
+-------------------------------------------------------+`}
                </pre>
                <p>
                    As a game developer using an engine like NEXUS AI Studio, you primarily interact with the top layer. The engine handles the complexity of the low-level APIs for you, allowing you to focus on creativity and game design.
                </p>
            </div>
        </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Generate</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Once your blueprint is ready, let our AI engine generate a playable mini-game based on your idea.</p>
            <div className="text-xs text-yellow-400/80 bg-yellow-900/30 p-2 rounded-md mb-4 flex items-start gap-2">
              <LightbulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> The current AI generates a clicker-style mini-game. The theme, items, and upgrades will be creatively adapted from your description.
              </span>
            </div>
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
