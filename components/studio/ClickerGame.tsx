import React, { useState, useEffect } from 'react';
import { type ClickerGameConfig } from '../../types';
import Card from '../ui/Card';

const ClickerGame: React.FC<{ config: ClickerGameConfig }> = ({ config }) => {
  const [score, setScore] = useState(0);
  const [pointsPerSecond, setPointsPerSecond] = useState(0);
  const [boughtUpgrades, setBoughtUpgrades] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (pointsPerSecond > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + pointsPerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pointsPerSecond]);

  const handleItemClick = () => {
    setScore(prev => prev + config.pointsPerClick);
  };

  const handleBuyUpgrade = (upgradeIndex: number) => {
    const upgrade = config.upgrades[upgradeIndex];
    if (score >= upgrade.cost) {
      setScore(prev => prev - upgrade.cost);
      setPointsPerSecond(prev => prev + upgrade.pointsPerSecond);
      setBoughtUpgrades(prev => ({
          ...prev,
          [upgrade.name]: (prev[upgrade.name] || 0) + 1
      }));
      // In a more complex game, we'd increase the cost here. For this demo, we'll keep it simple.
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[var(--accent-secondary)]/30 to-[var(--bg-secondary)] border-[var(--accent-primary)]/50">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{config.title}</h2>
        <p className="text-[var(--text-secondary)] mt-1 mb-6">{config.description}</p>
        
        <div className="my-8">
            <button
                onClick={handleItemClick}
                className="text-8xl animate-pulse hover:animate-none hover:scale-110 transition-transform duration-200"
                title={`Click me! (+${config.pointsPerClick} ${config.itemName})`}
            >
                {config.itemEmoji}
            </button>
        </div>

        <div className="p-4 bg-[var(--bg-glass)] rounded-xl font-mono">
            <div className="text-4xl font-bold text-white mb-2">{Math.floor(score).toLocaleString()}</div>
            <div className="text-sm text-[var(--text-secondary)]">{config.itemName}s</div>
            <div className="text-sm text-green-400 mt-1">{pointsPerSecond.toLocaleString()} per second</div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4 text-center">Upgrades</h3>
        <div className="space-y-3">
          {config.upgrades.map((upgrade, index) => (
            <button
              key={index}
              onClick={() => handleBuyUpgrade(index)}
              disabled={score < upgrade.cost}
              className="w-full flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-lg text-left transition-colors hover:bg-[var(--bg-glass)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--bg-secondary)]"
            >
              <div>
                <p className="font-semibold">{upgrade.name} <span className="text-xs text-[var(--text-secondary)]">({boughtUpgrades[upgrade.name] || 0})</span></p>
                <p className="text-xs text-green-400">+ {upgrade.pointsPerSecond} PPS</p>
              </div>
              <div className="font-semibold text-sm text-[var(--accent-primary)]">
                {upgrade.cost.toLocaleString()} {config.itemName}s
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ClickerGame;
