import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractColorFromConfig(configPath) {
  if (!fs.existsSync(configPath)) return "#123a72";
  const content = fs.readFileSync(configPath, "utf8");
  const match = content.match(/primary:\s*"([^"]+)"/);
  if (match && match[1]) {
    return match[1];
  }
  return "#123a72";
}

function extractNameFromConfig(configPath) {
  if (!fs.existsSync(configPath)) return "C";
  const content = fs.readFileSync(configPath, "utf8");
  const match = content.match(/companyName:\s*"([^"]+)"/);
  if (match && match[1]) {
    return match[1][0].toUpperCase();
  }
  return "C";
}

const configPath = path.resolve(__dirname, "../site.config.ts");
const outPath = path.resolve(__dirname, "../public/favicon-source.svg");

const color = extractColorFromConfig(configPath);
const letter = extractNameFromConfig(configPath);

const svgData = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${color}" />
  <text x="256" y="276" font-family="system-ui, sans-serif" font-weight="bold" font-size="280" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
    ${letter}
  </text>
</svg>
`.trim();

fs.writeFileSync(outPath, svgData);
console.log(
  `Generated placeholder SVG favicon at ${outPath} with color ${color} and letter '${letter}'`,
);

// Wait to resolve sharp so it plays well in ESM
(async () => {
  const sharp = (await import("sharp")).default;
  await sharp(outPath)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(__dirname, "../public/favicon-source.png"));
  console.log(
    "Converted SVG to PNG. You can now run pnpm run generate-favicons.",
  );
})();
