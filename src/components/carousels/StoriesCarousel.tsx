import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import type { Memory, ThemeConfig } from '../../types';
import { getNeobrutalistTextStyle } from '../../themes';

interface StoriesCarouselProps {
  items: Memory[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  theme: ThemeConfig;
  autoPlay: boolean;
  autoPlayDuration: number;
  onBackToHero?: () => void;
}

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({
  items,
  currentIndex,
  onIndexChange,
  theme,
  autoPlay,
  autoPlayDuration,
  onBackToHero,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  const nextPage = () => onIndexChange((currentIndex + 1) % items.length);
  const prevPage = () => onIndexChange((currentIndex - 1 + items.length) % items.length);

  // Scroll wheel navigation + back to hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Check if scrolling backward at first image
      if (currentIndex === 0 && delta < -30 && onBackToHero) {
        onBackToHero();
        return;
      }
      
      if (Math.abs(delta) > 30) {
        isScrolling = true;
        if (delta > 0) nextPage();
        else prevPage();
        setTimeout(() => { isScrolling = false; }, 500);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, items.length, onBackToHero]);

  // Autoplay with progress
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    progress.set(0);
    const animation = animate(progress, 1, {
      duration: autoPlayDuration / 1000,
      ease: 'linear',
      onComplete: nextPage,
    });

    return () => animation.stop();
  }, [autoPlay, autoPlayDuration, currentIndex, items.length, progress]);

  // Tap navigation
  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) prevPage();
    else nextPage();
  };

  const currentItem = items[currentIndex];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Story container */}
      <div
        onClick={handleTap}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 450,
          height: '100%',
          maxHeight: 800,
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#000',
        }}
      >
        {/* Progress bars */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            gap: 4,
            padding: '16px 16px 0',
            zIndex: 20,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          }}
        >
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.25)',
                overflow: 'hidden',
              }}
            >
              {i < currentIndex && <div style={{ width: '100%', height: '100%', background: '#fff' }} />}
              {i === currentIndex && (
                <motion.div
                  style={{
                    height: '100%',
                    background: '#fff',
                    scaleX: progress,
                    transformOrigin: 'left',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Story content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* Background image */}
            <img
              src={currentItem?.image}
              alt={currentItem?.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
              }}
            />

            {/* Content - bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28 }}>
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 0.6 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  margin: '0 0 8px', 
                  fontSize: 12, 
                  color: '#fff', 
                  letterSpacing: '0.2em',
                  fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                  ...getNeobrutalistTextStyle(theme),
                }}
              >
                {String(currentIndex + 1).padStart(2, '0')}
              </motion.p>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  margin: '0 0 12px',
                  fontSize: 28,
                  fontWeight: theme.id === 'neobrutalism' ? 900 : 400,
                  color: '#fff',
                  fontFamily: theme.typography.fontFamily,
                  ...getNeobrutalistTextStyle(theme, true),
                }}
              >
                {currentItem?.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                transition={{ delay: 0.4 }}
                style={{ 
                  margin: '0 0 12px', 
                  fontSize: 13, 
                  color: '#fff', 
                  opacity: theme.id === 'neobrutalism' ? 1 : 0.6,
                  fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                  ...getNeobrutalistTextStyle(theme),
                }}
              >
                {currentItem && new Date(currentItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.85 }}
                transition={{ delay: 0.5 }}
                style={{ 
                  margin: 0, 
                  fontSize: 15, 
                  lineHeight: 1.6, 
                  color: '#fff',
                  fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                  ...getNeobrutalistTextStyle(theme),
                }}
              >
                {currentItem?.story}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side previews */}
      {items.length > 1 && (
        <>
          <motion.div
            onClick={prevPage}
            whileHover={{ scale: 1.05, opacity: 0.6 }}
            style={{
              position: 'absolute',
              left: 30,
              width: 70,
              height: 120,
              borderRadius: 10,
              overflow: 'hidden',
              opacity: 0.35,
              cursor: 'pointer',
            }}
          >
            <img
              src={items[(currentIndex - 1 + items.length) % items.length]?.image}
              alt="Previous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
          <motion.div
            onClick={nextPage}
            whileHover={{ scale: 1.05, opacity: 0.6 }}
            style={{
              position: 'absolute',
              right: 30,
              width: 70,
              height: 120,
              borderRadius: 10,
              overflow: 'hidden',
              opacity: 0.35,
              cursor: 'pointer',
            }}
          >
            <img
              src={items[(currentIndex + 1) % items.length]?.image}
              alt="Next"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StoriesCarousel;
