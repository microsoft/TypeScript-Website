---
title: Creating Types from Types
layout: docs
permalink: /docs/handbook/2/types-from-types.html
oneline: "An overview of the ways in which you can create more types from existing types."
---

TypeScript's type system is very powerful because it allows expressing types _in terms of other types_.

The simplest form of this idea is generics, we actually have a wide variety of _type operators_ available to use.
It's also possible to express types in terms of _values_ that we already have.

By combining various type operators, we can express complex operations and values in a succinct, maintainable way.
In this section we'll cover ways to express a new type in terms of an existing type or value.

- [Generics](/docs/handbook/2/generics.html) - Types which take parameters
- [Keyof Type Operator](/docs/handbook/2/keyof-types.html) - Using the `keyof` operator to create new types
- [Typeof Type Operator](/docs/handbook/2/typeof-types.html) - Using the `typeof` operator to create new types
- [Indexed Access Types](/docs/handbook/2/indexed-access-types.html) - Using `Type['a']` syntax to access a subset of a type
- [Conditional Types](/docs/handbook/2/conditional-types.html) - Types which act like if statements in the type system
- [Mapped Types](/docs/handbook/2/mapped-types.html) - Creating types by mapping each property in an existing type
- [Template Literal Types](/docs/handbook/2/template-literal-types.html) - Mapped types which change properties via template literal strings
