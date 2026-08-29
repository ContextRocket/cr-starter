/**
 * Landing-page fixture loaders (synced JSON). No remote fetches.
 */

import kleosFixture from "@/fixtures/landing-page/kleos.v1.json";
import weakBrandFixture from "@/fixtures/landing-page/weak_brand.v1.json";
import type { LandingPageManifest } from "@/lib/generated/landing-page-manifest";

export type LandingPageFixtureId = "kleos" | "weak-brand";

const FIXTURES: Record<LandingPageFixtureId, LandingPageManifest> = {
  kleos: kleosFixture as LandingPageManifest,
  "weak-brand": weakBrandFixture as LandingPageManifest,
};

export function listFixtureIds(): LandingPageFixtureId[] {
  return ["kleos", "weak-brand"];
}

export function loadFixtureManifest(
  fixture: LandingPageFixtureId,
): LandingPageManifest {
  const manifest = FIXTURES[fixture];
  if (!manifest) {
    throw new Error(`Unknown landing-page fixture: ${fixture}`);
  }
  return manifest;
}

export function fixtureIdFromRoute(
  routeSegments: string[] | undefined,
): LandingPageFixtureId | null {
  if (!routeSegments || routeSegments.length === 0) return null;
  const key = routeSegments.join("/");
  if (key === "kleos") return "kleos";
  if (key === "weak-brand") return "weak-brand";
  return null;
}
