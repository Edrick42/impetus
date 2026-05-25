import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { getInstagramPosts } from '@/lib/instagram';

export async function InstagramFeed() {
  const t = await getTranslations('instagram');
  const posts = await getInstagramPosts(6);

  return (
    <Section tone="surface">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('title')}</Heading>
            <Lead className="mt-6">{t('lead')}</Lead>
          </div>
          <a
            href="https://instagram.com/institutoimpetus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand hover:underline"
          >
            {t('cta')} →
          </a>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {posts.map((p) => (
              <a
                key={p.id}
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-md bg-bg"
              >
                <Image
                  src={p.thumbnailUrl ?? p.mediaUrl}
                  alt={p.caption?.slice(0, 80) ?? 'Instagram post'}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-muted">
            <p>{t('fallback')}</p>
          </div>
        )}
      </Container>
    </Section>
  );
}
