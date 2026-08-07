"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

// Rolling 7-day countdown that resets so the offer always feels current.
function useCountdown() {
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null
  );

  useEffect(() => {
    const cycle = 7 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const now = Date.now();
      const remaining = cycle - (now % cycle);
      setTime({
        d: Math.floor(remaining / 86400000),
        h: Math.floor((remaining % 86400000) / 3600000),
        m: Math.floor((remaining % 3600000) / 60000),
        s: Math.floor((remaining % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display font-bold text-lg tabular-nums text-ink">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-ink/70">
        {label}
      </span>
    </div>
  );
}

export function PromoBanner() {
  const time = useCountdown();

  return (
    <div className="bg-brand text-ink">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Zap size={16} className="fill-ink" />
          Limited-time deal — Colour changes from $2,800
        </span>
        {time && (
          <div className="flex items-center gap-3">
            <Unit value={time.d} label="Days" />
            <span className="text-ink/50">:</span>
            <Unit value={time.h} label="Hrs" />
            <span className="text-ink/50">:</span>
            <Unit value={time.m} label="Min" />
            <span className="text-ink/50">:</span>
            <Unit value={time.s} label="Sec" />
          </div>
        )}
        <Link
          href="/#quote"
          className="rounded-full bg-ink text-brand-bright font-semibold px-4 py-1 hover:bg-ink/90 transition-colors"
        >
          Claim Offer
        </Link>
      </div>
    </div>
  );
}
