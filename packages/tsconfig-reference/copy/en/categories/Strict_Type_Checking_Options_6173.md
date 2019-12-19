---
display: "Strict Checks"
---

TypeScript supports a spectrum of JavaScript patterns, TypeScript patterns and strives for backwards compatibility with them all.

Upgrading to a new version of TypeScript can uncover two types of errors:

- Errors which already exist in your codebase, TypeScript has uncovered because the language has become refined it's understanding of JavaScript.
- A new suite of errors which tackle a whole new problem domain.

TypeScript will usually add a compiler flag for the latter set of errors, and by default these are not enabled. 
If you  want to ensure that your codebase is as correct as possible, then use the option [`strict`](#strict) to opt-in to every possible improvement as they are built. 
