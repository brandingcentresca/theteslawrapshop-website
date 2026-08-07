import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Blog — Tesla Wrap Tips & Guides",
  description:
    "Guides, tips and inspiration for wrapping your Tesla — costs, maintenance, finishes and more from The Tesla Wrap Shop in Toronto.",
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="container-x py-16 md:py-24">
      <div className="max-w-2xl mb-14">
        <span className="inline-block text-brand-bright font-semibold tracking-[0.2em] text-xs uppercase mb-4">
          The Blog
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          Tesla wrap guides &amp; inspiration
        </h1>
        <p className="mt-5 text-muted text-lg">
          Everything you need to know about wrapping your Tesla — from costs and
          care to the latest finishes.
        </p>
      </div>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group card overflow-hidden grid md:grid-cols-2 mb-12 hover:border-brand transition-colors"
        >
          <div className="aspect-video md:aspect-auto md:h-full bg-panel-2 overflow-hidden">
            {featured.featured_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.featured_image}
                alt={featured.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full min-h-56 grid place-items-center bg-gradient-to-br from-panel-2 to-ink">
                <span className="font-display text-brand/40 text-2xl font-bold">
                  The Tesla Wrap Shop
                </span>
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs text-faint mb-3">
              <span className="rounded-full bg-brand/10 text-brand-bright px-3 py-1 font-medium">
                {featured.category}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formatDate(featured.published_at)}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold group-hover:text-brand-bright transition-colors">
              {featured.title}
            </h2>
            <p className="mt-3 text-muted line-clamp-3">{featured.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-brand-bright font-semibold text-sm">
              Read article <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group card overflow-hidden flex flex-col hover:border-brand transition-colors"
          >
            <div className="aspect-video bg-panel-2 overflow-hidden">
              {post.featured_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.featured_image}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full grid place-items-center bg-gradient-to-br from-panel-2 to-ink">
                  <span className="font-display text-brand/30 text-lg font-bold">
                    Tesla Wrap Shop
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-faint mb-3">
                <CalendarDays size={13} />
                {formatDate(post.published_at)}
              </div>
              <h3 className="font-display text-lg font-semibold group-hover:text-brand-bright transition-colors">
                {post.title}
              </h3>
              <p className="mt-2.5 text-sm text-muted line-clamp-3 flex-1">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 card p-10 text-center">
        <h2 className="font-display text-2xl font-bold">
          Thinking about wrapping your Tesla?
        </h2>
        <p className="mt-3 text-muted max-w-lg mx-auto">
          Get a free, no-obligation quote tailored to your car.
        </p>
        <ButtonLink href="/#quote" size="lg" className="mt-6">
          Get a Free Quote
        </ButtonLink>
      </div>
    </div>
  );
}
