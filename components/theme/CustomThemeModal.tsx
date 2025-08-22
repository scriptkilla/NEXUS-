import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { THEMES } from '../../constants';
import type { Theme } from '../../types';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2 bg-[var(--bg-glass)] rounded-lg">
        <label htmlFor={label} className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{value}</span>
            <input 
                id={label}
                type="color" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent appearance-none"
                style={{ '::-webkit-color-swatch-wrapper': { padding: 0 }, '::-webkit-color-swatch': { border: 'none', borderRadius: '4px' } } as React.CSSProperties}
            />
        </div>
    </div>
);

interface CustomThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomThemeModal: React.FC<CustomThemeModalProps> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);

    if (!context) return null;
    const { theme, setTheme } = context;

    const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
        const newColors = { ...theme.colors, [colorKey]: value };

        // Automatically derive glass and border colors for simplicity
        if (colorKey === 'bgSecondary') {
            const hex = value.replace('#', '');
            const r = parseInt(hex.substring(0,2), 16);
            const g = parseInt(hex.substring(2,4), 16);
            const b = parseInt(hex.substring(4,6), 16);
            newColors.bgGlass = `rgba(${r}, ${g}, ${b}, 0.5)`;
        }
        if (colorKey === 'bgPrimary') {
            const hex = value.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            newColors.borderColor = brightness > 128 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
        }

        setTheme({
            name: 'Custom',
            colors: newColors,
        });
    };
    
    const resetToDefault = () => {
        setTheme(THEMES[0]);
    };

    const colorMappings: { key: keyof Theme['colors'], label: string }[] = [
        { key: 'bgPrimary', label: 'Primary Background' },
        { key: 'bgSecondary', label: 'Secondary Background' },
        { key: 'textPrimary', label: 'Primary Text' },
        { key: 'textSecondary', label: 'Secondary Text' },
        { key: 'accentPrimary', label: 'Primary Accent' },
        { key: 'accentSecondary', label: 'Secondary Accent' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
            <Card className="!bg-[var(--bg-secondary)]">
                <h2 className="text-xl font-bold mb-4">Customize Theme</h2>
                <div className="space-y-3">
                    {colorMappings.map(({ key, label }) => (
                         <ColorPicker 
                            key={key}
                            label={label}
                            value={theme.colors[key]}
                            onChange={(value) => handleColorChange(key, value)}
                        />
                    ))}
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <button onClick={resetToDefault} className="px-4 py-2 text-sm font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-white transition-colors">
                        Reset to Default
                    </button>
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg">
                        Done
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

export default CustomThemeModal;