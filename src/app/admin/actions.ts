"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadToB2, isBackblazeConfigured } from "@/lib/backblaze";
import { slugify } from "@/lib/utils";
import { blogPosts, galleryItems } from "@/lib/data";

// ---- One-click starter import ---------------------------------------------
// Loads the built-in blog posts + gallery into the database so they become
// editable. Idempotent for posts (upsert by slug); gallery only if empty.
export async function importStarterContent() {
  await requireUser();
  const supabase = await createClient();

  await supabase.from("blog_posts").upsert(
    blogPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      featured_image: p.featured_image,
      author: p.author,
      category: p.category,
      published: p.published,
      published_at: p.published_at,
    })),
    { onConflict: "slug" }
  );

  const { count } = await supabase
    .from("gallery_items")
    .select("*", { count: "exact", head: true });
  if (!count) {
    await supabase.from("gallery_items").insert(
      galleryItems.map((g) => ({
        title: g.title,
        model: g.model,
        image_url: g.image_url,
        sort_order: g.sort_order,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/gallery");
}

// ---- Blog posts ------------------------------------------------------------

export async function savePost(formData: FormData) {
  await requireUser();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  let featured_image =
    String(formData.get("featured_image") ?? "").trim() || null;

  // If an image file was uploaded, store it in Backblaze and use that URL.
  const imgFile = formData.get("featured_image_file");
  if (imgFile instanceof File && imgFile.size > 0 && isBackblazeConfigured) {
    const buffer = Buffer.from(await imgFile.arrayBuffer());
    const safe = slugify(imgFile.name.replace(/\.[^.]+$/, "") || slug || "post");
    const ext = imgFile.name.split(".").pop() ?? "jpg";
    const key = `blog/${Date.now()}-${safe}.${ext}`;
    try {
      featured_image = await uploadToB2(
        key,
        buffer,
        imgFile.type || "image/jpeg"
      );
    } catch (e) {
      console.error("Blog image upload failed:", e);
    }
  }

  const published = formData.get("published") === "on";
  const published_at =
    String(formData.get("published_at") ?? "").trim() ||
    new Date().toISOString().slice(0, 10);

  const row = {
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published,
    published_at,
    author: "The Tesla Wrap Shop",
    category: "Vehicle Wrap",
  };

  if (id) {
    await supabase.from("blog_posts").update(row).eq("id", id);
  } else {
    await supabase.from("blog_posts").insert(row);
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/blog");
}

// ---- Gallery ---------------------------------------------------------------

export async function addGalleryItem(formData: FormData) {
  await requireUser();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  let image_url = String(formData.get("image_url") ?? "").trim();

  const file = formData.get("image");
  if (file instanceof File && file.size > 0 && isBackblazeConfigured) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safe = slugify(file.name.replace(/\.[^.]+$/, "") || title);
    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `gallery/${Date.now()}-${safe}.${ext}`;
    image_url = await uploadToB2(key, buffer, file.type || "image/jpeg");
  }

  if (!image_url) return;

  await supabase
    .from("gallery_items")
    .insert({ title, model, sort_order, image_url });

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("gallery_items").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

// ---- Quotes ----------------------------------------------------------------

export async function updateQuoteStatus(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const supabase = await createClient();
  await supabase.from("quote_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/quotes");
}
