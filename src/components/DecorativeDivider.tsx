"use client";

import { Heart } from "lucide-react";

export function DecorativeDivider() {
  return (
    <div
      className="flex items-center justify-center gap-4 py-8 md:py-10 px-4"
      aria-hidden
    >
      <span
        className="h-px flex-1 max-w-[80px] md:max-w-[120px]"
        style={{
          background: `linear-gradient(to right, transparent, var(--border-soft))`,
        }}
      />
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--accent-rose)]"
        style={{
          border: "1px solid var(--border-soft)",
          backgroundColor: "rgba(201, 169, 166, 0.12)",
        }}
      >
        <Heart className="h-3.5 w-3.5" strokeWidth={1.8} fill="currentColor" />
      </span>
      <span
        className="h-px flex-1 max-w-[80px] md:max-w-[120px]"
        style={{
          background: `linear-gradient(to left, transparent, var(--border-soft))`,
        }}
      />
    </div>
  );
}
