//// { "compiler": { "ts": "4.7.3" } }
// In 4.7 TypeScript added support for two optional prefixes
// to a type parameter: 'in' and 'out'. These are used to describe
// how the parameter is used inside the type and whether they
// become visible outside of that type.

// For example, here is an interface for which the type 'CoinType'
// is only used inside the interface, and not exposed to the outside.

interface PiggyBank<in CoinType> {
    add(item: CoinType): void;
//  smash(): CoinType[];
}

// Because CoinType is declared as being 'in' if you uncomment the
// 'smash' method, which re-exposes the CoinType via a return type
// then TypeScript will raise an error that CoinType is also being used
// ins an out position. You can fix this by adding the 'out' prefix also.

// e.g: interface PiggyBank<in out CoinType> {

// There are two main uses for these prefixes, cases like the above
// where you want to be careful about how the type is being used, and
// the optional prefixes are used by TypeScript to speed up comparing
// types. Which makes them very useful on large types which are re-used
// across many other types (for example in popular npm libraries or the
// DOM definitions).

// For more info, see the 4.7 release notes:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-7-rc/#optional-variance-annotations-for-type-parameters

