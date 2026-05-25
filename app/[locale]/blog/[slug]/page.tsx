import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/routing';
import { PostBody } from '@/components/blog/PostBody';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllSlugs, getPostBySlug } from '@/lib/mdx';
import { buildMetadata, blogPostingLd, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateStaticParams() {
  return await getAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = await getPostBySlug(locale, slug);
  if (!post) return {};

  return buildMetadata({
    locale,
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogImage: post.cover,
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author],
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const blogTitle = t('title');

  return (
    <Container className="py-20 md:py-28">
      <JsonLd
        data={[
          blogPostingLd({
            locale,
            slug,
            title: post.title,
            description: post.description,
            publishedAt: post.publishedAt,
            author: post.author,
            cover: post.cover,
          }),
          breadcrumbLd([
            { name: 'Home', url: `/${locale}` },
            { name: blogTitle, url: `/${locale}/blog` },
            { name: post.title, url: `/${locale}/blog/${slug}` },
          ]),
        ]}
      />
      <ReadingProgress slug={slug} />

      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-muted hover:text-fg">
          {t('back')}
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">
          {new Date(post.publishedAt).toLocaleDateString(locale)} ·{' '}
          {t('readingTime', { minutes: post.readingTime })}
        </p>

        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {post.description}
        </p>

        <p className="mt-6 text-sm text-muted">
          {t('by')} {post.author}
        </p>

        <hr className="my-12 border-border" />

        <PostBody source={post.content} />
      </div>
    </Container>
  );
}
