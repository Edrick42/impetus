import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasSupabaseAdmin } from '@/lib/env';

export const runtime = 'nodejs';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  eventIds: z.array(z.string().uuid()).default([]),
});

export async function POST(request: Request) {
  if (!hasSupabaseAdmin) {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await request.json());
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid_body';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    app_metadata: { role: 'photographer' },
  });

  if (createErr || !created.user) {
    return NextResponse.json(
      { error: createErr?.message ?? 'create_failed' },
      { status: 400 },
    );
  }

  if (body.eventIds.length > 0) {
    const rows = body.eventIds.map((eid) => ({
      event_id: eid,
      user_id: created.user!.id,
    }));
    await admin.from('event_photographers').insert(rows);
  }

  return NextResponse.json({ id: created.user.id, email: created.user.email });
}

const assignSchema = z.object({
  userId: z.string().uuid(),
  eventIds: z.array(z.string().uuid()),
});

export async function PUT(request: Request) {
  if (!hasSupabaseAdmin) {
    return NextResponse.json({ error: 'admin_not_configured' }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof assignSchema>;
  try {
    body = assignSchema.parse(await request.json());
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid_body';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin.from('event_photographers').delete().eq('user_id', body.userId);
  if (body.eventIds.length > 0) {
    await admin
      .from('event_photographers')
      .insert(body.eventIds.map((eid) => ({ event_id: eid, user_id: body.userId })));
  }

  return NextResponse.json({ ok: true });
}
