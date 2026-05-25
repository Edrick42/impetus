import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { getAllPosts } from '@/lib/mdx';
import type { Locale } from '@/i18n/routing';

export async function BlogPreview({ locale }: { locale: Locale }) {
  const t = await getTranslations('blogPreview');
  const posts = (await getAllPosts(locale)).slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('title')}</Heading>
            <Lead className="mt-6">{t('lead')}</Lead>
          </div>
          <ButtonLink href="/blog" variant="ghost">
            {t('cta')}
          </ButtonLink>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    {new Date(post.publishedAt).toLocaleDateString(locale)} ·{' '}
                    {t('readingTime', { minutes: post.readingTime })}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-medium leading-snug transition-colors group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-brand">{t('readMore')} →</p>
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
