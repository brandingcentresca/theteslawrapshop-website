import { Check } from "lucide-react";
import { pricing } from "@/lib/site";
import { Section, SectionHeading } from "../ui/Section";
import { ButtonLink } from "../ui/Button";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <Section id="pricing" className="bg-panel-2/70 border-y border-line">
      <SectionHeading
        eyebrow="Transparent Pricing"
        title="Simple, upfront wrap packages"
        subtitle="No surprises. Pick the finish you want — every package uses premium 3M and Avery Dennison vinyl."
      />

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {pricing.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "card p-8 flex flex-col relative",
              tier.popular && "border-brand glow-brand"
            )}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand text-ink text-xs font-bold px-3 py-1">
                Most Popular
              </span>
            )}
            <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
            <p className="mt-2 text-sm text-muted min-h-10">
              {tier.description}
            </p>
            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-4xl font-bold">
                ${tier.price.toLocaleString()}
              </span>
              <span className="text-faint line-through mb-1.5">
                ${tier.original.toLocaleString()}
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-muted flex-1">
              {[
                "Premium 3M / Avery vinyl",
                "Professional installation",
                "Secure, insured storage",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check size={16} className="text-brand shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/#quote"
              variant={tier.popular ? "primary" : "outline"}
              className="mt-8 w-full"
            >
              Claim This Deal
            </ButtonLink>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-faint mt-8">
        Prices vary with design and complexity. Wraps range from $650 to $5,000+.
        Contact us for an exact quote.
      </p>
    </Section>
  );
}
