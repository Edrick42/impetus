import 'server-only';
import sharp from 'sharp';

export type ImageVariant = {
  buffer: Buffer;
  contentType: string;
  ext: string;
  width: number;
  height: number;
};

export type BuiltImage = {
  width: number;
  height: number;
  thumb: ImageVariant;
  medium: ImageVariant;
  original: ImageVariant;
};

const ALLOWED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp', 'heif', 'avif']);
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

export async function buildVariants(input: Buffer): Promise<BuiltImage> {
  if (input.length > MAX_INPUT_BYTES) {
    throw new Error('Imagem maior que 30MB.');
  }

  const pipeline = sharp(input, { failOn: 'error' });
  const meta = await pipeline.metadata();

  if (!meta.format || !ALLOWED_INPUT_FORMATS.has(meta.format)) {
    throw new Error(`Formato não suportado: ${meta.format ?? 'desconhecido'}`);
  }
  if (!meta.width || !meta.height) {
    throw new Error('Imagem sem dimensões legíveis.');
  }

  // Strip EXIF (privacidade — fotos profissionais carregam GPS) e aplica rotação
  const base = sharp(input).rotate().withMetadata({ exif: {} });

  const [thumbBuf, mediumBuf, originalBuf] = await Promise.all([
    base
      .clone()
      .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer(),
    base
      .clone()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer(),
    base.clone().jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
  ]);

  const originalMeta = await sharp(originalBuf).metadata();

  return {
    width: meta.width,
    height: meta.height,
    thumb: {
      buffer: thumbBuf,
      contentType: 'image/webp',
      ext: 'webp',
      width: (await sharp(thumbBuf).metadata()).width ?? 400,
      height: (await sharp(thumbBuf).metadata()).height ?? 400,
    },
    medium: {
      buffer: mediumBuf,
      contentType: 'image/webp',
      ext: 'webp',
      width: (await sharp(mediumBuf).metadata()).width ?? 1600,
      height: (await sharp(mediumBuf).metadata()).height ?? 1600,
    },
    original: {
      buffer: originalBuf,
      contentType: 'image/jpeg',
      ext: 'jpg',
      width: originalMeta.width ?? meta.width,
      height: originalMeta.height ?? meta.height,
    },
  };
}

export function extFromContentType(contentType: string): string {
  switch (contentType) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/heic':
    case 'image/heif':
      return 'heic';
    case 'image/avif':
      return 'avif';
    default:
      return 'bin';
  }
}

export function isAllowedUploadContentType(contentType: string): boolean {
  return [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ].includes(contentType);
}
