"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DM_Serif_Display } from "next/font/google";
import { couple, hero, flags } from "@/config/wedding";

const fontHeroSerifEditorial = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
});

const easeElegant = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.22,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.88,
      ease: easeElegant,
    },
  },
};

const itemVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
};

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const noAnimation = !flags.enableAnimations || reduceMotion;
  const variants = noAnimation ? itemVariantsReduced : itemVariants;

  const scrollToCountdown = () => {
    document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
  };

  /* Contenedor único: flex column, centrado estricto. Sin max-width ni padding que rompan el eje. */
  const heroBlockClass =
    "flex flex-col items-center justify-center text-center w-max";

  /* Eje central de la página pasa entre el 2 y el 0: "JUNIO | " + "20" + " | SÁBADO" */
  const dateLineParts = hero.dateLine.split(" | ");
  const dateLeft = dateLineParts[0] ? `${dateLineParts[0]} | ` : "";
  const dateCenter = dateLineParts[1] ?? "20";
  const dateRight = dateLineParts[2] ? ` | ${dateLineParts[2]}` : "";

  const dateLineClass =
    "font-serif text-lg sm:text-xl md:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--text-primary)]";

  if (noAnimation) {
    return (
      <section
        id="hero"
        className="hero-paper-texture relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pt-24 sm:pb-32 md:pt-28 md:pb-36"
      >
        <div className={heroBlockClass}>
          <p
            className={`${fontHeroSerifEditorial.className} block w-max mx-auto text-[var(--text-primary)] text-2xl sm:text-3xl md:text-4xl mb-1`}
          >
            {hero.saveTheDate}
          </p>
          <h1
            className="flex flex-col items-center gap-2 sm:gap-2.5 text-[var(--text-primary)] mt-4 sm:mt-5 md:mt-6 leading-[1.02] text-5xl sm:text-6xl md:text-7xl lg:text-8xl w-max mx-auto"
            style={{ fontFamily: "var(--font-script)" }}
            aria-label={`${couple.name1} y ${couple.name2}`}
          >
            <span className="block w-max mx-auto">{couple.name1}</span>
            <span className="block w-max mx-auto my-0.5 sm:my-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">&</span>
            <span className="block w-max mx-auto">{couple.name2}</span>
          </h1>
          <p
            className={`${fontHeroSerifEditorial.className} block w-max mx-auto text-[var(--text-primary)] text-2xl sm:text-3xl md:text-4xl mt-5 sm:mt-6 md:mt-8`}
          >
            {hero.weAreGettingMarried}
          </p>
          <div className="flex flex-col items-center w-full mt-10 sm:mt-12 md:mt-14">
            <div className="flex flex-col items-center text-center sm:hidden">
              <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)]">
                {dateLineParts[0] ?? "JUNIO"}
              </p>
              <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)] leading-tight">
                | {dateCenter} |
              </p>
              <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)]">
                {dateLineParts[2] ?? "SÁBADO"}
              </p>
            </div>
            <div
              className={`hidden sm:grid grid-cols-[1fr_auto_1fr] w-full items-center gap-0 ${dateLineClass}`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <span className="text-right pr-0.5">{dateLeft}</span>
              <span className="text-center tabular-nums">{dateCenter}</span>
              <span className="text-left pl-0.5">{dateRight}</span>
            </div>
            <p className="block w-max mx-auto font-serif text-base sm:text-lg md:text-xl uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--text-primary)] mt-1.5">
              {hero.year}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={scrollToCountdown}
          className="focus-ring absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          aria-label={hero.ctaAriaLabel}
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-light">
            {hero.ctaLabel}
          </span>
          <span className="text-[var(--text-muted)] animate-bounce-subtle" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="hero-paper-texture relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pt-24 sm:pb-32 md:pt-28 md:pb-36"
    >
      <motion.div
        className={heroBlockClass}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={variants}
          className={`${fontHeroSerifEditorial.className} block w-max mx-auto text-[var(--text-primary)] text-2xl sm:text-3xl md:text-4xl mb-1`}
        >
          {hero.saveTheDate}
        </motion.p>

        <motion.p
          variants={variants}
          className="block w-max mx-auto text-[var(--text-primary)] mt-4 sm:mt-5 md:mt-6 leading-[1.02] text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-script)" }}
        >
          {couple.name1}
        </motion.p>
        <motion.p
          variants={variants}
          className="block w-max mx-auto my-0.5 sm:my-1 text-[var(--text-primary)] leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-script)" }}
          aria-hidden
        >
          &
        </motion.p>
        <motion.h1
          variants={variants}
          className="block w-max mx-auto text-[var(--text-primary)] leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-script)" }}
          aria-label={`${couple.name1} y ${couple.name2}`}
        >
          {couple.name2}
        </motion.h1>

        <motion.p
          variants={variants}
          className={`${fontHeroSerifEditorial.className} block w-max mx-auto text-[var(--text-primary)] text-2xl sm:text-3xl md:text-4xl mt-5 sm:mt-6 md:mt-8`}
        >
          {hero.weAreGettingMarried}
        </motion.p>

        <motion.div variants={variants} className="flex flex-col items-center w-full mt-10 sm:mt-12 md:mt-14">
          <div className="flex flex-col items-center text-center sm:hidden">
            <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)]">
              {dateLineParts[0] ?? "JUNIO"}
            </p>
            <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)] leading-tight">
              | {dateCenter} |
            </p>
            <p className="font-serif text-lg uppercase tracking-[0.2em] text-[var(--text-primary)]">
              {dateLineParts[2] ?? "SÁBADO"}
            </p>
          </div>
          <div
            className={`hidden sm:grid grid-cols-[1fr_auto_1fr] w-full items-center gap-0 ${dateLineClass}`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <span className="text-right pr-0.5">{dateLeft}</span>
            <span className="text-center tabular-nums">{dateCenter}</span>
            <span className="text-left pl-0.5">{dateRight}</span>
          </div>
        </motion.div>
        <motion.p
          variants={variants}
          className="block w-max mx-auto font-serif text-base sm:text-lg md:text-xl uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--text-primary)] mt-1.5"
        >
          {hero.year}
        </motion.p>
      </motion.div>

      <button
        type="button"
        onClick={scrollToCountdown}
        className="focus-ring absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        aria-label={hero.ctaAriaLabel}
      >
        <motion.span
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.25, duration: 0.75, ease: easeElegant }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-light"
        >
          {hero.ctaLabel}
        </motion.span>
        <span className="text-[var(--text-muted)] animate-bounce-subtle" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </span>
      </button>
    </section>
  );
}
