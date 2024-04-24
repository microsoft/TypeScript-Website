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

Create a folder in this repo, then sub-folders per section. Next,
edit `generateTOC.js` with at the set of folders it should grab
at around line 30, then edit the `const toc` further down to
add a new section. If you need custom ordering then use the
`sortedSubSections` array to set your order.
