import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Memory, ThemeConfig, CardStyle } from '../../types';
import { getNeobrutalistTextStyle } from '../../themes';

interface FlowCarouselProps {
  items: Memory[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  theme: ThemeConfig;
  autoPlay: boolean;
  autoPlayDuration: number;
  cardStyle?: CardStyle;
  onBackToHero?: () => void;
}

const FlowCarousel: React.FC<FlowCarouselProps> = ({
  items,
  currentIndex,
  onIndexChange,
  theme,
  autoPlay,
  autoPlayDuration,
  cardStyle = 'polaroid',
  onBackToHero,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const targetPositionRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastScrollTime = useRef(0);

  const totalCards = items.length;
  const cardWidth = 320;
  const gap = 40;

  // Smooth animation loop
  useEffect(() => {
    const animateLoop = () => {
      const diff = targetPositionRef.current - position;
      if (Math.abs(diff) > 0.5) {
        setPosition(prev => prev + diff * 0.1);
      }
      animationRef.current = requestAnimationFrame(animateLoop);
    };
    animationRef.current = requestAnimationFrame(animateLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [position]);

  // Update current index based on position
  useEffect(() => {
    let normalizedPos = position % totalCards;
    if (normalizedPos < 0) normalizedPos += totalCards;
    const newIndex = Math.round(normalizedPos) % totalCards;
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  }, [position, totalCards, currentIndex, onIndexChange]);

  // Scroll wheel - with speed limiting + back to hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Speed limiting - max scroll every 80ms
      const now = Date.now();
      if (now - lastScrollTime.current < 80) return;
      lastScrollTime.current = now;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Check if scrolling backward at first image
      if (currentIndex === 0 && delta < -30 && onBackToHero) {
        onBackToHero();
        return;
      }
      
      // Clamp delta to prevent fast scrolling
      const clampedDelta = Math.max(-60, Math.min(60, delta));
      targetPositionRef.current += clampedDelta * 0.008;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, onBackToHero]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || totalCards <= 1) return;
    const interval = setInterval(() => {
      targetPositionRef.current += 1;
    }, autoPlayDuration);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDuration, totalCards]);

  const currentItem = items[currentIndex];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'ew-resize',
      }}
    >
      {/* Cards container */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {items.map((item, index) => {
          // Calculate position with infinite wrapping
          let diff = index - position;
          while (diff > totalCards / 2) diff -= totalCards;
          while (diff < -totalCards / 2) diff += totalCards;

          const x = diff * (cardWidth + gap);
          const scale = Math.max(0.7, 1 - Math.abs(diff) * 0.12);
          const opacity = Math.max(0.3, 1 - Math.abs(diff) * 0.25);
          const blur = Math.min(Math.abs(diff) * 3, 8);
          const isFocused = Math.abs(diff) < 0.5;

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                let clickDiff = index - (position % totalCards);
                if (clickDiff > totalCards / 2) clickDiff -= totalCards;
                if (clickDiff < -totalCards / 2) clickDiff += totalCards;
                targetPositionRef.current += clickDiff;
              }}
              style={{
                position: 'absolute',
                left: -cardWidth / 2,
                width: cardWidth,
                transform: `translateX(${x}px) scale(${scale})`,
                opacity,
                filter: `blur(${blur}px) grayscale(${isFocused ? 0 : 80}%)`,
                zIndex: Math.round(100 - Math.abs(diff) * 10),
                cursor: 'pointer',
                transition: 'filter 0.3s ease',
              }}
            >
              {cardStyle === 'polaroid' ? (
                <div
                  style={{
                    background: '#fefefe',
                    padding: '10px 10px 40px 10px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: '#e8e8e8' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4/5',
                    overflow: 'hidden',
                    borderRadius: 12,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info panel - bottom left */}
      <div style={{ position: 'absolute', bottom: 60, left: 50, zIndex: 200, maxWidth: 400 }}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ 
            margin: '0 0 12px', 
            fontSize: 'clamp(24px, 4vw, 40px)', 
            fontWeight: theme.id === 'neobrutalism' ? 900 : 300, 
            color: theme.typography.titleColor, 
            fontFamily: theme.typography.fontFamily, 
            textTransform: 'uppercase',
            ...getNeobrutalistTextStyle(theme, true)
          }}>
            {currentItem?.title}
          </h1>
          <p style={{ 
            margin: '0 0 12px', 
            fontSize: 13, 
            color: theme.typography.textColor, 
            opacity: theme.id === 'neobrutalism' ? 1 : 0.5,
            fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
            ...getNeobrutalistTextStyle(theme)
          }}>
            {currentItem && new Date(currentItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: 14, 
            lineHeight: 1.6, 
            color: theme.typography.textColor, 
            opacity: theme.id === 'neobrutalism' ? 1 : 0.6, 
            fontWeight: theme.id === 'neobrutalism' ? 700 : 300,
            ...getNeobrutalistTextStyle(theme)
          }}>
            {currentItem?.story}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowCarousel;
