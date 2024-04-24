//// { "compiler": { "ts": "4.1.0-dev.20201028" } }

// TypeScript already supports treating an exact string/number 
// as a literal, for example this function only allows two
// exact strings and no others:

declare function enableFeature(command: "redesign" | "newArtistPage"): void;
enableFeature("redesign");
enableFeature(`newArtistPage`);
enableFeature("newPaymentSystem");

// String literals supports all the way you can write a 
// string in ES2020, with TypeScript 4.1 we've extended 
// support for interpolation inside a template string literal.

type Features = "Redesign" | "newArtistPage";

// This takes the Features union above, and transforms
// each part of the union to add `-branch` after the string
type FeatureBranch = `${Features}-branch`;

// 4.1 supports a set of new generic-like keywords which
// you can use inside a template literal to manipulate strings.
// These are: Uppercase, Lowercase, Capitalize and Uncapitalize

type FeatureID = `${Lowercase<Features>}-id`;
type FeatureEnvVar = `${Uppercase<Features>}-ID`;

// Strings in unions are cross multiplied, so if used more
// than one union type then each union member is evaluated
// against each member from the other union.

type EnabledStates = "enabled" | "disabled";
type FeatureUIStrings = `${Features} is ${EnabledStates}`;

// This ensures that every possible combination of each
// union is accounted for.

// This type can then be used with an indexed signature
// to quickly make a list of keys:

type SetFeatures = {
  [K in FeatureID]: boolean
};

// Continue learning more about template literals in
// example:mapped-types-with-template-literals

// Or read the announcement blog post:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
