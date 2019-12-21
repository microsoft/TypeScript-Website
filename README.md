### Getting Started

This repo uses [yarn workspaces][y-wrk], to get started clone this repo and run `yarn install`.

```sh
git clone https://github.com/microsoft/TypeScript-website
cd TypeScript-website
yarn install
yarn bootstrap
code .
```

# Website Packages

## TypeScriptLang-Org

The main website for TypeScript, a Gatsby website which is statically deployed.

```sh
yarn start
```

## Playground

A React component for the TypeScript playground base component. Not the one available on
the site, but one you can use in other websites for showing off your APIs.

You can work on the playground by running:

```sh
yarn playground
```

Then opening: http://localhost:1234 - which is the below package.

# Doc Packages

## TSConfig Reference

A set of tools and scripts for generating a comprehensive API reference for the TSConfig JSON file.

```sh
# Generate JSON from the typescript cli
yarn workspace tsconfig-reference run generate-json
# Jams them all into a single file
yarn workspace tsconfig-reference run generate-markdown
```

Validate the docs

```sh
yarn workspace tsconfig-reference run test

# or to just run the linter without a build
yarn workspace tsconfig-reference run lint

# or to just one one linter
yarn workspace tsconfig-reference run lint resolveJson
```

## Handbook V1

The existing docs for TypeScript

## Handbook V2

The upcoming docs for TypeScript

## Playground Examples

The code samples used in the Playground

# Infra Packages

## TS Twoslasher

A code sample markup extension for TypeScript.

```sh
# Tests
yarn workspace ts-twoslasher test

# Build
yarn workspace ts-twoslasher build
```

## Gatsby Remark Twoslasher Code Blocks

A Gasby Remark plugin which runs twoslash for any code blocks with twoslash in their metadata

## Gatsby Remark Shiki

A Gasby Remark plugin which highlights code (using vscode's parsers) then annotates the code with twoslash information

```sh
# Tests
yarn workspace gatsby-remark-shiki test

# Build
yarn workspace gatsby-remark-shiki build
```

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

[y-wrk]: https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/
