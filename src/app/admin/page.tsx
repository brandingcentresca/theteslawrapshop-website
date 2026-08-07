import Link from "next/link";
import { Inbox, FileText, Images, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { importStarterContent } from "./actions";

export const dynamic = "force-dynamic";

async function counts() {
  if (!isSupabaseConfigured) return { quotes: 0, newQuotes: 0, posts: 0, gallery: 0 };
  const supabase = await createClient();
  const [q, nq, p, g] = await Promise.all([
    supabase.from("quote_submissions").select("*", { count: "exact", head: true }),
    supabase
      .from("quote_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("gallery_items").select("*", { count: "exact", head: true }),
  ]);
  return {
    quotes: q.count ?? 0,
    newQuotes: nq.count ?? 0,
    posts: p.count ?? 0,
    gallery: g.count ?? 0,
  };
}

export default async function AdminDashboard() {
  await requireUser();
  const c = await counts();

  const cards = [
    {
      href: "/admin/quotes",
      label: "Quote requests",
      value: c.quotes,
      hint: `${c.newQuotes} new`,
      icon: Inbox,
    },
    { href: "/admin/blog", label: "Blog posts", value: c.posts, icon: FileText },
    { href: "/admin/gallery", label: "Gallery items", value: c.gallery, icon: Images },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card p-6 hover:border-brand transition-colors group"
          >
            <div className="flex items-center justify-between">
              <card.icon size={22} className="text-brand" />
              <ArrowRight
                size={18}
                className="text-faint group-hover:text-brand-bright transition-colors"
              />
            </div>
            <p className="mt-4 font-display text-3xl font-bold">{card.value}</p>
            <p className="text-sm text-muted">
              {card.label}
              {card.hint ? (
                <span className="text-brand-bright"> · {card.hint}</span>
              ) : null}
            </p>
          </Link>
        ))}
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-display text-lg font-semibold">Starter content</h2>
        <p className="text-sm text-muted mt-1.5 max-w-xl">
          Load the 12 existing blog posts and the starter gallery into your
          database so you can edit them here. Safe to run more than once — posts
          are matched by their web address and won&apos;t be duplicated.
        </p>
        <form action={importStarterContent} className="mt-4">
          <Button type="submit" variant="outline" size="sm">
            Import starter posts &amp; gallery
          </Button>
        </form>
      </div>

      {!isSupabaseConfigured && (
        <div className="card p-6 mt-6 border-yellow-500/30">
          <p className="text-sm text-yellow-300/90">
            The database isn&apos;t connected yet, so counts show zero. Once the
            environment variables are set this will populate automatically.
          </p>
        </div>
      )}
    </AdminShell>
  );
}
