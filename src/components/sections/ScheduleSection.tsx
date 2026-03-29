"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Heart,
  Wine,
  UtensilsCrossed,
  Music2,
  Music,
  Sparkles,
} from "lucide-react";
import { scheduleEvents, type ScheduleEventIconKey } from "@/config/wedding";

const SCHEDULE_ICON_MAP: Record<ScheduleEventIconKey, typeof MapPin> = {
  mapPin: MapPin,
  heart: Heart,
  wine: Wine,
  utensilsCrossed: UtensilsCrossed,
  music2: Music2,
  music: Music,
  sparkles: Sparkles,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function ScheduleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });

  return (
    <section id="schedule" className="section-padding">
      <div ref={ref} className="section-content">
        <h2
          className="section-title-script mt-2"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Timeline
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)] font-sans">
          Nuestra celebración paso a paso
        </p>

        {/* Desktop: timeline horizontal */}
        <motion.div
          className="mt-12 hidden md:block"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="relative">
            {/* Línea horizontal central (alineada con centro del icono) */}
            <div
              className="absolute left-0 right-0 top-[58px] h-px w-full"
              style={{ backgroundColor: "var(--border-soft)" }}
              aria-hidden
            />
            <ul className="relative flex justify-between gap-2">
              {scheduleEvents.map(({ time, title, description, icon }) => {
                const Icon = SCHEDULE_ICON_MAP[icon];
                return (
                <motion.li
                  key={time}
                  variants={itemVariants}
                  className="schedule-timeline-item flex flex-1 flex-col items-center text-center"
                >
                  <span
                    className="schedule-time-capsule rounded-full px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: "var(--accent-rose)" }}
                  >
                    {time}
                  </span>
                  <span
                    className="schedule-icon-ring mt-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--background-card)] text-[var(--text-primary)]"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                    {title}
                  </span>
                  <span className="mt-0.5 max-w-[90px] text-xs leading-snug text-[var(--text-muted)]">
                    {description}
                  </span>
                </motion.li>
              );
              })}
            </ul>
          </div>
        </motion.div>

        {/* Móvil: lista vertical */}
        <motion.ul
          className="mt-8 sm:mt-10 flex flex-col gap-0 md:hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {scheduleEvents.map(({ time, title, description, icon }) => {
            const Icon = SCHEDULE_ICON_MAP[icon];
            return (
            <motion.li
              key={time}
              variants={itemVariants}
              className="schedule-mobile-item flex items-start gap-3 sm:gap-4 py-4 sm:py-5 border-b border-[var(--border-soft)] last:border-b-0 min-h-[56px]"
            >
              <span
                className="schedule-time-capsule shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--accent-rose)" }}
              >
                {time}
              </span>
              <span
                className="schedule-icon-ring mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--background-card)] text-[var(--text-primary)]"
                aria-hidden
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  {title}
                </span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                  {description}
                </span>
              </div>
            </motion.li>
          );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
