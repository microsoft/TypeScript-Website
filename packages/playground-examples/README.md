# TypeScript Example Code

The English examples can be found in [`en/`](en/).

# TypeScript Example Code

These samples are built for hyperlinking between each-other
in a sandboxed environment like the TypeScript Playground.

Each example aims to cover one or two specific features to
either how JavaScript works in TypeScript, or features which
TypeScript has added to the language.

An example should make assumptions that the reader is in a
monaco/IDE-like environment which has a TSServer running for
to provide extra analysis. As well as a minor fluency in
JavaScript.

These examples are not set in stone, and we're open to new
ideas. If you'd like to help out and speak more than one
language, we'd love to see translations.

## Adding a new example section

Create a folder in the english section of the [`copy`](./copy) folder,
then add sub-folders per section which you'd want to have as headers
with 3-5 examples.

## Adding a localization

All localizations live inside the `copy` folder:

- There must be a `sections.json` in the root of each language
- A language is created by copying over an english example with the same path, and then translating it
- Any examples not copied over fall back to the english version
- You can change the name of an example for your language by having `//// { "title": 'c0d3 fl0w', ... }` in the first line of the example

Languages are compiled to TOC JSON files in [`generated`](./generated), one per lanaguge.

# Deployment

There is a table of contents JSON file which contains
all the useful metadata about the hierarchy and sort
order for the docs.

It's likely that we'll need to create this per translation
in the future, but for now the table of contents will
default to english.

The script is in [`scripts/generateTOC.js`](scripts/generateTOC.js), with  
\output of the build process is then copied into the `typescriptlang-org`
module under `static/js/examples` in [`scripts/copyFiles.js`](scripts/copyFiles.js).
