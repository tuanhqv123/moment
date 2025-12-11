import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus } from 'lucide-react';
import type { Memory, ThemeStyle, CarouselStyle, CardStyle } from '../types';
import { getTheme, getNeobrutalistTextStyle } from '../themes';
import ThemedBackground from './backgrounds/ThemedBackground';
import ThemeSelector from './ThemeSelector';
import HeroTransition from './HeroTransition';
import { OrbitCarousel, TimelineCarousel, StackCarousel, StoriesCarousel, FlowCarousel } from './carousels';

interface StoryViewerProps {
  memories: Memory[];
  onAddMemory?: () => void;
  initialTheme?: ThemeStyle;
  initialCarousel?: CarouselStyle;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  memories,
  onAddMemory,
  initialTheme = 'minimal',
  initialCarousel = 'orbit',
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeStyle>(initialTheme);
  const [currentCarousel, setCurrentCarousel] = useState<CarouselStyle>(initialCarousel);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayDuration, setAutoPlayDuration] = useState(6000);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customBgColor, setCustomBgColor] = useState<string | undefined>('#ffffff'); // Default light mode
  const [cardStyle, setCardStyle] = useState<CardStyle>('borderless');

  const baseTheme = getTheme(currentTheme);
  
  // Adjust theme for minimal mode based on background color
  const theme = currentTheme === 'minimal'
    ? (customBgColor === '#ffffff' || customBgColor === undefined)
      ? {
          ...baseTheme,
          typography: {
            ...baseTheme.typography,
            titleColor: '#000000',
            textColor: 'rgba(0, 0, 0, 0.8)',
            accentColor: '#007AFF',
          },
        }
      : {
          ...baseTheme,
          typography: {
            ...baseTheme.typography,
            titleColor: '#ffffff',
            textColor: 'rgba(255, 255, 255, 0.9)',
            accentColor: '#ffffff',
          },
        }
    : baseTheme;

  // Hero image transition state - bidirectional
  const [isHeroView, setIsHeroView] = useState(true);

  // Callback for carousel to trigger hero view when scrolling back from first image
  const handleBackToHero = () => {
    if (currentIndex === 0) {
      setIsHeroView(true);
    }
  };

  const renderCarousel = () => {
    const commonProps = {
      items: memories,
      currentIndex,
      onIndexChange: setCurrentIndex,
      theme,
      autoPlay: autoPlay && !isHeroView,
      autoPlayDuration,
      cardStyle,
      onBackToHero: handleBackToHero,
    };

    switch (currentCarousel) {
      case 'orbit':
        return <OrbitCarousel {...commonProps} />;
      case 'timeline':
        return <TimelineCarousel {...commonProps} />;
      case 'stack':
        return <StackCarousel {...commonProps} />;
      case 'stories':
        return <StoriesCarousel {...commonProps} />;
      case 'flow':
        return <FlowCarousel {...commonProps} />;
      default:
        return <OrbitCarousel {...commonProps} />;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <ThemedBackground theme={theme} customColor={customBgColor} />

      {/* Header */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 40px',
          zIndex: 100,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: currentTheme === 'neobrutalism' ? 900 : 500,
            color: theme.typography.titleColor,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            opacity: currentTheme === 'neobrutalism' ? 1 : 0.9,
            fontFamily: theme.typography.fontFamily,
            ...getNeobrutalistTextStyle(theme, true),
          }}
        >
          Memory Lane
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Settings button - glass style (adapts to light/dark) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            style={{
              background: (customBgColor === '#ffffff' || (currentTheme === 'minimal' && customBgColor === undefined)) ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              border: (customBgColor === '#ffffff' || (currentTheme === 'minimal' && customBgColor === undefined)) ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: theme.typography.titleColor,
            }}
          >
            <Settings size={18} />
          </motion.button>

          {/* Add button - same glass style as settings */}
          {onAddMemory && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddMemory}
              style={{
                background: (customBgColor === '#ffffff' || (currentTheme === 'minimal' && customBgColor === undefined)) ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: (customBgColor === '#ffffff' || (currentTheme === 'minimal' && customBgColor === undefined)) ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: theme.typography.titleColor,
              }}
            >
              <Plus size={18} />
            </motion.button>
          )}
        </div>
      </header>

      {/* Hero Transition + Carousel */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {memories.length > 0 ? (
          <HeroTransition
            firstMemory={memories[0]}
            theme={theme}
            isHeroView={isHeroView}
            onShowHero={() => {
              setIsHeroView(true);
              setCurrentIndex(0);
            }}
            onShowCarousel={() => setIsHeroView(false)}
          >
            {renderCarousel()}
          </HeroTransition>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.typography.textColor,
            }}
          >
            <p style={{ 
              fontSize: 16, 
              marginBottom: 24, 
              opacity: theme.id === 'neobrutalism' ? 1 : 0.5,
              color: theme.typography.textColor,
              fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
              ...getNeobrutalistTextStyle(theme)
            }}>No memories yet</p>
            {onAddMemory && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddMemory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  background: theme.typography.accentColor,
                  border: currentTheme === 'neobrutalism' ? '4px solid #000000' : 'none',
                  borderRadius: currentTheme === 'neobrutalism' ? 0 : 28,
                  boxShadow: currentTheme === 'neobrutalism' ? '6px 6px 0px #000000' : 'none',
                  color: currentTheme === 'neobrutalism' ? '#000000' : '#fff',
                  fontSize: 15,
                  fontWeight: currentTheme === 'neobrutalism' ? 900 : 600,
                  cursor: 'pointer',
                  fontFamily: currentTheme === 'neobrutalism' ? theme.typography.fontFamily : 'inherit',
                  textShadow: currentTheme === 'neobrutalism' ? '2px 2px 0px #ffffff' : 'none',
                  WebkitTextStroke: currentTheme === 'neobrutalism' ? '1px #ffffff' : 'none',
                }}
              >
                <Plus size={18} />
                Add Your First Memory
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Theme Selector Modal */}
      {showSettings && (
        <ThemeSelector
          currentTheme={currentTheme}
          currentCarousel={currentCarousel}
          autoPlay={autoPlay}
          autoPlayDuration={autoPlayDuration}
          customBgColor={customBgColor}
          cardStyle={cardStyle}
          onThemeChange={(t) => {
            setCurrentTheme(t);
            // Set appropriate default background color for the theme
            if (t === 'minimal') {
              setCustomBgColor('#ffffff'); // Default to light mode for minimal
            } else {
              setCustomBgColor(undefined); // Let other themes use their default
            }
          }}
          onCarouselChange={setCurrentCarousel}
          onAutoPlayChange={setAutoPlay}
          onDurationChange={setAutoPlayDuration}
          onCustomColorChange={setCustomBgColor}
          onCardStyleChange={setCardStyle}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default StoryViewer;
