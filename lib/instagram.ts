import 'server-only';
import { env, hasInstagram } from './env';

export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
};

/**
 * Busca os posts mais recentes do Instagram via Graph API.
 * Retorna [] se IG_ACCESS_TOKEN / IG_USER_ID não estiverem configurados.
 *
 * Docs: https://developers.facebook.com/docs/instagram-platform
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  if (!hasInstagram) return [];

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.instagram.com/${env.IG_USER_ID}/media?fields=${fields}&limit=${limit}&access_token=${env.IG_ACCESS_TOKEN}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600, tags: ['instagram'] } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data: Array<{
        id: string;
        caption?: string;
        media_type: InstagramPost['mediaType'];
        media_url: string;
        thumbnail_url?: string;
        permalink: string;
        timestamp: string;
      }>;
    };
    return json.data.map((p) => ({
      id: p.id,
      caption: p.caption,
      mediaType: p.media_type,
      mediaUrl: p.media_url,
      thumbnailUrl: p.thumbnail_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));
  } catch {
    return [];
  }
}
