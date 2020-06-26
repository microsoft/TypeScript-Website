//// { compiler: {  }, order: 1 }

// TypeScript supports a lot of fixits, which are automated
// helpers to refactor your code. For example if you select
// the text in line 7, and click on the light bulb which
// pops up, you'll get offered some fixits.

function addOne(x: number) {
  return x + 1;
}

// This feature is available as of TypeScript version 3.7,
// which will also include nightly builds.

// They might not be something you need to use inside the
// playground when you're making code samples, or learning.

// However, having fixits available means we can document
// them in the playground and that's really valuable:

// example:big-number-literals
// example:const-to-let
// example:infer-from-usage-changes
