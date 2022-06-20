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
// in an out position. You can fix this by adding the 'out' prefix also.

// e.g: interface PiggyBank<in out CoinType> {

// There are a few use-cases for these prefixes:
//
//   - ensuring that TypeScript is correct in its measurements
//   - speeding up type comparisons when types are large and recursive
//   - as a form of enforced documentation - being careful on how these types are used

// For more info, see the 4.7 release notes:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-7-rc/#optional-variance-annotations-for-type-parameters

