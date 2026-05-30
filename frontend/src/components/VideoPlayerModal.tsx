import React, { useEffect, useState } from 'react';

interface VideoPlayerModalProps {
  videoId: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoId, onClose }) => {
  const [isMonochrome, setIsMonochrome] = useState(true);

  // Prevent body scrolling and close on Esc key
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[2px] p-4 sm:p-6" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-200 bg-white">
          <a 
            href={`https://youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Open on YouTube ↗
          </a>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMonochrome(!isMonochrome)}
              className="text-xs font-mono text-neutral-500 hover:text-black transition-colors px-2 py-1 rounded hover:bg-neutral-100"
              title="Toggle color mode"
            >
              {isMonochrome ? '[Enable Colors]' : '[Monochrome]'}
            </button>
            <button 
              onClick={onClose}
              className="text-xs font-mono text-neutral-500 hover:text-black transition-colors px-2 py-1 rounded hover:bg-neutral-100"
            >
              [Close]
            </button>
          </div>
        </div>

        {/* 16:9 Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title="CureFeed Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={`absolute inset-0 w-full h-full border-none transition-all duration-700 ${isMonochrome ? 'grayscale' : ''}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};
