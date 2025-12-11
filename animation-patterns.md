# Advanced Animation Patterns Guide

## 1. Parallax & Scale Carousel (Expo Slider Style)

### Key Implementation Details:
- Uses `perspective` and `translateZ` for depth
- Implements smooth momentum scrolling with velocity tracking
- Scale transforms based on distance from center
- Touch gesture recognition for swipe detection

```tsx
// ParallaxCarousel.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

const ParallaxCarousel = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const drag = useGesture({
    onDrag: ({ offset: [dx], velocity: [vx], direction: [dir] }) => {
      x.set(dx);

      // Detect swipe completion based on velocity and offset
      if (Math.abs(vx) > 500 || Math.abs(dx) > width / 3) {
        const newIndex = dir > 0 ? index - 1 : index + 1;
        setIndex(Math.max(0, Math.min(newIndex, items.length - 1)));
      }
    },
    onDragEnd: () => {
      x.set(0);
    }
  });

  const cardVariants = {
    center: {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      zIndex: 5,
      filter: 'brightness(1.2)',
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
    left: {
      x: '-60%',
      y: 40,
      scale: 0.8,
      rotateY: 25,
      zIndex: 2,
      filter: 'brightness(0.7)',
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
    right: {
      x: '60%',
      y: 40,
      scale: 0.8,
      rotateY: -25,
      zIndex: 2,
      filter: 'brightness(0.7)',
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
    farLeft: {
      x: '-120%',
      y: 80,
      scale: 0.6,
      rotateY: 35,
      zIndex: 1,
      opacity: 0.5,
      filter: 'brightness(0.4)',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    farRight: {
      x: '120%',
      y: 80,
      scale: 0.6,
      rotateY: -35,
      zIndex: 1,
      opacity: 0.5,
      filter: 'brightness(0.4)',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="carousel-container" style={{ perspective: '1200px', height: '100vh' }}>
      <motion.div className="carousel-track" style={{ transform: `translateX(${-index * 100}%)` }}>
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const position = getPosition(i - index);

            return (
              <motion.div
                key={item.id}
                className="carousel-card"
                custom={position}
                variants={cardVariants}
                initial="center"
                animate={position}
                exit="farRight"
                style={{
                  position: 'absolute',
                  width: '400px',
                  height: '500px',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-200px',
                  marginTop: '-250px',
                  transformStyle: 'preserve-3d'
                }}
                {...drag()}
              >
                <div className="card-content" style={{ backfaceVisibility: 'hidden' }}>
                  {item.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Helper to determine card position based on index difference
const getPosition = (diff: number) => {
  if (diff === 0) return 'center';
  if (diff === -1) return 'left';
  if (diff === 1) return 'right';
  if (diff < -1) return 'farLeft';
  return 'farRight';
};
```

### Performance Optimizations:
- `will-change: transform` for cards being animated
- `backface-visibility: hidden` to prevent render jank
- Use `transform3d` instead of individual transform properties
- GPU acceleration with `translateZ(0)` where needed

## 2. Cards Stack Slider (3D Deck Effect)

### Key Features:
- Physics-based spring animations
- Swipe to dismiss with velocity thresholds
- 3D rotation and perspective effects

```tsx
// CardStack.tsx
import { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

const CardStack = ({ cards }: { cards: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const swipeX = useMotionValue(0);
  const swipeY = useMotionValue(0);
  const rotateX = useTransform(swipeY, [-100, 100], [30, -30]);
  const rotateZ = useTransform(swipeX, [-100, 100], [-30, 30]);

  const bind = useGesture({
    onDrag: ({ offset: [dx, dy], velocity: [vx, vy], down }) => {
      swipeX.set(dx);
      swipeY.set(dy);

      if (!down) {
        // Check if card should be swiped away
        if (Math.abs(dx) > 150 || Math.abs(vx) > 0.5) {
          const direction = dx > 0 ? 1 : -1;
          swipeOutCard(direction);
        } else {
          // Snap back to center
          swipeX.set(0);
          swipeY.set(0);
        }
      }
    }
  });

  const swipeOutCard = async (direction: number) => {
    await controls.start({
      x: direction * 500,
      y: direction === 1 ? -200 : 200,
      rotateZ: direction * 45,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1]
      }
    });

    setActiveIndex(prev => prev + 1);
    swipeX.set(0);
    swipeY.set(0);
  };

  return (
    <div className="card-stack" style={{ perspective: '1000px', height: '100vh' }}>
      {cards.slice(activeIndex, activeIndex + 3).reverse().map((card, stackIndex) => {
        const isActive = stackIndex === 2;
        const isNext = stackIndex === 1;

        return (
          <motion.div
            key={card.id}
            className="stack-card"
            animate={{
              x: 0,
              y: stackIndex * -5,
              scale: 1 - stackIndex * 0.05,
              rotateZ: (2 - stackIndex) * 2,
              z: stackIndex * 50,
              opacity: 1 - stackIndex * 0.15
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            style={{
              position: 'absolute',
              width: '320px',
              height: '480px',
              left: '50%',
              top: '50%',
              marginLeft: '-160px',
              marginTop: '-240px',
              transformStyle: 'preserve-3d',
              cursor: isActive ? 'grab' : 'default',
              zIndex: 10 - stackIndex
            }}
          >
            {isActive && (
              <motion.div
                {...bind()}
                className="draggable-card"
                animate={controls}
                style={{
                  x: swipeX,
                  y: swipeY,
                  rotateX,
                  rotateZ,
                  width: '100%',
                  height: '100%',
                  position: 'absolute'
                }}
              >
                {card.content}
              </motion.div>
            )}
            {!isActive && (
              <div className="static-card">
                {card.content}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
```

### CSS for 3D Effects:
```css
.card-stack {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.stack-card {
  transform-style: preserve-3d;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border-radius: 16px;
  overflow: hidden;
}

.draggable-card {
  cursor: grab;
  user-select: none;
}

.draggable-card:active {
  cursor: grabbing;
}
```

## 3. Instagram Stories Slider

### Features:
- Full-screen viewport
- Progress bars with active state
- Auto-play with pause on interaction
- Smooth transitions between stories

```tsx
// StoriesSlider.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

const StoriesSlider = ({ stories }: { stories: any[] }) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const storyDuration = 5000; // 5 seconds per slide
  const totalSlides = stories[currentStory]?.slides?.length || 0;

  // Auto-play logic
  useEffect(() => {
    if (!isPaused && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev >= totalSlides - 1) {
            // Move to next story
            if (currentStory < stories.length - 1) {
              setCurrentStory(s => s + 1);
              return 0;
            } else {
              // Loop back to beginning
              setCurrentStory(0);
              return 0;
            }
          }
          return prev + 1;
        });
      }, storyDuration);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, isDragging, currentStory, totalSlides, stories.length]);

  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true);
      setIsPaused(true);
    },
    onDragEnd: ({ direction: [dir], velocity: [vx] }) => {
      setIsDragging(false);

      // Handle horizontal swipe for story navigation
      if (Math.abs(vx) > 0.5) {
        if (dir > 0 && currentStory > 0) {
          setCurrentStory(s => s - 1);
          setCurrentSlide(0);
        } else if (dir < 0 && currentStory < stories.length - 1) {
          setCurrentStory(s => s + 1);
          setCurrentSlide(0);
        }
      }

      // Resume playing after a short delay
      setTimeout(() => setIsPaused(false), 1000);
    }
  });

  const handleSlideClick = (index: number) => {
    if (index < currentSlide) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className="stories-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStory}-${currentSlide}`}
          className="story-view"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: 'tween', duration: 0.3 }}
          {...bind()}
          style={{ width: '100vw', height: '100vh' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress Bars */}
          <div className="progress-container">
            {stories[currentStory]?.slides?.map((_, index) => (
              <div
                key={index}
                className="progress-bar-wrapper"
                style={{ flex: 1 }}
                onClick={() => handleSlideClick(index)}
              >
                <div className="progress-bar-bg">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{
                      width: index < currentSlide ? '100%' :
                             index === currentSlide ? 'var(--progress)' : '0%'
                    }}
                    transition={
                      index === currentSlide && !isPaused
                        ? { duration: storyDuration / 1000, ease: 'linear' }
                        : { duration: 0.2 }
                    }
                    style={{ '--progress': `${((Date.now() % storyDuration) / storyDuration) * 100}%` } as any}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Story Content */}
          <div className="story-content">
            {stories[currentStory]?.slides?.[currentSlide]?.content}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

### CSS for Stories:
```css
.stories-container {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
}

.progress-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 2px;
  padding: 12px 16px;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}

.progress-bar-wrapper {
  height: 2px;
  cursor: pointer;
}

.progress-bar-bg {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.3);
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: white;
  border-radius: 1px;
}

.story-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.story-view:active {
  cursor: grabbing;
}
```

## 4. Cyberpunk Retro Effects

### Features:
- Neon glow with CSS filters
- Glitch animations using keyframes
- Vaporwave gradients
- Retro typography effects

```tsx
// CyberpunkEffects.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CyberpunkCard = ({ content }: { content: any }) => {
  const [glitching, setGlitching] = useState(false);

  // Trigger random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div
      className="cyberpunk-card"
      whileHover={{
        scale: 1.05,
        filter: 'brightness(1.2) saturate(1.3)',
        transition: { duration: 0.3 }
      }}
      animate={glitching ? 'glitch' : 'normal'}
      variants={{
        glitch: {
          x: [-5, 5, -5, 5, 0],
          y: [-2, 2, -2, 2, 0],
          skewX: [-5, 5, -5, 5, 0],
          filter: [
            'hue-rotate(0deg) saturate(1)',
            'hue-rotate(90deg) saturate(2)',
            'hue-rotate(180deg) saturate(0.5)',
            'hue-rotate(270deg) saturate(1.5)',
            'hue-rotate(360deg) saturate(1)'
          ],
          transition: {
            duration: 0.3,
            repeat: 1
          }
        },
        normal: {
          x: 0,
          y: 0,
          skewX: 0,
          filter: 'none',
          transition: { duration: 0.3 }
        }
      }}
    >
      <div className="card-content">
        {/* Main content layer */}
        <div className="main-layer">
          {content}
        </div>

        {/* Glitch overlay layers */}
        {glitching && (
          <>
            <div className="glitch-layer red" />
            <div className="glitch-layer blue" />
            <div className="glitch-layer green" />
          </>
        )}
      </div>

      {/* Neon border effect */}
      <div className="neon-border" />
    </motion.div>
  );
};

// Vaporwave Gradient Background Component
const VaporwaveBackground = () => {
  return (
    <div className="vaporwave-bg">
      <motion.div
        className="gradient-layer layer-1"
        animate={{
          background: [
            'linear-gradient(45deg, #ff00ff, #00ffff)',
            'linear-gradient(45deg, #00ffff, #ffff00)',
            'linear-gradient(45deg, #ffff00, #ff00ff)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="gradient-layer layer-2"
        animate={{
          background: [
            'linear-gradient(-45deg, #9400d3, #ff1493)',
            'linear-gradient(-45deg, #ff1493, #00fa9a)',
            'linear-gradient(-45deg, #00fa9a, #9400d3)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Retro Typography Component
const RetroText = ({ text }: { text: string }) => {
  return (
    <div className="retro-text-container">
      <h1 className="retro-title">
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            className="retro-char"
            animate={{
              textShadow: [
                '3px 3px 0 #ff00ff, -3px -3px 0 #00ffff',
                '-3px 3px 0 #ffff00, 3px -3px 0 #ff00ff',
                '3px -3px 0 #00ffff, -3px 3px 0 #ffff00'
              ]
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};
```

### CSS for Cyberpunk Effects:
```css
/* Cyberpunk Card Styles */
.cyberpunk-card {
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyberpunk-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
  background-size: 400% 400%;
  z-index: -1;
  animation: gradient-shift 4s ease infinite;
  filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyberpunk-card:hover::before {
  opacity: 0.7;
}

.neon-border {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
  background-size: 400% 400%;
  z-index: -2;
  animation: gradient-shift 3s linear infinite;
  filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyberpunk-card:hover .neon-border {
  opacity: 1;
}

/* Glitch Effect Layers */
.glitch-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  mix-blend-mode: screen;
}

.glitch-layer.red {
  background: linear-gradient(transparent, rgba(255, 0, 0, 0.5));
  transform: translateX(-2px);
  animation: glitch-red 0.3s infinite;
}

.glitch-layer.blue {
  background: linear-gradient(transparent, rgba(0, 0, 255, 0.5));
  transform: translateX(2px);
  animation: glitch-blue 0.3s infinite;
}

.glitch-layer.green {
  background: linear-gradient(transparent, rgba(0, 255, 0, 0.5));
  transform: translateY(-1px);
  animation: glitch-green 0.3s infinite;
}

/* Vaporwave Background */
.vaporwave-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-layer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  animation: rotate-gradient 20s linear infinite;
  mix-blend-mode: screen;
}

.layer-1 {
  opacity: 0.5;
}

.layer-2 {
  animation-direction: reverse;
  opacity: 0.3;
}

/* Retro Typography */
.retro-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 3px 3px 0 #ff00ff, -3px -3px 0 #00ffff;
  animation: retro-pulse 2s ease-in-out infinite;
}

.retro-char {
  display: inline-block;
  position: relative;
}

/* Animations */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes rotate-gradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes glitch-red {
  0%, 100% { clip-path: inset(0 0 0 0); }
  25% { clip-path: inset(20% 0 40% 0); }
  50% { clip-path: inset(60% 0 20% 0); }
  75% { clip-path: inset(30% 0 50% 0); }
}

@keyframes glitch-blue {
  0%, 100% { clip-path: inset(0 0 0 0); }
  25% { clip-path: inset(40% 0 20% 0); }
  50% { clip-path: inset(20% 0 60% 0); }
  75% { clip-path: inset(50% 0 30% 0); }
}

@keyframes glitch-green {
  0%, 100% { clip-path: inset(0 0 0 0); }
  25% { clip-path: inset(10% 0 70% 0); }
  50% { clip-path: inset(70% 0 10% 0); }
  75% { clip-path: inset(40% 0 40% 0); }
}

@keyframes retro-pulse {
  0%, 100% { filter: brightness(1) contrast(1); }
  50% { filter: brightness(1.2) contrast(1.1); }
}

/* Scanning lines effect */
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
}
```

## Combining All Effects

To combine these animation patterns cohesively:

```tsx
// CombinedCarousel.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CombinedCarousel = () => {
  const [mode, setMode] = useState<'parallax' | 'stack' | 'stories' | 'cyber'>('parallax');
  const [isGlitching, setIsGlitching] = useState(false);

  const handleModeChange = (newMode: typeof mode) => {
    setIsGlitching(true);
    setTimeout(() => {
      setMode(newMode);
      setIsGlitching(false);
    }, 300);
  };

  const renderCarousel = () => {
    switch(mode) {
      case 'parallax':
        return <ParallaxCarousel items={[]} />;
      case 'stack':
        return <CardStack cards={[]} />;
      case 'stories':
        return <StoriesSlider stories={[]} />;
      case 'cyber':
        return <CyberpunkEffects content={<></>} />;
      default:
        return null;
    }
  };

  return (
    <div className="combined-carousel">
      <VaporwaveBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          className={isGlitching ? 'glitch-transition' : ''}
        >
          {renderCarousel()}
        </motion.div>
      </AnimatePresence>

      <nav className="mode-selector">
        {['parallax', 'stack', 'stories', 'cyber'].map(m => (
          <motion.button
            key={m}
            whileHover={{ scale: 1.1, textShadow: '0 0 20px currentColor' }}
            whileTap={{ scale: 0.95 }}
            className={mode === m ? 'active' : ''}
            onClick={() => handleModeChange(m as typeof mode)}
          >
            <RetroText text={m.toUpperCase()} />
          </motion.button>
        ))}
      </nav>
    </div>
  );
};
```

## Performance Best Practices

1. **GPU Acceleration**:
   - Always use `transform3d` instead of 2D transforms
   - Set `will-change: transform` on animated elements
   - Use `backface-visibility: hidden` on 3D elements

2. **Reduce Re-renders**:
   - Use `memo()` for static components
   - Implement virtual scrolling for large lists
   - Throttle scroll and resize events

3. **Mobile Optimization**:
   - Use `passive: true` for touch event listeners
   - Implement touch-specific gesture thresholds
   - Reduce animation complexity on low-end devices

4. **Bundle Optimization**:
   - Lazy load animation libraries
   - Code-split by animation type
   - Use dynamic imports for heavy effects

5. **60fps Targets**:
   - Profile animations with Chrome DevTools
   - Use `requestAnimationFrame` for custom animations
   - Limit number of simultaneous animations

These patterns provide a solid foundation for creating engaging, performant animation systems in modern React applications.