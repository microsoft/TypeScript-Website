# Playground v2

The private package behind `/play/v2/`. The existing Playground remains at
`/play/`.

## Development

Run the normal repository bootstrap first. From the repository root:

```sh
pnpm --filter @typescript/playground-v2 dev
pnpm --filter @typescript/playground-v2 typecheck
pnpm --filter @typescript/playground-v2 test
pnpm --filter @typescript/playground-v2 build
```

The build composes examples from `playground-examples`' generated English index
and canonical source files. In-app help is handwritten in `src/help.json`.
Neither requires a vendoring step.

## Compiler delivery

No compiler implementation is bundled with the website. Installed native API
and WASI packages are development dependencies for types and offline tests;
their versions do not select the runtime compiler.

The version menu discovers native releases from jsDelivr's npm metadata API
and historical releases from the Playground CDN index. New visits follow the
latest supported stable release, or Nightly until one is available. Exact
version links remain fixed.

Native support starts at `7.1.0-dev.20261030.1`. Earlier 7.x builds, including
`7.1.0-beta`, have no supported WASM host/artifact pair. At runtime, package
manifests determine immutable UNPKG URLs, and API/WASI revisions must agree.
The WASI package's `lib/libFiles.json` lists standard libraries; the schema
comes from the matching compiler package. Package unpacked sizes provide the
initial download estimate.

Published historical JavaScript compilers and libraries also load from exact
UNPKG URLs, with the compiler's own version checked before startup. Custom/PR
builds use the Playground CDN. There is no checked-in distribution manifest
or compiler update script.

## Runtime

Native emit, whole-project diagnostics, type queries, and dependency discovery
run in a worker separate from the language-server worker. The API, AST helpers,
and reactor host are dynamically imported there; no native compiler instance
or `window.ts` is created on the page.

Native compilation reuses snapshots across edits, coalesces pending requests,
and ignores stale responses. Files outside the configured project need an
inferred program only for type queries. Whole-project diagnostics remain
independent of Monaco's per-document reports.

Historical compilers provide compilation and language-service features in
their worker. Their main-page parser is used internally for package discovery.

See [package type acquisition](src/ata/README.md) for declaration discovery,
resolution, caching, and acquisition policy.
