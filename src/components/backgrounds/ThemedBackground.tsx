import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ThemeConfig } from '../../types';

interface ThemedBackgroundProps {
  theme: ThemeConfig;
  customColor?: string;
}

const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ theme, customColor }) => {
  const backgroundStyle = useMemo(() => {
    const base: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
    };
    return base;
  }, []);

  // Perplexity - cinematic dark atmosphere with clouds
  if (theme.id === 'perplexity') {
    return (
      <div style={backgroundStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.background.value,
          }}
        />
        {/* Animated atmospheric clouds */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-100%',
            background: 'radial-gradient(ellipse at 30% 30%, rgba(74, 158, 255, 0.1) 0%, transparent 50%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-100%',
            background: 'radial-gradient(ellipse at 70% 60%, rgba(26, 58, 74, 0.3) 0%, transparent 50%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-50%',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(13, 36, 56, 0.4) 0%, transparent 40%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Subtle vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>
    );
  }

  // Neobrutalism - solid bold color with grid
  if (theme.id === 'neobrutalism') {
    const bgColor = customColor || theme.background.value;
    return (
      <div style={backgroundStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: bgColor,
          }}
        />
        {/* Bold grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.08) 3px, transparent 3px),
              linear-gradient(90deg, rgba(0,0,0,0.08) 3px, transparent 3px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Corner accent */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            background: '#000',
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    );
  }

  // Gradient Wave - flowing wavy gradients
  if (theme.id === 'gradientWave') {
    const bgGradient = customColor || theme.background.value;
    return (
      <div style={backgroundStyle}>
        {/* Base gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: bgGradient,
          }}
        />
        
        {/* Animated wavy gradient layers */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            transform: ['scale(1) rotate(0deg)', 'scale(1.1) rotate(2deg)', 'scale(1) rotate(0deg)'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-20%',
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(74, 158, 255, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 40% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 50%)
            `,
            backgroundSize: '150% 150%, 120% 120%, 180% 180%',
            filter: 'blur(40px)',
          }}
        />

        {/* Second wavy layer */}
        <motion.div
          animate={{
            backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'],
            transform: ['scale(1.1) rotate(-1deg)', 'scale(1) rotate(1deg)', 'scale(1.1) rotate(-1deg)'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-30%',
            background: `
              radial-gradient(ellipse 70% 45% at 60% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 90% 55% at 30% 70%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 110% 65% at 70% 20%, rgba(251, 191, 36, 0.18) 0%, transparent 50%)
            `,
            backgroundSize: '140% 140%, 160% 160%, 200% 200%',
            filter: 'blur(60px)',
          }}
        />

        {/* Third flowing layer */}
        <motion.div
          animate={{
            backgroundPosition: ['50% 50%', '150% 150%', '50% 50%'],
            transform: ['scale(0.9)', 'scale(1.2)', 'scale(0.9)'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: '-40%',
            background: `
              radial-gradient(ellipse 120% 70% at 10% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse 80% 50% at 90% 30%, rgba(244, 63, 94, 0.12) 0%, transparent 60%)
            `,
            backgroundSize: '170% 170%, 130% 130%',
            filter: 'blur(80px)',
          }}
        />

        {/* Subtle overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>
    );
  }

  // Stage Lights - dramatic lighting from above
  if (theme.id === 'stageLights') {
    const lightOverlay = customColor || theme.background.overlay;
    return (
      <div style={backgroundStyle}>
        {/* Dark stage background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.background.value,
          }}
        />
        {/* Main spotlight */}
        <motion.div
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: lightOverlay,
          }}
        />
        {/* Side spotlights */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: '30%',
            height: '60%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [20, -20, 20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: '20%',
            width: '30%',
            height: '60%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          }}
        />
        {/* Floor reflection */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 100%)',
          }}
        />
      </div>
    );
  }

  // Parallax - deep space with stars
  if (theme.id === 'parallax') {
    return (
      <div style={backgroundStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.background.value,
          }}
        />
        {/* Stars layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.5), transparent),
              radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.4), transparent),
              radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.5), transparent),
              radial-gradient(2px 2px at 180px 20px, rgba(233,69,96,0.8), transparent),
              radial-gradient(1px 1px at 200px 150px, rgba(255,255,255,0.6), transparent)
            `,
            backgroundSize: '250px 250px',
          }}
        />
        {/* Nebula glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
    );
  }

  // Minimal - pure black or white
  const isLight = customColor === '#ffffff';
  return (
    <div style={backgroundStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: customColor || theme.background.value,
        }}
      />
      {/* Subtle gradient for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.03) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default ThemedBackground;
