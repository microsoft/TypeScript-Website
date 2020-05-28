//// { compiler: {  }, order: 3 }

// TypeScriptのエラーメッセージはときどき、少しだけ冗長になってしまうことがあります。
// 3.7では、特にひどいいくつかの事例を
// 取り上げました。

// 入れ子のプロパティ

let a = { b: { c: { d: { e: "string" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;

// 以前は、入れ子のプロパティ1つにつき2行のコードでした。
// これは、エラーメッセージの最初と最後の行を読むことで、
// エラーメッセージの読み方をすぐに学べるということを意味していました。

// 今は、これらはインラインになりました。:tada:

// 3.6では以下のようになっていました:
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

// これによって、様々な形のオブジェクトに対しても、
// 有用で簡潔なエラーメッセージを表示することができるようになりました。

class ExampleClass {
  state = "ok";
}

class OtherClass {
  state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ExampleClass } } } } } };
let y = { a: { b: { c: { d: { e: { f: OtherClass } } } } } };
x = y;

// 3.6では以下のようになっていました:
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
