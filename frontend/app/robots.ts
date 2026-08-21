import type { MetadataRoute } from "next";

import { buildPublicRobotsConfig } from "@/lib/public-site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return buildPublicRobotsConfig() as MetadataRoute.Robots;
}
