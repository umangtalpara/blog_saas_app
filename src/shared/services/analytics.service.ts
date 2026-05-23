import api from '../api/api';

export const analyticsService = {
  async trackInteraction(slug: string, type: 'view' | 'like' | 'share', tenantSlug: string) {
    return api.post(`/analytics/public/${slug}/track`, { type }, {
      headers: { 'X-Tenant-Slug': tenantSlug }
    });
  },

  async getOverview() {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  async getTrends(days: number = 30) {
    const response = await api.get(`/analytics/trends?days=${days}`);
    return response.data;
  },

  async getTopPosts(limit: number = 5) {
    const response = await api.get(`/analytics/top-posts?limit=${limit}`);
    return response.data;
  }
};
