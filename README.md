# Site de Chantal Porras

Site vitrine statique (Astro) de la sculptrice Chantal Porras, style « Galerie blanche », prévu pour Cloudflare Pages.

## Démarrer
```
npm install
npm run dev        # aperçu local sur http://localhost:4321
npm run build      # génère le site dans dist/
```

## Où modifier le contenu
- `src/data/oeuvres.json` : les 82 sculptures (titre, collection, année, image). L'ordre d'affichage suit l'année, de la plus récente à la plus ancienne.
- `src/data/site.json` : coordonnées, collections et leurs descriptions.
- `src/data/actualites.json` : actualités (les textes sont à rédiger).
- `src/data/atelier.json` : photos de l'atelier.
- Textes des pages : `src/pages/*.astro`.

## Photos
Chaque œuvre attend sa photo dans `public/images/oeuvres/<slug>.jpg`. Tant qu'une photo manque, le site affiche un cadre titré à sa place.
`npm run images` télécharge les photos depuis l'ancien site WordPress (à lancer depuis une machine qui peut joindre chantal-porras.fr). Une photo déjà présente n'est pas écrasée : on peut donc la remplacer par une meilleure version à la main.

## Déploiement Cloudflare (Workers, fichiers statiques)
- Commande de build : `npm run build`
- Commande de déploiement : `npx wrangler deploy` (lit `wrangler.jsonc`, qui publie le dossier `dist`)
- `public/_redirects` redirige les anciennes adresses WordPress vers les nouvelles (301), pour garder le référencement.
- `public/_headers` règle le cache des images.

## À compléter
- Matériaux et dimensions des œuvres : champs `materiau` et `dimensions` de `oeuvres.json` (une ligne n'apparaît sur la fiche que si le champ est rempli).
- Les années sont estimées d'après la date de mise en ligne sur l'ancien site : à corriger si besoin.
- Textes des actualités, profils de réseaux sociaux.
