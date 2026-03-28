"use client";

import { VenueSection } from "@/components/sections/VenueSection";
import { convitePlace, conviteMap, conviteTexts } from "@/config/wedding";

export function BanquetSection() {
  return (
    <VenueSection
      sectionId="convite"
      title={conviteTexts.title}
      subtitle={conviteTexts.subtitle}
      venue={convitePlace}
      map={conviteMap}
      texts={{
        openInMaps: conviteTexts.openInMaps,
      }}
      imageSrc="/wedding_celebration.jpg"
      imageAlt="Lugar del convite"
    />
  );
}
