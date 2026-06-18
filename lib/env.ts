import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  PIWIGO_API_URL: z.string().url().optional().or(z.literal('')),
  PIWIGO_USERNAME: z.string().optional(),
  PIWIGO_PASSWORD: z.string().optional(),
  IG_ACCESS_TOKEN: z.string().optional(),
  IG_USER_ID: z.string().optional(),
  NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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

export const hasPiwigo = Boolean(
  env.PIWIGO_API_URL && env.PIWIGO_USERNAME && env.PIWIGO_PASSWORD,
);
export const hasInstagram = Boolean(env.IG_ACCESS_TOKEN && env.IG_USER_ID);
export const hasClarity = Boolean(env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
