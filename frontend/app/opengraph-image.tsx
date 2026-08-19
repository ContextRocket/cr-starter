import { siteConfig } from "@/config/site.config";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.theme.light["--background"],
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: siteConfig.theme.light["--primary"],
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {siteConfig.companyName}
        </div>
        <div
          style={{
            fontSize: 32,
            color: siteConfig.theme.light["--muted-foreground"],
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
