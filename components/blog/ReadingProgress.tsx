'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/clarity';

/**
 * Dispara evento Clarity quando o usuário rola até o fim de um post.
 * Não renderiza nada.
 */
export function ReadingProgress({ slug }: { slug: string }) {
  useEffect(() => {
    let fired = false;
    function onScroll() {
      if (fired) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.95) {
        fired = true;
        trackEvent('blog_post_complete', { slug });
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  return null;
}
