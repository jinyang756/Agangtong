import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'cyan' | 'purple' | 'emerald';
}

export default function NeonButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'cyan'
}: NeonButtonProps) {
  const variantClasses = {
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/30',
    emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}