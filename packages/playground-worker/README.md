### The Playground Worker

This is a WebWorker function which the Playground uses to wrap the TypeScript Language Service. You can learn about how this works in this PR to monaco-typescript: https://github.com/microsoft/monaco-typescript/pull/65

The worker is a factory function which returns a subclass for the TSServer to monaco language bindings, this subclass takes into account the `// @filename: abc.ts` syntax which is used all over the place in TypeScript code.

The code is well commented, so better to just go read that to learn more: [`index.ts`](./index.ts).
