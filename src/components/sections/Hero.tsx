import Link from "next/link";
import { Phone, Star, ShieldCheck, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { galleryItems } from "@/lib/data";
import { ButtonLink } from "../ui/Button";

const heroImage =
  galleryItems.find((g) => g.id === "g-m3-6")?.image_url ??
  galleryItems[0].image_url;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 45%, transparent), transparent 60%)",
        }}
      />

      <div className="container-x relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-xs font-medium text-muted mb-6">
              <ShieldCheck size={14} className="text-brand" />
              Premium 3M &amp; Avery vinyl · 1-year warranty
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Custom Tesla Wraps
              <br />
              in <span className="text-gradient">Toronto</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              {site.tagline}. Full colour changes, custom printed designs and
              decals — installed by specialists who work on Teslas every day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/#quote" size="lg">
                Get a Free Quote
              </ButtonLink>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2.5 font-semibold text-fg hover:text-brand-bright transition-colors"
              >
                <span className="grid place-items-center h-11 w-11 rounded-full border border-line">
                  <Phone size={18} className="text-brand" />
                </span>
                {site.phone}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <div className="flex text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-brand" />
                  ))}
                </div>
                <span>Trusted by Tesla owners across the GTA</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-brand" />
                {site.serviceAreas.slice(0, 3).join(" · ")} &amp; more
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative rounded-3xl overflow-hidden border border-line glow-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Tesla Model 3 with a full colour-change vinyl wrap"
                className="w-full h-full object-cover aspect-4/3"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-5 card px-5 py-4 backdrop-blur-md bg-panel/90 hidden sm:block">
              <p className="text-2xl font-display font-bold text-brand-bright">
                $3,500
              </p>
              <p className="text-xs text-muted">Full colour change from</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
