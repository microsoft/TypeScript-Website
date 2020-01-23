### gatsby-remark-shiki

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code level of syntax highlighting:

```js
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      "gatsby-remark-twoslasher-code-blocks",
      "gatsby-remark-autolink-headers",
      "gatsby-remark-shiki",
      "gatsby-remark-copy-linked-files",
      "gatsby-remark-smartypants",
    ],
  },
}
```

You want this really late in the plugin process if you have anything else touching your code, as after this
the code will be raw HTML.
