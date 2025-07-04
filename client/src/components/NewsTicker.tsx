import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Globe } from 'lucide-react';

interface NewsArticle {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const NewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    if (articles && articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
      }, 5000); // Change story every 5 seconds

      return () => clearInterval(interval);
    }
  }, [articles]);

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <Globe className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading trending stories...</span>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <Globe className="w-5 h-5" />
          <span className="font-medium">No trending stories available</span>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm uppercase tracking-wide">TRENDING</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 flex-shrink-0 opacity-80" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate animate-fade-in-up">
                {currentArticle.title}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {currentArticle.source.name} • {new Date(currentArticle.publishedAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex space-x-1">
            {articles.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;