import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--bg-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;