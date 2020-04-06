Type assertions have two forms.
One is the "angle-bracket" syntax:

```ts twoslash
let someValue: any = 'this is a string'

let strLength: number = (<string>someValue).length
```

And the other is the `as`-syntax:

```ts twoslash
let someValue: any = 'this is a string'

let strLength: number = (someValue as string).length
```

The two samples are equivalent.
Using one over the other is mostly a choice of preference; however, when using TypeScript with JSX, only `as`-style assertions are allowed.
