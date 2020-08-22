### shiki-twoslash

Provides the API primitives to mix [shiki](https://shiki.matsu.io) with [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher).

Things it handles:

- Shiki bootstrapping: `createShikiHighlighter`
- Checking if shiki can handle a code sample: `canHighlightLang`
- Running Twoslash over code, with caching and DTS lookups: `runTwoSlash`
- Rendering any code sample with Shiki: `renderCodeToHTML`

### API

The user-exposed parts of the API is a single file, you might find it easier to just read that: [`src/index.ts`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/shiki-twoslash/src/index.ts).

##### `createShikiHighlighter`

Sets up the highlighter for Shiki, accepts shiki options:

```ts
async function visitor(highlighterOpts, shikiOpts) {
  const highlighter = await createShikiHighlighter(highlighterOpts)
  visit(markdownAST, "code", visitor(highlighter, shikiOpts))
}
```

##### `renderCodeToHTML`

Renders source code into HTML via Shiki:

```ts
const shouldHighlight = lang && canHighlightLang(lang)

if (shouldHighlight) {
  const results = renderCodeToHTML(node.value, lang, highlighter)
  node.type = "html"
  node.children = []
}
```

To get access to the twoslash renderer, you'll need to pass in the results of a twoslash run to `renderCodeToHTML`:

```ts
const highlighter = await createShikiHighlighter(highlighterOpts)
const twoslashResults = runTwoSlash(code, lang)
const html = renderCodeToHTML(twoslashResults.code, twoslashResults.lang, highlighter)
```

#### `runTwoSlash`

Used to run Twoslash on a code sample. In this case it's looking at a code AST node and switching out the HTML with the twoslash results:

```ts
if (node.meta && node.meta.includes("twoslash")) {
  const results = runTwoSlash(node.value, node.lang, settings)
  node.value = results.code
  node.lang = results.extension
  node.twoslash = results
}
```

### Used in:

- [gatsby-remark-shiki-twoslash](https://www.npmjs.com/package/gatsby-remark-shiki-twoslash)
