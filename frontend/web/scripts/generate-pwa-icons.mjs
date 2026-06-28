import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG_PATH = join(ROOT, 'public', 'icons', 'icon.svg');
const OUT_DIR = join(ROOT, 'public', 'icons');

// Ensure output directory exists
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const ICON_BG = { r: 12, g: 26, b: 44, alpha: 1 }; // #0C1A2C
const MASKABLE_BG = { r: 10, g: 16, b: 32, alpha: 1 }; // #0A1020

async function generate() {
  const svgBuffer = await sharp(SVG_PATH).toBuffer();

  // Standard icons
  for (const size of [16, 32, 192, 384, 512]) {
    await sharp(svgBuffer).resize(size, size).png().toFile(join(OUT_DIR, `icon-${size}.png`));
    console.log(`  icon-${size}.png`);
  }

  // Apple touch icon (180x180)
  await sharp(svgBuffer).resize(180, 180).png().toFile(join(OUT_DIR, 'apple-touch-icon.png'));
  console.log('  apple-touch-icon.png');

  // Maskable icons (10% safe zone padding)
  for (const size of [192, 512]) {
    const pad = Math.round(size * 0.10);
    const inner = size - pad * 2;
    const resizedIcon = await sharp(svgBuffer).resize(inner, inner).toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: MASKABLE_BG },
    })
      .composite([{ input: resizedIcon, left: pad, top: pad }])
      .png()
      .toFile(join(OUT_DIR, `icon-maskable-${size}.png`));
    console.log(`  icon-maskable-${size}.png`);
  }

  // Favicon ICO using multi-size approach — generate 32x32 PNG as favicon fallback
  // For a proper .ico, we'll generate a 32x32 PNG named favicon.ico (browsers accept PNG ICO)
  await sharp(svgBuffer).resize(32, 32).png().toFile(join(OUT_DIR, 'favicon.png'));
  console.log('  favicon.png');

  console.log('\nAll PWA icons generated successfully.');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
