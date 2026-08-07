"use client";

import { useState, useMemo } from "react";
import { SectionHeading } from "../ui/Section";
import type { GalleryItem, TeslaModel } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: (TeslaModel | "All")[] = [
  "All",
  "Model 3",
  "Model Y",
  "Model S",
  "Model X",
];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.model === filter)),
    [filter, items]
  );

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 scroll-mt-24 bg-panel-2/70 border-y border-line"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Our Work"
          title="Recent Tesla transformations"
          subtitle="A look at colour changes, custom prints and decals we've installed across the GTA."
        />

        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium border transition-colors",
                filter === f
                  ? "bg-brand text-ink border-brand"
                  : "border-line text-muted hover:text-fg hover:border-fg/30"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted">No items yet for {filter}.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <figure
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-line aspect-4/3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <span className="text-xs font-semibold text-brand-bright">
                    {item.model}
                  </span>
                  <p className="text-sm font-medium">{item.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
