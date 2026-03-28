"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FAQ_ITEMS = [
  {
    question: "¿Habrá aparcamiento cerca del lugar de la ceremonia?",
    answer:
      "Sí, existe un aparcamiento público en la plaza de la Iglesia. Entrada por la calle Juan Torrico Lomeña. Además, puede haber aparcamiento en las calles cercanas.",
  },
  {
    question: "¿Cómo ir desde la Iglesia al lugar del banquete?",
    answer:
      "Un autobús privado nos llevará desde la Iglesia al lugar del banquete. El autobús saldrá a las 13:15 desde la Avenida de Cervantes, 16 (dos minutos andando desde la Iglesia).",
  },
  {
    question: "¿Hay alguna recomendación de vestimenta?",
    answer:
      "Nos encantará veros elegantes y cómodos para disfrutar juntos de un día muy especial.",
  },
] as const;

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section id="faq" className="section-padding pt-2 sm:pt-4">
      <div ref={ref} className="section-content">
        <h2
          className="section-title-script"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Dudas frecuentes
        </h2>

        <motion.div
          className="mx-auto mt-8 sm:mt-10 max-w-2xl space-y-8 sm:space-y-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {FAQ_ITEMS.map((item) => (
            <motion.div key={item.question} variants={itemVariants} className="px-2 sm:px-4">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {item.question}
              </h3>
              <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
