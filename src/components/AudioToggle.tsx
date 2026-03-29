"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { flags, media } from "@/config/wedding";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);

  const getAudio = useCallback(() => {
    if (typeof document === "undefined") return null;
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(media.audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.muted = false;
    audioRef.current = audio;
    return audio;
  }, []);

  const tryPlay = useCallback(async () => {
    const audio = getAudio();
    if (!audio || userPausedRef.current) return false;
    try {
      audio.muted = false;
      await audio.play();
      setIsPlaying(!audio.paused);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [getAudio]);

  useEffect(() => {
    if (!flags.enableAudio) return;

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.removeEventListener("pointerdown", onFirstInteraction);
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("scroll", onFirstInteraction);
      document.removeEventListener("keydown", onFirstInteraction);
    };

    const onFirstInteraction = async () => {
      const ok = await tryPlay();
      if (ok) cleanup();
    };

    // Intento inicial de autoplay.
    tryPlay().then((ok) => {
      if (ok) return;
      // Fallback por políticas de autoplay.
      document.addEventListener("pointerdown", onFirstInteraction, { passive: true });
      document.addEventListener("touchstart", onFirstInteraction, { passive: true });
      document.addEventListener("click", onFirstInteraction, { passive: true });
      document.addEventListener("scroll", onFirstInteraction, { passive: true });
      document.addEventListener("keydown", onFirstInteraction);
    });

    return () => {
      cleanup();
    };
  }, [tryPlay]);

  const handleToggle = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;

    if (isMuted || !isPlaying) {
      userPausedRef.current = false;
      audio.muted = false;
      setIsMuted(false);
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      userPausedRef.current = true;
      audio.pause();
      audio.muted = true;
      setIsMuted(true);
      setIsPlaying(false);
    }
  }, [getAudio, isMuted, isPlaying]);

  if (!flags.enableAudio) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="focus-ring fixed z-50 flex h-12 w-12 min-w-[48px] min-h-[48px] items-center justify-center rounded-full border border-[var(--border-soft)] text-white/95 shadow-[0_4px_20px_rgba(92,61,74,0.12)] transition-transform hover:scale-105 active:scale-100 cursor-pointer md:h-14 md:w-14"
      style={{
        backgroundColor: "var(--text-primary)",
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        right: "max(1.5rem, env(safe-area-inset-right))",
      }}
      aria-label={!isMuted ? "Silenciar música de fondo" : "Activar música de fondo"}
    >
      {!isMuted ? (
        <Volume2 className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
      ) : (
        <VolumeX className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
      )}
    </button>
  );
}
