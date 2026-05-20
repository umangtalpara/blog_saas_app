import api from '../api/api';
import type { Blog, BlogForm } from '../types/blog.types';

export const blogService = {
  async getAll(): Promise<Blog[]> {
    const response = await api.get('/blogs');
    return response.data;
  },

  async getById(id: string): Promise<Blog> {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  async create(data: BlogForm): Promise<Blog> {
    const response = await api.post('/blogs', data);
    return response.data;
  },

  async update(id: string, data: Partial<BlogForm>): Promise<Blog> {
    const response = await api.patch(`/blogs/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/blogs/${id}`);
  },

  async autosave(id: string | undefined, data: Partial<BlogForm>): Promise<Blog | null> {
    if (!id) return null;
    const response = await api.post('/blogs/autosave', { id, ...data });
    return response.data;
  }
};
