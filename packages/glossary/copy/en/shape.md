---
display: "Shape"
tags: typescript javascript
---

The term "shape" is used to describe the fields and values on a JavaScript object. For example, you could say that this JavaScript object:

```ts
const house = {
  name: "Shibden hall",
  road: "Lister's Road",
  town: "Halifax",
  county: "West Yorkshire",
};
```

has the shape:

- `name`: `string`
- `road`: `string`
- `town`: `string`
- `country`: `string`

TypeScript can describe this shape using two different syntaxes: [Interfaces](#interface) and [Types](#type-literal)

```ts
interface House {
  name: string;
  road: string;
  town: string;
  country: string;
}

// or

type House = {
  name: string;
  road: string;
  town: string;
  country: string;
};
```
