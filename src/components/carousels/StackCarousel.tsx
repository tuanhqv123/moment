import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCardRotation } from '../../hooks/useCardRotation';
import type { Memory, ThemeConfig, CardStyle } from '../../types';
import { getNeobrutalistTextStyle } from '../../themes';

interface StackCarouselProps {
  items: Memory[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  theme: ThemeConfig;
  autoPlay: boolean;
  autoPlayDuration: number;
  cardStyle?: CardStyle;
  onBackToHero?: () => void;
}

// Stack configuration - same as reference
const STACK_CONFIG = {
  rotation: 4,
  scale: 0.06,
  perspective: 600,
};

const StackCarousel: React.FC<StackCarouselProps> = ({
  items: initialItems,
  onIndexChange,
  theme,
  cardStyle = 'polaroid',
}) => {
  const [items, setItems] = useState(initialItems);

  // Send swiped card to back of stack - exact same logic as reference
  const sendToBack = (id: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const index = newItems.findIndex((item) => item.id === id);
      const [item] = newItems.splice(index, 1);
      newItems.unshift(item);
      return newItems;
    });
    // Update parent with new top card
    const newTopId = items[items.length - 2]?.id;
    const newIndex = initialItems.findIndex((item) => item.id === newTopId);
    if (newIndex !== -1) onIndexChange(newIndex);
  };

  // Top card is last in array
  const topCard = items[items.length - 1];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Info panel - bottom left */}
      <div style={{ position: 'absolute', bottom: 60, left: 50, zIndex: 200, maxWidth: 400 }}>
        <motion.div
          key={topCard?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            style={{
              margin: '0 0 12px',
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: theme.id === 'neobrutalism' ? 900 : 300,
              color: theme.typography.titleColor,
              fontFamily: theme.typography.fontFamily,
              textTransform: 'uppercase',
              ...getNeobrutalistTextStyle(theme, true)
            }}
          >
            {topCard?.title}
          </h1>
          <p style={{ 
            margin: '0 0 12px', 
            fontSize: 13, 
            color: theme.typography.textColor, 
            opacity: theme.id === 'neobrutalism' ? 1 : 0.5,
            fontWeight: theme.id === 'neobrutalism' ? 700 : 400,
            ...getNeobrutalistTextStyle(theme)
          }}>
            {topCard &&
              new Date(topCard.date).toLocaleDateString('en-US', {
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
              opacity: theme.id === 'neobrutalism' ? 1 : 0.6,
              fontWeight: theme.id === 'neobrutalism' ? 700 : 300,
              ...getNeobrutalistTextStyle(theme)
            }}
          >
            {topCard?.story}
          </p>
        </motion.div>
      </div>

      {/* Card stack container - exact same structure as reference */}
      <div
        style={{
          position: 'relative',
          width: 320,
          height: 420,
          perspective: STACK_CONFIG.perspective,
        }}
      >
        {items.map((item, index) => (
          <DraggableContainer
            key={item.id}
            onSendToBack={() => sendToBack(item.id)}
          >
            <motion.div
              style={{ width: '100%', height: '100%' }}
              animate={{
                rotateZ: (items.length - index - 1) * STACK_CONFIG.rotation,
                scale: 1 + index * STACK_CONFIG.scale - items.length * STACK_CONFIG.scale,
                transformOrigin: '90% 90%',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CardContent item={item} cardStyle={cardStyle} />
            </motion.div>
          </DraggableContainer>
        ))}
      </div>
    </div>
  );
};

// DraggableContainer - exact same as reference
interface DraggableContainerProps {
  children: React.ReactNode;
  onSendToBack: () => void;
}

const DraggableContainer: React.FC<DraggableContainerProps> = ({ children, onSendToBack }) => {
  const { x, y, rotateX, rotateY, handleDragEnd } = useCardRotation(onSendToBack);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 320,
        height: 420,
        cursor: 'grab',
        x,
        y,
        rotateX,
        rotateY,
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
};

// Card content (polaroid or borderless)
interface CardContentProps {
  item: Memory;
  cardStyle: CardStyle;
}

const CardContent: React.FC<CardContentProps> = ({ item, cardStyle }) => {
  if (cardStyle === 'polaroid') {
    return (
      <div
        style={{
          background: '#fefefe',
          padding: '10px 10px 45px 10px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: '100%',
            height: 'calc(100% - 35px)',
            overflow: 'hidden',
            background: '#e8e8e8',
            borderRadius: 4,
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </div>
  );
};

export default StackCarousel;
