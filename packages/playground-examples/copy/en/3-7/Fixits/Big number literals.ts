//// { "compiler": {  "target": 99 }, "order": 1 }

// Did you know there is a limit to how big of a number you
// can represent in JavaScript when writing ?

const maxHighValue = 9007199254740991;
const maxLowValue = -9007199254740991;

// If you go one over/below these numbers
// then you start to get into dangerous territory.

const oneOverMax = 9007199254740992;
const oneBelowMin = -9007199254740992;

// The solution for handling numbers of this size
// is to convert these numbers to BigInts instead
// of a number:
//
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScript will now offer a fixit for number
// literals which are above 2^52 (positive / negative)
// which adds the suffix "n" which informs JavaScript
// that the type should be BigInt.

// Number literals
9007199254740993;
-9007199254740993;
9007199254740994;
-9007199254740994;

// Hex numbers
0x19999999999999;
-0x19999999999999;
0x20000000000000;
-0x20000000000000;
0x20000000000001;
-0x20000000000001;
