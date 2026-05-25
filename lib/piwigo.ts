import 'server-only';
import { env, hasPiwigo } from './env';

export type PiwigoAlbum = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  cover: string;
  photoCount: number;
};

export type PiwigoPhoto = {
  id: string;
  thumb: string;
  src: string;
  download: string;
  width: number;
  height: number;
  caption?: string;
};

/* ============================================================
   Mock dataset — usado em dev e enquanto o Piwigo do cliente
   não estiver no ar. Quando PIWIGO_API_URL estiver setado, o
   cliente real assume.
   ============================================================ */

const PEXELS = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
const PEXELS_THUMB = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

const MOCK_ALBUMS: PiwigoAlbum[] = [
  {
    id: '1',
    slug: 'favela-rica-2026-dia-1',
    name: 'Favela + Rica 2026 — Dia 1',
    description: 'Networking, pitches e abertura do evento.',
    cover: PEXELS('1181406'),
    photoCount: 12,
  },
  {
    id: '2',
    slug: 'favela-rica-2026-dia-2',
    name: 'Favela + Rica 2026 — Dia 2',
    description: 'Encerramento, premiação e conexões finais.',
    cover: PEXELS('2422280'),
    photoCount: 12,
  },
];

const MOCK_PHOTO_IDS: Record<string, string[]> = {
  '1': [
    '1181406', '2422280', '3184325', '3184339', '3184360', '3184398',
    '3184405', '3184410', '3184418', '3184427', '3184433', '3184451',
  ],
  '2': [
    '1181244', '1181263', '1181271', '1181298', '1181315', '1181317',
    '1181325', '1181341', '1181354', '1181373', '1181391', '1181436',
  ],
};

function buildMockPhotos(albumId: string): PiwigoPhoto[] {
  const ids = MOCK_PHOTO_IDS[albumId] ?? [];
  return ids.map((id) => ({
    id,
    thumb: PEXELS_THUMB(id),
    src: PEXELS(id),
    download: PEXELS(id),
    width: 1600,
    height: 1066,
    caption: undefined,
  }));
}

/* ============================================================
   Cliente Piwigo real — REST API
   Docs: https://piwigo.org/doc/doku.php?id=dev:webapi:start
   ============================================================ */

async function piwigoCall<T>(method: string, params: Record<string, string> = {}): Promise<T> {
  if (!hasPiwigo) throw new Error('Piwigo não configurado');
  const url = `${env.PIWIGO_API_URL}/ws.php?format=json&method=${method}`;
  const body = new URLSearchParams(params).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    next: { revalidate: 300, tags: [`piwigo:${method}`] },
  });
  if (!res.ok) throw new Error(`Piwigo ${method} ${res.status}`);
  const json = await res.json();
  if (json.stat !== 'ok') throw new Error(`Piwigo error: ${JSON.stringify(json)}`);
  return json.result as T;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ============================================================
   API pública — sempre retorna mock se Piwigo não configurado
   ============================================================ */

export async function getAlbums(): Promise<PiwigoAlbum[]> {
  if (!hasPiwigo) return MOCK_ALBUMS;
  try {
    type Cat = { id: number; name: string; comment?: string; nb_images: number; tn_url?: string };
    const result = await piwigoCall<{ categories: Cat[] }>('pwg.categories.getList', {
      recursive: 'true',
    });
    return result.categories.map((c) => ({
      id: String(c.id),
      slug: slugify(c.name),
      name: c.name,
      description: c.comment,
      cover: c.tn_url ?? '/placeholders/gallery/cover.jpg',
      photoCount: c.nb_images,
    }));
  } catch {
    return MOCK_ALBUMS;
  }
}

export async function getAlbumBySlug(slug: string): Promise<PiwigoAlbum | null> {
  const albums = await getAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}

export async function getAlbumPhotos(albumId: string): Promise<PiwigoPhoto[]> {
  if (!hasPiwigo) return buildMockPhotos(albumId);
  try {
    type Image = {
      id: number;
      element_url: string;
      derivatives: { medium: { url: string }; thumb: { url: string } };
      width: number;
      height: number;
      name?: string;
    };
    const result = await piwigoCall<{ images: Image[] }>('pwg.categories.getImages', {
      cat_id: albumId,
      per_page: '200',
    });
    return result.images.map((img) => ({
      id: String(img.id),
      thumb: img.derivatives.thumb.url,
      src: img.derivatives.medium.url,
      download: img.element_url,
      width: img.width,
      height: img.height,
      caption: img.name,
    }));
  } catch {
    return buildMockPhotos(albumId);
  }
}
