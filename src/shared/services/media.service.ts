import api from '../api/api';
import axios from 'axios';

export const mediaService = {
  async getUploadUrl(fileName: string, contentType: string, folder: string = 'blogs') {
    const response = await api.post('/media/upload-url', { fileName, contentType, folder });
    return response.data;
  },

  async uploadToS3(uploadUrl: string, file: File) {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
    } catch (err: any) {
      console.error('S3 Upload Error:', err);
      if (err.response) {
        console.error('S3 Response Data:', err.response.data);
        console.error('S3 Status:', err.response.status);
      } else if (err.request) {
        console.error('S3 No Response. Possible CORS issue or network error.');
      }
      throw new Error('Failed to upload file to storage. Please check your internet connection and S3 CORS settings.');
    }
  },

  async upload(file: File, folder: string = 'blogs'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileUrl;
    } catch (err: any) {
      console.error('Media upload failed', err);
      throw new Error(err.response?.data?.message || 'Failed to upload image. Please try again.');
    }
  }
};
