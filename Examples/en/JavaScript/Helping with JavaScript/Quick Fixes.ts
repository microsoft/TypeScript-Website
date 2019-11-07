// TypeScript provides quick-fix recommendations for
// common accidents, they show up in your editor based
// on recommendations.

// For example TypeScript can provide quick-fixes
// for typos in your types:

const eulersNumber = 2.7182818284
eulersNumber.toStrang();
//           ^______^ - select this to see the light build

class ExampleClass {
  method() {
    this.notDeclared = 10;
  }
}
