import type { Metadata } from "next";
import {
  Great_Vibes,
  Cormorant_Garamond,
  Lato,
} from "next/font/google";
import "./globals.css";
import { AudioToggle } from "@/components/AudioToggle";
import { DecorativeSideImages } from "@/components/DecorativeSideImages";

const fontScript = Great_Vibes({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const fontSerif = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
});

const fontSans = Lato({
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Save the date",
  description: "Invitación a nuestra boda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${fontScript.variable} ${fontSerif.variable} ${fontSans.variable} font-sans antialiased`}
      >
        <DecorativeSideImages />
        <div className="relative z-10 min-h-screen ml-[88px] mr-[88px] sm:ml-[180px] sm:mr-[180px] md:ml-[260px] md:mr-[260px] lg:ml-[300px] lg:mr-[300px]">
          {children}
        </div>
        <AudioToggle />
      </body>
    </html>
  );
}
