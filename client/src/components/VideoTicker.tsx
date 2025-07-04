import { useRef, useEffect } from 'react';

interface VideoItem {
  id: string;
  src: string;
  title: string;
  thumbnail?: string;
}

interface VideoTickerProps {
  videos?: VideoItem[];
}

const VideoTicker = ({ videos }: VideoTickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Default video examples - you can replace these with your actual videos
  const defaultVideos: VideoItem[] = [
    {
      id: '1',
      src: '/videos/Video_Ready_Abstract_Building_View_1751666705819.mp4',
      title: 'Abstract Building View',
    },
    {
      id: '2',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Sample Video 1',
    },
    {
      id: '3',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: 'Sample Video 2',
    },
    {
      id: '4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Sample Video 3',
    },
    {
      id: '5',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Sample Video 4',
    },
  ];

  const videosToShow = videos || defaultVideos;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 0.5; // Constant speed in pixels per frame
    
    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Seamless reset when we've scrolled past the first set
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation immediately
    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Duplicate videos for seamless infinite scroll
  const duplicatedVideos = [...videosToShow, ...videosToShow];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Example Video Creations
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          See what's possible with AI video generation
        </p>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden scrollbar-hide"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedVideos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="flex-shrink-0 w-64 h-36 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 video-glow-item"
            style={{
              animationDelay: `${index * 0.5}s`
            }}
          >
            <video
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            >
              <source src={video.src} type="video/mp4" />
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center">
                <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  {video.title}
                </span>
              </div>
            </video>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Videos created using AI prompt generation tools
        </p>
      </div>
    </div>
  );
};

export default VideoTicker;