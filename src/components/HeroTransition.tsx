import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Memory, ThemeConfig } from '../types';
import { getNeobrutalistTextStyle } from '../themes';

interface HeroTransitionProps {
  firstMemory: Memory;
  theme: ThemeConfig;
  isHeroView: boolean;
  onShowHero: () => void;
  onShowCarousel: () => void;
  children: React.ReactNode;
}

const HeroTransition: React.FC<HeroTransitionProps> = ({
  firstMemory,
  theme,
  isHeroView,
  onShowHero,
  onShowCarousel,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionCooldown = useRef(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Mark first load complete after initial render
  useEffect(() => {
    if (isFirstLoad) {
      const timer = setTimeout(() => setIsFirstLoad(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  // Transition to carousel
  const transitionToCarousel = useCallback(() => {
    if (transitionCooldown.current || !isHeroView) return;
    transitionCooldown.current = true;

    // Delay before switching view
    setTimeout(() => {
      onShowCarousel();
      // Longer cooldown to prevent fast scroll in carousel
      setTimeout(() => {
        transitionCooldown.current = false;
      }, 1000);
    }, 100);
  }, [isHeroView, onShowCarousel]);

  // Transition back to hero - smooth with longer cooldown
  const transitionToHero = useCallback(() => {
    if (transitionCooldown.current || isHeroView) return;
    transitionCooldown.current = true;

    // Small delay before switching to allow carousel to fade
    setTimeout(() => {
      onShowHero();
      // Longer cooldown to let the smooth spring animation complete
      setTimeout(() => {
        transitionCooldown.current = false;
      }, 1200);
    }, 50);
  }, [isHeroView, onShowHero]);

  // Handle scroll in hero view
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isHeroView) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 30) {
        transitionToCarousel();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > 50) {
        transitionToCarousel();
      }
    };

    const handleClick = () => transitionToCarousel();

    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handleClick);
    };
  }, [isHeroView, transitionToCarousel]);

  // Expose transition to hero for carousel to call
  useEffect(() => {
    (window as any).__transitionToHero = transitionToHero;
    return () => {
      delete (window as any).__transitionToHero;
    };
  }, [transitionToHero]);



  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <AnimatePresence mode="sync">
        {isHeroView ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {/* Hero Image - ultra smooth spring animation for appearing */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{
                type: 'spring',
                stiffness: 35,
                damping: 18,
                mass: 1.2,
                restDelta: 0.001,
              }}
              style={{
                width: '80vw',
                maxWidth: 550,
                aspectRatio: '4/5',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              }}
            >
              <img
                src={firstMemory.image}
                alt={firstMemory.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>

            {/* Hero Info - smooth delayed fade in */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ 
                delay: 0.3, 
                duration: 1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                marginTop: 36,
                textAlign: 'center',
                maxWidth: 480,
                padding: '0 24px',
              }}
            >
              <h1
                style={{
                  margin: '0 0 14px',
                  fontSize: 'clamp(22px, 4.5vw, 38px)',
                  fontWeight: theme.id === 'neobrutalism' ? 900 : 300,
                  color: theme.typography.titleColor,
                  fontFamily: theme.typography.fontFamily,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  ...getNeobrutalistTextStyle(theme, true),
                }}
              >
                {firstMemory.title}
              </h1>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 13,
                  color: theme.typography.textColor,
                  opacity: theme.id === 'neobrutalism' ? 1 : 0.5,
                  fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                  ...getNeobrutalistTextStyle(theme),
                }}
              >
                {new Date(firstMemory.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: theme.typography.textColor,
                  opacity: theme.id === 'neobrutalism' ? 1 : 0.6,
                  fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                  ...getNeobrutalistTextStyle(theme),
                }}
              >
                {firstMemory.story}
              </p>
            </motion.div>

            {/* Scroll hint - appears later */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: 45,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                color: theme.typography.textColor,
              }}
            >
              <span style={{ 
                fontSize: 10, 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase',
                fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
                ...getNeobrutalistTextStyle(theme),
              }}>
                Scroll to explore
              </span>
              <motion.svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </motion.svg>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.7, 
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroTransition;
