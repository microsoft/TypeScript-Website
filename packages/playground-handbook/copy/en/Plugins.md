## Playground Plugins

The Playground aims to cover nearly all of the key features you might want in a sandbox-ed environment for writing TypeScript. The Playground plugins system allows the Playground to be extended in new directions.

There are three main categories of plugins as of 2021:

### Playground Extensions

Plugins like [Presentation Mode](https://www.npmjs.com/package/typescript-playground-presentation-mode) and [Codeblock Examples](https://www.npmjs.com/package/playground-plugin-codeblock-examples) make it easy to use the Playground as a live-coding environment for presenting to others. [Prettier](https://www.npmjs.com/package/ts-playground-plugin-prettier) and [Link Shortener](https://www.npmjs.com/package/typescript-playground-link-shortener) help you use other tools when working, and the [Vim](https://www.npmjs.com/package/ts-playground-plugin-vim) plugin adds Vim keybindings to the playground!

### Introspection Tools

Plugins like [Transformer Timeline](https://www.npmjs.com/package/playground-transformer-timeline), [Code Show Flow](https://www.npmjs.com/package/playground-code-show-flow), [TS Scanner](https://www.npmjs.com/package/playground-ts-scanner), [Live Transformer](https://www.npmjs.com/package/playground-live-transformer) and [TS Symbols](https://www.npmjs.com/package/playground-ts-symbols) are plugins which help you to understand how TypeScript understands and transforms the code you have in your editor.

### Exporting Information

Plugins like [TypeScript JSON Schema](https://www.npmjs.com/package/playground-typescript-json-schema), [Dts Plugin](https://www.npmjs.com/package/playground-dts-plugin) and [@structuredtypes/plugin](https://www.npmjs.com/package/@structured-types/playground-plugin) take the code you write in the editor and transform it into another format.

This isn't all of the plugins, you can go and see the full list in the "Plugins" tab of the sidebar. You can do it now and still keep reading actually. Anyone can create a plugin, you just need to be familiar with TypeScript and working in a web browser. if you're interested you can learn more in [Writing Plugins](/play#handbook-17).

Otherwise, we'll be looking at how to [export code](/play#handbook-12) from the Playground.
