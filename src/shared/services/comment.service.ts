import api from '../api/api';

export interface Comment {
  _id: string;
  blogId: any;
  content: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const commentService = {
  async submitComment(blogSlug: string, tenantSlug: string, data: { content: string, authorName: string, authorEmail: string }) {
    return api.post(`/comments/public/${blogSlug}`, data, {
      headers: { 'X-Tenant-Slug': tenantSlug }
    });
  },

  async getBlogComments(blogSlug: string, tenantSlug: string) {
    const response = await api.get(`/comments/public/${blogSlug}`, {
      headers: { 'X-Tenant-Slug': tenantSlug }
    });
    return response.data;
  },

  async getAdminComments() {
    const response = await api.get('/comments/admin');
    return response.data;
  },

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    const response = await api.patch(`/comments/admin/${id}/status`, { status });
    return response.data;
  },

  async deleteComment(id: string) {
    await api.delete(`/comments/admin/${id}`);
  }
};
