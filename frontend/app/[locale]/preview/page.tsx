/**
 * /preview — a static preview of the full marketing composition.
 *
 * This page renders <MarketingSections /> from `company.config.ts` so the
 * static build exercises the entire section library from the single content
 * SoT. It is not part of the public site (noindex) — it exists to prove the
 * company-config → section bridge renders and statically exports.
 */

import { MarketingSections } from "@/components/sections/marketing-sections";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <main>
      <MarketingSections />
    </main>
  );
}
