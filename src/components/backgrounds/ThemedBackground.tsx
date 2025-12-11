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

  // Gradient Wave - Web3 style with blur and noise
  if (theme.id === 'gradientWave') {
    const bgGradient = customColor || theme.background.value;
    return (
      <div style={backgroundStyle}>
        {/* Base gradient */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: '-50%',
            background: bgGradient,
            backgroundSize: '200% 200%',
            filter: 'blur(0px)',
          }}
        />
        {/* Animated mesh blobs */}
        <motion.div
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 80, 40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -60, 30, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '40%',
            right: '30%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        {/* Noise overlay */}
        {theme.background.noise && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.4,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
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
