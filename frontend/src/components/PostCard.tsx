import React from 'react';

interface PostProps {
  id: string;
  author: string;
  authorAvatar: string;
  published: string;
  content: string;
  likes: string;
  comments: string;
  attachment: any;
}

export const PostCard: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <div className="border border-neutral-200 bg-white p-4 rounded-xl flex flex-col space-y-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <img 
          src={post.authorAvatar} 
          alt={post.author} 
          className="w-8 h-8 rounded-full grayscale opacity-80 border border-neutral-200 object-cover" 
        />
        <div>
          <h4 className="text-xs font-semibold text-neutral-800">{post.author}</h4>
          <span className="text-[10px] text-neutral-400 font-mono">{post.published}</span>
        </div>
      </div>
      
      <p className="text-neutral-600 text-xs whitespace-pre-wrap leading-relaxed">{post.content}</p>
      
      {post.attachment && post.attachment.type === 'images' && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          {post.attachment.images.map((img: string, idx: number) => (
            <img 
              key={idx} 
              src={img} 
              alt="Attachment" 
              className="rounded border border-neutral-100 w-full h-auto object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
          ))}
        </div>
      )}
      
      {post.attachment && post.attachment.type === 'image' && (
        <img 
          src={post.attachment.url} 
          alt="Attachment" 
          className="rounded border border-neutral-100 w-full h-auto object-cover max-h-72 mt-1 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
        />
      )}
      
      {post.attachment && post.attachment.type === 'video' && (
        <a 
          href={`https://youtube.com/watch?v=${post.attachment.id}`} 
          target="_blank" 
          rel="noreferrer" 
          className="block relative mt-1 rounded overflow-hidden border border-neutral-100 group"
        >
          <img 
            src={post.attachment.thumbnails[post.attachment.thumbnails.length - 1]?.url} 
            alt="Video Attachment" 
            className="w-full h-auto grayscale opacity-70 group-hover:opacity-90 transition-all" 
          />
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <div className="bg-neutral-800 rounded px-2 py-1 text-[9px] font-mono text-white">
              PLAY VIDEO
            </div>
          </div>
        </a>
      )}
      
      <div className="flex items-center space-x-4 text-neutral-400 text-[10px] font-mono pt-2 border-t border-neutral-100">
        <div className="flex items-center space-x-1">
          <span>Likes:</span>
          <span className="text-neutral-600">{post.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Replies:</span>
          <span className="text-neutral-600">{post.comments}</span>
        </div>
      </div>
    </div>
  );
};
