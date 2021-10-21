## TypeScript Versions

The TypeScript Playground supports TypeScript versions all the way back to `3.3.3` (which was versioned as [`3.3.3333`](https://github.com/Microsoft/TypeScript/issues/30032)) up to the latest nightly build.

The ability to switch the version of TypeScript makes it easy to figure out potential regressions and to be able to let people test out new language features without having to upgrade their projects to (potentially) an unstable version of TypeScript. You can access the list of production TypeScript versions via a dropdown in the editor's toolbar inside the Playground. If there's a current beta or rc, that will show at the top.

The dropdown shows the highest patch version for a TypeScript release, but that is not every version available. You can refer to these two JSON files for the full list of [release versions](https://typescript.azureedge.net/indexes/releases.json) and [pre-release versions](https://typescript.azureedge.net/indexes/pre-releases.json).

Setting a TypeScript version will append `?ts=[version]` to your URL and reload. For example, setting the TypeScript version to 4.3.5 will add `?ts=4.3.5` to the URL, which is an OK segue to the overview of the [URL's structure](...?)

There's one special case where `?ts=Nightly` will find the latest version of the TypeScript which was built for the Playground and use that.

<details>
<summary>That's was a lie, there's two special cases</summary>

Funny enough, what really does feel like a security hole in Firefox/Chromium browsers (_to this author_) is that web pages in those browsers can arbitrarily load JavaScript from `localhost`. This "feature" is abused to support Plugin development environments inside the production version of the TypeScript website.

This same system can be used to load up a development version of TypeScript from your computer, there is a [script inside the TypeScript compiler](https://github.com/microsoft/TypeScript/blob/main/scripts/createPlaygroundBuild.js) which starts up a web server in node and hooks your local copy to the Playground.

</details>
