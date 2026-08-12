// One-off asset pipeline: normalizes brand logos + company logo to WebP.
// Spec D3: logo <= 30KB, product/hero images WebP.
import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const dir = 'public/assets/brands';
for (const f of readdirSync(dir)) {
  if (!/\.(png|jpg|jpeg)$/i.test(f)) continue;
  const p = join(dir, f);
  const before = statSync(p).size;
  const out = p.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  await sharp(p)
    .resize({ width: 320, height: 160, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(out);
  console.log(f, (before / 1024).toFixed(0) + 'KB ->', (statSync(out).size / 1024).toFixed(1) + 'KB');
  unlinkSync(p);
}

const logo = 'public/assets/ktd-logo.jpg';
if (existsSync(logo)) {
  await sharp(logo).resize({ width: 560, withoutEnlargement: true }).webp({ quality: 92 })
    .toFile('public/assets/ktd-logo.webp');
  console.log('ktd-logo ->', (statSync('public/assets/ktd-logo.webp').size / 1024).toFixed(1) + 'KB');
  unlinkSync(logo);
}
