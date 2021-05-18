### VuePress Shiki Twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

#### Setup

1. **Install the dependency**: `yarn add vuepress-shiki-twoslash`
1. **Include `"vuepress-shiki-twoslash"` in the plugins section** of `./vuepress/config.ts`

   ```diff
   + import vuepressShikiTwoslash from "vuepress-shiki-twoslash"

   export default defineUserConfig<DefaultThemeOptions>({
     lang: 'en-US',
     title: 'Hello VuePress',
     description: 'Just playing around',

     themeConfig: {
       logo: 'https://vuejs.org/images/logo.png',
     },
   + plugins: [
   +   [vuepressShikiTwoslash, { theme: "nord" }]
   + ]
   })
   ```

1. **Go read [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see what is available, this module leaves all the heavy work to that module.
