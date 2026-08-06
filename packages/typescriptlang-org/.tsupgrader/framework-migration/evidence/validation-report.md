# Gatsby to Astro validation report

Date: 2026-07-30

## Commands run

- `pnpm --filter documentation create-handbook-nav`
- `pnpm --filter typescriptlang-org-astro test`
- `pnpm --filter typescriptlang-org-astro check`
- `pnpm --filter typescriptlang-org-astro build`
- `pnpm --filter typescriptlang-org-astro validate:structure`

## What changed

- Extracted the ten Gatsby root-template semantic regions for all ten site-copy locales into target-owned, framework-independent structured data, including translated text, headings, local links, images, code, and Twoslash markers.
- Rendered all 100 root routes from that family-level data without target build/runtime imports from Gatsby source, copied the 15 referenced generated assets, and added exhaustive template/locale tests and retained root evidence.
- Added real TSConfig compatibility anchors for valid same-page option links exposed by the exhaustive root crawl; P21 remains at zero broken references without ignores.
- Added a framework-independent documentation navigation artifact at `packages/documentation/output/navigation.json` and updated the generator to keep it in sync.
- Switched Astro documentation sidebar ordering and previous/next behavior to the generated documentation navigation contract instead of filesystem/alphabetical order.
- Rewrote relative documentation markdown links and relative asset URLs from source-aware inputs so linked `.md` files resolve to their generated handbook routes and relative diagrams resolve under the current route.
- Fixed heading slug generation for markdown headings containing inline code so anchors preserve spaces and match handbook references more often.
- Changed content comparison normalization to extract the named `#handbook-content` region when present instead of comparing the first arbitrary `<article>` tag.
- Added deterministic tests for relative docs link rewriting, heading slugging, and navigation ordering.
- Added a narrow symmetric Playground link normalizer for Gatsby's build-time numeric `q` random bucket on same-page `#example/` links. It preserves locale paths, fragments, nonnumeric `q`, and meaningful query settings such as `strict`, `jsx`, and `target`; focused tests cover each boundary.
- Added target-owned structured Playground locale labels sourced from framework-independent locale/generated data. All ten roots now reproduce exact server semantics while retaining the independent Sandbox/Playground runtime and avoiding Gatsby source imports or baseline HTML snapshots.
- Added mapping-class tests for translated source-aware `.md` resolution, unavailable-locale fallback, legacy locale placement, release-note aliases and encoded paths, malformed Markdown destinations, `/en/play`, current online-handbook source, and historical anchor compatibility.
- Added a deterministic sequential compiler for all 283 documentation pages. It reuses one Remark/Twoslash processor and settings identity, rejects lost TypeScript/JavaScript Shiki registrations, and writes route-keyed HTML to a SHA-256 cache before Astro workers start.
- Added Gatsby-compatible GFM, smart punctuation, footnotes, raw-HTML preservation, heading aliases, and MD5 copied-file handling for Markdown and raw-HTML images.
- Added documentation feedback controls and desktop/mobile Playwright coverage for sidebar, ToC/hash, visible heading targets, previous/next navigation, and feedback confirmation.

## Current measured state

- Route parity: 920 expected application routes, 920 generated.
- Content parity: 920 / 920 exact matches and 0 / 920 mismatches. The empty mismatch set and aggregate distributions are retained in `content-parity.json`.
- Exact family matches: developer 6/6, documentation 283/283, glossary 1/1, playground 10/10, playground-example 361/361, playground-handbook 14/14, root 100/100, TSConfig 10/10, and TSConfig option 135/135.
- Documentation matches all required semantic fields on all 283 pages: headings, local links, image sources, code-block counts, Twoslash counts, and normalized text hashes.
- Metadata parity, static assets, generated assets, site artifacts, and P21 link checking pass. The exhaustive 952-page crawl checks 84,434 local references with 0 broken references. P07 content parity passes all 920 routes.

## Baseline comparison

- The corrected exhaustive baseline was 11 / 920 matches and 909 / 920 mismatches: developer 0/6, documentation 0/283, glossary 0/1, playground 0/10, playground-example 0/361, playground-handbook 11/14, root 0/100, TSConfig 0/10, and TSConfig option 0/135.
- The earlier claim of 196 / 283 documentation matches was not supported by retained evidence and contradicted the authoritative JSON. Its named-region RegExp encoded `\b` as a backspace in a JavaScript template string, so it never selected `#handbook-content`; it then compared different fallback article shells and truncated mismatch details to 100 records.
- After fixing region extraction, comparing only symmetric page-content regions, parsing TSConfig option frontmatter, and porting Playground SEO-page source segmentation, exact parity is 155 / 920. This is a gain of 144 exact pages without weakening required semantic fields.

## Remaining blockers

- Root has no remaining blocker: 16/100 became 100/100 and root field mismatches are empty.
- P21 and P07 have no remaining blocker. Developer is 6/6, Playground is 10/10, and all content-parity mismatch fields are empty.

## Status

- `test`: passed, 53/53
- `check`: passed, 50 files with zero errors (one pre-existing unused `reset` hint)
- `build`: passed
- `test:browser`: passed, 14/14 across desktop and mobile, including all six developer routes, a plugin-builder interaction, and localized Playground query/fragment/runtime smoke
- `validate:structure`: global P07 920/920, Playground 10/10, P21 passed across 84,434 local references with 0 broken, and generated assets, site artifacts, static assets, and P22 metadata parity all passed