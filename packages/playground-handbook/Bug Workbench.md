### Bug Workbench

The TypeScript team are big users of Playground for reproducing bugs and testing out features. Sometimes however, we need even more in-depth tools and that is what the Bug Workbench is. The Bug Workbench is a fork of the Playground with an on emphasis on creating and displaying complex reproductions of bugs. You can find it at https://www.typescriptlang.org/dev/bug-workbench/

The bug workbench uses Twoslash Commands (which are documented in the bug workbench, so we'll skip that here) to describe particular side effects like the the 'js emit', 'this type at this position', 'these errors' etc

The bug workbench has an 'Export to Markdown' feature which will trigger special behavior in the issues for the repo [microsoft/TypeScript](https://github.com/microsoft/TypeScript) via [microsoft/TypeScript-Twoslash-Repro-Action](https://github.com/microsoft/TypeScript-Twoslash-Repro-Action#twoslash-verify-github-action). Specially, a comment like:

````
```ts repro
const hello = "Hello"
const msg = `${hello}, world` as const
//    ^?
```
````

Would create a table summary of the type in `msg` across nightly builds, and the last 5 production versions of TypeScript. This gets checked every day to see if anything has changed.
