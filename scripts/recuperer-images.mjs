// Télécharge les photos du site WordPress actuel vers public/images/.
// À lancer depuis une machine qui peut joindre chantal-porras.fr : npm run images
// Les fichiers déjà présents sont conservés, ce qui permet de les remplacer à la main par de meilleures photos.
import fs from 'node:fs';
import path from 'node:path';

const lire = (f) => JSON.parse(fs.readFileSync(new URL(`../src/data/${f}`, import.meta.url)));
const cibles = [
  ...lire('oeuvres.json'),
  ...lire('atelier.json'),
  ...lire('actualites.json'),
  { image: '/images/site/portrait.jpg', source: 'https://chantal-porras.fr/wp-content/uploads/2019/04/COCKTAIL2017053115640.jpg' },
  { image: '/images/site/atelier.jpg', source: 'https://chantal-porras.fr/wp-content/uploads/2018/05/chantal-porras-atelier-3.jpg' },
];

let ok = 0, ignores = 0, echecs = [];
for (const { image, source } of cibles) {
  const dest = path.join('public', image);
  if (fs.existsSync(dest)) { ignores++; continue; }
  try {
    const rep = await fetch(source);
    if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await rep.arrayBuffer()));
    ok++;
  } catch (e) {
    echecs.push(`${source} (${e.message})`);
  }
}
console.log(`${ok} téléchargées, ${ignores} déjà présentes, ${echecs.length} en échec`);
for (const e of echecs) console.log('  échec :', e);
