---
title: Creating Types from Types
layout: docs
permalink: /docs/handbook/2/types-from-types.html
oneline: "Step one in learning TypeScript: The basics types."
beta: true
---

TypeScript's type system is very powerful because it allows expressing types _in terms of other types_.
Although the simplest form of this is generics, we actually have a wide variety of _type operators_ available to us.
It's also possible to express types in terms of _values_ that we already have.

By combining various type operators, we can express complex operations and values in a succinct, maintainable way.
In this section we'll cover ways to express a type in terms of an existing type or value.
