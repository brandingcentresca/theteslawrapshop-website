import { Phone, Mail } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin/AdminShell";
import { updateQuoteStatus } from "../actions";
import { formatDate } from "@/lib/utils";
import type { QuoteSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "won", "lost"];

export default async function QuotesPage() {
  await requireUser();

  let quotes: QuoteSubmission[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("quote_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    quotes = (data as QuoteSubmission[]) ?? [];
  }

  return (
    <AdminShell title="Quote requests">
      {quotes.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No quote requests yet. New submissions from the website will appear
          here.
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-semibold">
                      {q.name}
                    </h3>
                    <span className="rounded-full bg-brand/10 text-brand-bright text-xs font-medium px-2.5 py-0.5">
                      {q.model}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
                    <a
                      href={`tel:${q.phone}`}
                      className="flex items-center gap-1.5 hover:text-brand-bright"
                    >
                      <Phone size={14} /> {q.phone}
                    </a>
                    <a
                      href={`mailto:${q.email}`}
                      className="flex items-center gap-1.5 hover:text-brand-bright break-all"
                    >
                      <Mail size={14} /> {q.email}
                    </a>
                  </div>
                </div>
                <span className="text-xs text-faint">
                  {formatDate(q.created_at)}
                </span>
              </div>

              {q.message && (
                <p className="mt-4 text-sm text-muted leading-relaxed border-l-2 border-line pl-4">
                  {q.message}
                </p>
              )}

              {q.photo_urls && q.photo_urls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {q.photo_urls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-bright underline"
                    >
                      Photo
                    </a>
                  ))}
                </div>
              )}

              <form
                action={updateQuoteStatus}
                className="mt-5 flex items-center gap-2"
              >
                <input type="hidden" name="id" value={q.id} />
                <select
                  name="status"
                  defaultValue={q.status}
                  className="rounded-lg bg-ink/60 border border-line px-3 py-1.5 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="text-sm font-semibold text-brand-bright hover:underline"
                >
                  Update
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
