import { useState, useCallback } from 'react';
import { mediaService } from '../../../services/media.service';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setUploadProgress] = useState(0);

  const upload = useCallback(async (file: File, folder: string = 'blogs') => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await mediaService.upload(file, folder);
      setUploadProgress(100);
      return url;
    } catch (err) {
      console.error('Media upload failed', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, progress };
};
