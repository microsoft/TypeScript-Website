# TypeScript 7 playground

A static, plugin-free Monaco playground backed by a vendored `wasip1`
TypeScript compiler. It supports Twoslash `^?` type queries, compiler
diagnostics, and JavaScript emit.

The compiler packages, standard library declarations, and WASM module are
committed under `vendor`, so normal builds and deployments only need this
repository. Refresh them from a TypeScript checkout with:

```sh
TYPESCRIPT_REPO=/path/to/TypeScript pnpm --filter @typescript/ts7-playground vendor-typescript
```

Run `pnpm install` after refreshing the file dependencies.

The generated static site is written to `dist` and copied into the website's
ignored `packages/typescriptlang-org/static/ts7-playground` directory. Run the
local development server with:

```sh
pnpm --filter @typescript/ts7-playground dev
```

The compiler API is also exposed as `window.ts` for experiments in the browser
development console.

When running the full website, the playground is available at `/play/7/`.
