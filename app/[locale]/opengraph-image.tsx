import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Instituto Impetus';

export default async function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0f0f0f',
          color: '#fafaf8',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(250,250,248,0.6)',
          }}
        >
          {t('siteName')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            {t('defaultTitle')}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              color: 'rgba(250,250,248,0.7)',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {t('defaultDescription')}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
