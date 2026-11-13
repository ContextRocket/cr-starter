#!/usr/bin/env node
/** Validate the starter's single curated semantic palette and key contrast pairs. */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const configFlag = args.indexOf("--config");
const configPath = configFlag >= 0
  ? args[configFlag + 1]
  : undefined;
if (configFlag >= 0 && !configPath) {
  console.error("Usage: node scripts/validate-theme.mjs [--config <site.json>]");
  process.exit(2);
}
const sitePath = configPath
  ? resolve(process.cwd(), configPath)
  : resolve(root, "../config/site.json");
const site = JSON.parse(readFileSync(sitePath, "utf8"));
const tokens = site.theme?.tokens;
const required = ["--background", "--foreground", "--card", "--primary", "--muted", "--muted-foreground", "--border", "--ring"];
const missing = required.filter((key) => typeof tokens?.[key] !== "string" || !tokens[key].trim());
if (missing.length) {
  console.error(`validate-theme: missing theme.tokens: ${missing.join(", ")}`);
  process.exit(1);
}

function parseChannel(value) {
  const channel = value.trim();
  if (channel.endsWith("%")) return Number.parseFloat(channel) * 2.55;
  return Number.parseFloat(channel);
}

function parseAlpha(value) {
  const alpha = value.trim();
  return alpha.endsWith("%")
    ? Number.parseFloat(alpha) / 100
    : Number.parseFloat(alpha);
}

function parseColor(raw) {
  const value = raw.trim().toLowerCase();
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    const expanded = hex[1].length <= 4
      ? [...hex[1]].map((digit) => `${digit}${digit}`).join("")
      : hex[1];
    const hasAlpha = expanded.length === 8;
    return {
      r: Number.parseInt(expanded.slice(0, 2), 16),
      g: Number.parseInt(expanded.slice(2, 4), 16),
      b: Number.parseInt(expanded.slice(4, 6), 16),
      a: hasAlpha ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1,
    };
  }

  const functionColor = value.match(/^(rgba?|hsla?)\((.*)\)$/);
  if (!functionColor) return null;
  const [, name, body] = functionColor;
  const slashParts = body.split("/");
  const components = slashParts[0].includes(",")
    ? slashParts[0].split(",").map((part) => part.trim())
    : slashParts[0].trim().split(/\s+/);
  let alphaValue = slashParts[1]?.trim();
  if (!alphaValue && components.length === 4) alphaValue = components.pop();
  if (components.length !== 3) return null;
  const alpha = alphaValue ? parseAlpha(alphaValue) : 1;
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;

  if (name.startsWith("rgb")) {
    const channels = components.map(parseChannel);
    if (channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)) return null;
    return { r: channels[0], g: channels[1], b: channels[2], a: alpha };
  }

  const hueMatch = components[0].match(/^([+-]?(?:\d+\.?\d*|\.\d+))(deg|grad|rad|turn)?$/);
  if (!hueMatch) return null;
  const hueValue = Number.parseFloat(hueMatch[1]);
  const hue = hueMatch[2] === "grad" ? hueValue * 0.9
    : hueMatch[2] === "rad" ? hueValue * 180 / Math.PI
      : hueMatch[2] === "turn" ? hueValue * 360
        : hueValue;
  const saturation = Number.parseFloat(components[1]) / 100;
  const lightness = Number.parseFloat(components[2]) / 100;
  if (
    !Number.isFinite(hue) ||
    !Number.isFinite(saturation) || saturation < 0 || saturation > 1 ||
    !Number.isFinite(lightness) || lightness < 0 || lightness > 1
  ) return null;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = ((hue % 360) + 360) % 360 / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const rgb = segment < 1 ? [chroma, second, 0]
    : segment < 2 ? [second, chroma, 0]
      : segment < 3 ? [0, chroma, second]
        : segment < 4 ? [0, second, chroma]
          : segment < 5 ? [second, 0, chroma]
            : [chroma, 0, second];
  const offset = lightness - chroma / 2;
  const [r, g, b] = rgb.map((channel) => Math.round((channel + offset) * 255));
  return { r, g, b, a: alpha };
}

function composite(foreground, background) {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
    a: alpha,
  };
}

function luminance(color) {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foregroundValue, backgroundValue, canvasValue) {
  const canvas = parseColor(canvasValue) ?? { r: 255, g: 255, b: 255, a: 1 };
  const rawBackground = parseColor(backgroundValue);
  const rawForeground = parseColor(foregroundValue);
  if (!rawBackground || !rawForeground) return null;
  const background = rawBackground.a < 1 ? composite(rawBackground, canvas) : rawBackground;
  const foreground = rawForeground.a < 1 ? composite(rawForeground, background) : rawForeground;
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const contrastPairs = [
  ["--foreground", "--background", 4.5],
  ["--foreground", "--card", 4.5],
  ["--card-foreground", "--card", 4.5],
  ["--popover-foreground", "--popover", 4.5],
  ["--muted-foreground", "--background", 4.5],
  ["--muted-foreground", "--muted", 4.5],
  ["--text-secondary", "--background", 4.5],
  ["--text-tertiary", "--background", 4.5],
  ["--primary-foreground", "--primary", 4.5],
  ["--primary-foreground", "--primary-hover", 4.5],
  ["--brand-accent-foreground", "--brand-accent", 4.5],
  ["--brand-accent-foreground", "--brand-accent-hover", 4.5],
  ["--secondary-foreground", "--secondary", 4.5],
  ["--tertiary-foreground", "--tertiary", 4.5],
  ["--warning-foreground", "--warning", 4.5],
  ["--success-foreground", "--success", 4.5],
  ["--info-foreground", "--info", 4.5],
  ["--destructive-foreground", "--destructive", 4.5],
  ["--error-foreground", "--error", 4.5],
  ["--ring", "--background", 3],
  ["--ring", "--card", 3],
];
const contrastFailures = [];
const uncheckedColors = [];
for (const [foregroundToken, backgroundToken, minimum] of contrastPairs) {
  const foreground = tokens[foregroundToken];
  const background = tokens[backgroundToken];
  if (typeof foreground !== "string" || typeof background !== "string") continue;
  const ratio = contrastRatio(foreground, background, tokens["--background"]);
  if (ratio === null) {
    uncheckedColors.push(`${foregroundToken} / ${backgroundToken}`);
  } else if (ratio < minimum) {
    contrastFailures.push(
      `${foregroundToken} on ${backgroundToken}: ${ratio.toFixed(2)}:1 (requires ${minimum}:1)`,
    );
  }
}

if (uncheckedColors.length || contrastFailures.length) {
  for (const pair of uncheckedColors) {
    console.error(`validate-theme: cannot measure contrast for ${pair}; use a supported CSS color value`);
  }
  for (const failure of contrastFailures) console.error(`validate-theme: ${failure}`);
  process.exit(1);
}

console.log(
  `validate-theme: OK -- ${sitePath}; ${Object.keys(tokens).length} semantic tokens; ` +
  `all configured text and focus-ring pairs meet contrast thresholds.`,
);
