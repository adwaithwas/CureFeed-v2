import React, { useEffect, useState } from 'react';

interface SavedChannel {
  id: string;
  name: string;
  url: string;
  avatar: string;
}

export const SavedChannels: React.FC<{ onSelect: (url: string) => void }> = ({ onSelect }) => {
  const [channels, setChannels] = useState<SavedChannel[]>([]);

  useEffect(() => {
    const loadChannels = () => {
      const saved = localStorage.getItem('saved_channels');
      if (saved) {
        setChannels(JSON.parse(saved));
      }
    };
    
    loadChannels();
    window.addEventListener('channels_updated', loadChannels);
    return () => window.removeEventListener('channels_updated', loadChannels);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = localStorage.getItem('saved_channels');
    if (saved) {
      const channelsList: SavedChannel[] = JSON.parse(saved);
      const updated = channelsList.filter(c => c.id !== id);
      localStorage.setItem('saved_channels', JSON.stringify(updated));
      setChannels(updated);
      window.dispatchEvent(new Event('channels_updated'));
    }
  };

  if (channels.length === 0) return null;

  return (
    <div className="mb-6 p-3 border border-neutral-200 bg-white rounded-xl shadow-sm">
      <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 font-mono">Saved Subscriptions</h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {channels.map(channel => (
          <div
            key={channel.id}
            className="flex items-center flex-shrink-0 rounded-lg border border-neutral-200 bg-[#FAF9F6] hover:bg-white hover:border-neutral-300 transition-colors"
          >
            <button
              onClick={() => onSelect(channel.url)}
              className="flex items-center space-x-2 px-2.5 py-1.5 focus:outline-none"
            >
              <img 
                src={channel.avatar} 
                alt={channel.name} 
                className="w-5 h-5 rounded-full grayscale opacity-80 object-cover" 
              />
              <span className="text-xs text-neutral-600 font-medium truncate max-w-[100px]">{channel.name}</span>
            </button>
            <button
              onClick={(e) => handleDelete(channel.id, e)}
              className="text-[14px] leading-none text-neutral-400 hover:text-red-600 font-mono px-2 py-1.5 border-l border-neutral-100 hover:bg-neutral-50 rounded-r-lg transition-colors"
              title="Remove channel"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
