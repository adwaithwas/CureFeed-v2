import React from 'react';

interface VideoProps {
  id: string;
  title: string;
  thumbnails: { url: string; width: number; height: number }[];
  published: string;
  views: string;
  duration: string;
  isMemberOnly?: boolean;
}

export const VideoCard: React.FC<{ video: VideoProps; onPlay?: (id: string) => void }> = ({ video, onPlay }) => {
  const thumbnail = video.thumbnails[video.thumbnails.length - 1]?.url;

  
  const content = (
    <>
      <div className="relative aspect-video w-32 md:w-36 flex-shrink-0 bg-neutral-100 rounded overflow-hidden border border-neutral-100">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
            No Image
          </div>
        )}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono font-medium">
          {video.duration || '0:00'}
        </div>
        {video.isMemberOnly && (
          <div className="absolute top-1 left-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono font-medium uppercase tracking-wider">
            Members Only
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-xs md:text-sm text-neutral-800 line-clamp-2 leading-snug group-hover:text-black transition-colors">
          {video.title}
        </h3>
        <div className="mt-1.5 text-[10px] text-neutral-400 font-mono space-x-1">
          <span>{video.views || 'Members only'}</span>
          {video.published && (
            <>
              <span>•</span>
              <span>{video.published}</span>
            </>
          )}
        </div>
      </div>
    </>
  );

  const containerClass = "group flex items-start gap-4 p-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm";

  if (video.isMemberOnly) {
    return (
      <div className={containerClass}>
        {content}
      </div>
    );
  }

  if (onPlay) {
    return (
      <button 
        onClick={() => onPlay(video.id)}
        className={`${containerClass} w-full text-left`}
      >
        {content}
      </button>
    );
  }

  return (
    <a 
      href={`https://youtube.com/watch?v=${video.id}`} 
      target="_blank" 
      rel="noreferrer"
      className={containerClass}
    >
      {content}
    </a>
  );
};

