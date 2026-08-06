# Frozen validation plan

## 1. Snapshot contract

- Source revision: `c8170c35bda4811c9516cbb69c39241ae4beb6d9` with a clean working tree before migration artifacts.
- Package state: repository `pnpm-lock.yaml`, pnpm 10.30.3, Node 20.x/at least 20.19 for authoritative CI-equivalent runs. Local exploratory runs under Node 26.4.0 must be labeled non-authoritative.
- Content snapshot: `pnpm docs-sync pull microsoft/TypeScript-Website-localizations#main 1`, then `pnpm bootstrap`, `pnpm run --filter=typescriptlang-org setup-playground-cache-bust`, and `pnpm build`. Full Git history is required for documentation attribution.
- Source build: `pnpm build-site`; source output `packages/typescriptlang-org/public`.
- Target complete build: initially `pnpm run --filter=typescriptlang-org-astro build:site`; after cutover, root `pnpm build-site`; target output `packages/typescriptlang-org-astro/dist` before source removal.
- Expected application routes: 920 source-declared pages grouped exactly as inventory: 6 filesystem, 100 localized root, 283 documentation, 10 TSConfig roots, 1 glossary, 10 Playground roots, 361 Playground examples, 135 TSConfig options, and 14 Playground handbook. Redirects and copied static HTML are tracked separately.
- Route normalization: root `index.html` => `/`; nested `index.html` => trailing-slash route; preserve intentional non-index `.html`; collapse duplicate separators while retaining the malformed-source discrepancy as evidence; compare case-sensitively and separately detect case-insensitive collisions; exclude Gatsby slices and non-route build internals; classify redirect pages separately.
- Environment assumptions: production canonical origin `https://www.typescriptlang.org/`; no `NO_TRANSLATIONS`; external DocSearch/consent/CDN checks may be stubbed for deterministic behavior but must include a real-network smoke check before approval.
- Intentional exclusions: no package publish/release validation; no production deployment is performed locally. Existing unrelated package tests remain required through root `pnpm test`.
- Evidence root: `packages/typescriptlang-org/.tsupgrader/framework-migration/evidence/`.

The plan is frozen when the first target application edit occurs. Checks may be appended; existing requirements may not be removed or weakened.

## 2. Coverage matrix

| Inventory/plan scope | Validation IDs |
|---|---|
| Snapshot, source build, exact source/output inventory | B01-B04 |
| Target package and synchronized generation | F01, P01-P03 |
| Shared shell, styles, metadata, manifest, pre-paint | F02, P04-P05, P19, P22-P23 |
| Localization, route/link model, 100 root pages | F03, F05, P06, P13 |
| Markdown/Twoslash and 283 documentation pages | F04, F06, P07-P08, P21-P23 |
| TSConfig roots/options | F07, P09, P21-P22 |
| Glossary | F08, P06, P21-P22 |
| Playground roots/examples and browser application | F09, P10-P11, P16, P21-P23 |
| Playground handbook | F10, P06, P21-P22 |
| Filesystem/developer routes | F11, P12, P21-P23 |
| Navigation, search, consent, sidebar, locale recommendation | P13-P16 |
| Redirects, 404, sitemap, assets, MIME | P17-P20 |
| Exhaustive routes and metadata | P06, P21-P22 |
| Runtime, responsive, accessibility, visual | P08-P16, P23 |
| Isolation/deletion readiness | P24-P25 |
| Preview approval | P26 |
| Root/CI/deployment cutover | C01-C05 |
| Gatsby removal | C06-C07 |
| Final clean lifecycle | C08-C10 |
| M01-M23 | B01-B04, F01-F11, P01-P26, C01-C10 |

## 3. Validation checks

Commands run from repository root unless another directory is specified. Each command must exit 0 and persist the named evidence.

### Baseline

| ID | Gate | Scope | Requirement | Method/command | Expected result | Required evidence |
|---|---|---|---|---|---|---|
| B01 | baseline | Revision/tool state | Record reproducible starting state | `git rev-parse HEAD; git status --short; node --version; pnpm --version` | Recorded revision; pre-migration tree clean; versions labeled | `evidence/baseline-environment.txt` |
| B02 | baseline | Source checks | Gatsby package compiles/tests on snapshot | `pnpm run --filter=typescriptlang-org test` | Exit 0 | `evidence/source-test.log` |
| B03 | baseline | Source production build | Production-equivalent Gatsby build completes when practical | Run snapshot generation then `pnpm build-site` | Exit 0, output retained; otherwise concrete external blocker | `evidence/source-build.log`, `evidence/source-build-duration.json` |
| B04 | baseline | Source manifests | Exact routes/redirects/assets/metadata baseline is retained | Run migration baseline manifest script against source declarations and Gatsby `public` | 920 declared application routes categorized; output discrepancies and 22 unique redirects explicit | `evidence/source-route-manifest.json`, `evidence/source-output-manifest.json`, `evidence/source-metadata.json` |

### Per-family

| ID | Gate | Scope | Requirement | Method/command | Expected result | Required evidence |
|---|---|---|---|---|---|---|
| F01 | per-family | Foundation/generation | Reproducible target complete build | `pnpm run --filter=typescriptlang-org-astro build:site` | Exit 0 from clean target output after all required synchronization/generation | `evidence/target-build.log`, `evidence/target-build-duration.json` |
| F02 | per-family | Shared shell | Shell, style, head and pre-paint behavior match | Target checks plus browser assertions on home/docs | Correct lang/title/meta/styles; theme/font class set before interactive load | `evidence/shell-results.json`, screenshots |
| F03 | per-family | Localization | Family-specific locale sets and fallback links match | Route-manifest family checks plus locale browser test | Exact localized paths; fallback/link behavior equivalent | `evidence/localization-results.json` |
| F04 | per-family | Markdown pipeline | Twoslash/Remark transforms preserve behavior | Fixture comparison for code, headings, images, iframe, linked files, punctuation | Stable IDs/links and equivalent transformed semantics | `evidence/markdown-fixtures.json`, fixture HTML |
| F05 | per-family | Root pages | All 100 localized template routes exist | Manifest assertion | Exactly 100, 10 templates x 10 locales, no missing/extra | `evidence/root-pages.json` |
| F06 | per-family | Documentation | All 283 docs and navigation joins exist | Manifest/content comparison plus representative browser checks | Exact locale counts, content, previous/next/sidebar/attribution/canonical behavior | `evidence/documentation.json`, screenshots |
| F07 | per-family | TSConfig | 10 roots and 135 option routes exist | Manifest plus browser/bot checks | Exact counts; `.html` URLs; human redirect and indexable bot content | `evidence/tsconfig.json` |
| F08 | per-family | Glossary | English glossary route/content exists | Manifest/content/browser check | `/glossary` content and quick links match | `evidence/glossary.json` |
| F09 | per-family | Playground | 10 roots and 361 examples exist | Manifest and representative browser/bot checks | Exact locale/example counts and redirect encoding | `evidence/playground-family.json` |
| F10 | per-family | Handbook | All 14 fragment routes exist | Manifest/content comparison | Exactly 14 with matching rendered content | `evidence/playground-handbook.json` |
| F11 | per-family | Filesystem/dev | Six routes and workbench behavior exist | Manifest and browser checks | Exact six routes; representative workbench loads without console/network errors | `evidence/developer-pages.json`, screenshots |

### Pre-cutover

| ID | Gate | Scope | Requirement | Method/command | Expected result | Required evidence |
|---|---|---|---|---|---|---|
| P01 | pre-cutover | Target framework | Astro check/build/test pass | `pnpm run --filter=typescriptlang-org-astro check && pnpm run --filter=typescriptlang-org-astro test && pnpm run --filter=typescriptlang-org-astro build` | Exit 0, no unresolved errors | `evidence/target-check-test-build.log` |
| P02 | pre-cutover | Generation | Complete build is one reproducible command | Delete target generated/output state then run `build:site` | Exit 0 without undocumented manual steps | `evidence/clean-target-build.log` |
| P03 | pre-cutover | Generated assets | Required generated files/assets are complete | Compare declared generated inputs/assets to target output | No missing required content, worker, Playground, TSConfig, search, or static asset | `evidence/generated-assets.json` |
| P04 | pre-cutover | Source preservation | Gatsby remains independently buildable before approval | `pnpm run --filter=typescriptlang-org build` | Exit 0 after target changes | `evidence/source-preservation-build.log` |
| P05 | pre-cutover | Package boundary | No Astro-specific edits in source package except migration evidence or documented neutral extraction | `git diff --name-only <base>...HEAD` plus dependency/import scan | Boundary violations absent | `evidence/package-boundary.json` |
| P06 | pre-cutover | Route parity | Expected-vs-generated routes are exhaustive | Run route comparison on full synchronized snapshot | 920 application pages with exact family counts; redirects/static classified; no unexplained missing/extra | `evidence/route-parity.json`, `evidence/route-parity.txt` |
| P07 | pre-cutover | Content parity | Automatable content semantics match | Compare normalized headings, links, text, code blocks, images across generated application pages | No unexplained differences | `evidence/content-parity.json` |
| P08 | pre-cutover | Documentation journey | Documentation navigation behavior works | Playwright desktop/mobile: open docs, sidebar keyboard/toggle, ToC/hash, previous/next, feedback | Meaningful interactions and URLs succeed; no unexpected console/network errors | `evidence/playwright/docs/` |
| P09 | pre-cutover | TSConfig journey | Reference navigation and option redirects work | Playwright browser and bot-UA checks | Active section/hash behavior; option bot/human behavior matches | `evidence/playwright/tsconfig/` |
| P10 | pre-cutover | Playground journey | Create/edit/share/settings/version flows work | Playwright with bounded waits and controlled CDN/network fixtures where needed | Monaco loads; edits compile; URL/share/settings/version behavior meaningful | `evidence/playwright/playground/` |
| P11 | pre-cutover | Playground real-network smoke | External Monaco/compiler/worker path is viable | One bounded browser smoke check without stubs | Playground becomes usable or concrete external blocker retained | `evidence/playwright/playground-network/` |
| P12 | pre-cutover | Developer journeys | Workbench pages initialize | Playwright representative Twoslash/Sandbox/VFS/plugin/bug flows | Useful interaction succeeds; no unexpected console/network errors | `evidence/playwright/developer/` |
| P13 | pre-cutover | Localization journey | Locale route and recommendation behavior works | Playwright locale matrix + representative mobile/desktop | Each family locale set covered; fallback, language recommendation and dismissal match | `evidence/playwright/localization/` |
| P14 | pre-cutover | Navigation/search | Header, internal links and DocSearch work | Playwright keyboard/mobile navigation and deterministic search fixture plus network smoke | Correct target URLs/results/focus; no broken internal link | `evidence/playwright/navigation-search/` |
| P15 | pre-cutover | Consent/settings | Consent and persistent theme/font settings work | Playwright with consent stub and reloads | Consent initialization and persisted classes/settings match | `evidence/playwright/consent-settings/` |
| P16 | pre-cutover | Marketing journeys | Documented new/existing user paths work | Playwright home -> download/docs/play/search across desktop/mobile | Journeys reach correct useful outcomes | `evidence/playwright/user-journeys/` |
| P17 | pre-cutover | Redirects | Every redirect declaration behaves correctly | Automated request/browser matrix for 23 declarations/22 unique paths | Correct destination/status/client behavior per hosting contract; collision documented | `evidence/redirects.json` |
| P18 | pre-cutover | 404 | Unknown route has usable error behavior | Request/browser check on target preview | Correct 404 artifact/status where host permits; no missing fallback target | `evidence/404.json`, screenshots |
| P19 | pre-cutover | Manifest/sitemap | Generated metadata artifacts are correct | Parse manifest and sitemap(s) | Manifest fields match; sitemap contains intended canonical application routes only, no redirects/build internals | `evidence/site-artifacts.json` |
| P20 | pre-cutover | Static/hosting assets | Static files and MIME/preview config survive | Asset manifest/hash/request checks | No missing linked/copied/worker/search/icon asset; Web.config/preview config correct | `evidence/static-assets.json` |
| P21 | pre-cutover | Links/assets | No broken internal links or required asset requests | Crawl all generated HTML and resolve local references | Zero unexplained broken local links/assets | `evidence/link-check.json` |
| P22 | pre-cutover | Metadata | Metadata is exhaustively equivalent | Parse every application page and compare title, description, lang, canonical, OG/Twitter contract | No unexplained missing/incorrect metadata | `evidence/metadata-parity.json` |
| P23 | pre-cutover | Visual/accessibility/responsive | Major layouts/states preserve UX | Playwright screenshots at desktop/mobile plus automated accessibility checks | Reviewed paired screenshots within documented tolerance; no new serious accessibility failures | `evidence/visual/`, `evidence/accessibility.json` |
| P24 | pre-cutover | Gatsby removal readiness | Target has no Gatsby runtime/API/shim/source imports | Dependency/import/config scan | No Gatsby package/API/graphql/config/compatibility alias/shim or Gatsby source-tree dependency | `evidence/gatsby-scan.json` |
| P25 | pre-cutover | Deletion readiness | Target builds/tests with source package unavailable | Disposable copy/worktree; remove/rename Gatsby package there; install/generate/check/test/build target | Complete target workflow exits 0; primary working copy untouched | `evidence/deletion-readiness.log`, `evidence/deletion-readiness.json` |
| P26 | pre-cutover | Local preview | Reviewable target is running after all gates pass | `pnpm run --filter=typescriptlang-org-astro preview`; bounded HTTP/browser checks on representative URLs | Root and major family URLs respond; review URL/screenshots/differences supplied | `evidence/preview-smoke.json`, screenshots |

### Post-cutover

| ID | Gate | Scope | Requirement | Method/command | Expected result | Required evidence |
|---|---|---|---|---|---|---|
| C01 | post-cutover | Root development | `pnpm start` selects Astro and watches prerequisites | Start bounded development smoke test | Astro root/representative route responds; Gatsby not launched | `evidence/cutover-dev.log` |
| C02 | post-cutover | Root build | `pnpm build-site` performs complete Astro site build | Clean output then root build | Exit 0; Astro `dist` complete | `evidence/cutover-build.log` |
| C03 | post-cutover | CI | Workflow builds/tests Astro on configured OS matrix | Static workflow assertion plus local equivalent; CI run when available | No Gatsby command/artifact; expected checks present | `evidence/ci-cutover.json` |
| C04 | post-cutover | Production | GitHub Pages workflow uploads Astro output | Workflow/config inspection and artifact simulation | `dist` copied/uploaded with required assets | `evidence/production-cutover.json` |
| C05 | post-cutover | Preview | Azure preview consumes Astro artifact/config | Workflow/config inspection and local artifact validation | Preview artifact is Astro `dist`; redirects/fallback config included | `evidence/preview-cutover.json` |
| C06 | post-cutover | Gatsby removal | Source framework is absent | Workspace-wide dependency/import/config/command/output scan | No required Gatsby package, import, API, config, command, `public` deployment path, `_gatsby` artifact, alias or shim | `evidence/final-gatsby-scan.json` |
| C07 | post-cutover | Workspace health | Remaining packages no longer write into removed source package | Search generators and run bootstrap/build | No writes/references to removed Gatsby package | `evidence/generator-decoupling.json` |
| C08 | post-cutover | Clean lifecycle | Fresh install/generate/build/test succeeds under Node 20.x | Clean checkout/worktree: install, localization, bootstrap, build, build-site, test | Every command exits 0 | `evidence/final-clean-lifecycle.log` |
| C09 | post-cutover | Final parity | All structural/runtime/visual checks remain green after removal | Rerun P06-P24 against final app | Passed evidence refreshed, no regression | Updated pre-cutover evidence plus `evidence/final-parity.json` |
| C10 | post-cutover | Final preview | Production preview starts and representative routes respond | Start bounded root preview and run smoke/browser checks | All major route families respond; commands/URLs/screenshots recorded | `evidence/final-preview.json`, screenshots |

## 4. Gate exit criteria

- Baseline exits only when B01-B04 are passed or a concrete external blocker is recorded. A blocked baseline cannot support cutover.
- A family is complete only when all applicable F checks pass with retained evidence.
- Cutover approval may be requested only when every B, applicable F, and P check is `passed` or an explicit user-approved `approved-difference`; `blocked`, `failed`, and `pending` do not satisfy the gate.
- Post-cutover completion requires C01-C10 and refreshed final parity to pass. Any unresolved required check makes the migration incomplete.

## 5. Plan change log

- 2026-07-29: Initial plan created before target application edits. 4 baseline, 11 per-family, 26 pre-cutover, and 10 post-cutover checks.
- 2026-08-04: P23 execution protocol strengthened without weakening its frozen 5% maximum difference ratio. Gatsby and Astro must run simultaneously on fixed ports and equivalent Playground URL/query/hash states must be captured with identical browser/version, viewport, device scale, theme, locale, fonts, content, and readiness conditions after fonts, images, hydration, Monaco, and required assets settle. Axe must run identically on both applications; findings retain rule, selector, HTML, foreground/background colors and contrast ratio, impact, and count, and are classified as migration regression, equivalent pre-existing debt, preserved improvement, or inconclusive conditions. Playground mobile evidence retains Gatsby, Astro, diff, measured pixels, and machine-readable diagnostics for DOM/text/assets, geometry and scroll dimensions, computed styles/media/stylesheets/fonts/images, hydration/overlays/stacking/pointer behavior, and click hit targets; remediation starts at the first top-to-bottom structural divergence. Every Playground control receives meaningful interaction assertions, and click failures retain `elementFromPoint`, interception, listener/hydration, console, and failed-request evidence. Gatsby is the remediation specification for regressions. Threshold increases, masks for real differences, accessibility-rule disabling, and behavior redesign are prohibited. After each coherent fix, rerun Playground desktop/mobile visual, interactions, responsive behavior, console/network, URL state, and accessibility; P23 remains failed until both satisfy the frozen criteria with no material unexplained difference.
