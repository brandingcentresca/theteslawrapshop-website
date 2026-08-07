import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Best Tesla Wraps in Toronto | The Tesla Wrap Shop",
    template: "%s | The Tesla Wrap Shop",
  },
  description: site.description,
  keywords: [
    "Tesla wrap Toronto",
    "Tesla vinyl wrap",
    "Tesla colour change",
    "Model 3 wrap",
    "Model Y wrap",
    "car wrap GTA",
  ],
  openGraph: {
    title: "Best Tesla Wraps in Toronto | The Tesla Wrap Shop",
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_CA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080b10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <PromoBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
