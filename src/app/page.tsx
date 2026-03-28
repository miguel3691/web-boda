import { HeroSection } from "@/components/sections/HeroSection";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { BanquetSection } from "@/components/sections/BanquetSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { RSVPSection } from "@/components/sections/RSVPSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { DecorativeSideFlowers } from "@/components/DecorativeSideFlowers";
import { IntroVideoOverlay } from "@/components/IntroVideoOverlay";
import { SectionReveal } from "@/components/SectionReveal";
import { DecorativeDivider } from "@/components/DecorativeDivider";

export default function Home() {
  return (
    <>
      <IntroVideoOverlay />
      <DecorativeSideFlowers />
      <main className="relative z-10 min-h-screen">
        <HeroSection />
        <DecorativeDivider />
        <SectionReveal>
          <CountdownSection />
        </SectionReveal>
        <DecorativeDivider />
        <SectionReveal>
          <LocationSection />
        </SectionReveal>
        <DecorativeDivider />
        <SectionReveal>
          <BanquetSection />
        </SectionReveal>
        <DecorativeDivider />
        <SectionReveal>
          <ScheduleSection />
        </SectionReveal>
        <DecorativeDivider />
        <SectionReveal>
          <FaqSection />
        </SectionReveal>
        <DecorativeDivider />
        <SectionReveal>
          <RSVPSection />
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <FooterSection />
        </SectionReveal>
      </main>
    </>
  );
}
