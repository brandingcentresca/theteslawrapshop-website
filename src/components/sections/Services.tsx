import { services } from "@/lib/site";
import { Section, SectionHeading } from "../ui/Section";
import { Icon } from "../ui/Icon";

export function Services() {
  return (
    <Section id="services" className="bg-panel/30 border-y border-line">
      <SectionHeading
        eyebrow="What We Do"
        title="Wraps built around your Tesla"
        subtitle="From a complete colour transformation to subtle custom accents, we tailor every job to your vision."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="card p-8 hover:border-brand transition-colors group"
          >
            <div className="grid place-items-center h-14 w-14 rounded-2xl bg-brand/10 text-brand mb-6 group-hover:bg-brand group-hover:text-ink transition-colors">
              <Icon name={s.icon} size={26} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">
              {s.title}
            </h3>
            <p className="text-muted leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
