## Some markdown

I shouldn't get changed:

```ts
// @showEmit
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

I should:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers

// --importHelpers on: Spread helper will be imported from 'tslib'

export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Cool, a paragraph after

```ts twoslash
// @errors: 2304
sfsdfsdfsd
```
