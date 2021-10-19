## Writing JavaScript

"Write JavaScript in the _TypeScript_ Playground, madness!" - maybe, but there's a few of majors cases for why you would want to do this:

1. **Learning typed-JavaScript** - JSDoc-flavoured JavaScript is TypeScript-lite without the tooling overhead and with weirder syntax. JSDoc-flavoured JavaScript is both a legitimate stepping stone to migrating to TypeScript and a perfectly good stopping point for getting richer tools without additional complexity.

1. **Debugging JavaScript .d.ts conversion** - TypeScript can generate `.d.ts` files from `.js` files, which gives library authors the chance to stay in JavaScript but still offer a rich developer experience to their users. The `.d.ts` sidebar tab offers a fast-feedback cycle for understanding how the code is understood by TypeScript.

1. **Experiment with code flow analysis and `jsconfig.json` settings** - A JavaScript project can use a `jsconfig.json` file to set up their tooling experience, and the Playground can be used to emulate that environment.

1. **Running JavaScript locally** - You can copy in modern JavaScript syntax, and it will be automatically backported to older JavaScript syntax which means you can reliably run it. Making it easy to do a quick 'does this work' playground and hit Run to see the output.

You can turn on JavaScript mode by opening the "TS Config" menu and changing the "language" to "JavaScript". This will add `?filetype=js` to the URL (note `?isJavaScript=true` is also supported for older links) and reload the Playground into a JavaScript context instead.
