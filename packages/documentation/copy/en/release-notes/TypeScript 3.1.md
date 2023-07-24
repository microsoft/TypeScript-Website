---
title: TypeScript 3.1
layout: docs
permalink: /docs/handbook/release-notes/typescript-3-1.html
oneline: TypeScript 3.1 Release Notes
---

## Mapped types on tuples and arrays

In TypeScript 3.1, mapped object types<sup>[[1]](#ts-3-1-only-homomorphic)</sup> over tuples and arrays now produce new tuples/arrays, rather than creating a new type where members like `push()`, `pop()`, and `length` are converted.
For example:

```ts
type MapToPromise<T> = { [K in keyof T]: Promise<T[K]> };

type Coordinate = [number, number];

type PromiseCoordinate = MapToPromise<Coordinate>; // [Promise<number>, Promise<number>]
```

`MapToPromise` takes a type `T`, and when that type is a tuple like `Coordinate`, only the numeric properties are converted.
In `[number, number]`, there are two numerically named properties: `0` and `1`.
When given a tuple like that, `MapToPromise` will create a new tuple where the `0` and `1` properties are `Promise`s of the original type.
So the resulting type `PromiseCoordinate` ends up with the type `[Promise<number>, Promise<number>]`.

## Properties declarations on functions

TypeScript 3.1 brings the ability to define properties on function declarations and `const`-declared functions, simply by assigning to properties on these functions in the same scope.
This allows us to write canonical JavaScript code without resorting to `namespace` hacks.
For example:

```ts
function readImage(path: string, callback: (err: any, image: Image) => void) {
  // ...
}

readImage.sync = (path: string) => {
  const contents = fs.readFileSync(path);
  return decodeImageSync(contents);
};
```

Here, we have a function `readImage` which reads an image in a non-blocking asynchronous way.
In addition to `readImage`, we've provided a convenience function on `readImage` itself called `readImage.sync`.

While ECMAScript exports are often a better way of providing this functionality, this new support allows code written in this style to "just work" in TypeScript.
Additionally, this approach for property declarations allows us to express common patterns like `defaultProps` and `propTypes` on React function components (formerly known as SFCs).

```ts
export const FooComponent = ({ name }) => <div>Hello! I am {name}</div>;

FooComponent.defaultProps = {
  name: "(anonymous)",
};
```

<!--
fs.readFile(path, (err, data) => {
        if (err) callback(err, undefined);
        else decodeImage(data, (err, image) => {
            if (err) callback(err, undefined);
            else callback(undefined, image);
        });
    });
-->

---

<sup id="ts-3-1-only-homomorphic">[1]</sup> More specifically, homomorphic mapped types like in the above form.

## Version selection with `typesVersions`

Feedback from our community, as well as our own experience, has shown us that leveraging the newest TypeScript features while also accommodating users on the older versions are difficult.
TypeScript introduces a new feature called `typesVersions` to help accommodate these scenarios.

You can read [about it in the Publishing section of the declaration files section](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions)
