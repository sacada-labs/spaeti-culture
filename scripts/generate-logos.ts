import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const iconSvgPath = join(publicDir, "icon.svg");

async function generateLogos() {
  const svgBuffer = readFileSync(iconSvgPath);

  // Generate logo512.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, "logo512.png"));

  // Generate logo192.png (192x192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, "logo192.png"));

  // Generate favicon.ico (32x32 PNG, saved as .ico)
  // Note: Most modern browsers support PNG favicons even with .ico extension
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, "favicon.ico"));

  console.log("✅ Generated logo512.png, logo192.png, and favicon.ico");
}

try {
  await generateLogos();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
