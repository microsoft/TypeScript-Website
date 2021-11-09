//// { "compiler": { "ts": "4.1.0-dev.20201028" } }

// Template literals can be used to extract and manipulate string literal types.
// These string literal types, in turn, can be used as properties, and can describe
// possible transformations from a string to an object in an API.

// ## String Splitting To An Object

// Template literals can use patterns as "split-points" to infer the
// substrings in between. For example...

// This type is a string literal which conforms to a SemVer-like string.
type TSVersion = "4.1.2"

// We can create a type to extract the components of that string.
// We'll split across two '.' characters.
type ExtractSemver<SemverString extends string> =
    SemverString extends `${infer Major}.${infer Minor}.${infer Patch}` ?
    { major: Major, minor: Minor, patch: Patch } : { error: "Cannot parse semver string" }

// Line 1 should be familiar if you've looked at the preceding examples:
// example:intro-to-template-literals / example:mapped-types-with-template-literals

// Line 2 is a conditional type, TypeScript validates that the infer pattern matches
// against SemverString parameter.

// Line 3 is the result of the conditional, if true then provide an object
// with the substrings passed into different positions in an object. If the string
// does not match, then return the type with an error shape.

type TS = ExtractSemver<TSVersion>

// This won't handle SemVer 100%, because it is an example:
type BadSemverButOKString = ExtractSemver<"4.0.Four.4444">

// However, ExtractSemver will fail on strings which don't fit the format. This case
// will only match when a string has the format "X.Y.Z", which the next line does not:
type SemverError = ExtractSemver<"Four point Zero point Five">

// ## Recursive String Splitting

// The previous example will only work when you have an exact string to match,
// for more nuanced cases you want work with the TypeScript 4.0 feature: example:variadic-tuples.

// To split a string into re-usable components, Tuples are a good way to keep
// track of the results. Here's a split type:

type Split<S extends string, D extends string> =
    string extends S ? string[] :
    S extends '' ? [] :
    S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

// Line 1 declares two params, we'll use single characters for brevity.
// S represents the string to split, and D is the deliminator. This
// line ensures they are both strings.

// Line 2 checks if string is a literal, by checking if a general string
// can be extended from the input string. If so, return a string array. We
// can't work with non-literal string.

// E.g. this case:
type S1 = Split<string, ".">

// Line 3 checks if the string is empty, if so return an empty tuple
type S2 = Split<"", ".">

// Line 4 has a similar check to our ExtractSemver. If the string matches
// `[Prefix as T][Deliminator][Suffix as U]` then extract the prefix (T) into the
// first parameter of a tuple, then re-run Split on the suffix (U) to ensure
// that more than one match can be found.
//
// If the string does not include the deliminator, then return a tuple of 1 
// length which contains the string passed in as an argument (S).

// Simple case
type S3 = Split<"1.2", ".">

// Will recurse once to get all the .'s splitted
type S4 = Split<"1.2.3", ".">

// With this knowledge, you should be able to read and understand quite a
// few of the community examples of template literals, for example:
//
// - An express route extractor by Dan Vanderkam
// https://twitter.com/danvdk/status/1301707026507198464
//
// - A definition for document.querySelector by Mike Ryan
// https://twitter.com/mikeryandev/status/1308472279010025477
//
// People have also experimented with quite complicated string parsers 
// using template string literals, which are fun - but not recommended for
// production codebases.
//
// https://github.com/ghoullier/awesome-template-literal-types
// 
// Or read the announcement blog post:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
