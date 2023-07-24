## URL Structures

Because the Playground runs in the browser, we strive to represent all possible environmental setting inside the URL so that you can easily share your Playground. This include the code, compiler flags and settings.

The Playground supports two forms of inputs from the URL: The Hash and queries.

### The Hash

The hash generally represents the state of the editor:

- `#code/PRAz3dDc3...` - A base64 and zipped version of the code which should live in the editor. You can use [`LZString.compressToEncodedURIComponent`](https://github.com/pieroxy/lz-string/blob/master/libs/lz-string.js#L93) from the [`lz-string`](https://github.com/pieroxy/lz-string) package to construct URLs for arbitrary pieces of code
- `#src=The%20code...` - URLEncoded way to have the code for the editor (used for backwards-compatibility with older URLs)
- `#example/generic-functions` - Grab the code from a Playground example with the id generic-functions
- `#handbook-2` - The Playground handbook with the page number

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
