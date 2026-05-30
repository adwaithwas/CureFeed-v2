import { useState } from 'react';
import { Loader } from './components/Loader';
import { VideoCard } from './components/VideoCard';
import { PostCard } from './components/PostCard';
import { SavedChannels } from './components/SavedChannels';
import { VideoPlayerModal } from './components/VideoPlayerModal';

function App() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'members' | 'community'>('home');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>(() => {
    const w = localStorage.getItem('watched_videos');
    return w ? JSON.parse(w) : [];
  });

  const fetchChannel = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError('');
    setData(null);
    setActiveTab('home');

    try {
      const backendUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;
      const response = await fetch(`${backendUrl}/api/channel?url=${encodeURIComponent(targetUrl)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch channel');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setUrlInput('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChannel(urlInput);
  };

  const toggleSaveChannel = () => {
    if (!data?.channel) return;

    const saved = localStorage.getItem('saved_channels');
    let channels = saved ? JSON.parse(saved) : [];

    const exists = channels.some((c: any) => c.id === data.channel.id);
    if (exists) {
      channels = channels.filter((c: any) => c.id !== data.channel.id);
    } else {
      channels.push({
        id: data.channel.id,
        name: data.channel.name,
        url: data.channel.url,
        avatar: data.channel.avatar
      });
    }

    localStorage.setItem('saved_channels', JSON.stringify(channels));
    window.dispatchEvent(new Event('channels_updated'));
    // force update
    setData({ ...data });
  };

  const isSaved = () => {
    if (!data?.channel) return false;
    const saved = localStorage.getItem('saved_channels');
    if (!saved) return false;
    const channels = JSON.parse(saved);
    return channels.some((c: any) => c.id === data.channel.id);
  };

  const handlePlayVideo = (videoId: string) => {
    setActiveVideoId(videoId);

    // Save to watched list if not already there
    setWatchedVideos((prev) => {
      if (prev.includes(videoId)) return prev;
      const updated = [...prev, videoId];
      localStorage.setItem('watched_videos', JSON.stringify(updated));
      return updated;
    });
  };

  const getHomeVideos = () => {
    if (!data) return [];
    
    // Combine both public and members-only videos
    const allVideos = [...(data.videos || []), ...(data.members || [])];
    
    // Sort chronologically (newest first)
    const sorted = [...allVideos].sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Filter out watched videos
    return sorted.filter((v: any) => !watchedVideos.includes(v.id));
  };

  const clearWatchHistory = () => {
    localStorage.removeItem('watched_videos');
    setWatchedVideos([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-800 pb-20 selection:bg-neutral-200 selection:text-black">
      <header className="pt-16 pb-8 px-4 flex flex-col items-center border-b border-neutral-100">
        <h1
          onClick={() => {
            setData(null);
            setUrlInput('');
            setError('');
            setActiveTab('home');
            setActiveVideoId(null);
          }}
          className="text-2xl font-semibold tracking-widest text-neutral-900 uppercase mb-2 cursor-pointer hover:opacity-75 transition-opacity select-none"
        >
          CureFeed
        </h1>
        <p className="text-neutral-500 text-xs font-mono mb-8 text-center tracking-tight max-w-sm">
          distraction-free feed
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div className="relative flex items-center bg-white rounded border border-neutral-200 focus-within:border-neutral-400 transition-colors p-0.5 shadow-sm">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="youtube.com/@handle"
              className="w-full bg-transparent border-none text-neutral-800 text-xs focus:outline-none focus:ring-0 py-2.5 px-4 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-neutral-50 border-l border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-xs font-mono px-5 py-2.5 transition-colors disabled:opacity-50"
            >
              FETCH
            </button>
          </div>
        </form>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        <SavedChannels onSelect={fetchChannel} />

        {loading && <Loader />}

        {error && (
          <div className="border border-neutral-200 bg-white p-4 rounded text-center shadow-sm">
            <p className="text-xs font-mono text-neutral-500">Error: {error}</p>
          </div>
        )}

        {data && data.channel && !loading && (
          <div className="space-y-8">
            {/* Channel Profile bar */}
            <div className="flex items-center justify-between p-4 border border-neutral-200 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <img
                  src={data.channel.avatar}
                  alt={data.channel.name}
                  className="w-12 h-12 rounded-full grayscale opacity-75 object-cover border border-neutral-100"
                />
                <div>
                  <h2 className="text-md font-semibold text-neutral-900">{data.channel.name}</h2>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{data.channel.subscriberCount}</p>
                  <a
                    href={data.channel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-neutral-400 font-mono hover:text-neutral-600 underline mt-1 inline-block"
                  >
                    original link ↗
                  </a>
                </div>
              </div>
              <button
                onClick={toggleSaveChannel}
                className={`text-[10px] font-mono px-3 py-1.5 rounded transition-all border ${isSaved()
                  ? 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-transparent border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400'
                  }`}
              >
                {isSaved() ? 'SAVED' : 'SAVE CHANNEL'}
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-neutral-200 gap-6 pb-2 font-mono text-xs">
              {(['home', 'videos', 'members', 'community'] as const).map(tab => {
                let badgeCount = 0;
                if (tab === 'home') badgeCount = getHomeVideos().length;
                if (tab === 'videos') badgeCount = data.videos?.length || 0;
                if (tab === 'members') badgeCount = data.members?.length || 0;
                if (tab === 'community') badgeCount = data.posts?.length || 0;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`uppercase pb-2 -mb-2 border-b-2 transition-all ${activeTab === tab
                      ? 'border-neutral-900 text-neutral-900 font-semibold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600'
                      }`}
                  >
                    {tab} <span className="text-[10px] text-neutral-400">({badgeCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              {activeTab === 'home' && (
                <div className="space-y-4">
                  {getHomeVideos().length > 0 ? (
                    getHomeVideos().map((video: any) => (
                      <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                    ))
                  ) : (
                    <div className="border border-neutral-200 bg-white p-8 rounded-xl text-center shadow-sm">
                      <p className="text-xs font-mono text-neutral-400 italic mb-2">✓ No new videos. You are completely caught up!</p>
                      {watchedVideos.length > 0 && (
                        <button
                          onClick={clearWatchHistory}
                          className="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 underline transition-colors"
                        >
                          [Reset watch history]
                        </button>
                      )}
                    </div>
                  )}
                  {getHomeVideos().length > 0 && watchedVideos.length > 0 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={clearWatchHistory}
                        className="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 underline transition-colors"
                      >
                        [Reset watch history]
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-3">
                  {data.videos && data.videos.length > 0 ? (
                    data.videos.map((video: any) => (
                      <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                    ))
                  ) : (
                    <p className="text-xs font-mono text-neutral-400 italic">No public videos found.</p>
                  )}
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-3">
                  {data.members && data.members.length > 0 ? (
                    data.members.map((video: any) => (
                      <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                    ))
                  ) : (
                    <div className="border border-neutral-200 bg-white p-6 rounded text-center shadow-sm">
                      <p className="text-xs font-mono text-neutral-400 italic mb-1">No member-exclusive videos found.</p>
                      <p className="text-[10px] font-mono text-neutral-400">(Scraping paid member-only videos requires account authentication sessions, which are disabled by default to maintain privacy).</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'community' && (
                <div className="space-y-4">
                  {data.posts && data.posts.length > 0 ? (
                    data.posts.map((post: any) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <p className="text-xs font-mono text-neutral-400 italic">No recent community posts found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {activeVideoId && (
        <VideoPlayerModal
          videoId={activeVideoId}
          onClose={() => setActiveVideoId(null)}
        />
      )}
    </div>
  );
}

export default App;