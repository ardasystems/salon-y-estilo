import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://fmjnmjkzbbqmldgnmwvz.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper to upload image file or base64 data URL to Supabase Storage bucket
 * @param {File|Blob|string} fileOrDataUrl 
 * @param {string} folder 
 * @returns {Promise<string>} Public URL of uploaded asset
 */
export async function uploadToSalonAssets(fileOrDataUrl, folder = 'general') {
  try {
    let fileBody = fileOrDataUrl;
    let fileExt = 'jpg';
    let contentType = 'image/jpeg';

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const parts = fileOrDataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      fileExt = contentType.split('/')[1] || 'jpg';
      if (fileExt === 'svg+xml') fileExt = 'svg';

      const byteString = atob(parts[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      fileBody = new Blob([ab], { type: contentType });
    } else if (fileOrDataUrl instanceof File) {
      contentType = fileOrDataUrl.type || 'image/jpeg';
      fileExt = fileOrDataUrl.name.split('.').pop() || 'jpg';
    }

    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('salon-assets')
      .upload(filename, fileBody, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError);
      // Fallback: return the original file / base64 string
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
    }

    const { data: publicData } = supabase.storage
      .from('salon-assets')
      .getPublicUrl(filename);

    return publicData?.publicUrl || (typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null);
  } catch (err) {
    console.warn('Error in uploadToSalonAssets:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }
}
