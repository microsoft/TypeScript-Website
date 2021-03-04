### shiki-twoslash

> Documentation / made lovely by counting words / maybe we would read!

Provides the API primitives to mix [shiki](https://shiki.matsu.io) with [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) to provide rich contextual code samples.

Things it handles:

- Shiki bootstrapping: `createShikiHighlighter`
- Running Twoslash over code, with caching and DTS lookups: `runTwoSlash`
- Rendering any code sample with Shiki: `renderCodeToHTML`

Libraries for common tools which use this generator:

- [gatsby-remark-shiki-twoslash](https://www.npmjs.com/package/gatsby-remark-shiki-twoslash) - For instantly using with Gatsby
- [remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash) - Any JS static site generator using Remark (11ty, nextjs, )

Or you can use the API directly in a Node.js script:

```ts
import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "shiki-twoslash"
import { writeFileSync } from "fs"

const go = async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `
// Hello world
const a = "123"
const b = "345"
    `
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

  fs.writeFileSync("output.html", html, "utf8")
}
```

### User Settings

The config which a user passes is an intersection of Shiki's [`HighlighterOptions`](https://unpkg.com/shiki/dist/index.d.ts)

```ts
interface HighlighterOptions {
  theme?: IThemeRegistration
  langs?: (Lang | ILanguageRegistration)[]
  themes?: IThemeRegistration[]
  /**
   * Paths for loading themes and langs. Relative to the package's root.
   */
  paths?: IHighlighterPaths
}
```

With twoslash's [`TwoSlashOptions`](https://unpkg.com/@typescript/twoslash/dist/index.d.ts)

```ts
export interface TwoSlashOptions {
  /** Allows setting any of the handbook options from outside the function, useful if you don't want LSP identifiers */
  defaultOptions?: Partial<ExampleOptions>
  /** Allows setting any of the compiler options from outside the function */
  defaultCompilerOptions?: CompilerOptions
  /** Allows applying custom transformers to the emit result, only useful with the showEmit output */
  customTransformers?: CustomTransformers
  /** An optional copy of the TypeScript import, if missing it will be require'd. */
  tsModule?: TS
  /** An optional copy of the lz-string import, if missing it will be require'd. */
  lzstringModule?: LZ
  /**
   * An optional Map object which is passed into @typescript/vfs - if you are using twoslash on the
   * web then you'll need this to set up your lib *.d.ts files. If missing, it will use your fs.
   */
  fsMap?: Map<string, string>
  /** The cwd for the folder which the virtual fs should be overlaid on top of when using local fs, opts to process.cwd() if not present */
  vfsRoot?: string
}
```

Most people will want to set a `theme`, and _maybe_ `vfsRoot` if they want to do twoslash with custom libraries in a monorepo:

```ts
{
  resolve: "gatsby-remark-shiki-twoslash",
  options: {
    theme: "github-light",
    vfsRoot: path.join(__dirname, "..", "..")
  },
}
```

### Common Use Case

##### Node Types in a Code Sample

To get the Node globals set up, import them via an inline triple-slash reference:

````
```ts twoslash
/// <reference types="node" />
import { execSync } from "child_process"
const files = execSync("git status --porcelain", { encoding: "utf8" })
files.length
```
````

This applies to other projects which use globals, like Jest etc. If you think that's ugly, that's OK, you can use `// ---cut---` to trim the user-visible output.

### API

The user-exposed parts of the API is a single file, you might find it easier to just read that: [`src/index.ts`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/shiki-twoslash/src/index.ts).

##### `createShikiHighlighter`

Sets up the highlighter for Shiki, accepts shiki options:

```ts
async function visitor(highlighterOpts) {
  const highlighter = await createShikiHighlighter(userOpts)
  visit(markdownAST, "code", visitor(highlighter, userOpts))
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
