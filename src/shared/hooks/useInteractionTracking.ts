import { useEffect, useRef } from 'react';
import { analyticsService } from '../services/analytics.service';

export const useInteractionTracking = (slug: string | undefined, tenantSlug: string) => {
  const trackedViews = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!slug) return;

    // Avoid double counting views in a single session
    if (!trackedViews.current.has(slug)) {
      analyticsService.trackInteraction(slug, 'view', tenantSlug)
        .catch(err => console.error('Failed to track view', err));
      trackedViews.current.add(slug);
    }
  }, [slug, tenantSlug]);

  const trackLike = async () => {
    if (!slug) return;
    try {
      await analyticsService.trackInteraction(slug, 'like', tenantSlug);
      return true;
    } catch (err) {
      console.error('Failed to track like', err);
      return false;
    }
  };

  const trackShare = async () => {
    if (!slug) return;
    try {
      await analyticsService.trackInteraction(slug, 'share', tenantSlug);
      return true;
    } catch (err) {
      console.error('Failed to track share', err);
      return false;
    }
  };

  return { trackLike, trackShare };
};
