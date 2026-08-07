import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin/AdminShell";
import { ButtonLink } from "@/components/ui/Button";
import { deletePost } from "../actions";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  await requireUser();

  let posts: BlogPost[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    posts = (data as BlogPost[]) ?? [];
  }

  return (
    <AdminShell title="Blog posts">
      <div className="flex justify-end mb-6">
        <ButtonLink href="/admin/blog/new" size="sm">
          <Plus size={16} /> New post
        </ButtonLink>
      </div>

      {posts.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No posts yet. Create your first post to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-brand/10 text-brand-bright"
                        : "bg-panel-2 text-faint"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-faint mt-1">
                  /{post.slug} · {formatDate(post.published_at)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-muted hover:text-brand-bright"
                  aria-label="Edit"
                >
                  <Pencil size={17} />
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="text-sm text-muted hover:text-red-400"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
