import Link from "next/link";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Images,
  ExternalLink,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/quotes", label: "Quote requests", icon: Inbox },
  { href: "/admin/blog", label: "Blog posts", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
];

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="container-x py-10">
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 h-max">
          <nav className="card p-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:text-fg hover:bg-panel-2 transition-colors"
              >
                <l.icon size={17} />
                {l.label}
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:text-fg hover:bg-panel-2 transition-colors"
            >
              <ExternalLink size={17} />
              View site
            </a>
            <div className="pt-2 mt-2 border-t border-line">
              <LogoutButton />
            </div>
          </nav>
        </aside>
        <main>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}
