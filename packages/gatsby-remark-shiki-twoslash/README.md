### gatsby-remark-shiki-twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting. This part is basically the same as [gatsby-remark-shiki](https://www.gatsbyjs.org/packages/gatsby-remark-shiki/).

## Plugin Setup

#### Express Setup

[Read this PR](https://github.com/orta/gatsby-twoslash-shiki-blog/pull/1) and apply the same to your project.

#### Setup

1. **Install the dependency**: `yarn add gatsby-remark-shiki-twoslash`
1. **Include `"gatsby-remark-shiki-twoslash"` in the plugins section** of `gatsby-transformer-remark`

   ```diff
   {
     resolve: `gatsby-transformer-remark`,
     options: {
       plugins: [
         "gatsby-remark-autolink-headers",
   +       {
   +         resolve: "gatsby-remark-shiki-twoslash",
   +         options: {
   +            theme: "nord",
   +         }
   +       },
         "gatsby-remark-copy-linked-files",
         "gatsby-remark-smartypants",
       ],
     },
   }
   ```

   If you have `gatsby-remark-prismjs` in, delete it from the config and run `yarn remove gatsby-remark-prismjs`.

1. **Go read [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see what is available, this module leaves all the heavy work to that module.
