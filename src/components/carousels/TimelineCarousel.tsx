import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Memory, ThemeConfig, CardStyle } from '../../types';
import { getNeobrutalistTextStyle } from '../../themes';

interface TimelineCarouselProps {
  items: Memory[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  theme: ThemeConfig;
  autoPlay: boolean;
  autoPlayDuration: number;
  cardStyle?: CardStyle;
  onBackToHero?: () => void;
}

const TimelineCarousel: React.FC<TimelineCarouselProps> = ({
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
  const rawPosition = useMotionValue(currentIndex);
  const position = useSpring(rawPosition, { stiffness: 50, damping: 18 });
  const [displayIndex, setDisplayIndex] = useState(currentIndex);
  const lastScrollTime = useRef(0);

  const totalCards = items.length;

  // Update display index - handle infinite wrapping
  useEffect(() => {
    const unsubscribe = position.on('change', (latest) => {
      // Normalize to valid index for infinite loop
      let normalized = Math.round(latest) % totalCards;
      if (normalized < 0) normalized += totalCards;
      
      if (normalized !== displayIndex) {
        setDisplayIndex(normalized);
      }
    });
    return unsubscribe;
  }, [position, totalCards, displayIndex]);

  // Sync with external currentIndex
  useEffect(() => {
    // Don't reset position, just update the target smoothly
    const currentPos = rawPosition.get();
    const currentNormalized = ((Math.round(currentPos) % totalCards) + totalCards) % totalCards;
    
    if (currentNormalized !== currentIndex) {
      // Calculate shortest path for smooth transition
      let diff = currentIndex - currentNormalized;
      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;
      
      rawPosition.set(currentPos + diff);
    }
  }, [currentIndex, totalCards, rawPosition]);

  // Scroll wheel navigation - TRUE INFINITE with speed limiting + back to hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Speed limiting - max scroll every 60ms
      const now = Date.now();
      if (now - lastScrollTime.current < 60) return;
      lastScrollTime.current = now;
      
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Check if scrolling backward at first image
      if (displayIndex === 0 && delta < -30 && onBackToHero) {
        onBackToHero();
        return;
      }
      
      // Clamp delta to prevent fast scrolling
      const clampedDelta = Math.max(-80, Math.min(80, delta));
      
      // Continuous scroll - no clamping, true infinite
      const newPosition = rawPosition.get() + clampedDelta * 0.006;
      rawPosition.set(newPosition);
      
      // Calculate normalized index
      let roundedIndex = Math.round(newPosition) % totalCards;
      if (roundedIndex < 0) roundedIndex += totalCards;
      
      if (roundedIndex !== currentIndex) {
        onIndexChange(roundedIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [rawPosition, currentIndex, totalCards, onIndexChange, displayIndex, onBackToHero]);

  // Autoplay - infinite
  useEffect(() => {
    if (!autoPlay || totalCards <= 1) return;
    const interval = setInterval(() => {
      rawPosition.set(rawPosition.get() + 1);
      const newIndex = (currentIndex + 1) % totalCards;
      onIndexChange(newIndex);
    }, autoPlayDuration);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDuration, currentIndex, totalCards, onIndexChange, rawPosition]);

  const currentItem = items[displayIndex];

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
      {/* Info panel - bottom left */}
      <div style={{ position: 'absolute', bottom: 60, left: 50, zIndex: 200, maxWidth: 400 }}>
        <motion.div
          key={displayIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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

      {/* Timeline line */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${theme.typography.accentColor}30, transparent)`,
        }}
      />

      {/* Cards */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {items.map((item, index) => (
          <TimelineCard
            key={item.id}
            item={item}
            index={index}
            position={position}
            totalCards={totalCards}
            theme={theme}
            cardStyle={cardStyle}
            onSelect={() => {
              const currentPos = rawPosition.get();
              const currentNormalized = ((Math.round(currentPos) % totalCards) + totalCards) % totalCards;
              let diff = index - currentNormalized;
              if (diff > totalCards / 2) diff -= totalCards;
              if (diff < -totalCards / 2) diff += totalCards;
              rawPosition.set(currentPos + diff);
              onIndexChange(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface TimelineCardProps {
  item: Memory;
  index: number;
  position: ReturnType<typeof useSpring>;
  totalCards: number;
  theme: ThemeConfig;
  cardStyle: CardStyle;
  onSelect: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, index, position, totalCards, theme, cardStyle, onSelect }) => {
  // Calculate position with wrapping for infinite feel
  const x = useTransform(position, (pos) => {
    let diff = index - pos;
    // Wrap around for infinite loop visual
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    return diff * 280;
  });
  
  const scale = useTransform(position, (pos) => {
    let diff = index - pos;
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    return Math.max(0.7, 1 - Math.abs(diff) * 0.1);
  });
  
  const opacity = useTransform(position, (pos) => {
    let diff = index - pos;
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    return Math.max(0.3, 1 - Math.abs(diff) * 0.18);
  });
  
  const blur = useTransform(position, (pos) => {
    let diff = index - pos;
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    return Math.min(Math.abs(diff) * 2, 5);
  });

  const zIndex = useTransform(position, (pos) => {
    let diff = index - pos;
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    return Math.round(100 - Math.abs(diff) * 10);
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        scale,
        opacity,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        zIndex,
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      {/* Card - polaroid or borderless */}
      {cardStyle === 'polaroid' ? (
        <div
          style={{
            background: '#fefefe',
            padding: '10px 10px 38px 10px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            width: 220,
          }}
        >
          <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: '#e8e8e8' }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
          </div>
        </div>
      ) : (
        <div
          style={{
            width: 220,
            aspectRatio: '4/5',
            overflow: 'hidden',
            borderRadius: 10,
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          }}
        >
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        </div>
      )}
      
      {/* Timeline dot */}
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: theme.typography.accentColor,
          border: '2px solid rgba(255,255,255,0.3)',
        }}
      />
    </motion.div>
  );
};

export default TimelineCarousel;
