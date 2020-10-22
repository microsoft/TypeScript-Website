---
display: "Strict Checks"
---

We recommend using the [compiler option `strict`](#strict) to opt-in to every possible improvement as they are built.

TypeScript supports a wide spectrum of JavaScript patterns and defaults to allowing for quite a lot of flexibility in accommodating these styles.
Often the safety and potential scalability of a codebase can be at odds with some of these techniques.

Because of the variety of supported JavaScript, upgrading to a new version of TypeScript can uncover two types of errors:

- Errors which already exist in your codebase, which TypeScript has uncovered because the language has refined its understanding of JavaScript.
- A new suite of errors which tackle a new problem domain.

TypeScript will usually add a compiler flag for the latter set of errors, and by default these are not enabled.
