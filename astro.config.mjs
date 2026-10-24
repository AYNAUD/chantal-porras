import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chantal-porras.fr',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
