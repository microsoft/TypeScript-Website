### Meta

- **URLs:** [production](https://www.typescriptlang.org)
- **Translations:** [microsoft/TypeScript-Website-Localizations](https://github.com/microsoft/TypeScript-Website-Localizations)

### Getting Started

This repo uses pnpm workspaces with Node.js 20 or newer.

With those set up, clone this repo and run `pnpm install`.

```sh
git clone https://github.com/microsoft/TypeScript-website
cd TypeScript-website
pnpm install
code .

# Optional, grab the translations:
pnpm docs-sync pull microsoft/TypeScript-Website-localizations#main 1

# Start the Astro development server
pnpm start
```

### Local website development

Run `pnpm start` from the repository root and open <http://localhost:4321>.

On the first run after cloning, `pnpm start` generates the content, dependencies,
browser assets, and documentation cache required by the Astro development server.
This preparation can take several minutes. Later runs reuse those generated artifacts
and normally start within a few seconds.

Keep the command running while you work. Astro hot reloads its source files. Saving a
Markdown file under `packages/documentation/copy` also regenerates the documentation
navigation, recompiles the changed page, and reloads Astro. You do not need to update
`packages/documentation/output/navigation.json` manually.

If generated content or dependencies appear stale, force a complete refresh before
starting the development server:

```sh
pnpm --dir packages/typescriptlang-org-astro dev:fresh
```

### Validate a website change

Run the checks relevant to your change before opening a pull request:

```sh
# Astro and TypeScript diagnostics
pnpm compile

# Content and generated-output tests
pnpm --dir packages/typescriptlang-org-astro test

# Complete production build
pnpm build-site

# Browser tests on the production build, using desktop and mobile projects
pnpm --dir packages/typescriptlang-org-astro test:browser
```

`pnpm build-site` always regenerates all content, dependencies, and assets. It then
pre-renders and bundles the production website into
`packages/typescriptlang-org-astro/dist`, creates redirects and 404 configuration,
repairs compatibility links and anchors, and writes the sitemap and route manifest.
It does not start a persistent server or run the test suites listed above. The browser
tests temporarily serve the completed `dist` directory themselves.

To inspect the completed production build locally, run:

```sh
pnpm --dir packages/typescriptlang-org-astro preview
```

The usual contribution flow is to run `pnpm start`, make and inspect the change,
run the relevant validation commands, review `git status` and `git diff`, commit the
intended files, push the branch, and open a pull request. CI repeats the required build
and validation before a reviewed change is merged and deployed.

Some useful knowledge you need to know:

- All packages have: `pnpm build` and `pnpm test`
- All packages use [debug](https://www.npmjs.com/package/debug) - which means you can do `env DEBUG="*" pnpm test` to get verbose logs

Having issues getting set up? [Consult the troubleshooting](./docs/Setup%20Troubleshooting.md).

## Deployment

Deployment is automatic:

- Pushes to the branch `v2` deploy to [production](https://www.typescriptlang.org)

You can find the build logs in [GitHub Actions](https://github.com/microsoft/TypeScript-Website/actions)

## Docs

If you want to know _in-depth_ how this website works, there is an [hour long video covering the codebase, deployment and tooling on YouTube.](https://www.youtube.com/watch?v=HOvivt6B7hE). Otherwise there are some short guides:

- [Converting Twoslash Code Samples](./docs/Converting%20Twoslash%20Code%20Samples.md)
- [How i18n Works For Site Copy](./docs/How%20i18n%20Works%20For%20Site%20Copy.md)
- [Updating the TypeScript Version](./docs/New%20TypeScript%20Version.md)
- [Something Went Wrong](./docs/Something%20Went%20Wrong.md)

## Changesets

This repo uses `pnpm` + `changesets` to manage package version bumps and releases.

CI will fail if a PR modifies a public package but is missing a changeset. To add a changeset, run `pnpm changeset`, then follow along with the CLI.

```console
$ pnpm changeset
🦋  Which packages would you like to include? …
◯ changed packages
  ◯ create-typescript-playground-plugin
  ◯ @typescript/vfs
  ◯ @typescript/twoslash
  ◯ @typescript/sandbox
  ◯ @typescript/ata
```

New files will be created in `.changeset` and must be committed.

PRs which don't modify public packages (e.g. website content updates) do not require changesets.
If you are making a change to a published package but are not affecting published code, you can create an empty changeset for your PR with `pnpm changeset --empty`.

# Website Packages

## TypeScriptLang-Org Astro

The main TypeScript website is statically built with Astro. Run it via:

```sh
pnpm start
```

## Sandbox

The editor aspect of the TypeScript Playground REPL, useable for all sites which want to show a monaco editor
with TypeScript or JavaScript code.

## Playground

The JS code has an AMD module for the playground which is loaded at runtime in the Playground website.

# Doc Packages

## TSConfig Reference

A set of tools and scripts for generating a comprehensive API reference for the TSConfig JSON file.

```sh
# Generate JSON from the typescript cli
pnpm run --filter=tsconfig-reference generate-json
# Jams them all into a single file
pnpm run --filter=tsconfig-reference generate-markdown
```

Validate the docs:

```sh
pnpm run --filter=tsconfig-reference test

# or to just run the linter without a build
pnpm run --filter=tsconfig-reference lint

# or to just one one linter for a single doc
pnpm run --filter=tsconfig-reference lint resolveJson
```

## Documentation

The docs for TypeScript. Originally ported over from [microsoft/TypeScript-Handbook](https://github.com/microsoft/TypeScript-Handbook/) then intermingled with [microsoft/TypeScript-New-Handbook](https://github.com/microsoft/TypeScript-New-Handbook).

## JSON Schema

It's a little odd, but the `tsconfig-reference` package creates the JSON schema for a TSConfig files:

```sh
pnpm run --filter=tsconfig-reference build
```

Then you can find it at: [`packages/tsconfig-reference/scripts/schema/result/schema.json`](packages/tsconfig-reference/scripts/schema/result/schema.json).

## Playground Handbook

The user-facing documentation for the Playground.

## Playground Examples

The code samples used in the Playground split across many languages.

# Infra Packages

Most of these packages use (a maintained [fork](https://github.com/weiran-zsd/dts-cli) of) [`tsdx`](https://tsdx.io).

## TS Twoslash

A code sample markup extension for TypeScript. Available on npm: [@typescript/twoslash](https://www.npmjs.com/package/@typescript/twoslash)

## TypeScript VFS

A comprehensive way to run TypeScript projects in-memory in a browser or node environment. Available on npm: [@typescript/vfs](https://www.npmjs.com/package/@typescript/vfs)

## Create Playground Plugin

A template for generating a new playground plugin which you can use via `npm init playground-plugin [name]`

## Community Meta

Generates contribution JSON metadata on who edited handbook pages.

## Playground Worker

A web worker which sits between the Playground and Monaco-TypeScript

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all other rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
