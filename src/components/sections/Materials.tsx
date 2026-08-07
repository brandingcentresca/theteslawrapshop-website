import { materials } from "@/lib/site";
import { Section, SectionHeading } from "../ui/Section";

export function Materials() {
  return (
    <Section id="materials">
      <SectionHeading
        eyebrow="Premium Materials"
        title="Only the best vinyl touches your Tesla"
        subtitle="We work exclusively with the industry's most trusted wrap films for durability, colour and finish."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {materials.map((m) => (
          <div key={m.name} className="card p-8">
            <div className="h-12 flex items-center mb-5">
              <span className="font-display text-2xl font-bold tracking-tight">
                {m.name}
              </span>
            </div>
            <p className="text-muted leading-relaxed">{m.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
