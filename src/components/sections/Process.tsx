import { process } from "@/lib/site";
import { Section, SectionHeading } from "../ui/Section";

export function Process() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow="Our Process"
        title="From idea to installed in four steps"
        subtitle="A clear, collaborative process so you know exactly what to expect at every stage."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {process.map((step) => (
          <div key={step.step} className="relative card p-7">
            <span className="font-display text-5xl font-bold text-brand/25 leading-none">
              {String(step.step).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-semibold mt-4 mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
