## Deprecating a documentation page

Start with this question: are you deprecating or deleting? Ideally you're never deleting because [Cool URIs Don't Change](https://www.w3.org/Provider/Style/URI.html) but for something which intentionally had a limited self-life, that's OK.

### Keep or Redirect?

If you don't want the keep the content at all, remove the `.md` file from the repo and add the URI to [setupRedirects.ts](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/redirects/setupRedirects.ts).

### Keep it

There are two new attributes you can add to the yml at the top of the markdown doc to indicate a page is deprecated:

```md
---
title: Advanced Types
layout: docs
permalink: /docs/handbook/advanced-types.html
oneline: Advanced concepts around types in TypeScript
deprecated_by: /docs/handbook/2/types-from-types.html

# prettier-ignore
deprecation_redirects: [
  type-guards-and-differentiating-types, /docs/handbook/2/narrowing.html,
  user-defined-type-guards, /docs/handbook/2/narrowing.html#using-type-predicates,
  typeof-type-guards, "/docs/handbook/2/narrowing.html#typeof-type-guards",
  instanceof-type-guards, /docs/handbook/2/narrowing.html#instanceof-narrowing,
  nullable-types, /docs/handbook/2/everyday-types.html#null-and-undefined,
  type-aliases, /docs/handbook/2/everyday-types.html#type-aliases,
  interfaces-vs-type-aliases, /docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces,
  enum-member-types, /docs/handbook/enums.html,
  polymorphic-this-types, /docs/handbook/2/classes.html,
  index-types, /docs/handbook/2/indexed-access-types.html,
  index-types-and-index-signatures, /docs/handbook/2/indexed-access-types.html,
  mapped-types, /docs/handbook/2/mapped-types.html,
  inference-from-mapped-types, /docs/handbook/2/mapped-types.html,
  conditional-types, /docs/handbook/2/conditional-types.html,
  distributive-conditional-types, /docs/handbook/2/conditional-types.html#distributive-conditional-types,
  type-inference-in-conditional-types, /docs/handbook/2/conditional-types.html#inferring-within-conditional-types,
  predefined-conditional-types, /docs/handbook/utility-types.html,
]
---

This page lists some of the more advanced ways in which you can model types, it works in tandem with the [Utility Types](/docs/handbook/utility-types.html) doc which includes types which are included in TypeScript and available globally.

## Type Guards and Differentiating Types

Union types are useful for modeling situations when values can overlap in the types they can take on.
What happens when we need to know specifically whether we have a `Fish`?
```

Including the `deprecated_by` tag will mark the pages visually as deprecated, and tell search engines to consider that other page the canonical source instead. That should be enough for simple pages.

If it's a page which people are linking to a lot, and you want to _really_ carry someone to their right location then you can make a map of query hashes to new pages.

If you load the old page in your browser and run this JS in the web inspector:

```js
document.querySelectorAll(".markdown h2, .markdown h3").forEach(h => console.log(h.id))
```

It will print out all the of header's anchors, and that is the left hand side of your array couplets. The site has client-side code to override the `deprecated_by` url at runtime if it detects a user has a matching hash in the URL.
