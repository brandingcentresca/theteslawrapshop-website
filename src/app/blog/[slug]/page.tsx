import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { sanitizePostHtml } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { blogPosts } from "@/lib/data";

export async function generateStaticParams() {
  // Prerender seed posts; DB-only posts render on-demand.
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;

// Revalidate each article at most once a minute so edits made in the admin
// panel appear without a redeploy. Mutations also revalidate on-demand.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="py-16 md:py-20">
      <div className="container-x max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-bright transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <div className="flex items-center gap-3 text-xs text-faint mb-4">
          <span className="rounded-full bg-brand/10 text-brand-bright px-3 py-1 font-medium">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatDate(post.published_at)}
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
          {post.title}
        </h1>

        {post.featured_image && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose-tws mt-10"
          dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.content) }}
        />

        <div className="mt-12 card p-8 text-center">
          <h2 className="font-display text-2xl font-bold">
            Ready to transform your Tesla?
          </h2>
          <p className="mt-3 text-muted">
            Get a free quote from Toronto&apos;s Tesla wrap specialists.
          </p>
          <ButtonLink href="/#quote" size="lg" className="mt-6">
            Get a Free Quote
          </ButtonLink>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-x max-w-5xl mt-20">
          <h2 className="font-display text-2xl font-bold mb-8">
            More to explore
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group card p-6 hover:border-brand transition-colors"
              >
                <span className="text-xs text-faint">
                  {formatDate(p.published_at)}
                </span>
                <h3 className="font-display font-semibold mt-2 group-hover:text-brand-bright transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
