import { useEffect, useRef } from 'react';
import { blogService } from '../../../services/blog.service';
import type { BlogForm } from '../../../types/blog.types';

export const useAutosave = (id: string | undefined, data: BlogForm, enabled: boolean = true) => {
  const lastSavedRef = useRef<string>(JSON.stringify(data));
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !id) return;

    timerRef.current = setInterval(async () => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedRef.current) {
        try {
          await blogService.autosave(id, data);
          lastSavedRef.current = currentData;
          console.log('Autosaved at', new Date().toLocaleTimeString());
        } catch (err) {
          console.error('Autosave failed', err);
        }
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, data, enabled]);
};
