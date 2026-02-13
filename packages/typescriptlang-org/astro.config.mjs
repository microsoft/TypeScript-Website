import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { DOMParser } from 'xmldom';

// Polyfill DOMParser for SSR so react-intl can format rich text messages
// (equivalent to the old gatsby-ssr.js polyfill)
globalThis.DOMParser = DOMParser;

export default defineConfig({
  site: 'https://www.typescriptlang.org',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/glossary') && !page.includes('/vo/'),
    }),
  ],
  build: {
    format: 'file',
  },
  trailingSlash: 'ignore',
  redirects: {
    '/Tutorial': '/docs',
    '/Handbook': '/docs',
    '/samples': '/docs',
    '/docs/home.html': '/docs',
    '/playground': '/play/',
    '/docs/home': '/docs',
    '/docs/handbook/writing-declaration-files': '/docs/handbook/declaration-files/introduction.html',
    '/docs/handbook/writing-declaration-files.html': '/docs/handbook/declaration-files/introduction.html',
    '/docs/handbook/writing-definition-files': '/docs/handbook/declaration-files/introduction.html',
    '/docs/handbook/typings-for-npm-packages': '/docs/handbook/declaration-files/publishing.html',
    '/docs/tutorial.html': '/docs/',
    '/docs/handbook/release-notes': '/docs/',
    '/docs/handbook/release-notes/overview': '/docs/',
    '/docs/handbook/release-notes/overview.html': '/docs',
    '/docs/handbook/react-&-webpack.html': 'https://webpack.js.org/guides/typescript/',
    '/docs/bootstrap': '/docs/',
    '/docs/handbook/esm-node': '/docs/handbook/modules/reference.html#node16-node18-node20-nodenext',
    '/docs/handbook/esm-node.html': '/docs/handbook/modules/reference.html#node16-node18-node20-nodenext',
    '/docs/handbook/modules': '/docs/handbook/modules/introduction.html',
    '/docs/handbook/modules.html': '/docs/handbook/modules/introduction.html',
    '/docs/handbook/module-resolution': '/docs/handbook/modules/theory.html#module-resolution',
    '/docs/handbook/module-resolution.html': '/docs/handbook/modules/theory.html#module-resolution',
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: ['react-intl', 'intl-format-cache', 'intl-messageformat', 'intl-messageformat-parser', '@formatjs/intl-utils'],
    },
  },
});
