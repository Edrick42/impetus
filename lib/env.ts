import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional().or(z.literal('')),

  // Piwigo (legado, fallback)
  PIWIGO_API_URL: z.string().url().optional().or(z.literal('')),
  PIWIGO_USERNAME: z.string().optional(),
  PIWIGO_PASSWORD: z.string().optional(),

  IG_ACCESS_TOKEN: z.string().optional(),
  IG_USER_ID: z.string().optional(),
  NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET: process.env.R2_BUCKET,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  PIWIGO_API_URL: process.env.PIWIGO_API_URL,
  PIWIGO_USERNAME: process.env.PIWIGO_USERNAME,
  PIWIGO_PASSWORD: process.env.PIWIGO_PASSWORD,
  IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
  IG_USER_ID: process.env.IG_USER_ID,
  NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
});

if (!parsed.success) {
  console.warn('Env validation warnings:', parsed.error.flatten().fieldErrors);
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    };

export const hasSupabase = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
export const hasSupabaseAdmin = Boolean(hasSupabase && env.SUPABASE_SERVICE_ROLE_KEY);
export const hasR2 = Boolean(
  env.R2_ACCOUNT_ID &&
    env.R2_ACCESS_KEY_ID &&
    env.R2_SECRET_ACCESS_KEY &&
    env.R2_BUCKET &&
    env.R2_PUBLIC_URL,
);
export const hasGallery = hasSupabase && hasR2;
export const hasPiwigo = Boolean(
  env.PIWIGO_API_URL && env.PIWIGO_USERNAME && env.PIWIGO_PASSWORD,
);
export const hasInstagram = Boolean(env.IG_ACCESS_TOKEN && env.IG_USER_ID);
export const hasClarity = Boolean(env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
