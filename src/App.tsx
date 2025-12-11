import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StoryViewer from './components/StoryViewer';
import StoryInput from './components/StoryInput';
import type { Memory, ThemeStyle } from './types';
import { getTheme } from './themes';
import './App.css';

const sampleMemories: Memory[] = [
  {
    id: 1,
    title: 'The Beginning',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    story: 'Every journey starts with a single step. This was the moment everything changed.',
    chapter: 1,
  },
  {
    id: 2,
    title: 'City of Dreams',
    date: '2024-03-22',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=800&fit=crop',
    story: 'The city lights welcomed us with open arms. A new chapter was about to unfold.',
    chapter: 2,
  },
  {
    id: 3,
    title: 'Ocean Whispers',
    date: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=800&fit=crop',
    story: 'The waves told stories of distant lands. We listened, and we learned.',
    chapter: 3,
  },
  {
    id: 4,
    title: 'Mountain Peak',
    date: '2024-07-18',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=800&fit=crop',
    story: 'At the summit, we found more than just a view. We found ourselves.',
    chapter: 4,
  },
  {
    id: 5,
    title: 'Golden Hour',
    date: '2024-09-05',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    story: 'As the sun set, we realized this was just the beginning of something beautiful.',
    chapter: 5,
  },
  {
    id: 6,
    title: 'Winter Magic',
    date: '2024-12-01',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=800&fit=crop',
    story: 'The snow fell softly, covering everything in a blanket of pure white wonder.',
    chapter: 6,
  },
];

function App() {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories);
  const [showStoryInput, setShowStoryInput] = useState(false);
  const [currentTheme] = useState<ThemeStyle>('minimal');

  const theme = getTheme(currentTheme);

  const handleAddMemory = (memory: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now(),
      chapter: memories.length + 1,
    };
    setMemories([...memories, newMemory]);
    setShowStoryInput(false);
  };

  // Convert ThemeConfig to BackgroundTheme for StoryInput
  const backgroundTheme = {
    name: theme.name,
    primary: theme.background.value,
    cardBg: theme.card.background,
    text: theme.typography.titleColor,
    accent: theme.typography.accentColor,
  };

  return (
    <div className="app">
      <StoryViewer
        memories={memories}
        onAddMemory={() => setShowStoryInput(true)}
        initialTheme={currentTheme}
      />

      {/* Story Input Modal */}
      <AnimatePresence>
        {showStoryInput && (
          <StoryInput
            backgroundTheme={backgroundTheme}
            onSubmit={handleAddMemory}
            onClose={() => setShowStoryInput(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
