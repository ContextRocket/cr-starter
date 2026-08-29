/**
 * Generated landing-page routes — fixture manifests only.
 *
 * Default marketing `/` is unchanged. This surface is `/[locale]/generated/...`.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManifestPage } from "@/lib/landing-page/ManifestPage";
import {
  fixtureIdFromRoute,
  listFixtureIds,
  loadFixtureManifest,
} from "@/lib/landing-page/fixtures";
import { ACTIVE_LOCALES, resolveLocale } from "@/i18n/messages";

interface PageProps {
  params: Promise<{ locale: string; route?: string[] }>;
}

export function generateStaticParams() {
  const params: { locale: string; route: string[] }[] = [];
  for (const locale of ACTIVE_LOCALES) {
    for (const id of listFixtureIds()) {
      params.push({ locale, route: [id] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, route } = await params;
  resolveLocale(rawLocale);
  const fixtureId = fixtureIdFromRoute(route);
  if (!fixtureId) {
    return { robots: { index: false, follow: false } };
  }
  const manifest = loadFixtureManifest(fixtureId);
  const indexable = manifest.search.indexing_intent === "index";
  return {
    title: manifest.search.title,
    description: manifest.search.description,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function GeneratedLandingPage({ params }: PageProps) {
  const { locale: rawLocale, route } = await params;
  resolveLocale(rawLocale);
  const fixtureId = fixtureIdFromRoute(route);
  if (!fixtureId) {
    notFound();
  }
  const manifest = loadFixtureManifest(fixtureId);
  return <ManifestPage manifest={manifest} />;
}
