# Playground v2

The application served at `/play/v2/`.

Run the normal repository bootstrap first. From the repository root:

```sh
pnpm --filter @typescript/playground-v2 dev
pnpm --filter @typescript/playground-v2 typecheck
pnpm --filter @typescript/playground-v2 test
pnpm --filter @typescript/playground-v2 build
```

Compiler code is fetched at runtime, never bundled.
Installed compiler packages are development dependencies for types and tests,
not the default runtime version.

See [package type acquisition](src/ata/README.md) for its API and limitations.
