## Relative imports

```ts twoslash {2}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`)
}

greet("Maddison", new Date())
```

Hello

```ts twoslash {1}
const a = 1
// ---cut---
const b = 2
const c = 3 // highlighted (0 based)
```
