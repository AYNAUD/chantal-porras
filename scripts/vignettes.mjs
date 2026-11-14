// Génère (commande : npm run vignettes) des versions WebP allégées de chaque photo
// (480, 960 et 1600 px de large au plus) dans public/images/_v/.
// Le navigateur choisit ensuite la taille adaptée à l'écran (attribut srcset).
// Les fichiers générés sont versionnés avec le site : relancer après tout ajout de photo.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export const LARGEURS = [480, 960, 1600];
const racine = path.join(process.cwd(), 'public', 'images');
const sortie = path.join(racine, '_v');

function* jpegs(dossier) {
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory() && p !== sortie) yield* jpegs(p);
    else if (/\.jpe?g$/i.test(e.name)) yield p;
  }
}

let crees = 0;
for (const fichier of jpegs(racine)) {
  const relatif = path.relative(racine, fichier).replace(/\.jpe?g$/i, '');
  const { width } = await sharp(fichier).metadata();
  for (const l of LARGEURS) {
    if (l > width && l !== LARGEURS[0]) continue;
    const cible = path.join(sortie, `${relatif}-${l}.webp`);
    if (fs.existsSync(cible) && fs.statSync(cible).mtimeMs >= fs.statSync(fichier).mtimeMs) continue;
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    await sharp(fichier).resize({ width: Math.min(l, width) }).webp({ quality: 78 }).toFile(cible);
    crees++;
  }
}
console.log(`Vignettes WebP : ${crees} fichier(s) créé(s) dans public/images/_v/`);
