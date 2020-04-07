// TypeScript provides quick-fix recommendations for
// common accidents. Prompts show up in your editor based
// on these recommendations.

// For example TypeScript can provide quick-fixes
// for typos in your types:

const eulersNumber = 2.7182818284;
eulersNumber.toStrang();
//           ^______^ - select this to see the light bulb

class ExampleClass {
  method() {
    this.notDeclared = 10;
  }
}
