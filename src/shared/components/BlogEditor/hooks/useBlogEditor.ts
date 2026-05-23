import { useState, useCallback, useEffect } from 'react';
import type { Blog, BlogForm } from '../../../types/blog.types';
import { blogService } from '../../../services/blog.service';

export const useBlogEditor = (id: string | undefined) => {
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogForm>({
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    coverImage: '',
    media: [],
    videos: [],
    tags: [],
    categories: [],
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: '',
    },
    allowComments: true,
    featured: false,
    visibility: 'public',
  });

  useEffect(() => {
    if (id) {
      loadBlog(id);
    }
  }, [id]);

  const loadBlog = async (blogId: string) => {
    try {
      const blog = await blogService.getById(blogId);
      setFormData({
        title: blog.title,
        subtitle: blog.subtitle || '',
        slug: blog.slug,
        content: blog.content,
        coverImage: blog.coverImage || '',
        media: blog.media || [],
        videos: blog.videos || [],
        tags: blog.tags || [],
        categories: blog.categories || [],
        status: blog.status as any,
        seo: blog.seo || { metaTitle: '', metaDescription: '', keywords: [], ogImage: '' },
        allowComments: blog.allowComments ?? true,
        featured: blog.featured ?? false,
        visibility: (blog.visibility as any) || 'public',
        scheduleAt: blog.scheduleAt ? new Date(blog.scheduleAt) : undefined,
      });
    } catch (err) {
      console.error('Failed to load blog', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev as any)[keys[0]],
            [keys[1]]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const save = async (statusOverride?: string) => {
    setSaving(true);
    try {
      const data = { ...formData };
      if (statusOverride) data.status = statusOverride as any;
      
      console.log('Saving blog data:', data);
      
      if (id) {
        return await blogService.update(id, data);
      } else {
        const created = await blogService.create(data);
        return created;
      }
    } catch (err) {
      console.error('Save failed', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    updateField,
    save,
    setFormData
  };
};
