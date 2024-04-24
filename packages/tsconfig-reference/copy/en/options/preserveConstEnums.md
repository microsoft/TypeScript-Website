---
display: "Preserve Const Enums"
oneline: "Disable erasing `const enum` declarations in generated code."
---

Do not erase `const enum` declarations in generated code. `const enum`s provide a way to reduce the overall memory footprint
of your application at runtime by emitting the enum value instead of a reference.

For example with this TypeScript:

```ts twoslash
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3,
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

The default `const enum` behavior is to convert any `Album.Something` to the corresponding number literal, and to remove a reference
to the enum from the JavaScript completely.

```ts twoslash
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3,
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

With `preserveConstEnums` set to `true`, the `enum` exists at runtime and the numbers are still emitted.

```ts twoslash
// @preserveConstEnums: true
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3,
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

This essentially makes such `const enums` a source-code feature only, with no runtime traces.
