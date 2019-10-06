// Work in Progress - there is a PR which adds quick 
// fix support for the tool which powers the playground
// which we need to have merged before this is usable
// with the light-bulb

// TypeScript provides quick-fix recommendations for 
// common accidents, they show up in your editor based
// on recommendations

// For example TypeScript can provide quick-fixes
// for typoes in your types:

const eulersNumber = 2.7182818284
eulersNumber.toStrang();
//           ^_______^ - select this to see the light build


class ExampleClass {
   method() {
       this.notDeclared = 10;
   }
}