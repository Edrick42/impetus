import 'server-only';
import { hasGallery, hasPiwigo } from './env';
import { createClient as createSupabaseServer } from './supabase/server';
import { publicUrl } from './r2';
import {
  getAlbums as piwigoAlbums,
  getAlbumBySlug as piwigoAlbumBySlug,
  getAlbumPhotos as piwigoAlbumPhotos,
} from './piwigo';

/**
 * Tipos públicos da galeria — compatíveis com os antigos de `lib/piwigo.ts`
 * para que componentes existentes continuem funcionando sem mudança.
 */
export type GalleryAlbum = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  cover: string;
  photoCount: number;
};

export type GalleryPhoto = {
  id: string;
  thumb: string;
  src: string;
  download: string;
  width: number;
  height: number;
  caption?: string;
};

/* ============================================================
   Fonte: Supabase + R2 (quando configurados)
   ============================================================ */

async function supabaseAlbums(): Promise<GalleryAlbum[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, slug, name, description, event_date, cover_photo_id, photos(id, r2_key_thumb, r2_key_medium)',
    )
    .eq('published', true)
    .order('event_date', { ascending: false });

  if (error || !data) return [];

  return data.map((ev) => {
    const photos = (ev.photos ?? []) as Array<{
      id: string;
      r2_key_thumb: string;
      r2_key_medium: string;
    }>;
    const coverPhoto =
      photos.find((p) => p.id === ev.cover_photo_id) ?? photos[0] ?? null;
    return {
      id: ev.id,
      slug: ev.slug,
      name: ev.name,
      description: ev.description ?? undefined,
      cover: coverPhoto ? publicUrl(coverPhoto.r2_key_medium) : '',
      photoCount: photos.length,
    };
  });
}

async function supabaseAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  const albums = await supabaseAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}

async function supabaseAlbumPhotos(albumId: string): Promise<GalleryPhoto[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from('photos')
    .select(
      'id, r2_key_thumb, r2_key_medium, r2_key_original, width, height, caption, event:events!inner(published)',
    )
    .eq('event_id', albumId)
    .order('uploaded_at', { ascending: true });

  if (error || !data) return [];

  return data
    .filter((p) => {
      const ev = (p as unknown as { event?: { published?: boolean } | { published?: boolean }[] }).event;
      const published = Array.isArray(ev) ? ev[0]?.published : ev?.published;
      return published === true;
    })
    .map((p) => ({
      id: p.id,
      thumb: publicUrl(p.r2_key_thumb),
      src: publicUrl(p.r2_key_medium),
      download: publicUrl(p.r2_key_original),
      width: p.width ?? 1600,
      height: p.height ?? 1066,
      caption: p.caption ?? undefined,
    }));
}

/* ============================================================
   API pública — escolhe a fonte automaticamente
   ============================================================ */

export async function getAlbums(): Promise<GalleryAlbum[]> {
  if (hasGallery) {
    const a = await supabaseAlbums();
    if (a.length > 0) return a;
  }
  if (hasPiwigo) {
    return (await piwigoAlbums()).map(piwigoAlbumToGallery);
  }
  // Mock antigo (Pexels) — útil em dev sem configuração
  return (await piwigoAlbums()).map(piwigoAlbumToGallery);
}

export async function getAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  if (hasGallery) {
    const a = await supabaseAlbumBySlug(slug);
    if (a) return a;
  }
  const p = await piwigoAlbumBySlug(slug);
  return p ? piwigoAlbumToGallery(p) : null;
}

export async function getAlbumPhotos(albumId: string): Promise<GalleryPhoto[]> {
  if (hasGallery) {
    const photos = await supabaseAlbumPhotos(albumId);
    if (photos.length > 0) return photos;
  }
  return (await piwigoAlbumPhotos(albumId)).map(piwigoPhotoToGallery);
}

/* ============================================================
   Adaptadores Piwigo → Gallery
   ============================================================ */

type PiwigoAlbumLike = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  cover: string;
  photoCount: number;
};

type PiwigoPhotoLike = {
  id: string;
  thumb: string;
  src: string;
  download: string;
  width: number;
  height: number;
  caption?: string;
};

function piwigoAlbumToGallery(a: PiwigoAlbumLike): GalleryAlbum {
  return { ...a };
}

function piwigoPhotoToGallery(p: PiwigoPhotoLike): GalleryPhoto {
  return { ...p };
}
