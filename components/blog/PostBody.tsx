import { MDXRemote } from 'next-mdx-remote/rsc';
import { cn } from '@/lib/utils';

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={cn(
        'mt-12 font-display text-2xl font-medium tracking-tight md:text-3xl',
        props.className,
      )}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={cn('mt-8 font-display text-xl font-medium', props.className)}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className={cn('mt-5 leading-relaxed text-fg/90', props.className)} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className={cn(
        'my-8 border-l-2 border-brand pl-6 font-display text-xl italic text-fg/80',
        props.className,
      )}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className={cn('mt-5 list-disc space-y-2 pl-6', props.className)} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className={cn('text-brand underline underline-offset-2', props.className)} />
  ),
};

export function PostBody({ source }: { source: string }) {
  return (
    <div className="text-base leading-relaxed md:text-lg">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
