import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Gallery } from "@/components/sections/Gallery";
import { Materials } from "@/components/sections/Materials";
import { Faq } from "@/components/sections/Faq";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { getGalleryItems } from "@/lib/queries";
import { site } from "@/lib/site";

export default async function HomePage() {
  const gallery = await getGalleryItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: site.name,
    description: site.description,
    telephone: site.phone,
    email: site.email,
    url: site.url,
    areaServed: site.serviceAreas,
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Pricing />
      <Services />
      <WhyUs />
      <Process />
      <Gallery items={gallery} />
      <Materials />
      <Faq />
      <QuoteSection />
    </>
  );
}
