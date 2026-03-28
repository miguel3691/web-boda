"use client";

import { VenueSection } from "@/components/sections/VenueSection";
import { place, map, locationTexts } from "@/config/wedding";

export function LocationSection() {
  return (
    <VenueSection
      sectionId="location"
      title={locationTexts.title}
      subtitle={locationTexts.subtitle}
      venue={place}
      map={map}
      texts={{
        openInMaps: locationTexts.openInMaps,
      }}
      imageSrc="/wedding_venue.jpg"
      imageAlt="Lugar de la ceremonia"
    />
  );
}
