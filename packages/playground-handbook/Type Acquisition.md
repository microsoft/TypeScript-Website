## Type Acquisition

No Playground is a island. Well, not strictly, no playground _needs_ to be an island. One of the first problem we hit when adding support for `.tsx`/`.jsx` to the Playground was that to **_really_** use JSX to write React components - you need the types for React.

This left us with the dilemma of needing to either bundle React's types into the Playground, or to replicate the feature found in JavaScript projects utilizing TypeScript: Automatic Type Acquisition. The idea behind Automatic Type Acquisition (ATA) is that behind the scenes the Playground will look at any `import` / `require` / [`/// <reference types="`](/docs/handbook/triple-slash-directives.html) and understand what npm modules have been referenced.

For these referenced modules, TypeScript will search through the npm package contents, and potentially in the `@types` equivalent for `.d.ts` files to describe how the library works. This means to get the types for React, you would create a playground like:

```ts
import React from "react"

const myComponent = () => <h1>Hello, world</h1>
```

Type Acquisition would:

- look in the package `react` on npm, see there are no `.d.ts` files in its contents
- look to see if `@types/react` exists, downloads all of the `.d.ts` files
- read the `.d.ts` files in `@types/react`, and discover they import from `csstype` and `prop-types`
  - look in the package `csstype` for `.d.ts` files and downloads them
  - look in the package `prop-types` for `.d.ts` files and finds none
  - look to see if `@types/prop-types` exists and download the `.d.ts` files from that

That one import line has downloaded the `.d.ts` files from `@types/react`, `@types/prop-types` and `csstype`. These are added to the Playground's TypeScript project's `node_modules` folder and TypeScript picks them up.

This is all built on the [jsdelivr CDN](https://www.jsdelivr.com/) which has kept the complexity down, and the type acquisition system is available for other projects to use via npm on [`@typescript/ata`](https://www.npmjs.com/package/@typescript/ata).
