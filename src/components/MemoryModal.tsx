import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Trash2, Calendar, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import type { Memory, BackgroundTheme } from '../types';

interface MemoryModalProps {
  memory: Memory;
  backgroundTheme: BackgroundTheme;
  onClose: () => void;
  onDelete: () => void;
}

const MemoryModal: React.FC<MemoryModalProps> = ({ memory, backgroundTheme, onClose, onDelete }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(window.location.href, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  useEffect(() => {
    if (showQRCode && !qrCodeDataUrl) {
      generateQRCode();
    }
  }, [showQRCode, qrCodeDataUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.title,
          text: memory.story,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const memoryData = {
      title: memory.title,
      date: memory.date,
      story: memory.story,
      image: memory.image,
    };

    const dataStr = JSON.stringify(memoryData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `memory-${memory.title.replace(/\s+/g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: backgroundTheme.cardBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${backgroundTheme.accent}33`,
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: backgroundTheme.text,
              cursor: 'pointer',
              zIndex: 1,
            }}
          >
            <X size={24} />
          </button>

          {/* Image */}
          {memory.image && (
            <img
              src={memory.image}
              alt={memory.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '20px 20px 0 0',
              }}
            />
          )}

          {/* Content */}
          <div style={{ padding: '32px' }}>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 16px 0',
                color: backgroundTheme.text,
              }}
            >
              {memory.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                color: `${backgroundTheme.text}CC`,
              }}
            >
              <Calendar size={18} />
              <span style={{ fontSize: '16px' }}>
                {new Date(memory.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: backgroundTheme.text,
                whiteSpace: 'pre-wrap',
              }}
            >
              {memory.story}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: backgroundTheme.accent,
                  color: backgroundTheme.primary.includes('gradient') ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={() => setShowQRCode(!showQRCode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: backgroundTheme.text,
                  border: `1px solid ${backgroundTheme.text}33`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Copy size={18} />
                QR Code
              </button>

              <button
                onClick={handleDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: backgroundTheme.text,
                  border: `1px solid ${backgroundTheme.text}33`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Download size={18} />
                Export
              </button>

              <button
                onClick={onDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#ff4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>

            {/* QR Code */}
            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: backgroundTheme.primary.includes('gradient') ? '#ffffff' : '#000000',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  style={{ width: '200px', height: '200px' }}
                />
                <p
                  style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    color: backgroundTheme.primary.includes('gradient') ? '#000' : '#fff',
                  }}
                >
                  Scan to share this memory
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemoryModal;