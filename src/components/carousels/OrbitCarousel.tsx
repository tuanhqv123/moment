import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Memory, ThemeConfig, CardStyle } from '../../types';

interface OrbitCarouselProps {
  items: Memory[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  theme: ThemeConfig;
  autoPlay: boolean;
  autoPlayDuration: number;
  cardStyle?: CardStyle;
  onBackToHero?: () => void;
}

const OrbitCarousel: React.FC<OrbitCarouselProps> = ({
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
  const [globalRotation, setGlobalRotation] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(currentIndex);
  const animationRef = useRef<number | null>(null);
  const targetRotationRef = useRef(0);
  const isExternalUpdateRef = useRef(false);
  const lastScrollTime = useRef(0);

  const totalCards = items.length;
  const angleStep = 360 / totalCards;
  const radius = 550;

  // Smooth animation loop
  useEffect(() => {
    let currentRotation = globalRotation;
    
    const animateLoop = () => {
      const diff = targetRotationRef.current - currentRotation;
      
      if (Math.abs(diff) > 0.1) {
        currentRotation += diff * 0.06;
        setGlobalRotation(currentRotation);
      }
      
      animationRef.current = requestAnimationFrame(animateLoop);
    };
    
    animationRef.current = requestAnimationFrame(animateLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update display index based on rotation - TRUE INFINITE
  useEffect(() => {
    // Calculate which card is at front based on continuous rotation
    // Use modulo to wrap around infinitely
    let normalizedRotation = -globalRotation % 360;
    if (normalizedRotation < 0) normalizedRotation += 360;
    
    let focusIndex = Math.round(normalizedRotation / angleStep) % totalCards;
    if (focusIndex < 0) focusIndex += totalCards;
    
    if (focusIndex !== displayIndex) {
      setDisplayIndex(focusIndex);
      // Only update parent if this wasn't triggered by parent
      if (!isExternalUpdateRef.current) {
        onIndexChange(focusIndex);
      }
      isExternalUpdateRef.current = false;
    }
  }, [globalRotation, angleStep, totalCards, displayIndex, onIndexChange]);

  // Sync with external currentIndex - find shortest path
  useEffect(() => {
    isExternalUpdateRef.current = true;
    
    // Calculate current position's index
    let currentNormalized = -targetRotationRef.current % 360;
    if (currentNormalized < 0) currentNormalized += 360;
    const currentPosIndex = Math.round(currentNormalized / angleStep) % totalCards;
    
    if (currentPosIndex !== currentIndex) {
      // Find shortest rotation path
      let diff = currentIndex - currentPosIndex;
      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;
      
      targetRotationRef.current -= diff * angleStep;
    }
  }, [currentIndex, angleStep, totalCards]);

  // Scroll wheel navigation - TRUE INFINITE with speed limiting + back to hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Speed limiting - max scroll every 50ms
      const now = Date.now();
      if (now - lastScrollTime.current < 50) return;
      lastScrollTime.current = now;
      
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Check if scrolling backward at first image
      if (displayIndex === 0 && delta < -30 && onBackToHero) {
        onBackToHero();
        return;
      }
      
      // Clamp delta to prevent fast scrolling
      const clampedDelta = Math.max(-80, Math.min(80, delta));
      targetRotationRef.current -= clampedDelta * 0.1;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [displayIndex, onBackToHero]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetRotationRef.current -= angleStep;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetRotationRef.current += angleStep;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [angleStep]);

  // Autoplay - continuous
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const interval = setInterval(() => {
      targetRotationRef.current -= angleStep;
    }, autoPlayDuration);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDuration, angleStep, items.length]);

  const currentItem = items[displayIndex];

  // Calculate card style with inclined arc
  const getCardStyle = (index: number) => {
    // Use continuous rotation for positioning
    const cardAngle = index * angleStep + globalRotation;
    
    // Normalize for visual calculations only
    let normalizedAngle = cardAngle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    if (normalizedAngle > 180) normalizedAngle = 360 - normalizedAngle;
    
    const isFocused = index === displayIndex;
    const angleDiff = normalizedAngle;
    
    // Visual effects
    const blur = isFocused ? 0 : Math.min(angleDiff / 18, 6);
    const opacity = isFocused ? 1 : Math.max(0.35, 1 - angleDiff / 180);
    const grayscale = isFocused ? 0 : 100;
    const brightness = isFocused ? 1.05 : 0.65;
    const zIndex = Math.round(100 - angleDiff);

    // Position on circle using continuous angle
    const angleRad = (cardAngle * Math.PI) / 180;
    const xPos = Math.sin(angleRad) * radius;
    const zPos = Math.cos(angleRad) * radius;
    
    // INCLINED ARC - wave pattern
    const yPos = Math.sin(angleRad) * 80 + Math.cos(angleRad * 0.5) * 40;
    
    // Scale based on depth
    const scale = isFocused ? 1 : Math.max(0.75, 0.85 + (zPos / radius) * 0.15);

    return {
      transform: `translateX(${xPos}px) translateY(${yPos}px) translateZ(${zPos}px) scale(${scale})`,
      filter: `grayscale(${grayscale}%) blur(${blur}px) brightness(${brightness})`,
      opacity,
      zIndex,
      transition: 'filter 0.5s ease, opacity 0.5s ease',
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'ns-resize',
      }}
    >
      {/* 3D Scene */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d',
          perspective: '1800px',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, index) => {
            const style = getCardStyle(index);
            
            return (
              <div
                key={item.id}
                onClick={() => {
                  // Find shortest path to this card
                  let currentNormalized = -targetRotationRef.current % 360;
                  if (currentNormalized < 0) currentNormalized += 360;
                  const currentPosIndex = Math.round(currentNormalized / angleStep) % totalCards;
                  
                  let diff = index - currentPosIndex;
                  if (diff > totalCards / 2) diff -= totalCards;
                  if (diff < -totalCards / 2) diff += totalCards;
                  
                  targetRotationRef.current -= diff * angleStep;
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: -150,
                  marginTop: -190,
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  ...style,
                }}
              >
                {/* Card - polaroid or borderless */}
                {cardStyle === 'polaroid' ? (
                  <div
                    style={{
                      background: '#fefefe',
                      padding: '10px 10px 40px 10px',
                      boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
                      width: 300,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '4/5',
                        overflow: 'hidden',
                        background: '#e8e8e8',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        draggable={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 300,
                      aspectRatio: '4/5',
                      overflow: 'hidden',
                      borderRadius: 12,
                      boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info panel - BOTTOM LEFT */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 50,
          zIndex: 200,
          maxWidth: 450,
        }}
      >
        <motion.div
          key={displayIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1
            style={{
              margin: '0 0 12px 0',
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 300,
              color: theme.typography.titleColor,
              fontFamily: theme.typography.fontFamily,
              lineHeight: 1.15,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {currentItem?.title}
          </h1>
          
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: 13,
              color: theme.typography.textColor,
              opacity: 0.5,
            }}
          >
            {currentItem && new Date(currentItem.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.6,
              color: theme.typography.textColor,
              opacity: 0.6,
              maxWidth: 380,
              fontWeight: 300,
            }}
          >
            {currentItem?.story}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrbitCarousel;
