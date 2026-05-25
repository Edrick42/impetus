import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';

export type PostFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  cover?: string;
  tags?: string[];
};

export type Post = PostFrontmatter & {
  slug: string;
  locale: Locale;
  content: string;
  readingTime: number;
};

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getAllPosts(locale: Locale): Promise<Post[]> {
  const dir = path.join(POSTS_DIR, locale);
  const files = await readDirSafe(dir);
  const mdxFiles = files.filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(dir, filename);
      const raw = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.mdx?$/, '');
      return {
        ...(data as PostFrontmatter),
        slug,
        locale,
        content,
        readingTime: calcReadingTime(content),
      };
    }),
  );

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<Post | null> {
  const posts = await getAllPosts(locale);
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<{ locale: Locale; slug: string }[]> {
  const out: { locale: Locale; slug: string }[] = [];
  for (const locale of ['pt', 'en', 'es'] as const) {
    const posts = await getAllPosts(locale);
    for (const p of posts) out.push({ locale, slug: p.slug });
  }
  return out;
}
