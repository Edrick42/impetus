import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env, hasR2 } from '@/lib/env';

let cachedClient: S3Client | null = null;

function client(): S3Client {
  if (!hasR2) throw new Error('R2 não configurado — preencha as vars R2_*');
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY as string,
    },
  });
  return cachedClient;
}

export function publicUrl(key: string): string {
  if (!env.R2_PUBLIC_URL) return '';
  return `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
}

export async function presignPut(
  key: string,
  contentType: string,
  expiresInSec = 300,
): Promise<string> {
  const cmd = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client(), cmd, { expiresIn: expiresInSec });
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const cmd = new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: key });
  const res = await client().send(cmd);
  if (!res.Body) throw new Error(`R2 GET vazio: ${key}`);
  const chunks: Uint8Array[] = [];
  // @ts-expect-error — Body é AsyncIterable em Node
  for await (const chunk of res.Body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
  cacheControl = 'public, max-age=31536000, immutable',
): Promise<void> {
  const cmd = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  });
  await client().send(cmd);
}

export async function deleteObject(key: string): Promise<void> {
  const cmd = new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key });
  await client().send(cmd);
}
