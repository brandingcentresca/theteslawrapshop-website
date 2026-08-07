import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import type { BlogPost } from "@/lib/types";

const inputClass =
  "w-full rounded-xl bg-ink/60 border border-line px-4 py-3 text-fg placeholder:text-faint focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export function PostForm({ post }: { post?: BlogPost }) {
  return (
    <form action={savePost} className="card p-6 sm:p-8 space-y-5 max-w-3xl">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input
          name="title"
          required
          defaultValue={post?.title}
          className={inputClass}
          placeholder="How much does a Tesla wrap cost?"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Slug (URL) — leave blank to auto-generate
          </label>
          <input
            name="slug"
            defaultValue={post?.slug}
            className={inputClass}
            placeholder="tesla-wrap-cost"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Publish date</label>
          <input
            type="date"
            name="published_at"
            defaultValue={post?.published_at?.slice(0, 10)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Featured image URL
        </label>
        <input
          name="featured_image"
          defaultValue={post?.featured_image ?? ""}
          className={inputClass}
          placeholder="https://…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          className={inputClass}
          placeholder="A short summary shown on the blog list."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Content (Markdown)
        </label>
        <textarea
          name="content"
          rows={16}
          defaultValue={post?.content}
          className={`${inputClass} font-mono text-sm`}
          placeholder={"## Heading\n\nWrite your article using Markdown…"}
        />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="h-4 w-4 accent-[var(--color-brand)]"
        />
        Published (visible on the site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">Save post</Button>
        <Link
          href="/admin/blog"
          className="text-sm text-muted hover:text-fg"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
