## Gist Docsets

If you want to explain something which requires looking at a problem from many angles, or feel like there's value in interspersing text between code samples - you can create a Playground Docset powered by a GitHub Gist. These docsets are generated at runtime from `.ts`, `.tsx`, `.tsx`, `.mjs`, and `.md` files inside a gist which create you separately from the Playground.

For example, the re-creation of the 2020 blog post series `Type | Treat` you can see https://gist.github.com/303ebff59a6fc37f88c86e86dbdeb0e8 - the URL for loading this gist into the Playground is:

```
https://www.typescriptlang.org/play#gist/303ebff59a6fc37f88c86e86dbdeb0e8-6
//                                       ^ gist id                        ^ page
```

This works by utilizing the [TypeScript-Playground-Gist-Proxy-API](https://github.com/microsoft/TypeScript-Playground-Gist-Proxy-API) which safely pre-renders the markdown to HTML, and passes through the TS/JS files to the playground.

### Single File Gists

If you want to simply make a _really_ long Playground, you can make a gist of a single file and that will be loaded into the Playground without ceremony.

### Multi-file Playgrounds

Gist powered Playgrounds are where the interesting complexity lays. You can use a combination of `.ts`, `.tsx`, `.js` and `.md` files to create a compelling docset.

#### Naming Systems

The Playground supports ordering in the sidebar via the file's name. You can prefix the file name with an index. For example: `"0 ~ Intro.md` would come first, after that `01 ~ code.ts`. The Playground will strip any leading whitespace after removing the `~` to extract the index.

If you leave a gap between numbers, for example `03 ~ Wrap Up.md` and then `05 ~ Part Two.md` then the 4th index will show in the sidebar as a dash indicating the end of a group.

Life is easier when working with the gist if you add the `0` for numbers before ten, that's optional.

#### Code Files

Each code file replaces the main content of the playground, meaning you cannot import between individual files. State is not saved per file, so if you edit a code file and then change the page - the Playground will not restore those changes if you come back.

Code files support setting compiler options via a special fourslash comment in the top line:

```js
//// { compiler: { strictNullChecks: false } }
// The first actual line of my code

const a = 123
```

Would set `strictNullChecks` to false, and then remove that line from the code sample.

The compiler flags are set when a user clicks on the page, it is not reverted back when they click to another page. If you rely on switching between settings to showcase an idea, it's better to be explicit in both.

#### Markdown

Markdown is rendered to HTML via the [GitHub Markdown API](https://docs.github.com/en/rest/reference/markdown) which means any features you see on GitHub are reflected in the markdown in the Playground.

If you want to link between pages, you can use the full Playground address of your gist with the page and the Playground will override those links and treat it as though you had clicked in the sidebar.

Any other link will automatically get `target="_blank"` applied.
