/**
 * Rank observed crawl colors into light-landing role tokens.
 *
 * Never invent brand hues. Prefer CTA fills when present; keep provenance.
 * Principles: examples/CAPTURE.md
 */

function parseRgb(str) {
  if (!str) return null;
  const hex = String(str).trim();
  if (hex.startsWith("#") && (hex.length === 7 || hex.length === 4)) {
    if (hex.length === 4) {
      return {
        r: parseInt(hex[1] + hex[1], 16),
        g: parseInt(hex[2] + hex[2], 16),
        b: parseInt(hex[3] + hex[3], 16),
      };
    }
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }
  const m = String(str).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}

function toHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function lum({ r, g, b }) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function near(a, b, tol = 18) {
  if (!a || !b) return false;
  return (
    Math.abs(a.r - b.r) <= tol &&
    Math.abs(a.g - b.g) <= tol &&
    Math.abs(a.b - b.b) <= tol
  );
}

function isBrowserDefaultLink(c) {
  return c && c.r === 0 && c.g === 0 && c.b === 238;
}

function usableFill(c) {
  if (!c) return false;
  const L = lum(c);
  return L > 0.04 && L < 0.96;
}

/**
 * @returns {{
 *   background: string|null,
 *   foreground: string|null,
 *   primary: string|null,
 *   accent: string|null,
 *   provenance: Record<string, string|null>,
 *   observed: Array<{role:string, hex:string, source:string}>,
 *   notes: string[]
 * }}
 */
export function deriveColors(crawl) {
  const bodyBgRaw = crawl.computed?.body?.backgroundColor;
  const bodyBg = parseRgb(bodyBgRaw);
  const bodyInk = parseRgb(crawl.computed?.body?.color);
  const h1 = parseRgb(crawl.computed?.h1?.color);
  const btn = parseRgb(crawl.computed?.button?.backgroundColor);
  const btnText = crawl.computed?.button?.text || "";
  const link = parseRgb(crawl.computed?.linkAccent?.color);
  const theme = parseRgb(crawl.meta?.themeColor);
  const ctaSamples = (crawl.computed?.ctaCandidates || [])
    .map((c) => ({ ...c, rgb: parseRgb(c.backgroundColor) }))
    .filter((c) => usableFill(c.rgb));

  const bgTransparent =
    !bodyBg ||
    /rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0(?:\.0+)?\s*\)/i.test(String(bodyBgRaw || ""));

  let background = null;
  let foreground = null;
  let primary = null;
  let accent = null;
  const provenance = {
    background: null,
    foreground: null,
    primary: null,
    accent: null,
  };
  const observed = [];
  const notes = [];

  const pushObserved = (role, rgbVal, source) => {
    if (!rgbVal) return;
    observed.push({ role, hex: toHex(rgbVal), source });
  };

  if (bgTransparent) {
    background = "#ffffff";
    provenance.background = "assumed-light-canvas (body transparent)";
    notes.push("body bg transparent → assumed white canvas");
  } else if (bodyBg && lum(bodyBg) >= 0.85) {
    background = toHex(bodyBg);
    provenance.background = "body.backgroundColor";
    notes.push("light body background kept");
    pushObserved("background", bodyBg, "body");
  } else if (bodyBg && lum(bodyBg) < 0.35) {
    background = "#ffffff";
    provenance.background = "assumed-light-canvas (body was dark)";
    primary = toHex(bodyBg);
    provenance.primary = "body.backgroundColor (dark→primary)";
    foreground = toHex(bodyBg);
    provenance.foreground = "body.backgroundColor (dark→foreground)";
    notes.push("dark body → primary/foreground; white canvas assumed");
    pushObserved("brand-surface", bodyBg, "body-dark");
  } else if (bodyBg) {
    background = toHex(bodyBg);
    provenance.background = "body.backgroundColor";
    pushObserved("background", bodyBg, "body");
  }

  if (bodyInk && !provenance.foreground) {
    foreground = toHex(bodyInk);
    provenance.foreground = "body.color";
    pushObserved("ink", bodyInk, "body");
  }

  const bestCta = ctaSamples[0]?.rgb || (usableFill(btn) ? btn : null);
  const bestCtaLabel = ctaSamples[0]?.text || btnText || "button";
  if (bestCta) pushObserved("cta", bestCta, bestCtaLabel);
  for (const c of ctaSamples.slice(0, 6)) {
    pushObserved("cta-candidate", c.rgb, c.text || "cta");
  }
  if (theme && usableFill(theme)) {
    pushObserved("theme-color", theme, "meta.theme-color");
  }
  if (h1 && usableFill(h1) && !(h1.r > 240 && h1.g > 240 && h1.b > 240)) {
    pushObserved("h1", h1, "h1.color");
  }
  if (link && usableFill(link) && !isBrowserDefaultLink(link)) {
    pushObserved("link", link, "ranked-links");
  }

  if (!primary && bestCta) {
    primary = toHex(bestCta);
    provenance.primary = `cta.fill (${bestCtaLabel})`;
    notes.push(`CTA fill → primary (${bestCtaLabel})`);
  }
  if (!primary && bodyInk) {
    primary = toHex(bodyInk);
    provenance.primary = "body.color (ink fallback)";
    notes.push("no CTA fill → body ink as primary");
  }

  if (bestCta && primary && !near(bestCta, parseRgb(primary))) {
    const ctaSat =
      Math.max(bestCta.r, bestCta.g, bestCta.b) -
      Math.min(bestCta.r, bestCta.g, bestCta.b);
    const h1Sat =
      h1 && usableFill(h1)
        ? Math.max(h1.r, h1.g, h1.b) - Math.min(h1.r, h1.g, h1.b)
        : 0;
    // Near-ink CTAs lose to a strongly chromatic headline (FORMATION neon green).
    if (h1Sat >= 80 && h1Sat > ctaSat + 40 && !near(h1, parseRgb(primary))) {
      accent = toHex(h1);
      provenance.accent = "h1.color (chromatic over near-ink CTA)";
      notes.push("chromatic h1 → accent (preferred over muted CTA)");
    } else {
      accent = toHex(bestCta);
      provenance.accent = `cta.fill (${bestCtaLabel})`;
      notes.push("CTA fill → accent (distinct from primary)");
    }
  } else if (bestCta && primary && near(bestCta, parseRgb(primary))) {
    accent = primary;
    provenance.accent = "same as primary (CTA)";
  } else if (
    link &&
    !isBrowserDefaultLink(link) &&
    bodyInk &&
    !near(link, bodyInk) &&
    usableFill(link)
  ) {
    accent = toHex(link);
    provenance.accent = "link.color";
    notes.push("link color → accent only");
  } else if (
    theme &&
    usableFill(theme) &&
    primary &&
    !near(theme, parseRgb(primary))
  ) {
    accent = toHex(theme);
    provenance.accent = "meta.theme-color";
  } else if (
    h1 &&
    usableFill(h1) &&
    primary &&
    !near(h1, parseRgb(primary)) &&
    Math.max(h1.r, h1.g, h1.b) - Math.min(h1.r, h1.g, h1.b) >= 60 &&
    !(h1.r > 240 && h1.g > 240 && h1.b > 240)
  ) {
    accent = toHex(h1);
    provenance.accent = "h1.color";
    notes.push("chromatic h1 → accent");
  } else if (primary) {
    accent = primary;
    provenance.accent = "same as primary (no distinct accent observed)";
    notes.push("no distinct accent → reuse primary");
  }

  if (!foreground && primary) {
    foreground = primary;
    provenance.foreground = "mirrored primary (ink not observed)";
  }

  return {
    background,
    foreground,
    primary,
    accent,
    provenance,
    observed,
    notes,
  };
}
