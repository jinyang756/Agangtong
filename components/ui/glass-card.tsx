import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6 ${className}`}>
      {children}
    </div>
  );
}