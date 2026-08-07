import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isBackblazeConfigured } from "@/lib/backblaze";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { addGalleryItem, deleteGalleryItem } from "../actions";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const MODELS = ["Model 3", "Model Y", "Model S", "Model X"];
const inputClass =
  "w-full rounded-xl bg-ink/60 border border-line px-4 py-3 text-fg placeholder:text-faint focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export default async function AdminGallery() {
  await requireUser();

  let items: GalleryItem[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("model")
      .order("sort_order");
    items = (data as GalleryItem[]) ?? [];
  }

  return (
    <AdminShell title="Gallery">
      <div className="card p-6 sm:p-8 mb-8">
        <h2 className="font-display text-lg font-semibold mb-5">
          Add a gallery photo
        </h2>
        <form action={addGalleryItem} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                name="title"
                className={inputClass}
                placeholder="Model 3 · Satin Black Wrap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select name="model" defaultValue="Model 3" className={inputClass}>
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload image {isBackblazeConfigured ? "(to Backblaze)" : "(storage not connected yet)"}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className={inputClass}
              disabled={!isBackblazeConfigured}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              …or paste an image URL
            </label>
            <input
              name="image_url"
              className={inputClass}
              placeholder="https://…"
            />
          </div>

          <input type="hidden" name="sort_order" value={items.length + 1} />
          <Button type="submit">Add photo</Button>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No gallery items in the database yet. The site currently shows the
          built-in starter gallery until you add photos here.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full aspect-4/3 object-cover"
              />
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-brand-bright">{item.model}</p>
                  <p className="text-sm truncate">{item.title}</p>
                </div>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="text-sm text-muted hover:text-red-400 shrink-0"
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
