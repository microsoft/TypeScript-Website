---
title: TypeScript 1.1
layout: docs
permalink: /docs/handbook/release-notes/typescript-1-1.html
oneline: TypeScript 1.1 Release Notes
---

This is a test example, knowingly shipped to prod while v2 is in beta - it's got a really long comment and a twoslash error.

```ts twoslash
// @errors: 2345
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

const hello = longest("alice", "bob");
console.log(hello);
```

## Performance Improvements

The 1.1 compiler is typically around 4x faster than any previous release. See [this blog post for some impressive charts.](http://blogs.msdn.com/b/typescript/archive/2014/10/06/announcing-typescript-1-1-ctp.aspx)

## Better Module Visibility Rules

TypeScript now only strictly enforces the visibility of types in modules if the `--declaration` flag is provided. This is very useful for Angular scenarios, for example:

```ts
module MyControllers {
  interface ZooScope extends ng.IScope {
    animals: Animal[];
  }
  export class ZooController {
    // Used to be an error (cannot expose ZooScope), but now is only
    // an error when trying to generate .d.ts files
    constructor(public $scope: ZooScope) {}
    /* more code */
  }
}
```
