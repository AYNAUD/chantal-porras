// Plan du site pour les moteurs de recherche, avec la photo de chaque œuvre
// (référencement dans Google Images).
import type { APIRoute } from 'astro';
import oeuvres from '../data/oeuvres.json';
import site from '../data/site.json';

const echapper = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site: racine }) => {
  const url = (chemin: string) => new URL(chemin, racine).toString();
  const pages: { loc: string; image?: { loc: string; titre: string } }[] = [
    { loc: '/' },
    { loc: '/oeuvres/' },
    ...site.collections.map((c) => ({ loc: `/collections/${c.id}/` })),
    ...oeuvres.map((o) => ({ loc: `/oeuvres/${o.slug}/`, image: { loc: o.image, titre: o.titre } })),
    { loc: '/demarche/' },
    { loc: '/atelier/' },
    { loc: '/actualites/' },
    { loc: '/archives/' },
    { loc: '/contact/' },
  ];
  const corps = pages
    .map((p) => {
      const image = p.image
        ? `<image:image><image:loc>${echapper(url(p.image.loc))}</image:loc><image:title>${echapper(`${p.image.titre}, sculpture de ${site.nom}`)}</image:title></image:image>`
        : '';
      return `<url><loc>${echapper(url(p.loc))}</loc>${image}</url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${corps}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
