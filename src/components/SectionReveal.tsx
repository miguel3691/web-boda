"use client";

import { motion, useReducedMotion } from "framer-motion";
import { flags } from "@/config/wedding";

const defaultTransition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Desplazamiento inicial en px (por defecto 20) */
  y?: number;
  /** Retraso en segundos antes de iniciar la animación */
  delay?: number;
}

export function SectionReveal({
  children,
  className = "",
  y = 20,
  delay = 0,
}: SectionRevealProps) {
  const reduceMotion = useReducedMotion();
  const noAnimation = !flags.enableAnimations || reduceMotion;

  if (noAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px -40px 0px" }}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
