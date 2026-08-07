// Seed / fallback content. Used when the database is empty or unconfigured so
// the site always renders. Once Supabase is live, this content is migrated in
// and the app reads from the database (with this as a safety fallback).

import type { GalleryItem, BlogPost } from "./types";

const CDN = "https://cdn.theteslawrapshop.com/wp-content/uploads";

export const LOGO_URL = `${CDN}/2023/01/The-Tesla-Wrap-Shop-Logo.webp`;

export const galleryItems: GalleryItem[] = [
  // Model 3
  { id: "g-m3-1", model: "Model 3", sort_order: 1, title: "Model 3 · Full Vinyl Wrap — Front View", image_url: `${CDN}/2023/01/Tesla-Model-3-2020-Full-Vinyl-Wrap-at-The-Tesla-Wrap-Shop-Front-View.webp` },
  { id: "g-m3-2", model: "Model 3", sort_order: 2, title: "Model 3 · Full Colour Change — Side View", image_url: `${CDN}/2023/01/Tesla-Model-3-Wrap-Full-Colour-Change-Avery-and-3M-wraps-Side-View.webp` },
  { id: "g-m3-3", model: "Model 3", sort_order: 3, title: "Model 3 · Full Colour Change — Angle View", image_url: `${CDN}/2023/01/Tesla-Model-3-2020-Full-Colour-Change-Wrap-The-Tesla-Wrap-Shop-in-Toronto-View-from-an-angle.webp` },
  { id: "g-m3-4", model: "Model 3", sort_order: 4, title: "Model 3 · Full Vinyl Wrap — Avery & 3M", image_url: `${CDN}/2023/01/Tesla-Model-3-Full-Vinyl-Wrap-at-The-Tesla-Wrap-Shop-Avery-and-3M-Wraps.webp` },
  { id: "g-m3-5", model: "Model 3", sort_order: 5, title: "Model 3 · Colour Change in Etobicoke", image_url: `${CDN}/2023/01/Tesla-Model-3-Full-Vinyl-Wrap-Colour-Change-at-The-Tesla-Wrap-Shop-in-Etobicoke.webp` },
  { id: "g-m3-6", model: "Model 3", sort_order: 6, title: "Model 3 · Dark Metallic Grey — Side View", image_url: `${CDN}/2023/01/Tesla-Model-3-Colour-Change-to-Dark-Metalic-Grey-Side-View-The-Tesla-Wrap-Shop-in-Toronto.webp` },
  { id: "g-m3-7", model: "Model 3", sort_order: 7, title: "Model 3 · Dark Metallic Grey Colour Change", image_url: `${CDN}/2023/01/Tesla-Model-3-Full-Colour-Change-Dark-Metalic-Grey-The-Tesla-Wrap-Shop-in-Toronto.webp` },
  { id: "g-m3-8", model: "Model 3", sort_order: 8, title: "Model 3 · Dark Metallic Grey Wrap", image_url: `${CDN}/2023/01/Tesla-Model-3-Full-Colour-Change-Vinyl-Wrap-The-Tesla-Wrap-Shop-in-Toronto-Dark-Metalic-Grey.webp` },
  // Model Y
  { id: "g-my-1", model: "Model Y", sort_order: 1, title: "Model Y · Full Wrap Colour Change — Angle", image_url: `${CDN}/2023/01/Tesla-Model-Y-Full-Car-Wrap-Colour-Change-The-Tesla-Wrap-Shop-in-Toronto-Angle-View.webp` },
  { id: "g-my-2", model: "Model Y", sort_order: 2, title: "Model Y · Full Colour Change — Side View", image_url: `${CDN}/2023/01/Tesla-Model-Y-Full-Colour-Change-Wrap-in-Toronto-The-Tesla-Wrap-Shop-Side-View.webp` },
  { id: "g-my-3", model: "Model Y", sort_order: 3, title: "Model Y · Full Wrap — Front View", image_url: `${CDN}/2023/01/Tesla-Model-Y-full-wrap-by-The-Tesla-Wrap-Shop-Colour-Change-Front-View.webp` },
  { id: "g-my-4", model: "Model Y", sort_order: 4, title: "Model Y · Colour Change — Avery & 3M", image_url: `${CDN}/2023/01/Tesla-Model-Y-Colour-Change-Wrap-at-The-Tesla-Wrap-Shop-in-Toronto-Avery-and-3M-Wraps.webp` },
  // Model S
  { id: "g-ms-1", model: "Model S", sort_order: 1, title: "Model S · Personal Decals — Brampton", image_url: `${CDN}/2023/01/Tesla-Model-S-Decals-Personal-The-Tesla-Wrap-Shop-in-Brampton.webp` },
  { id: "g-ms-2", model: "Model S", sort_order: 2, title: "Model S · Decals — Mississauga", image_url: `${CDN}/2023/01/Tesla-Model-S-Decals-The-Tesla-Wrap-Shop-in-Mississauga.webp` },
  { id: "g-ms-3", model: "Model S", sort_order: 3, title: "Model S · Decals — Toronto", image_url: `${CDN}/2023/01/The-Tesla-Wrap-Shop-in-Toronto-Model-S-Decals.webp` },
  { id: "g-ms-4", model: "Model S", sort_order: 4, title: "Model S · Vinyl Decals — Toronto", image_url: `${CDN}/2023/01/Tesla-Model-S-Vinyl-Decals-The-Tesla-Wrap-Shop-in-Toronto.webp` },
];

// ---- Blog seed -------------------------------------------------------------

function post(p: Partial<BlogPost> & Pick<BlogPost, "slug" | "title" | "excerpt" | "published_at" | "content">): BlogPost {
  return {
    id: p.slug,
    author: "The Tesla Wrap Shop",
    category: "Vehicle Wrap",
    published: true,
    featured_image: p.featured_image ?? null,
    ...p,
  } as BlogPost;
}

export const blogPosts: BlogPost[] = [
  post({
    slug: "tesla-wrap-cost-in-toronto-guide",
    title: "Tesla Wrap Cost in Toronto: Factors and Estimated Prices",
    excerpt:
      "Are you a proud Tesla owner in Toronto looking to transform the appearance of your electric gem? Here's what a wrap really costs and why.",
    published_at: "2023-10-20",
    content: `## What goes into the cost of a Tesla wrap?\n\nThe price of wrapping a Tesla in Toronto depends on a few key factors: the type of vinyl, whether you want a standard colour change or a custom printed design, and the complexity of the installation.\n\n### Material quality\n\nWe only use premium vinyl from 3M and Avery Dennison. Premium film costs more up front but lasts longer, looks better, and protects your factory paint.\n\n### Coverage and complexity\n\nA full colour change covers every exterior panel. Custom printed designs, chrome deletes, and intricate decals take more time and material, which affects the price.\n\n## Estimated pricing\n\n- **Standard colour change:** from $3,500\n- **Custom printed colours:** from $4,500\n- **Custom printed design:** from $4,750\n\nEvery Tesla and every vision is a little different. Call us at 647-559-5939 for an accurate quote tailored to your car.`,
  }),
  post({
    slug: "tesla-model-3-wrap-maintenance",
    title: "The Dos and Don'ts of Maintaining Your Tesla Model 3 Wrap",
    excerpt:
      "Maintaining your Tesla Model 3 wrap is crucial to keep the car looking its best. Follow these simple dos and don'ts.",
    published_at: "2023-05-02",
    content: `## Keep your wrap looking new\n\nA quality vinyl wrap can look showroom-fresh for years with the right care. Here's how to protect your investment.\n\n### Do\n\n- Hand wash with a mild, pH-neutral soap.\n- Dry with a clean microfibre towel.\n- Park in the shade or a garage when possible.\n- Address bird droppings and tree sap quickly.\n\n### Don't\n\n- Use automatic brush car washes.\n- Pressure wash at close range or high heat.\n- Apply wax or polish meant for paint.\n- Let contaminants sit on the surface.\n\nTreat your wrap gently and it will reward you with years of head-turning colour.`,
  }),
  post({
    slug: "custom-tesla-wraps",
    title: "Vinyl Wraps for Tesla: Protection, Customization, and Cost-Effectiveness",
    excerpt:
      "A vinyl wrap protects your factory paint, lets you customize your look, and costs a fraction of a respray.",
    published_at: "2023-04-17",
    content: `## Why Tesla owners choose vinyl\n\nA vinyl wrap offers three big wins: protection, customization, and value.\n\n### Protection\n\nThe film shields your original paint from stone chips, UV rays, and minor scratches — helping preserve resale value.\n\n### Customization\n\nFrom satin and matte to gloss, chrome, and custom prints, the finishes available in vinyl go far beyond factory paint options.\n\n### Cost-effectiveness\n\nA premium wrap costs less than a high-quality respray, and it's fully reversible when you're ready for a change.`,
  }),
  post({
    slug: "how-long-do-vehicle-wraps-last",
    title: "How Long Do Vehicle Wraps Last? Factors and Maintenance Tips",
    excerpt:
      "With premium material and proper care, a quality vehicle wrap can last five to seven years. Here's what affects longevity.",
    published_at: "2023-04-04",
    content: `## Typical wrap lifespan\n\nA professionally installed premium wrap lasts **five to seven years** on average. Several factors influence that range.\n\n### What affects longevity\n\n- **Material:** premium 3M and Avery film outlasts budget vinyl.\n- **Sun exposure:** constant UV fades and degrades film faster.\n- **Care:** gentle washing and quick cleaning of contaminants extends life.\n- **Storage:** garaged cars keep their wrap longer.\n\nWith the right material and care, your wrap will look great for years.`,
  }),
  post({
    slug: "tesla-racing-stripes-in-toronto",
    title: "The Ultimate Guide to Tesla Racing Stripes: Tips, Benefits, and More",
    excerpt:
      "Racing stripes add sporty, personal flair to your Tesla. Here's everything to know before adding them.",
    published_at: "2023-03-23",
    content: `## Add character with racing stripes\n\nRacing stripes are one of the most popular ways to personalize a Tesla without committing to a full colour change.\n\n### Benefits\n\n- A sporty, custom look that stands out.\n- Fully reversible vinyl — no permanent changes.\n- Endless colour and finish combinations.\n\nWhether you want subtle accents or bold centre stripes, we'll design a look that suits your car.`,
  }),
  post({
    slug: "vinyl-wraps-for-tesla-model-s",
    title: "Vinyl Wraps For Tesla Model S: The Ultimate Customization Solution",
    excerpt:
      "The Tesla Model S is a luxury electric sedan. A vinyl wrap is the ultimate way to make it uniquely yours.",
    published_at: "2023-03-16",
    content: `## The Tesla Model S\n\nThe Tesla Model S is a luxury electric sedan introduced in 2012. It has earned numerous accolades for its performance, design, and technology, and helped shift the automotive industry toward electrification.\n\n### Customization options\n\n- **Solid colours** for a clean, factory-style refresh.\n- **Glossy finishes** for a deep, reflective shine.\n- **Textures** like brushed steel and carbon fibre.\n- **Patterns** and holographic films for a bold statement.\n\n## How a vinyl wrap enhances your Model S\n\nA wrap protects your paint, lets you customize your look, preserves resale value, costs less than a respray, and is fully reversible. Ready to talk? Give us a call.`,
  }),
  post({
    slug: "tesla-modifications",
    title: "8 Ways to Customize Your Tesla and Make It Your Own",
    excerpt:
      "From wraps to decals to interior touches, here are eight ways to make your Tesla stand out from the crowd.",
    published_at: "2023-03-10",
    content: `## Make your Tesla yours\n\nHere are eight popular ways Tesla owners personalize their cars:\n\n1. Full colour change wrap\n2. Custom printed designs\n3. Racing stripes and accents\n4. Chrome delete\n5. Personalized decals\n6. Wheel and caliper refinishing\n7. Window tinting\n8. Interior trim accents\n\nA vinyl wrap is the fastest, most reversible way to transform your Tesla's look.`,
  }),
  post({
    slug: "tesla-car-wrap-in-toronto",
    title: "Tesla Car Wraps in Toronto: Your Options and Benefits",
    excerpt:
      "Considering a wrap for your Tesla in Toronto? Here are your options and the benefits of each.",
    published_at: "2023-03-09",
    content: `## Your wrap options in Toronto\n\nWhether you want a subtle refresh or a complete transformation, there's a wrap for you.\n\n### Colour change\n\nSwap your Tesla's colour entirely with gloss, satin, matte, or metallic finishes.\n\n### Custom prints and decals\n\nAdd graphics, patterns, or branding with fully custom printed vinyl.\n\n### Benefits\n\nProtection for your paint, a personalized look, and a fully reversible upgrade — all installed with premium 3M and Avery film.`,
  }),
  post({
    slug: "tesla-model-y-wrap",
    title: "Tesla Model Y Wrap: The Affordable Alternative to Custom Paint Jobs",
    excerpt:
      "The Tesla Model Y is one of the most talked-about EVs on the market. A wrap is the affordable way to protect and personalize it.",
    published_at: "2023-03-02",
    content: `## The Tesla Model Y\n\nThe Tesla Model Y is one of the most talked-about electric vehicles on the market, and it's easy to see why. This sleek, powerful SUV offers cutting-edge technology, impressive performance, and features that make it a great choice for switching to electric. As with any vehicle, it's important to protect your investment and keep it looking great.\n\n### Why get a Model Y wrap?\n\n- **Protection from the elements** — guard your paint from chips and UV.\n- **Customization options** — dozens of colours and finishes.\n- **Easy to remove** — fully reversible with no damage.\n- **Cost-effective** — far less than a custom paint job.\n- **Resale value** — preserve the factory paint underneath.\n\nLet's talk about your Tesla Model Y wrap.`,
  }),
  post({
    slug: "tesla-model-x-vinyl-wraps-in-toronto",
    title: "Why Every Tesla Model X Owner in Toronto Should Consider a Vinyl Wrap",
    excerpt:
      "The Tesla Model X is an all-electric luxury SUV. A vinyl wrap protects and personalizes it beautifully.",
    published_at: "2023-03-01",
    content: `## Enhance your Tesla Model X\n\nThe Tesla Model X is an all-electric luxury SUV that has been taking the world by storm since its 2015 launch. With sleek lines, cutting-edge technology, and impressive performance, the Model X is a favourite among drivers who prioritize sustainability, safety, and style.\n\n### Features\n\n- Electric powertrain with impressive range.\n- Signature falcon-wing doors.\n- Autopilot capability.\n- Large touchscreen display.\n\n### Why get a vinyl wrap?\n\nA wrap protects your paint, is fully customizable, is more affordable than a respray, and boosts resale value. Ready to talk?`,
  }),
  post({
    slug: "vinyl-wraps-for-tesla-model-3-toronto",
    title: "Upgrade Your Ride: Get a High-Quality Vinyl Wrap for Your Tesla Model 3",
    excerpt:
      "The Tesla Model 3 is a game-changing vehicle. A vinyl wrap enhances its look while protecting the paint underneath.",
    published_at: "2023-02-23",
    content: `## The Tesla Model 3\n\nThe Tesla Model 3 is a game-changing vehicle that brought electric cars to the masses. With its sleek design and advanced technology, it has quickly become a favourite among eco-conscious drivers and enthusiasts alike. But there's always room for improvement — and a vinyl wrap is one of the best ways to enhance the look and feel of your Model 3.\n\n### Benefits of a vinyl wrap\n\n- **Protection** from chips, scratches, and UV.\n- **Customization** with dozens of finishes.\n- **Ease of removal** — fully reversible.\n- **Resale value** — keeps factory paint pristine.\n- **Cost-effective** compared to painting.\n\nChoose a premium wrap at The Tesla Wrap Shop in Toronto.`,
  }),
  post({
    slug: "ultimate-tesla-upgrade-benefits-of-vinyl-wrap",
    title: "The Ultimate Tesla Upgrade: Benefits of a Vinyl Wrap",
    excerpt:
      "Tesla is known for innovation and sleek design. A vinyl wrap is the ultimate upgrade to make yours one of a kind.",
    published_at: "2023-02-22",
    content: `## The ultimate upgrade\n\nTesla is a brand known for innovation, sleek design, and environmental consciousness. As electric cars become more popular, a vinyl wrap has become the ultimate way to make your Tesla one of a kind.\n\n### Key benefits\n\n- **Personalization** — stand out with a unique colour or design.\n- **Paint protection** — shield the factory finish.\n- **Reversibility** — return to original whenever you like.\n- **Value** — a premium look for less than a respray.\n\nReady to upgrade your Tesla? Get in touch for a free quote.`,
  }),
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
