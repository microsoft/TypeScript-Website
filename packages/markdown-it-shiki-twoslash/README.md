### markdown-it-shiki-twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

## Plugin Setup

1. **Install the dependency**: `yarn add markdown-it-shiki-twoslash`
1. **Include `"markdown-it-shiki-twoslash"` in the plugins section** of the markdown-it parser:

   ```ts
   import shikiTwoslash from "markdown-it-shiki-twoslash"
   import MarkdownIt from "markdown-it"

   const md = MarkdownIt()
   md.use(shikiTwoslash, { theme: "nord" })

   const html = md.render(file)
   ```

   or _even better_:

   ```ts
   import { markdownItShikiTwoslashSetup } from "markdown-it-shiki-twoslash"
   import MarkdownIt from "markdown-it"

   const md = MarkdownIt()

   const shiki = await markdownItShikiTwoslashSetup({
     theme: "nord",
   })

   md.use(shiki)
   const html = md.render(file)
   ```

   Because shiki uses WASM to handle the syntax highlighting, _it has to be async code_, this clashes with the markdown-it API which enforces synchronous code. In the first code sample, the plugin uses [`deasync`](https://www.npmjs.com/package/deasync) to convert that async work to sync. It's safe to say that you _probably don't want deasync'd code in critical systems_.

1. **Follow the instructions on [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)**, this module leaves all the heavy work to that module.
