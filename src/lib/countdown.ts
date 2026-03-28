export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/**
 * Calcula el tiempo restante hasta una fecha objetivo.
 * Si la fecha ya ha pasado, devuelve ceros y isPast: true.
 */
export function getTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
}

import { weddingDateObj } from "@/config/wedding";

/** Fecha objetivo de la boda (desde config) */
export const COUNTDOWN_TARGET = weddingDateObj;
