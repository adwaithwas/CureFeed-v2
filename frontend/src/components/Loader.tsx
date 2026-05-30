import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-2">
      <p className="text-xs font-mono text-neutral-500 animate-pulse">fetching clean feed...</p>
    </div>
  );
};
