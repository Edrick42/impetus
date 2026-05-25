import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { PostCard } from '@/components/blog/PostCard';
import { getAllPosts } from '@/lib/mdx';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('lead'),
    path: '/blog',
  });
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = await getAllPosts(locale);

  return (
    <Container className="py-20 md:py-28">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: `/${locale}` },
          { name: t('title'), url: `/${locale}/blog` },
        ])}
      />
      <div className="max-w-3xl">
        <Eyebrow>{t('title')}</Eyebrow>
        <Heading level="display" className="mt-4">
          {t('title')}.
        </Heading>
        <Lead className="mt-6">{t('lead')}</Lead>
      </div>

      {posts.length > 0 ? (
        <div className="mt-16">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-muted">{t('empty')}</p>
      )}
    </Container>
  );
}
