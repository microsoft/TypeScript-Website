---
display: "Downlevel Iteration"
oneline: "Emit more compliant, but verbose JavaScript for iterating objects"
---

Downleveling is TypeScript's term for transpiling to an older version of JavaScript.
This flag is to enable support for a more accurate implementation of how modern JavaScript iterates through new concepts in older JavaScript runtimes.

ECMAScript 6 added several new iteration primitives: the `for / of` loop (`for (el of arr)`), Array spread (`[a, ...b]`), argument spread (`fn(...args)`), and `Symbol.iterator`.
`--downlevelIteration` allows for these iteration primitives to be used more accurately in ES5 environments if a `Symbol.iterator` implementation is present.

#### Example: Effects on `for / of`

Without `downlevelIteration` on, a `for / of` loop on any object is downleveled to a traditional `for` loop:

```ts twoslash
// @target: ES5
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

This is often what people expect, but it's not 100% compliant with ECMAScript 6 behavior.
Certain strings, such as emoji (😜), have a `.length` of 2 (or even more!), but should iterate as 1 unit in a `for-of` loop.
See [this blog post by Jonathan New](https://blog.jonnew.com/posts/poo-dot-length-equals-two) for a longer explanation.

When `downlevelIteration` is enabled, TypeScript will use a helper function that checks for a `Symbol.iterator` implementation (either native or polyfill).
If this implementation is missing, you'll fall back to index-based iteration.

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

> > **Note:** enabling `downlevelIteration` does not improve compliance if `Symbol.iterator` is not present in the runtime.

#### Example: Effects on Array Spreads

This is an array spread:

```js
// Make a new array who elements are 1 followed by the elements of arr2
const arr = [1, ...arr2];
```

Based on the description, it sounds easy to downlevel to ES5:

```js
// The same, right?
const arr = [1].concat(arr2);
```

However, this is observably different in certain rare cases.
For example, if an array has a "hole" in it, the missing index will create an _own_ property if spreaded, but will not if built using `concat`:

```js
// Make an array where the '1' element is missing
let missing = [0, , 1];
let spreaded = [...missing];
let concated = [].concat(missing);

// true
"1" in spreaded;
// false
"1" in concated;
```

Just as with `for / of`, `downlevelIteration` will use `Symbol.iterator` (if present) to more accurately emulate ES 6 behavior.
