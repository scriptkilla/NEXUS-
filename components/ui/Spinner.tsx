
import React from 'react';
import { NexusLogoIcon } from '../icons/Icons';

interface SpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ text, fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center h-screen w-screen gap-4 bg-[var(--bg-primary)]"
    : "flex flex-col items-center justify-center h-full w-full gap-4";

  return (
    <div className={containerClasses}>
      <NexusLogoIcon className="w-16 h-16 animate-spin" style={{ animationDuration: '2s' }} />
      {text && <p className="text-lg font-semibold text-neon-purple animate-pulse">{text}</p>}
    </div>
  );
};

export default Spinner;
