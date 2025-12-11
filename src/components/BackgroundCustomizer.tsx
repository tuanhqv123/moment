import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { BackgroundTheme } from '../types';

interface BackgroundCustomizerProps {
  backgrounds: BackgroundTheme[];
  currentBackground: BackgroundTheme;
  onSelect: (theme: BackgroundTheme) => void;
  onClose: () => void;
}

const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({
  backgrounds,
  currentBackground,
  onSelect,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <motion.div
          className="customizer-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 24px 0 24px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: 0,
                color: '#ffffff',
              }}
            >
              Customize Background
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Theme Options */}
          <div style={{ padding: '0 24px 24px 24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
              }}
            >
              {backgrounds.map((theme) => (
                <motion.button
                  key={theme.name}
                  className="theme-option"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(theme)}
                  style={{
                    background: theme.primary,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    border: currentBackground.name === theme.name ? '3px solid #ffffff' : '2px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      background: theme.cardBg,
                      padding: '8px',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        fontWeight: '500',
                        color: theme.text,
                        textShadow: theme.text === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {theme.name}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom Theme Option */}
            <div style={{ marginTop: '24px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: '#ffffff',
                }}
              >
                Create Custom Theme
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <p style={{ margin: 0, color: '#ffffff99' }}>
                  Coming soon: Create your own custom themes
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackgroundCustomizer;