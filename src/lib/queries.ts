// Public data access. Reads from Supabase when configured, and always falls
// back to the seed content in data.ts so the site renders no matter what.

import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./supabase/config";
import { blogPosts, galleryItems } from "./data";
import type { BlogPost, GalleryItem } from "./types";

function readClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return galleryItems;
  try {
    const supabase = readClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("model", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return galleryItems;
    return data as GalleryItem[];
  } catch {
    return galleryItems;
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return blogPosts;
  try {
    const supabase = readClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data || data.length === 0) return blogPosts;
    return data as BlogPost[];
  } catch {
    return blogPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) {
    return blogPosts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = readClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) {
      return blogPosts.find((p) => p.slug === slug) ?? null;
    }
    return data as BlogPost;
  } catch {
    return blogPosts.find((p) => p.slug === slug) ?? null;
  }
}
