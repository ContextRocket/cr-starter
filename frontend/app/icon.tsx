import { siteConfig } from "@/config/site.config";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const initial = (siteConfig.companyName[0] ?? "C").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.theme.light["--primary"],
          borderRadius: "6px",
          fontSize: 20,
          fontWeight: 900,
          color: siteConfig.theme.light["--primary-foreground"],
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {initial}
      </div>
    ),
    { width: 32, height: 32 },
  );
}
