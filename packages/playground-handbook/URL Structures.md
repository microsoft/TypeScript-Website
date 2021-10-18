The Playground supports a set of query inputs from the URL. The hash is used to reflect the code:

- `#code/PRA` - A base64 and zipped version of the code which should live in the editor
- `#src/The%20code` - URLEncoded way to have the code for the editor
- `#example/generic-functions` - Grab the code from an example with the id generic-functions
- `#gist/92cf0a3...` - The ID of a public GitHub gist, the playground will either render a story of markdown and TS/JS files or grab the contents of just one file and show it. You can add `-2` to access the 3rd file (because of 0 indexing).

Or to trigger some action by default:

- `#show-examples` - When the app is loaded, show the examples popover
- `#show-whatisnew` - When the app is loaded, show the examples popover

Then queries tend to be about changing the state of the Playground setup from the default:

- `?ts=3.9.2` - Sets the TypeScript version, the list of supported versions is in these [two](https://typescript.azureedge.net/indexes/pre-releases.json) [json](https://typescript.azureedge.net/indexes/releases.json) files.

  There are two special cases for the `ts` option:

  - `ts=Nightly` where it will switch to most recently the nightly version.
  - `ts=dev` where it uses your [local developer's build of TypeScript](https://github.com/microsoft/TypeScript/blob/main/scripts/createPlaygroundBuild.js)

- `?flag=value` - Any compiler flag referenced in can be set from a query
- `?filetype=js|ts|dts` - Tells the Playground to set the editor's type
- `?install-plugin=npm-module` - Checks to see if there is an installed playground plugin of that name, and if not offers to install it in a modal.
