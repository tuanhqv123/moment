import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Layout, Play, Clock, Image } from 'lucide-react';
import type { ThemeStyle, CarouselStyle, CardStyle } from '../types';
import { themes, neoBrutalismColors, gradientWavePresets, minimalVariants } from '../themes';
import Modal from './ui/Modal';

interface ThemeSelectorProps {
  currentTheme: ThemeStyle;
  currentCarousel: CarouselStyle;
  autoPlay: boolean;
  autoPlayDuration: number;
  customBgColor?: string;
  cardStyle: CardStyle;
  onThemeChange: (theme: ThemeStyle) => void;
  onCarouselChange: (carousel: CarouselStyle) => void;
  onAutoPlayChange: (enabled: boolean) => void;
  onDurationChange: (duration: number) => void;
  onCustomColorChange: (color: string) => void;
  onCardStyleChange: (style: CardStyle) => void;
  onClose: () => void;
}

const themeList: { id: ThemeStyle; icon: string }[] = [
  { id: 'perplexity', icon: '🌌' },
  { id: 'neobrutalism', icon: '🎨' },
  { id: 'gradientWave', icon: '🌊' },
  { id: 'parallax', icon: '✨' },
  { id: 'minimal', icon: '◻️' },
];

const carouselList: { id: CarouselStyle; name: string; icon: string; description: string }[] = [
  { id: 'orbit', name: 'Orbit', icon: '🪐', description: '3D floating polaroids' },
  { id: 'timeline', name: 'Timeline', icon: '📅', description: 'Horizontal story flow' },
  { id: 'stack', name: 'Stack', icon: '🃏', description: 'Swipe through cards' },
  { id: 'stories', name: 'Stories', icon: '📱', description: 'Full-screen slides' },
  { id: 'flow', name: 'Flow', icon: '🌊', description: 'Smooth horizontal flow' },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  currentCarousel,
  autoPlay,
  autoPlayDuration,
  customBgColor,
  cardStyle,
  onThemeChange,
  onCarouselChange,
  onAutoPlayChange,
  onDurationChange,
  onCustomColorChange,
  onCardStyleChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'carousel' | 'settings'>('theme');

  return (
    <Modal isOpen={true} onClose={onClose}>
      <>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: '#fff' }}>
              Customize
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 2,
              padding: '12px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
              { id: 'carousel', label: 'Layout', icon: <Layout size={16} /> },
              { id: 'settings', label: 'Playback', icon: <Play size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(85vh - 140px)' }}>
            {/* Theme Selection */}
            {activeTab === 'theme' && (
              <div>
                {/* Theme grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {themeList.map(({ id, icon }) => {
                    const theme = themes[id];
                    const isSelected = currentTheme === id;

                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onThemeChange(id)}
                        style={{
                          position: 'relative',
                          height: 140,
                          borderRadius: 12,
                          border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                          background: theme.background.value,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          padding: 0,
                        }}
                      >
                        {/* Preview */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -60%)',
                            fontSize: 28,
                          }}
                        >
                          {icon}
                        </div>

                        {/* Label */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '10px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          }}
                        >
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#fff' }}>
                            {theme.name}
                          </p>
                        </div>

                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 12,
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Color options for specific themes */}
                {currentTheme === 'neobrutalism' && (
                  <div>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      Background Color
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {neoBrutalismColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => onCustomColorChange(color.value)}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            border: customBgColor === color.value ? '3px solid #fff' : '2px solid rgba(0,0,0,0.3)',
                            background: color.value,
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0 #000',
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {currentTheme === 'gradientWave' && (
                  <div>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      Gradient Preset
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {gradientWavePresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => onCustomColorChange(preset.value)}
                          style={{
                            height: 48,
                            borderRadius: 10,
                            border: customBgColor === preset.value ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                            background: preset.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: 16,
                          }}
                        >
                          <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentTheme === 'minimal' && (
                  <div>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      Mode
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {minimalVariants.map((variant) => (
                        <button
                          key={variant.name}
                          onClick={() => onCustomColorChange(variant.bg)}
                          style={{
                            flex: 1,
                            height: 60,
                            borderRadius: 10,
                            border: customBgColor === variant.bg ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.2)',
                            background: variant.bg,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 14, color: variant.text, fontWeight: 500 }}>
                            {variant.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Carousel Selection */}
            {activeTab === 'carousel' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {carouselList.map(({ id, name, icon, description }) => {
                  const isSelected = currentCarousel === id;

                  return (
                    <motion.button
                      key={id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onCarouselChange(id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        padding: 20,
                        borderRadius: 12,
                        border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{icon}</span>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#fff' }}>
                          {name}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                          {description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Playback Settings */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Card Style toggle */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Image size={18} color="rgba(255,255,255,0.7)" />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#fff' }}>
                        Card Style
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        {cardStyle === 'polaroid' ? 'Polaroid frame' : 'Borderless image'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onCardStyleChange('polaroid')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: cardStyle === 'polaroid' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: cardStyle === 'polaroid' ? '#fff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Polaroid
                    </button>
                    <button
                      onClick={() => onCardStyleChange('borderless')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: cardStyle === 'borderless' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: cardStyle === 'borderless' ? '#fff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Borderless
                    </button>
                  </div>
                </div>

                {/* Auto-play toggle */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Play size={18} color="rgba(255,255,255,0.7)" />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#fff' }}>
                        Auto-play
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        Automatically advance slides
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAutoPlayChange(!autoPlay)}
                    style={{
                      width: 48,
                      height: 26,
                      borderRadius: 13,
                      border: 'none',
                      background: autoPlay ? '#10b981' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <motion.div
                      animate={{ x: autoPlay ? 22 : 2 }}
                      style={{
                        position: 'absolute',
                        top: 2,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#fff',
                      }}
                    />
                  </button>
                </div>

                {/* Duration slider */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    opacity: autoPlay ? 1 : 0.4,
                    pointerEvents: autoPlay ? 'auto' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <Clock size={18} color="rgba(255,255,255,0.7)" />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#fff' }}>
                        Slide Duration
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        {(autoPlayDuration / 1000).toFixed(0)} seconds per slide
                      </p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={12000}
                    step={1000}
                    value={autoPlayDuration}
                    onChange={(e) => onDurationChange(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: 4,
                      borderRadius: 2,
                      appearance: 'none',
                      background: `linear-gradient(to right, #10b981 ${((autoPlayDuration - 3000) / 9000) * 100}%, rgba(255,255,255,0.15) ${((autoPlayDuration - 3000) / 9000) * 100}%)`,
                      cursor: 'pointer',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 8,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <span>3s</span>
                    <span>12s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
      </>
    </Modal>
  );
};

export default ThemeSelector;
