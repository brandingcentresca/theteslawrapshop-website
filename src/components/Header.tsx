"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { nav, site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-ink/90 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-x flex items-center justify-between h-18 py-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand text-ink font-display font-bold text-lg">
            T
          </span>
          <span className="font-display font-bold text-base leading-tight">
            The Tesla
            <br />
            <span className="text-brand-bright">Wrap Shop</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-fg hover:text-brand-bright transition-colors"
          >
            <Phone size={16} className="text-brand" />
            {site.phone}
          </a>
          <ButtonLink href="/#quote" size="sm">
            Get a Quote
          </ButtonLink>
        </div>

        <button
          className="lg:hidden text-fg p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-ink/95 backdrop-blur-md">
          <nav className="container-x flex flex-col py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-muted hover:text-fg border-b border-line/50"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-5">
              <a
                href={site.phoneHref}
                className="flex items-center gap-2 font-semibold"
              >
                <Phone size={18} className="text-brand" />
                {site.phone}
              </a>
              <ButtonLink href="/#quote" onClick={() => setOpen(false)}>
                Get a Quote
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
