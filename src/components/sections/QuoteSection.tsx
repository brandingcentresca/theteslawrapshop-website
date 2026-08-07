import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { QuoteForm } from "../QuoteForm";

export function QuoteSection() {
  return (
    <section id="quote" className="py-20 md:py-28 scroll-mt-24">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-block text-brand-bright font-semibold tracking-[0.2em] text-xs uppercase mb-4">
              Get an Estimate
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Ready to wrap
              <br />
              your Tesla?
            </h2>
            <p className="mt-5 text-muted text-lg leading-relaxed max-w-md">
              Tell us about your car and what you have in mind. Send a few photos
              and we&apos;ll come back with a tailored quote — usually within one
              business day.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={site.phoneHref}
                className="flex items-center gap-4 group"
              >
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-ink transition-colors">
                  <Phone size={20} />
                </span>
                <span>
                  <span className="block text-xs text-faint">Call us</span>
                  <span className="font-semibold group-hover:text-brand-bright transition-colors">
                    {site.phone}
                  </span>
                </span>
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-ink transition-colors">
                  <MessageCircle size={20} />
                </span>
                <span>
                  <span className="block text-xs text-faint">WhatsApp</span>
                  <span className="font-semibold group-hover:text-brand-bright transition-colors">
                    Message us for a quote
                  </span>
                </span>
              </a>
              <a
                href={site.emailHref}
                className="flex items-center gap-4 group"
              >
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-ink transition-colors">
                  <Mail size={20} />
                </span>
                <span>
                  <span className="block text-xs text-faint">Email</span>
                  <span className="font-semibold group-hover:text-brand-bright transition-colors break-all">
                    {site.email}
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-4">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand/10 text-brand">
                  <Clock size={20} />
                </span>
                <span>
                  <span className="block text-xs text-faint">Response time</span>
                  <span className="font-semibold">Within 1 business day</span>
                </span>
              </div>
            </div>
          </div>

          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
