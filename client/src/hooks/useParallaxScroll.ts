import { useEffect, useRef, useCallback } from 'react';

export const useParallaxScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.parallax-card');
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      const rect = cardElement.getBoundingClientRect();
      const cardTop = rect.top + scrollY;
      const cardBottom = cardTop + rect.height;

      // Calculate if card is in viewport
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
      
      if (isInViewport) {
        // Calculate progress through viewport (0 = top of viewport, 1 = bottom)
        const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
        
        // Create approach effect - cards scale up and move forward as they enter viewport
        const scale = 0.95 + (progress * 0.05); // Scale from 0.95 to 1
        const translateZ = -50 + (progress * 50); // Move from -50px to 0px in Z
        const opacity = 0.7 + (progress * 0.3); // Opacity from 0.7 to 1
        
        cardElement.style.transform = `translateZ(${translateZ}px) scale(${scale})`;
        cardElement.style.opacity = opacity.toString();
        
        cardElement.classList.add('in-view');
      } else {
        // Card is out of viewport - reset to default state
        cardElement.style.transform = 'translateZ(-50px) scale(0.98)';
        cardElement.style.opacity = '0.8';
        cardElement.classList.remove('in-view');
      }
    });
  }, []);

  useEffect(() => {
    // Set up scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set up cards
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { containerRef };
};