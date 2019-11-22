### gatsby-remark-twoslasher-code-blocks

Sets up code blocks to run through ts-twoslasher:

```js
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      "gatsby-remark-twoslasher-code-blocks",
      {
        resolve: `gatsby-remark-images`,
        options: {
          maxWidth: 590,
        },
      },
      {
        resolve: `gatsby-remark-responsive-iframe`,
        options: {
          wrapperStyle: `margin-bottom: 1.0725rem`,
        },
      },
      "gatsby-remark-autolink-headers",
      "gatsby-remark-prismjs",
      "gatsby-remark-copy-linked-files",
      "gatsby-remark-smartypants",
    ],
  },
}
```

Currently it only works when you specify twoslash in your codeblock

```js
// Nothing will happen
'''ts
// @showEmit
// @target ES5
const staysAsTypeScript = true
'''

// This will convert
'''ts twoslash
// @showEmit
// @target ES5

const staysAsTypeScript = false
```
