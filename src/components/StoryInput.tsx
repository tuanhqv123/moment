import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Image as ImageIcon, Calendar, Loader2 } from 'lucide-react';
import type { BackgroundTheme, Memory } from '../types';
import Modal from './ui/Modal';
import { uploadToImgBB } from '../lib/imgbb';

interface StoryInputProps {
  backgroundTheme: BackgroundTheme;
  onSubmit: (memory: Omit<Memory, 'id'>) => void;
  onClose: () => void;
}

const StoryInput: React.FC<StoryInputProps> = ({ backgroundTheme, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload to ImgBB
        const url = await uploadToImgBB(file);
        setImageUrl(url);
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback to local data URL
        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      title,
      date,
      story,
      image: imageUrl || '',
    });

    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <>
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
                color: backgroundTheme.text,
              }}
            >
              Create New Memory
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: backgroundTheme.text,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
            {/* Image Upload */}
            <div
              {...getRootProps()}
              style={{
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                height: '200px',
              }}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `${backgroundTheme.accent}22`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${backgroundTheme.accent}66`,
                  }}
                >
                  <Loader2 size={48} color={backgroundTheme.accent} style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ marginTop: '12px', color: backgroundTheme.text, opacity: 0.7 }}>
                    Uploading...
                  </p>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Memory"
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
                    background: `${backgroundTheme.accent}22`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${backgroundTheme.accent}66`,
                  }}
                >
                  <ImageIcon size={48} color={backgroundTheme.accent} />
                  <p
                    style={{
                      marginTop: '12px',
                      color: backgroundTheme.text,
                      opacity: 0.7,
                    }}
                  >
                    {isDragActive ? 'Drop image here' : 'Click or drag image here'}
                  </p>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: backgroundTheme.text,
                }}
              >
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${backgroundTheme.accent}33`,
                  borderRadius: '8px',
                  color: backgroundTheme.text,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = backgroundTheme.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${backgroundTheme.accent}33`;
                }}
                placeholder="Give your memory a title..."
              />
            </div>

            {/* Date Input */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: backgroundTheme.text,
                }}
              >
                Date *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${backgroundTheme.accent}33`,
                    borderRadius: '8px',
                    color: backgroundTheme.text,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = backgroundTheme.accent;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${backgroundTheme.accent}33`;
                  }}
                />
                <Calendar
                  size={18}
                  color={backgroundTheme.text}
                  opacity={0.5}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
              </div>
            </div>

            {/* Story Textarea */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: backgroundTheme.text,
                }}
              >
                Story
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${backgroundTheme.accent}33`,
                  borderRadius: '8px',
                  color: backgroundTheme.text,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = backgroundTheme.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${backgroundTheme.accent}33`;
                }}
                placeholder="Tell your story..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !title || !date}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: backgroundTheme.accent,
                color: backgroundTheme.primary.includes('gradient') ? '#000' : '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting || !title || !date ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !title || !date ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {isSubmitting ? 'Creating Memory...' : 'Create Memory'}
            </button>
          </form>
      </>
    </Modal>
  );
};

export default StoryInput;