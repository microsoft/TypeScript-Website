### gatsby-remark-shiki-twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting. This part is basically the same as [gatsby-remark-shiki](https://www.gatsbyjs.org/packages/gatsby-remark-shiki/).

Why Shiki? Shiki uses the same syntax highlighter engine as VS Code, which means no matter how complex your code is - it will syntax highlight correctly.

This module adds opt-in [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher)
rendering for TypeScript code blocks.

This powers the code samples on the TypeScript website.

![](https://user-images.githubusercontent.com/49038/78996047-ca7be880-7b11-11ea-9e6e-fa7ea8854993.png)

With a bit of work you can explain complicated code in a way that lets people introspect at their own pace.

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

1. **Add the CSS**

   This CSS comes from the [TypeScript website's scss](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/templates/markdown-twoslash.scss)

   You should consider it a base to work from, rather than a perfect for every project reference.

   ```css
   /* Code blocks look like: 
   <pre class='shiki twoslash'>
    <div class='language-id>[lang-id]</div>
    <div class='code-container'>
       <code>[the code as a series of spans]</code>
    </div>
   </pre> 
   */
   pre {
     /* In theory shiki will overwrite these, but this is to make sure there are defaults */
     background-color: white;
     color: black;
     /* Give it some space to breathe */
     padding: 12px;
     /* All code samples get a grey border, twoslash ones get a different color */
     border-left: 1px solid #999;
     border-bottom: 1px solid #999;
     margin-bottom: 3rem;
     /* Important to allow the code to move horizontally; */
     overflow: auto;
     position: relative;
   }
   pre.shiki {
     overflow: initial;
   }
   /* So that folks know you can highlight */
   pre.twoslash {
     border-color: #719af4;
   }
   /* The code inside should scroll, but the overflow can't be on the shiki because it would not allow the relative positioning */
   pre .code-container {
     overflow: auto;
   }
   /* Handle scrolling, and showing code correctly */
   pre code {
     white-space: pre;
     -webkit-overflow-scrolling: touch;
   }
   /* Let errors use the outer shiki for their absolute sizing, and not be affected by the scrolling of the code */
   pre data-err {
     background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23c94824'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
       repeat-x bottom left;
     padding-bottom: 3px;
   }
   /* In order to have the 'popped out' style design and to not break the layout
   /* we need to place a fake and un-selectable copy of the error which _isn't_ broken out
   /* behind the actual error message.
   /* This section keeps both of those in sync  */
   pre .error,
   pre .error-behind {
     margin-left: -20px;
     margin-top: 8px;
     margin-bottom: 4px;
     padding: 6px;
     padding-left: 14px;
     white-space: pre-wrap;
     display: block;
   }
   pre .error {
     position: absolute;
     background-color: #ffeeee;
     border-left: 2px solid #bf1818;
     width: calc(100% - 14px);
     /* Give the space to the error code  */
     display: flex;
     align-items: center;
     color: black;
   }
   pre .error .code {
     display: none;
   }
   pre .error-behind {
     user-select: none;
     color: #ffeeee;
   }
   data-lsp {
     /* Ensures there's no 1px jump when the hover happens above */
     border-bottom: 1px dotted transparent;
     /* Fades in unobtrusively */
     transition-timing-function: ease;
     transition: border-color 0.3s;
   }
   /* Respect people's wishes to not have animations */
   @media (prefers-reduced-motion: reduce) {
     data-lsp {
       transition: none;
     }
   }
   /** When you mouse over the pre, show the underlines */
   pre:hover data-lsp {
     border-color: #747474;
   }
   /** The tooltip-like which provides the LSP response */
   #twoslash-mouse-hover-info {
     background-color: #3f3f3f;
     color: #fff;
     text-align: left;
     padding: 5px 8px;
     border-radius: 2px;
     font-family: 'Jet Brains Mono', Menlo, Monaco, Consolas, Courier New, monospace;
     font-size: 14px;
     white-space: pre-wrap;
   }
   ```

1. **Add the JS** for hover info to your component:

   ```jsx
   import React, { useEffect } from "react"
   import { setupTwoslashHovers } from "gatsby-remark-shiki-twoslash/dom";

   export default () => {
     // Add a the hovers
     useEffect(setupTwoslashHovers, [])

       // Normal JSX for your component
     return </>
   }
   ```

### Verify

With that set up, start up your server and add a codeblock to a markdown file to see if it renders with highlights:

<pre>```json
{ "json": true }
```</pre>

If that works, then add a twoslash example:

<pre>```ts twoslash
interface IdLabel {id: number, /* some fields */ }
interface NameLabel {name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript");`
```</pre>

If the code sample shows as

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented'
}

let a = createLabel('typescript')
```

Then it worked, and you should be able to hover over `createLabel` to see it's types.

### Plugin Config

This plugin passes the config options directly to Shiki. You probably will want to
[set `theme`](https://github.com/octref/shiki/blob/master/packages/themes/README.md#shiki-themes).
