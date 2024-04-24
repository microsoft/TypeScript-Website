---
display: "Interface"
tags: typescript types keyword
---

An interface is a way to describe the [Shape](#shape) of a JavaScript object. For example, a dog could be described in the following format:

```ts twoslash
interface Dog {
  name: string;
  dateOfBirth: Date;
  markings: string[];
}
```

This means that only an object with a `name`, `dateOfBirth` and `markings` could be classed as a "Dog" in the [Type System](#type-system).
