import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createClient } from '@/lib/supabase/server';
import { presignPut } from '@/lib/r2';
import { extFromContentType, isAllowedUploadContentType } from '@/lib/image-pipeline';
import { rateLimit } from '@/lib/rate-limit';
import { hasGallery } from '@/lib/env';

export const runtime = 'nodejs';

const bodySchema = z.object({
  eventSlug: z.string().min(1).max(100),
  filename: z.string().max(255),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(30 * 1024 * 1024),
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

  const limit = rateLimit(`sign:${user.id}`, 120, 60_000);
  if (!limit.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!isAllowedUploadContentType(parsed.contentType)) {
    return NextResponse.json({ error: 'unsupported_type' }, { status: 400 });
  }

  const role = user.app_metadata?.role;
  const isAdmin = role === 'admin';

  const { data: eventRow, error: evErr } = await supabase
    .from('events')
    .select('id, slug')
    .eq('slug', parsed.eventSlug)
    .single();
  if (evErr || !eventRow) {
    return NextResponse.json({ error: 'event_not_found' }, { status: 404 });
  }

  if (!isAdmin) {
    const { data: assignment } = await supabase
      .from('event_photographers')
      .select('event_id')
      .eq('event_id', eventRow.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!assignment) {
      return NextResponse.json({ error: 'not_assigned' }, { status: 403 });
    }
  }

  const ext = extFromContentType(parsed.contentType);
  const stagingKey = `uploads/staging/${user.id}/${nanoid(16)}.${ext}`;

  const uploadUrl = await presignPut(stagingKey, parsed.contentType, 300);

  return NextResponse.json({
    uploadUrl,
    stagingKey,
    eventId: eventRow.id,
  });
}
