## Contributing to a TypeScript Playground Plugin

## Contributing

You can use `pnpm start` to set up both a copy of Rollup to generate the JS, and Serve to host it.

```sh
pnpm start
```

Then set up the TypeScript playground to connect to a dev plugin at `http://localhost:5000/`.

#### Plugin API

The plugin API is documented in the [interface PlaygroundPlugin in `./src/index.ts`](src/index.ts).

Roughly:

- There are a set of mounting and un-mounting functions which you can use to handle your UI in the sidebar
- There are `modelChanged` methods, which are shortcuts to knowing when the code in monaco editor has changed

### Sandbox

The plugins are passed copies of the TypeScript sandbox, which is a high level API wrapper to the [`monaco-editor`](https://microsoft.github.io/monaco-editor/). You can learn more about the sandbox on [the TypeScript website](http://www.typescriptlang.org/v2/dev/sandbox/).

#### Rollup

[Rollup](https://rollupjs.org) is a JavaScript bundler, that will take all of the TypeScript + JavaScript code you reference and then create an AMD bundle for it all. AMD bundles are used in Monaco, TypeScript Sandbox and the Playground - so, this is used for consistency with the rest of the ecosystem.

## Adding a dependency

Because most node_modules expect to be running in node, you might have to do some work to get the dependency working on the web.

The route to handle this is via rollup:

- add a new dependency via `pnpm add xyz`
- import it into your `index.ts`
- run `pnpm build` - did it provide some error messages?
  - If it did, you may need to edit your `rollup.config.js`.
  - You could probably start by taking the [rollup config from `playground-plugin-tsquery`](https://github.com/orta/playground-plugin-tsquery/blob/master/rollup.config.js) and by adding any extra externals and globals.

#### Serve

[Serve](https://github.com/zeit/serve) is used to make a web-server for the dist folder.

## Deployment

This module should be deployed to npm when you would like the world to see it, this may mean making your code handle a staging vs production environment (because the URLs will be different.)

For example, this is how you can handle getting the URL for a CSS file which is included in your `dist` folder:

```ts
const isDev = document.location.host.includes("localhost")
const unpkgURL = "https://unpkg.com/typescript-playground-presentation-mode@latest/dist/slideshow.css"
const cssHref = isDev ? "http://localhost:5000/slideshow.css" : unpkgURL
```

### Post-Deploy

Once this is deployed, you can test it on the TypeScript playground by passing in the name of your plugin on npm to the custom plugin box. This is effectively your staging environment.

Once you're happy and it's polished, you can apply to have it in the default plugin list.

## Support

Ask questions either on the [TypeScript Website issues](https://github.com/microsoft/TypeScript-Website/issues), or in the [TypeScript Community Discord](https://discord.gg/typescript) - in the TypeScript Website channel.
