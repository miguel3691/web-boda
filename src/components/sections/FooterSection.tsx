import { Heart } from "lucide-react";
import { coupleDisplayName, footerTexts } from "@/config/wedding";

export function FooterSection() {
  return (
    <footer
      id="footer"
      className="footer-block relative w-full overflow-hidden py-14 sm:py-16 md:py-20"
      style={{ backgroundColor: "var(--footer-bg)" }}
    >
      {/* Decoración lateral derecha (placeholder floral sutil) */}
      <div
        className="footer-decoration footer-decoration-right absolute right-0 top-1/2 h-[180px] w-[120px] -translate-y-1/2 opacity-20 md:h-[220px] md:w-[160px]"
        aria-hidden
      />
      {/* Decoración lateral izquierda (simétrica) */}
      <div
        className="footer-decoration footer-decoration-left absolute left-0 top-1/2 h-[180px] w-[120px] -translate-y-1/2 opacity-20 md:h-[220px] md:w-[160px]"
        aria-hidden
      />

      <div className="section-content relative z-10 flex flex-col items-center justify-center text-center">
        {/* Icono decorativo */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--footer-text-muted)] text-[var(--footer-text)] md:h-14 md:w-14"
          aria-hidden
        >
          <Heart
            className="h-5 w-5 md:h-6 md:w-6"
            strokeWidth={1.5}
            fill="currentColor"
          />
        </div>

        {/* Nombres en script */}
        <p
          className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl text-[var(--footer-text)]"
          style={{ fontFamily: "var(--font-script)" }}
        >
          {coupleDisplayName}
        </p>

        {/* Fecha */}
        <p
          className="mt-2 sm:mt-3 text-xs sm:text-sm tracking-wide text-[var(--footer-text-muted)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {footerTexts.date}
        </p>

        {/* Cierre */}
        <p
          className="mt-3 sm:mt-4 text-[10px] sm:text-xs tracking-[0.15em] text-[var(--footer-text-muted)] uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {footerTexts.closing}
        </p>
      </div>
    </footer>
  );
}
