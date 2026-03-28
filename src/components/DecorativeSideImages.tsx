"use client";

/**
 * Decoraciones laterales continuas con eucalipto.
 * Imágenes en public/: eucalyptus_left.png, eucalyptus_right.png
 */

const LEFT_IMAGE = "/eucalyptus_left.png";
const RIGHT_IMAGE = "/eucalyptus_right.png";
const OPACITY = 0.6;

export function DecorativeSideImages() {
  const mobileBgStyle = (url: string, side: "left" | "right") => ({
    backgroundImage: `url("${url}")`,
    backgroundRepeat: "repeat-y" as const,
    backgroundPosition: `${side} top`,
    backgroundSize: "100% auto",
    opacity: OPACITY,
  });

  return (
    <>
      {/* Mobile: repetición vertical para continuidad en todo el lateral */}
      <div
        className="fixed left-0 top-0 z-0 h-screen w-[88px] pointer-events-none sm:hidden"
        aria-hidden
        style={mobileBgStyle(LEFT_IMAGE, "left")}
      />
      <div
        className="fixed right-0 top-0 z-0 h-screen w-[88px] pointer-events-none sm:hidden"
        aria-hidden
        style={mobileBgStyle(RIGHT_IMAGE, "right")}
      />

      {/* Desktop/tablet: imagen única anclada al borde */}
      <div
        className="fixed left-0 top-0 z-0 hidden h-screen w-[180px] pointer-events-none items-start justify-start overflow-hidden sm:flex md:w-[260px] lg:w-[300px]"
        aria-hidden
        style={{ opacity: OPACITY }}
      >
        <img
          src={LEFT_IMAGE}
          alt=""
          className="h-full w-auto object-contain object-left-top select-none"
          draggable={false}
        />
      </div>
      <div
        className="fixed right-0 top-0 z-0 hidden h-screen w-[180px] pointer-events-none items-start justify-end overflow-hidden sm:flex md:w-[260px] lg:w-[300px]"
        aria-hidden
        style={{ opacity: OPACITY }}
      >
        <img
          src={RIGHT_IMAGE}
          alt=""
          className="h-full w-auto object-contain object-right-top select-none"
          draggable={false}
        />
      </div>
    </>
  );
}
