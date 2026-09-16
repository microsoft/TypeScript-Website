# TypeScript 7.1 playground

A static, plugin-free Monaco playground backed by the `wasip1` TypeScript
compiler. It supports Twoslash `^?` type queries, compiler diagnostics, and
JavaScript emit.

The build uses the sibling `../TypeScript` checkout by default. Override it
with `TYPESCRIPT_REPO` when needed:

```sh
TYPESCRIPT_REPO=/path/to/TypeScript pnpm --filter @typescript/ts7-playground build
```

The generated static site is written to `dist` and copied into the website's
ignored `packages/typescriptlang-org/static/ts7-playground` directory. Run the
local development server with:

```sh
pnpm --filter @typescript/ts7-playground dev
```

The compiler API is also exposed as `window.ts` for experiments in the browser
development console.

When running the full website, the playground is available at `/play/7-1/`.
