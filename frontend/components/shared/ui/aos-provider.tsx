"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * AosProvider -- initializes AOS (Animate On Scroll), the project's standard
 * scroll-entrance animation engine. Mount once near the root of the app.
 *
 * AOS scans the DOM for `data-aos="..."` attributes and animates those
 * elements as they enter the viewport. The animation components in
 * `components/ui/motion.tsx` and `components/sections/scroll-reveal.tsx`
 * render those attributes, so consumers use those wrappers rather than
 * touching AOS directly.
 *
 * Respects `prefers-reduced-motion`: AOS is disabled when the user asks for
 * reduced motion, so elements render in their final (visible) state.
 */
export function AosProvider() {
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      offset: 40,
      disable: reduce,
    });
  }, []);

  return null;
}
