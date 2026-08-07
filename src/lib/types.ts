export type TeslaModel = "Model S" | "Model 3" | "Model X" | "Model Y";

export interface GalleryItem {
  id: string;
  title: string;
  model: TeslaModel;
  image_url: string;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  featured_image: string | null;
  author: string;
  category: string;
  published: boolean;
  published_at: string; // ISO date
}

export interface QuoteSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  model: string;
  message: string;
  photo_urls: string[];
  status: "new" | "contacted" | "won" | "lost";
}
