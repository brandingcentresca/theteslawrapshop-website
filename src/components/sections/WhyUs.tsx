import { whyUs } from "@/lib/site";
import { Section, SectionHeading } from "../ui/Section";
import { Icon } from "../ui/Icon";

export function WhyUs() {
  return (
    <Section id="why-us" className="bg-panel-2/70 border-y border-line">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Details that make the difference"
        subtitle="We only wrap Teslas — so we know every panel, curve and edge. Here's what you get with every job."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((item) => (
          <div key={item.title} className="card p-7">
            <Icon name={item.icon} size={28} className="text-brand mb-5" />
            <h3 className="font-display text-lg font-semibold mb-2.5">
              {item.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
