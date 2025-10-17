// FIX: Created missing file components/studio/GameCreatorStudioView.tsx
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../ui/Card';
import ClickerGame from './ClickerGame';
import { type ClickerGameConfig, type Game, type ClickerUpgrade } from '../../types';
import { SparklesIcon, SaveIcon, PlusIcon, Trash2Icon, LightbulbIcon, SettingsIcon, WrenchIcon } from '../icons/Icons';
import { GoogleGenAI } from '@google/genai';

export const GameCreatorStudioView: React.FC = () => {
    const context = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'settings' | 'logic' | 'ai'>('settings');
    const [isGenerating, setIsGenerating] = useState(false);

    const [gameDetails, setGameDetails] = useState({
        title: 'My Awesome Clicker',
        description: 'A super fun clicker game made with NEXUS AI Studio!',
        category: 'p2e' as 'p2e' | 'p2p',
        thumbnail: `https://picsum.photos/seed/${Date.now()}/500/300`
    });

    const [clickerConfig, setClickerConfig] = useState<ClickerGameConfig>({
        title: 'My Awesome Clicker',
        description: 'A super fun clicker game made with NEXUS AI Studio!',
        itemName: 'Coin',
        itemEmoji: '🪙',
        pointsPerClick: 1,
        upgrades: [
            { name: 'Auto-Clicker', cost: 10, pointsPerSecond: 1 },
            { name: 'Better Mouse', cost: 100, pointsPerSecond: 5 },
            { name: 'Super Clicks', cost: 500, pointsPerSecond: 25 },
        ]
    });

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGameDetails(prev => ({ ...prev, [name]: value }));
        if (name === 'title' || name === 'description') {
            setClickerConfig(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClickerConfig(prev => ({ ...prev, [name]: name === 'pointsPerClick' ? Number(value) : value }));
    };

    const handleUpgradeChange = (index: number, field: keyof ClickerUpgrade, value: string) => {
        const newUpgrades = [...clickerConfig.upgrades];
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            (newUpgrades[index] as any)[field] = field === 'name' ? value : numValue;
            setClickerConfig(prev => ({ ...prev, upgrades: newUpgrades }));
        } else if (field === 'name') {
             (newUpgrades[index] as any)[field] = value;
            setClickerConfig(prev => ({ ...prev, upgrades: newUpgrades }));
        }
    };

    const addUpgrade = () => {
        setClickerConfig(prev => ({
            ...prev,
            upgrades: [...prev.upgrades, { name: 'New Upgrade', cost: 1000, pointsPerSecond: 50 }]
        }));
    };

    const removeUpgrade = (index: number) => {
        setClickerConfig(prev => ({
            ...prev,
            upgrades: prev.upgrades.filter((_, i) => i !== index)
        }));
    };

    const handlePublish = () => {
        if (!context) return;
        context.publishGame({
            ...gameDetails
        });
    };

    const handleGenerateIdeas = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate 3 creative and balanced upgrade ideas for a clicker game about collecting "${clickerConfig.itemName}". Provide a unique "name", a "cost" (number), and "pointsPerSecond" (number). Format the response as a valid JSON array of objects, like this: [{"name": "...", "cost": ..., "pointsPerSecond": ...}]`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const ideasText = response.text.trim();
            const ideas = JSON.parse(ideasText) as ClickerUpgrade[];
            
            if (Array.isArray(ideas) && ideas.every(i => i.name && typeof i.cost === 'number' && typeof i.pointsPerSecond === 'number')) {
                 setClickerConfig(prev => ({ ...prev, upgrades: [...prev.upgrades, ...ideas] }));
            } else {
                throw new Error("Invalid JSON format from AI");
            }
        } catch (error) {
            console.error("AI content generation failed:", error);
            alert('Failed to generate upgrade ideas. The AI might be busy or the response was not in the correct format. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                    AI Game Creator Studio
                </h1>
                <p className="text-[var(--text-secondary)] mt-2">Design, build, and publish your own games directly on the NEXUS platform.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <Card>
                    <div className="flex border-b border-[var(--border-color)] mb-4">
                        <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 ${activeTab === 'settings' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}><SettingsIcon className="w-4 h-4" />Settings</button>
                        <button onClick={() => setActiveTab('logic')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 ${activeTab === 'logic' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}><WrenchIcon className="w-4 h-4" />Logic</button>
                        <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 ${activeTab === 'ai' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}><LightbulbIcon className="w-4 h-4" />AI Assist</button>
                    </div>

                    {activeTab === 'settings' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-bold">Game Details</h3>
                            <div><label className="text-xs text-[var(--text-secondary)]">Game Title</label><input type="text" name="title" value={gameDetails.title} onChange={handleDetailChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" /></div>
                            <div><label className="text-xs text-[var(--text-secondary)]">Description</label><textarea name="description" value={gameDetails.description} onChange={handleDetailChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" rows={3} /></div>
                            <div><label className="text-xs text-[var(--text-secondary)]">Category</label><select name="category" value={gameDetails.category} onChange={handleDetailChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2"><option value="p2e">Play-to-Earn (P2E)</option><option value="p2p">Player-vs-Player (P2P)</option></select></div>
                            <hr className="border-[var(--border-color)]" />
                            <h3 className="text-lg font-bold">Clicker Settings</h3>
                            <div><label className="text-xs text-[var(--text-secondary)]">Item Name</label><input type="text" name="itemName" value={clickerConfig.itemName} onChange={handleConfigChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" /></div>
                            <div><label className="text-xs text-[var(--text-secondary)]">Item Emoji</label><input type="text" name="itemEmoji" value={clickerConfig.itemEmoji} onChange={handleConfigChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" /></div>
                            <div><label className="text-xs text-[var(--text-secondary)]">Points Per Click</label><input type="number" name="pointsPerClick" value={clickerConfig.pointsPerClick} onChange={handleConfigChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" /></div>
                        </div>
                    )}

                    {activeTab === 'logic' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-bold">Upgrades</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {clickerConfig.upgrades.map((upgrade, index) => (
                                    <div key={index} className="p-3 bg-[var(--bg-glass)] rounded-lg grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                        <input type="text" value={upgrade.name} onChange={e => handleUpgradeChange(index, 'name', e.target.value)} placeholder="Name" className="md:col-span-3 w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" />
                                        <input type="number" value={upgrade.cost} onChange={e => handleUpgradeChange(index, 'cost', e.target.value)} placeholder="Cost" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" />
                                        <input type="number" value={upgrade.pointsPerSecond} onChange={e => handleUpgradeChange(index, 'pointsPerSecond', e.target.value)} placeholder="PPS" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2" />
                                        <button onClick={() => removeUpgrade(index)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40"><Trash2Icon className="w-5 h-5 mx-auto" /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addUpgrade} className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors"><PlusIcon className="w-4 h-4"/> Add Upgrade</button>
                        </div>
                    )}
                    
                    {activeTab === 'ai' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-bold">AI Assistant</h3>
                            <Card className="!bg-[var(--bg-secondary)]">
                                <h4 className="font-semibold mb-2">Generate Upgrade Ideas</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">Let AI create new, balanced upgrades for your game based on your current configuration.</p>
                                <button onClick={handleGenerateIdeas} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg hover:opacity-90 disabled:opacity-50">
                                    <SparklesIcon className="w-4 h-4" />
                                    {isGenerating ? 'Generating...' : 'Generate with Gemini'}
                                </button>
                            </Card>
                        </div>
                    )}
                </Card>

                {/* Preview Panel */}
                <div className="space-y-4">
                    <ClickerGame config={clickerConfig} />
                    <button 
                        onClick={handlePublish}
                        className="w-full py-3 font-semibold text-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <SaveIcon className="w-6 h-6"/>
                        Publish Game
                    </button>
                </div>
            </div>
        </div>
    )
};
