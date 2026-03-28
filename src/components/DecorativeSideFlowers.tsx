"use client";

/**
 * Capa decorativa: placeholders en izquierda (arriba/abajo) y derecha (arriba/centro/abajo).
 * Se renderiza una sola vez en la página. Elementos sutiles y semitransparentes.
 */

const positions = [
  { id: "left-top", side: "left", area: "top" },
  { id: "left-bottom", side: "left", area: "bottom" },
  { id: "right-top", side: "right", area: "top" },
  { id: "right-center", side: "right", area: "center" },
  { id: "right-bottom", side: "right", area: "bottom" },
] as const;

const areaClasses: Record<string, string> = {
  top: "top-8 md:top-16",
  center: "top-1/2 -translate-y-1/2",
  bottom: "bottom-8 md:bottom-16",
};

export function DecorativeSideFlowers() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {positions.map(({ id, side, area }) => (
        <div
          key={id}
          className={`absolute ${side === "left" ? "left-0" : "right-0"} ${areaClasses[area]} w-14 opacity-20 sm:w-20 sm:opacity-25 md:w-24 md:opacity-30 lg:w-28`}
        >
          {/* Placeholder: div decorativo (sustituir por /public/decor/ cuando existan assets) */}
          <div
            className="aspect-square rounded-full border border-[var(--border-soft)] bg-[var(--accent-rose)]/20"
            style={{
              background: "radial-gradient(circle, var(--accent-rose) 0%, transparent 70%)",
              opacity: 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
}
