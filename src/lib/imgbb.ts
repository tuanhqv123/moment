// ImgBB Image Upload Service
// Get your API key from https://api.imgbb.com/

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

interface ImgBBResponse {
  data: {
    id: string;
    url: string;
    display_url: string;
    delete_url: string;
    thumb: {
      url: string;
    };
    medium?: {
      url: string;
    };
  };
  success: boolean;
  status: number;
}

export async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    console.warn('ImgBB API key not configured. Using local data URL.');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result: ImgBBResponse = await response.json();

    if (result.success) {
      return result.data.display_url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    // Fallback to local data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}

export async function uploadBase64ToImgBB(base64: string): Promise<string> {
  if (!IMGBB_API_KEY) {
    console.warn('ImgBB API key not configured. Using local data URL.');
    return base64;
  }

  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

  const formData = new FormData();
  formData.append('image', base64Data);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result: ImgBBResponse = await response.json();

    if (result.success) {
      return result.data.display_url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return base64;
  }
}
