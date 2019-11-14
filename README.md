### Getting Started

This repo uses [yarn workspaces][y-wrk], to get started clone this repo and run `yarn install`.

```sh
git clone https://github.com/microsoft/TypeScript-website
cd TypeScript-website
yarn install
yarn bootstrap
code .
```

# Packages

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

## Playground Sandbox

A create-react-app for working on the playground.

## TSConfig Reference

A set of tools and scripts for generating a comprehensive API reference for the TSConfig JSON file.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
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
