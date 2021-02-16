### shiki-twoslash

> Documentation / made lovely by counting words / maybe we would read!

Provides the API primitives to mix [shiki](https://shiki.matsu.io) with [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) to provide rich contextual code samples.

Things it handles:

- Shiki bootstrapping: `createShikiHighlighter`
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

```ts
/**
 * Renders a code sample to HTML, automatically taking into account:
 *
 *  - rendering overrides for twoslash and tsconfig
 *  - whether the language exists in shiki
 *
 * @param code the source code to render
 * @param lang the language to use in highlighting
 * @param info additional metadata which lives after the codefence lang (e.g. ["twoslash"])
 * @param highlighter optional, but you should use it, highlighter
 * @param twoslash optional, but required when info contains 'twoslash' as a string
 */
export declare const renderCodeToHTML: (
  code: string,
  lang: string,
  info: string[],
  shikiOptions?: import("shiki/dist/renderer").HtmlRendererOptions | undefined,
  highlighter?: Highlighter | undefined,
  twoslash?: TwoSlashReturn | undefined
) => string
```

For example:

```ts
const results = renderCodeToHTML(node.value, lang, node.meta || [], {}, highlighter, node.twoslash)
node.type = "html"
node.value = results
node.children = []
```

Uses:

- `renderers.plainTextRenderer` for language which shiki cannot handle
- `renderers.defaultRenderer` for shiki highlighted code samples
- `renderers.twoslashRenderer` for twoslash powered TypeScript code samples
- `renderers.tsconfigJSONRenderer` for extra annotations to JSON which is known to be a TSConfig file

These will be used automatically for you, depending on whether the language is available or what the `info` param is set to.

To get access to the twoslash renderer, you'll need to pass in the results of a twoslash run to `renderCodeToHTML`:

```ts
const highlighter = await createShikiHighlighter(highlighterOpts)
const twoslashResults = runTwoSlash(code, lang)
const results = renderCodeToHTML(
  twoslashResults.code,
  twoslashResults.lang,
  node.meta || ["twoslash"],
  {},
  highlighter,
  node.twoslash
)
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
- [remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)
