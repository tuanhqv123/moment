import type { ThemeConfig, ThemeStyle } from '../types';

export const themes: Record<ThemeStyle, ThemeConfig> = {
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Cinematic dark atmosphere with floating memories',
    background: {
      type: 'animated',
      value: 'linear-gradient(180deg, #0a1628 0%, #122a3a 40%, #1a3a4a 70%, #0d2438 100%)',
      overlay: 'radial-gradient(ellipse at 50% 30%, rgba(74, 158, 255, 0.08) 0%, transparent 60%)',
      blur: true,
      noise: false,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      shadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
      borderRadius: '4px',
    },
    typography: {
      fontFamily: '"Playfair Display", Georgia, serif',
      titleColor: '#ffffff',
      textColor: 'rgba(255, 255, 255, 0.9)',
      accentColor: '#4a9eff',
    },
  },

  neobrutalism: {
    id: 'neobrutalism',
    name: 'Neobrutalism',
    description: 'Bold, raw, unapologetic design',
    background: {
      type: 'solid',
      value: '#ff5c5c',
    },
    card: {
      background: '#ffffff',
      border: '4px solid #000000',
      shadow: '12px 12px 0px #000000',
      borderRadius: '0px',
    },
    typography: {
      fontFamily: '"Space Grotesk", "Arial Black", sans-serif',
      titleColor: '#000000',
      textColor: '#000000',
      accentColor: '#000000',
    },
  },

  gradientWave: {
    id: 'gradientWave',
    name: 'Gradient Wave',
    description: 'Web3 style flowing mesh gradients',
    background: {
      type: 'animated',
      value: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b4e 50%, #1e3a5f 75%, #0f2027 100%)',
      blur: true,
      noise: true,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      borderRadius: '20px',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      titleColor: '#ffffff',
      textColor: 'rgba(255, 255, 255, 0.85)',
      accentColor: '#a855f7',
    },
  },

  parallax: {
    id: 'parallax',
    name: 'Parallax',
    description: 'Deep space with layered depth',
    background: {
      type: 'gradient',
      value: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      shadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      titleColor: '#ffffff',
      textColor: 'rgba(255, 255, 255, 0.8)',
      accentColor: '#e94560',
    },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Light',
    description: 'Clean and minimal light mode',
    background: {
      type: 'solid',
      value: '#ffffff',
    },
    card: {
      background: '#ffffff',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    typography: {
      fontFamily: '"SF Pro Display", -apple-system, Helvetica, sans-serif',
      titleColor: '#000000',
      textColor: 'rgba(0, 0, 0, 0.8)',
      accentColor: '#007AFF',
    },
  },
};

// Neobrutalism color options
export const neoBrutalismColors = [
  { name: 'Red', value: '#ff5c5c' },
  { name: 'Yellow', value: '#ffe156' },
  { name: 'Blue', value: '#5c9eff' },
  { name: 'Green', value: '#5cff8f' },
  { name: 'Pink', value: '#ff5ce1' },
  { name: 'Orange', value: '#ff9f5c' },
  { name: 'Purple', value: '#b05cff' },
  { name: 'Cyan', value: '#5cffe1' },
];

// Gradient Wave color presets
export const gradientWavePresets = [
  { name: 'Purple Haze', value: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b4e 50%, #1e3a5f 75%, #0f2027 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0a1628 0%, #0d3b66 25%, #1a535c 50%, #4ecdc4 75%, #0a1628 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #1a0a2e 0%, #4a1942 25%, #7b2d5b 50%, #c94b4b 75%, #1a0a2e 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 25%, #2c5364 50%, #0f4c5c 75%, #0f2027 100%)' },
  { name: 'Neon', value: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #2e0a3a 50%, #0a2e1a 75%, #0a0a0a 100%)' },
];

// Minimal variants
export const minimalVariants = [
  { name: 'Dark', bg: '#000000', text: '#ffffff' },
  { name: 'Light', bg: '#ffffff', text: '#000000' },
];

export const getTheme = (id: ThemeStyle): ThemeConfig => themes[id];
