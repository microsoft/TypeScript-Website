//// { compiler: {  }, order: 3 }

// Às vezes, as mensagens de erros no TypeScript pode ser um pouco verbosas...
// Com a versão 3.7, nós tratamos alguns casos que poderiam ser
// particularmente notórios.

// Propriedades aninhadas

let a = { b: { c: { d: { e: "string" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;

// Antes, isso levaria a duas linhas de código por propriedade aninhada.
// Isso rapidamente significou que as pessoas aprenderam a ler
// mensagens de erro lendo a primeira e última linha de mensagem
// de erro.

// Agora eles estão alinhados. :tada:

// Anteriormente no 3.6:
//
// Type '{ b: { c: { d: { e: number; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: string; }; }; }; }'.
//   Types of property 'b' are incompatible.
//     Type '{ c: { d: { e: number; }; }; }' is not assignable to type '{ c: { d: { e: string; }; }; }'.
//       Types of property 'c' are incompatible.
//         Type '{ d: { e: number; }; }' is not assignable to type '{ d: { e: string; }; }'.
//           Types of property 'd' are incompatible.
//             Type '{ e: number; }' is not assignable to type '{ e: string; }'.
//               Types of property 'e' are incompatible.
//                 Type 'number' is not assignable to type 'string'

// Isso pode lidar com diferentes tipos de objetos,
// para fornecer uma mensagem de erro útil e coesa.

class ExampleClass {
  state = "ok";
}

class OtherClass {
  state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ExampleClass } } } } } };
let y = { a: { b: { c: { d: { e: { f: OtherClass } } } } } };
x = y;

// Anteriormente no 3.6:
//
// Type '{ a: { b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }; }' is not assignable to type '{ a: { b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }; }'.
//   Types of property 'a' are incompatible.
//     Type '{ b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }'.
//       Types of property 'b' are incompatible.
//         Type '{ c: { d: { e: { f: typeof OtherClass; }; }; }; }' is not assignable to type '{ c: { d: { e: { f: typeof ExampleClass; }; }; }; }'.
//           Types of property 'c' are incompatible.
//             Type '{ d: { e: { f: typeof OtherClass; }; }; }' is not assignable to type '{ d: { e: { f: typeof ExampleClass; }; }; }'.
//               Types of property 'd' are incompatible.
//                 Type '{ e: { f: typeof OtherClass; }; }' is not assignable to type '{ e: { f: typeof ExampleClass; }; }'.
//                   Types of property 'e' are incompatible.
//                     Type '{ f: typeof OtherClass; }' is not assignable to type '{ f: typeof ExampleClass; }'.
//                       Types of property 'f' are incompatible.
//                         Type 'typeof OtherClass' is not assignable to type 'typeof ExampleClass'.
//                           Type 'OtherClass' is not assignable to type 'ExampleClass'.
//                             Types of property 'state' are incompatible.
//                               Type 'number' is not assignable to type 'string'
