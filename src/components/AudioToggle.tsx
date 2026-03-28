"use client";

import { useState, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { flags, media } from "@/config/wedding";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (typeof document === "undefined") return null;
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(media.audioSrc);
    audio.loop = true;
    audioRef.current = audio;
    return audio;
  }, []);

  const handleToggle = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [getAudio, isPlaying]);

  if (!flags.enableAudio) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="focus-ring fixed z-50 flex h-12 w-12 min-w-[48px] min-h-[48px] items-center justify-center rounded-full border border-[var(--border-soft)] text-white/95 shadow-[0_4px_20px_rgba(92,61,74,0.12)] transition-transform hover:scale-105 active:scale-100 md:h-14 md:w-14"
      style={{
        backgroundColor: "var(--text-primary)",
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        right: "max(1.5rem, env(safe-area-inset-right))",
      }}
      aria-label={isPlaying ? "Silenciar música de fondo" : "Activar música de fondo"}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
      ) : (
        <VolumeX className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
      )}
    </button>
  );
}
