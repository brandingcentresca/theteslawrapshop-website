import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-panel/40 mt-auto">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand text-ink font-display font-bold text-lg">
                T
              </span>
              <span className="font-display font-bold text-lg">
                The Tesla <span className="text-brand-bright">Wrap Shop</span>
              </span>
            </Link>
            <p className="text-muted max-w-sm leading-relaxed">
              Premium 3M &amp; Avery vinyl wraps for every Tesla model. Full
              colour changes, custom prints and decals in Toronto and across the
              GTA.
            </p>
            <p className="mt-5 text-sm text-faint">
              Serving {site.serviceAreas.join(" · ")}
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-muted">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-bright transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-brand-bright transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Get in touch</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 hover:text-brand-bright transition-colors"
                >
                  <Phone size={16} className="text-brand shrink-0" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="flex items-center gap-2.5 hover:text-brand-bright transition-colors break-all"
                >
                  <Mail size={16} className="text-brand shrink-0" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-brand-bright transition-colors"
                >
                  <MessageCircle size={16} className="text-brand shrink-0" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={site.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-brand-bright transition-colors"
                >
                  <MapPin size={16} className="text-brand shrink-0" />
                  Get directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-faint">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <a
            href={site.credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-bright transition-colors"
          >
            {site.credit.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
