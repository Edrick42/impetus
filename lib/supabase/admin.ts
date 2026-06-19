import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseAdmin } from '@/lib/env';

export function createAdminClient() {
  if (!hasSupabaseAdmin) {
    throw new Error('Supabase service role não configurado — defina SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
