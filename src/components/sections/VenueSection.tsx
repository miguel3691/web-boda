"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";

export type VenueSectionProps = {
  sectionId: string;
  title: string;
  subtitle: string;
  venue: { name: string; city: string; schedule: string; fullAddress: string };
  map: { openUrl: string };
  texts: { openInMaps: string };
  imageSrc: string;
  imageAlt: string;
};

export function VenueSection({
  sectionId,
  title,
  subtitle,
  venue,
  map,
  texts,
  imageSrc,
  imageAlt,
}: VenueSectionProps) {
  return (
    <section id={sectionId} className="section-padding">
      <div className="section-content">
        <h2
          className="section-title-script"
          style={{ fontFamily: "var(--font-script)" }}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)] font-sans">
          {subtitle}
        </p>

        <div className="location-card mt-8 sm:mt-10 md:mt-12 mx-auto max-w-3xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="flex flex-col items-center px-4 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8">
            <h3
              className="text-xl md:text-2xl text-[var(--text-primary)] text-center font-serif max-w-xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {venue.name}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{venue.city}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Clock className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
              <span>{venue.schedule}</span>
            </div>
            <a
              href={map.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--border-soft)] bg-[var(--background-card)] px-5 py-2.5 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-rose)]/10"
            >
              <MapPin className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              {texts.openInMaps}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
