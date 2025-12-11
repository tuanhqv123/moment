import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ThemeStyle, CarouselStyle, StoryConfig, Memory } from '../types';
import { getTheme } from '../themes';

interface StoryContextType {
  config: StoryConfig;
  setTheme: (theme: ThemeStyle) => void;
  setCarousel: (carousel: CarouselStyle) => void;
  setAutoPlay: (enabled: boolean) => void;
  setAutoPlayDuration: (duration: number) => void;
  currentTheme: ReturnType<typeof getTheme>;
  memories: Memory[];
  setMemories: (memories: Memory[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

const defaultConfig: StoryConfig = {
  theme: 'perplexity',
  carousel: 'orbit',
  autoPlay: true,
  autoPlayDuration: 5000,
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoryConfig>(defaultConfig);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setTheme = (theme: ThemeStyle) => {
    setConfig(prev => ({ ...prev, theme }));
  };

  const setCarousel = (carousel: CarouselStyle) => {
    setConfig(prev => ({ ...prev, carousel }));
  };

  const setAutoPlay = (autoPlay: boolean) => {
    setConfig(prev => ({ ...prev, autoPlay }));
  };

  const setAutoPlayDuration = (autoPlayDuration: number) => {
    setConfig(prev => ({ ...prev, autoPlayDuration }));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % memories.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + memories.length) % memories.length);
  };

  const currentTheme = getTheme(config.theme);

  return (
    <StoryContext.Provider
      value={{
        config,
        setTheme,
        setCarousel,
        setAutoPlay,
        setAutoPlayDuration,
        currentTheme,
        memories,
        setMemories,
        currentIndex,
        setCurrentIndex,
        nextSlide,
        prevSlide,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
