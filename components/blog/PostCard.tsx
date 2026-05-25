import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { Post } from '@/lib/mdx';

export function PostCard({ post }: { post: Post }) {
  const t = useTranslations('blog');

  return (
    <article className="group border-b border-border py-10 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="block">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {new Date(post.publishedAt).toLocaleDateString(post.locale)} ·{' '}
          {t('readingTime', { minutes: post.readingTime })}
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium leading-snug transition-colors group-hover:text-brand md:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          {post.description}
        </p>
      </Link>
    </article>
  );
}
