## URL Structures

Because the Playground runs in the browser, we strive to represent all possible environmental setting inside the URL so that you can easily share your Playground. This include the code, compiler flags and settings.

The Playground supports two forms of inputs from the URL: The Hash and queries.

### The Hash

The hash generally represents the state of the editor:

- `#code/PRAz3dDc3...` - A base64 and zipped version of the code which should live in the editor
- `#src/The%20code...` - URLEncoded way to have the code for the editor (used for backwards-compatibility with older URLs)
- `#example/generic-functions` - Grab the code from a Playground example with the id generic-functions
- `#handbook-2` - The Playground handbook with the page number
- `#gist/92cf0a3...` - The ID of a public GitHub gist, the playground will either render a docset of markdown and TS/JS files or grab the contents of just one file and show it. Given the support for multi-file pages, you can append `-[n]` to access the nth file (taking into account 0 indexing) - so `/play/#gist/303ebff59a6fc37f88c86e86dbdeb0e8-3` will open the 4th page by default.

Or to trigger some action in the Playground UI by default:

- `#show-examples` - When the app is loaded, show the "Examples" panel
- `#show-whatisnew` - When the app is loaded, show the "What is New" panel

### The Query

Then the query string tend to be about changing the state of the Playground setup from the default:

- `?ts=3.9.2` - Sets the TypeScript version, the list of supported versions is in these [two](https://typescript.azureedge.net/indexes/pre-releases.json) [json](https://typescript.azureedge.net/indexes/releases.json) files.

  There are two special cases for the `ts` option:

  - `ts=Nightly` where it will switch to most recently the nightly version.
  - `ts=dev` where it uses your [local developer's build of TypeScript](https://github.com/microsoft/TypeScript/blob/main/scripts/createPlaygroundBuild.js)

- `?flag=value` - Any compiler flag referenced in can be set from a query
- `?filetype=js|ts|dts` - Tells the Playground to set the editor's language
- `?install-plugin=npm-module` - Checks to see if there is an installed playground plugin of that name, and if not offers to install it in a modal via npm`.

The playground will try to retain any non-compiler option setting during URL updates, this is to ensure that Playground plugins can read/write their own parameters which the Playground avoids interfering with.

### URL Length Limits

It's possible to hit a URL length limit with a long enough code sample you could use a [Gist Playgrounds](/play#handbook-15) or we'd recommend looking into the [Playground plugins](/play#handbook-11) section to find a URL shortener, which we're about to go to next.
