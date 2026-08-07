"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Upload } from "lucide-react";
import { teslaModels } from "@/lib/site";
import { Button } from "./ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="card p-10 text-center flex flex-col items-center gap-4">
        <CheckCircle2 size={56} className="text-brand" />
        <h3 className="font-display text-2xl font-bold">Thank you!</h3>
        <p className="text-muted max-w-md">
          Your request is in. We&apos;ll get back to you shortly with a quote.
          For anything urgent, call us at{" "}
          <span className="text-brand-bright font-semibold">647-559-5939</span>.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl bg-ink/60 border border-line px-4 py-3 text-fg placeholder:text-faint focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors";

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input name="name" required className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            name="email"
            required
            className={inputClass}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone *</label>
          <input
            name="phone"
            required
            className={inputClass}
            placeholder="(647) 000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tesla model *</label>
          <select name="model" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select a model
            </option>
            {teslaModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          What are you looking for?
        </label>
        <textarea
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Colour change, custom design, decals, timeline, questions…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload photos (optional)
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3 cursor-pointer hover:border-brand transition-colors">
          <Upload size={18} className="text-brand" />
          <span className="text-sm text-muted truncate">
            {fileName ?? "JPG, PNG, HEIC, WEBP or PDF"}
          </span>
          <input
            type="file"
            name="photos"
            multiple
            accept=".jpg,.jpeg,.heic,.pdf,.webp,.png"
            className="hidden"
            onChange={(e) =>
              setFileName(
                e.target.files && e.target.files.length > 0
                  ? Array.from(e.target.files)
                      .map((f) => f.name)
                      .join(", ")
                  : null
              )
            }
          />
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          "Get My Free Quote"
        )}
      </Button>
      <p className="text-xs text-faint text-center">
        We&apos;ll never share your info. Typical response within one business
        day.
      </p>
    </form>
  );
}
