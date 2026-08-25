"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Parent-owned blank-page guard (see aos-safety.css). Co-located so it syncs
// with this component as one unit; must NOT live in fork-owned globals.css.
import "./aos-safety.css";

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

    // Reduced motion: skip AOS entirely. Content stays visible via the
    // `html:not(.aos-ready)` safety net in globals.css -- no animation, and no
    // risk of content being stuck at opacity:0.
    if (reduce) return;

    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      offset: 40,
    });

    // Only NOW does aos.css's `[data-aos]{opacity:0}` hiding take effect. Until
    // this class is present, [data-aos] content is forced fully visible, so a
    // missed / failed / slow AOS init can never blank the page.
    document.documentElement.classList.add("aos-ready");

    // Re-measure after late layout shifts (images, fonts) so above-the-fold
    // elements reliably reveal instead of staying hidden.
    const id = window.setTimeout(() => AOS.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
