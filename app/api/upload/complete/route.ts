import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createClient } from '@/lib/supabase/server';
import { getObjectBuffer, putObject, deleteObject } from '@/lib/r2';
import { buildVariants } from '@/lib/image-pipeline';
import { rateLimit } from '@/lib/rate-limit';
import { hasGallery } from '@/lib/env';

export const runtime = 'nodejs';
export const maxDuration = 60;

const bodySchema = z.object({
  stagingKey: z.string().min(1),
  eventSlug: z.string().min(1).max(100),
  caption: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  if (!hasGallery) {
    return NextResponse.json({ error: 'gallery_not_configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const limit = rateLimit(`complete:${user.id}`, 120, 60_000);
  if (!limit.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!body.stagingKey.startsWith(`uploads/staging/${user.id}/`)) {
    return NextResponse.json({ error: 'staging_owner_mismatch' }, { status: 403 });
  }

  const { data: eventRow, error: evErr } = await supabase
    .from('events')
    .select('id, slug')
    .eq('slug', body.eventSlug)
    .single();
  if (evErr || !eventRow) {
    return NextResponse.json({ error: 'event_not_found' }, { status: 404 });
  }

  let rawBuffer: Buffer;
  try {
    rawBuffer = await getObjectBuffer(body.stagingKey);
  } catch {
    return NextResponse.json({ error: 'staging_missing' }, { status: 404 });
  }

  let variants;
  try {
    variants = await buildVariants(rawBuffer);
  } catch (err) {
    await deleteObject(body.stagingKey).catch(() => undefined);
    const msg = err instanceof Error ? err.message : 'process_failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const photoId = nanoid(16);
  const baseKey = `events/${eventRow.slug}/${photoId}`;
  const keyThumb = `${baseKey}-thumb.${variants.thumb.ext}`;
  const keyMedium = `${baseKey}-medium.${variants.medium.ext}`;
  const keyOriginal = `${baseKey}-original.${variants.original.ext}`;

  await Promise.all([
    putObject(keyThumb, variants.thumb.buffer, variants.thumb.contentType),
    putObject(keyMedium, variants.medium.buffer, variants.medium.contentType),
    putObject(keyOriginal, variants.original.buffer, variants.original.contentType),
  ]);

  await deleteObject(body.stagingKey).catch(() => undefined);

  const { data: inserted, error: insErr } = await supabase
    .from('photos')
    .insert({
      event_id: eventRow.id,
      uploaded_by: user.id,
      r2_key_thumb: keyThumb,
      r2_key_medium: keyMedium,
      r2_key_original: keyOriginal,
      width: variants.width,
      height: variants.height,
      caption: body.caption ?? null,
    })
    .select('id')
    .single();

  if (insErr || !inserted) {
    // Limpa R2 se insert falhou para não deixar órfão
    await Promise.all([
      deleteObject(keyThumb).catch(() => undefined),
      deleteObject(keyMedium).catch(() => undefined),
      deleteObject(keyOriginal).catch(() => undefined),
    ]);
    return NextResponse.json({ error: 'db_insert_failed' }, { status: 500 });
  }

  return NextResponse.json({
    id: inserted.id,
    keyThumb,
    keyMedium,
    keyOriginal,
    width: variants.width,
    height: variants.height,
  });
}
