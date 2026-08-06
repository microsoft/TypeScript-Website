# Gatsby-to-Astro migration inventory

Captured 2026-07-29 at revision `c8170c35bda4811c9516cbb69c39241ae4beb6d9`. The working tree was clean. Local tools were Node 26.4.0 and pnpm 10.30.3; CI and production use Node 20.x. The lockfile is `pnpm-lock.yaml`.

## Scope and topology

- Repository root: `C:\Users\navyasingh\Repos\TypeScript-Website`.
- Source application: `packages/typescriptlang-org` (`typescriptlang-org`), Gatsby 5.16.
- Target application: `packages/typescriptlang-org-astro`, required as a sibling workspace package. It currently has no tracked files or reproducible source. Ignored remnants include `dist` (944 HTML files), `node_modules`, `.astro`, and empty `public` scaffolding; they are not accepted as migration implementation.
- Scope includes the website and framework-independent packages that generate its content/assets: `documentation`, `tsconfig-reference`, `glossary`, `playground-examples`, `playground-handbook`, `community-meta`, `playground-worker`, `playground`, `sandbox`, `ata`, `typescript-vfs`, and `ts-twoslasher`.
- `pnpm-workspace.yaml` includes `packages/*`. Node >=20.19 and pnpm 10.30.3 are declared.

## Existing lifecycle

| Purpose | Command / behavior |
|---|---|
| Install | `pnpm install` |
| Localization | `pnpm docs-sync pull microsoft/TypeScript-Website-localizations#main 1` |
| Generate/build dependencies | `pnpm bootstrap`, then `pnpm build` |
| Development | root `pnpm start` runs Watchman plus `gatsby develop`; package `pnpm start` runs Gatsby on port 8000 |
| Production site | root `pnpm build-site` filters `typescriptlang-org` and runs Gatsby build |
| Test | package `pnpm test` runs TypeScript and Jest; root `pnpm test` runs package tests recursively |
| Preview | package `pnpm serve` runs `gatsby serve` |
| Production-only preparation | `pnpm run --filter=typescriptlang-org setup-playground-cache-bust` |
| Output | `packages/typescriptlang-org/public` |

`NO_TRANSLATIONS` deliberately produces a reduced English-only build and cannot be used for route-parity approval.

## Generated-data prerequisites and coupling

Production-equivalent order is install, pull localizations, bootstrap, Playground cache-busting, non-site package builds, then site build. Important prerequisites include generated release metadata, documentation navigation/attribution, TSConfig reference content, glossary content, Playground TOCs/examples/handbook, meetup data, Playground worker, Sandbox, VFS, ATA, and Twoslash.

Several generators currently hard-code writes into `packages/typescriptlang-org/src` or `packages/typescriptlang-org/static`, notably documentation navigation, Playground examples/TOCs, Playground worker output, and TSConfig/browser assets. The target needs a framework-neutral generated-assets location or a deterministic copy/synchronization stage; it must not import Gatsby application source.

Network inputs include localization sync, npm/Visual Studio release metadata, DocSearch assets, and Monaco/Playground assets. Documentation attribution requires full Git history.

## Gatsby configuration and plugin behavior

- Sass: compile all global/component/template/page SCSS.
- Manifest: TypeScript Documentation metadata, colors, standalone mode, `/` start URL, 512px icon. There is no Gatsby offline/service-worker plugin.
- TypeScript/typegen: compile TS/TSX and produce Gatsby GraphQL types in development.
- Sitemap: site URL `https://www.typescriptlang.org/`; declared exclusions cover glossary and `vo`, though current Gatsby sitemap behavior is inconsistent and needs an explicit target contract.
- React Helmet: title/SEO/canonical/language/consent/preload/style head behavior.
- Seven filesystem sources: documentation, TSConfig output, glossary output, Playground TOCs, Playground examples, English TSConfig option Markdown, and Playground handbook.
- i18n: default `en`; actual route localization is custom and React Intl supplies messages.
- Remark: HTML, responsive images (max 590px), responsive iframe wrappers, linked heading anchors, patched Shiki/Twoslash, linked-file copying, and smart punctuation.
- Catch-links: client navigation except URLs containing `sandbox`, `play`, or `dev`.
- Client redirects: materialize redirects declared by `setupRedirects`.
- Gatsby Node/Webpack: page tracking; `canvas` null loading; `pnpapi`, `fs`, `module`, and SSR `util` externals; disabled Node browser fallbacks; `__DEVELOPMENT__`; Node polyfills.
- Gatsby SSR: XML `DOMParser` global plus a synchronous pre-body theme/font script reading local storage and `prefers-color-scheme` to prevent flash.

## Exact source route inventory

The current synchronized/generated source snapshot declares **920 application pages**:

| Family | Count | Routes / mechanism |
|---|---:|---|
| Filesystem pages | 6 | `/branding/`; `/dev/bug-workbench/`; `/dev/playground-plugins/`; `/dev/sandbox/`; `/dev/twoslash/`; `/dev/typescript-vfs/` |
| Localized root templates | 100 | 10 templates x 10 site-copy locales (`en`, `es`, `fr`, `id`, `ja`, `ko`, `pl`, `pt`, `vo`, `zh`) |
| Documentation | 283 | Markdown permalink routes: en 131, fr 24, id 14, ja 5, ko 62, pl 2, pt 37, vo 1, zh 7 |
| TSConfig roots | 10 | en plus `es`, `fr`, `id`, `it`, `ja`, `ko`, `pt`, `vo`, `zh` |
| Glossary | 1 | `/glossary` |
| Playground roots | 10 | en plus `es`, `fa`, `fr`, `id`, `ja`, `ko`, `pt`, `vo`, `zh` |
| Playground example SEO | 361 | en 85, es 22, fa 1, fr 6, id 37, ja 39, ko 51, pt 70, vo 4, zh 46; intentional `.ts.html`/`.js.html` URLs |
| TSConfig option SEO | 135 | `/tsconfig/<option>.html` |
| Playground handbook fragments | 14 | `/_playground-handbook/<slug>.html` |

The 100 localized templates are `/`, `/cheatsheets`, `/community`, `/download`, `/empty`, `/tools`, `/why-create-typescript`, `/docs/`, `/docs/handbook/`, and `/dt/search`, with unprefixed English and prefixed non-English routes.

There are 23 permanent browser redirect declarations and 22 unique case-insensitive output paths because `Playground` and `/playground` collide. They cover legacy Playground/Tutorial/Handbook/samples, `/docs/home`, retired tutorial/release/declaration/module paths, and one external Webpack route.

Current Gatsby output has 902 application page-data entries and 926 HTML files total (including redirect pages, copied `License.html`, and a Gatsby slice). It omits 18 localized `/play/` and `/tsconfig/` roots declared by current source. Current ignored Astro output has 944 HTML files (all 926 plus those 18) but also contains `/_gatsby/`, lacks `404.html`, and is not reproducible. Source declarations are authoritative where stale Gatsby output disagrees.

Normalization for route comparison: map root `index.html` to `/`, nested `index.html` to a trailing-slash route, preserve intentional non-index `.html` routes, normalize duplicate separators, compare URLs case-sensitively while separately detecting case-insensitive collisions, and exclude non-route fragments/slices only by documented rule.

## Templates, layouts, and shared behavior

- Global layout: SEO, consent, navigation, footer, localization recommendation, and global Sass.
- Documentation: rendered Markdown, sidebar, generated table of contents, previous/next links, contributors and modified time, canonical deprecations, experimental/deprecated notices, and feedback UI.
- TSConfig: localized introduction, category links, generated option Markdown, sticky active section.
- Glossary: generated Markdown and quick links.
- Playground: Monaco, Sandbox, Playground worker, ATA, compiler version/nightly/local modes, plugins, history, sharing/export, URL/query/hash state, and fallbacks.
- Marketing/page families: home, download, community, tools, cheatsheets, documentation/handbook landing, search, empty, Why TypeScript.
- Developer families: Twoslash, Sandbox, Playground plugins, VFS, and bug workbench.

Static presentation should become Astro. High-risk interactive surfaces (Playground and developer workbenches) may remain React islands through `@astrojs/react`, hydrated only when browser behavior requires it.

The six filesystem/developer routes were subsequently inventoried at component level. Their framework-independent behavior comes from Sandbox, Monaco/TypeScript, VFS-style in-memory programs, Twoslash markup conventions, and generated plugin activation modules. Branding illustrations and the Playground plugin preview were extracted as target-owned SVGs under `packages/typescriptlang-org-astro/public`; the existing design-asset ZIP was already target-owned. The target does not read these assets or components from Gatsby during build or runtime.

## Cross-application browser behavior

Preserve theme/font before-paint initialization and persistence; language recommendation and dismissal; localized link fallback; Algolia DocSearch v2 loading and URL rewriting; Microsoft WCP consent; sticky navigation; responsive/inert/keyboard documentation sidebar; hash scrolling and active ToCs; deprecation fragment mapping; feedback/contributor UI; homepage tabs/carousel/scroll interactions; package-manager command switching; Playground local storage, worker and Monaco behavior; and workbench globals.

## Metadata, assets, and hosting

Preserve per-page title/description, OpenGraph/Twitter fields, `lang`, canonical deprecation URLs, manifest, sitemap inclusion policy, heading IDs, linked files, responsive media behavior, static assets, `Web.config` MIME mappings, SHA-prefixed Playground assets, and redirects. GitHub Pages is the production host; Azure Static Web Apps uploads an already-built preview artifact. Gatsby outputs `public`; Astro defaults to `dist`.

## Existing tests and documented journeys

- Website tests: TypeScript compilation and one active Jest snapshot suite for `invertCodeToHTML`.
- No active Playwright/Cypress route, redirect, accessibility, visual, or Astro suite exists.
- Orphaned Backstop reference images are not executable tests.
- Documented journeys cover new/existing desktop/mobile users learning TypeScript, installing it, finding reference content, trying/sharing Playground code, metadata-driven discovery, and site search.
- Localization and deprecation docs define important link fallback, canonical, and fragment-remapping requirements.

## CI and deployment

CI runs install, localization pull, bootstrap, non-site build, Gatsby site build, uploads `packages/typescriptlang-org/public`, runs all tests, and checks generated diffs on Ubuntu/Windows/macOS. Production does the same with full history and cache busting, then copies Gatsby `public` to the GitHub Pages artifact. Preview downloads that artifact and uploads it to Azure Static Web Apps with app build skipped. All must select Astro after approved cutover.

## Known baseline issues and risks

1. Local Node 26 differs from CI Node 20 and warns that the root `pnpm` configuration field is ignored by this pnpm version.
2. Astro source is absent; ignored output is contaminated by Gatsby and cannot be rebuilt.
3. Generated content/assets are coupled to Gatsby paths.
4. Gatsby output omits 18 source-declared localized roots.
5. Locale sets differ by route family; localization sync is required.
6. `allPages.ts` intentionally omits 510 SEO/handbook routes and retains a malformed Polish double-slash route, so it is not a complete route manifest.
7. Markdown parity includes patched Twoslash, images, iframes, heading IDs, copied links, and typography.
8. Playground/workbenches are complex browser applications.
9. Current automated coverage is inadequate; exhaustive structural and representative browser checks are mandatory.
10. GitHub Pages and Azure previews have different redirect/fallback capabilities.
11. The ignored Astro artifact points navigation fallback at missing `404.html`, indexes redirects, and contains a Gatsby slice.
