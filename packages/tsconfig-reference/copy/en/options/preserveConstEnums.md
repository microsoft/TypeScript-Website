---
display: "Preserve Const Enums"
---

Do not erase const enum declarations in generated code. `const enum`s provide a way to reduce the overall memory footprint
of your application at runtime, by swapping the reference to the enum value with the value in the code. 

For example with this TypeScript:

```ts twoslash
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.")
}
```

The default `const enum` behavior is to convert any `Album.Something` to the number literal, and to remove a reference
to the enum from the JavaScript completely.

```ts twoslash
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.")
}
```

With `preserveConstEnums` set to `true`, the enum exists at runtime and the numbers are still switched.

```ts twoslash
// @preserveConstEnums: true
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.")
}
```
