"use client";

import { useState, useCallback, useRef } from "react";
import { flags, media } from "@/config/wedding";

export function IntroVideoOverlay() {
  const [isVisible, setIsVisible] = useState(flags.enableIntroVideo);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hideOverlay = useCallback(() => {
    setIsFadingOut(true);
    const t = setTimeout(() => {
      setIsVisible(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleEnded = useCallback(() => {
    hideOverlay();
  }, [hideOverlay]);

  const handleError = useCallback(() => {
    hideOverlay();
  }, [hideOverlay]);

  const handleCanPlay = useCallback(() => {
    videoRef.current?.play().catch(() => {
      hideOverlay();
    });
  }, [hideOverlay]);

  if (!flags.enableIntroVideo || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)] transition-opacity duration-500 ease-out"
      style={{
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
      aria-hidden={isFadingOut}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src={media.introVideoSrc}
          className="h-full w-full object-cover"
          muted
          playsInline
          onEnded={handleEnded}
          onError={handleError}
          onCanPlayThrough={handleCanPlay}
        />
      </div>
    </div>
  );
}
