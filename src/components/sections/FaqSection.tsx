"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Car, Bus, Undo2, Footprints } from "lucide-react";

const FAQ_ITEMS = [
  {
    icon: Car,
    question: "¿Habrá aparcamiento cerca de la iglesia?",
    answer:
      "¡Sí! Podréis aparcar en el aparcamiento público de la plaza de la Iglesia, con entrada por la calle Juan Torrico Lomeña. También hay plazas disponibles en las calles cercanas, así que no tendréis problema para llegar tranquilamente.",
  },
  {
    icon: Bus,
    question: "¿Cómo llegar desde la iglesia al banquete?",
    answer:
      "Hemos preparado un autobús privado para llevaros hasta el lugar del banquete. Saldrá a las 13:15 desde la Avenida de Cervantes, 16 —apenas dos minutos a pie desde la iglesia—. Solo tenéis que seguir a la gente guapa.",
  },
  {
    icon: Undo2,
    question: "¿Y de vuelta? ¿Hay autobús?",
    answer:
      "Por supuesto. Habrá autobús de regreso a las 20:00 para quienes lo necesiten, y otro más al final de la fiesta, para los que quieran exprimir cada momento hasta el último baile.",
  },
  {
    icon: Footprints,
    question: "¿Algún consejo para la pista de baile?",
    answer:
      "Si pensáis darlo todo en la pista —y esperamos que así sea— os recomendamos traer un calzado más cómodo para la noche. Los tacones y los zapatos de vestir son perfectos para la ceremonia y la cena, pero cuando llegue el momento de bailar, los pies os lo agradecerán.",
  },
] as const;

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const isInView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section id="faq" className="section-padding pt-2 sm:pt-4">
      <div ref={ref} className="section-content">
        <p className="section-title-script" style={{ fontFamily: "var(--font-script)" }}>
          Antes del gran día
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
          Queremos que ese día lo único en lo que tengáis que pensar sea en disfrutar. Por eso, hemos
          reunido aquí las respuestas a las dudas más habituales para que todo fluya sin preocupaciones.
          Pulsad en cada pregunta y descubriréis la respuesta al instante.
        </p>

        <motion.div
          className="mx-auto mt-10 sm:mt-12 max-w-4xl space-y-5 sm:space-y-6 text-left"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={item.question}
              variants={itemVariants}
              style={{ perspective: "1400px" }}
            >
              <button
                type="button"
                onClick={() => toggleCard(index)}
                className="focus-ring relative block w-full rounded-lg text-left"
                aria-pressed={Boolean(flippedCards[index])}
                aria-label={`Mostrar ${flippedCards[index] ? "pregunta" : "respuesta"}: ${item.question}`}
              >
                <div
                  className="relative min-h-[420px] sm:min-h-[360px] md:min-h-[320px] transition-transform duration-[1400ms] [transform-style:preserve-3d]"
                  style={{
                    transform: flippedCards[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  <div className="absolute inset-0 rounded-lg border border-[var(--border-soft)]/70 bg-[var(--background-card)] px-4 py-5 sm:px-5 sm:py-6 [backface-visibility:hidden]">
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: "rgba(205, 191, 230, 0.4)",
                          color: "var(--text-primary)",
                        }}
                        aria-hidden
                      >
                        <item.icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-lg border border-[var(--border-soft)]/70 bg-[var(--background-card)] px-4 py-5 sm:px-5 sm:py-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-full flex-col justify-center overflow-y-auto pr-1">
                      <p className="text-[15px] sm:text-base leading-relaxed text-[var(--text-muted)] text-center sm:text-left">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
