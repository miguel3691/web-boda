"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining, COUNTDOWN_TARGET } from "@/lib/countdown";

type TimeUnitKey = "days" | "hours" | "minutes" | "seconds";

const UNITS: { key: TimeUnitKey; label: string }[] = [
  { key: "days", label: "DIAS" },
  { key: "hours", label: "HORAS" },
  { key: "minutes", label: "MINUTOS" },
  { key: "seconds", label: "SEGUNDOS" },
];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function CountdownSection() {
  const [time, setTime] = useState(() => getTimeRemaining(COUNTDOWN_TARGET));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(COUNTDOWN_TARGET));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const values: Record<TimeUnitKey, number> = {
    days: time.days,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
  };

  return (
    <section id="countdown" className="section-padding">
      <div className="section-content">
        <p className="section-kicker tracking-[0.25em]">Cuenta atrás</p>
        <h2 className="section-title-script mt-2" style={{ fontFamily: "var(--font-script)" }}>
          Para el gran día
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:mt-10 md:grid-cols-4 md:gap-5 md:mt-12">
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              className="countdown-box flex flex-col items-center justify-center px-3 py-5 sm:px-4 sm:py-6 md:py-8"
            >
              <span
                className="font-serif text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tabular-nums min-h-[2.25rem] flex items-center justify-center"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {pad(values[key] ?? 0)}
              </span>
              <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[var(--text-muted)] font-sans">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
