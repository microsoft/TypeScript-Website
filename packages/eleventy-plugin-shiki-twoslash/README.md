### Eleventy Shiki Twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

#### Setup

1. **Install the dependency**: `yarn add eleventy-plugin-shiki-twoslash`
1. **Include `"eleventy-plugin-shiki-twoslash"` in the plugins section** of `.eleventy.js`

   ```ts
   const shikiTwoslash = require("eleventy-plugin-shiki-twoslash")

   module.exports = function (eleventyConfig) {
     eleventyConfig.addPlugin(shikiTwoslash, { theme: "nord" })
   }
   ```

1. **Go read [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see the next steps, and what is available, this module leaves all the heavy work to that module.
