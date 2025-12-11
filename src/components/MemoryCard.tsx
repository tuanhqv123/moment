import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import type { Memory, BackgroundTheme } from '../types';

interface MemoryCardProps {
  memory: Memory;
  index: number;
  backgroundTheme: BackgroundTheme;
  onClick: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, index, backgroundTheme, onClick }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.05
    }
  };

  const staggeredStyles = useMemo(() => {
    // Create a grid pattern with vertical scrolling support
    const row = Math.floor(index / 3);
    const col = index % 3;
    const basePositions = [
      { top: 0, left: 0 },
      { top: 80, left: 0 },
      { top: 160, left: 0 },
    ];

    return {
      top: `${basePositions[col].top + row * 320}px`,
      left: `${col * 33}%`,
      zIndex: 10 - index,
    };
  }, [index]);

  return (
    <motion.div
      className="memory-card"
      style={{
        position: 'absolute',
        top: staggeredStyles.top,
        left: staggeredStyles.left,
        zIndex: staggeredStyles.zIndex,
        width: '280px',
        background: backgroundTheme.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${backgroundTheme.accent}33`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{
        duration: 0.5,
        delay: index * 0.1
      }}
      onClick={onClick}
    >
      {/* Memory Number Badge */}
      <div
        className="memory-number"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: backgroundTheme.accent,
          color: backgroundTheme.primary.includes('gradient') ? '#000' : '#fff',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1,
        }}
      >
        {(index + 1).toString().padStart(2, '0')}
      </div>

      {/* Image */}
      <div className="memory-image-container" style={{ position: 'relative', height: '200px' }}>
        {memory.image ? (
          <img
            src={memory.image}
            alt={memory.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${backgroundTheme.accent}22`,
            }}
          >
            <ImageIcon size={48} color={backgroundTheme.accent} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: backgroundTheme.text,
          }}
        >
          {memory.title}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: `${backgroundTheme.text}99`,
            fontSize: '14px',
          }}
        >
          <Calendar size={14} />
          <span>{new Date(memory.date).toLocaleDateString()}</span>
        </div>
        {memory.story && (
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: `${backgroundTheme.text}CC`,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {memory.story}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default MemoryCard;