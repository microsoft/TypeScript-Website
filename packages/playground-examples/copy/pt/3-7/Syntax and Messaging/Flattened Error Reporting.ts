//// { compiler: {  }, order: 3 }

// As mensagens de erro do TypeScript algumas vezes podem ser 
// um pouco verbosas...
// Com o 3.7, nós temos alguns casos que poderiam ser particularmente notórios.

// Propriedades aninhadas

let a = { b: { c: { d: { e: "texto" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;

// Antes, eram duas linhas de código por propriedade aninhada,
// o que significa resumidamente que as pessoas aprenderam a 
// ler mensagens de erro lendo a primeira e a última linha de
// uma mensagem de erro.

// Agora elas estão na linha. :tada:

// Anteriormente na 3.6:
//
// Tipo '{ b: { c: { d: { e: number; }; }; }; }' não é atribuível ao tipo '{ b: { c: { d: { e: string; }; }; }; }'.
//   Tipos da propriedade 'b' são incompatíveis.
//     Tipo '{ c: { d: { e: number; }; }; }' não é atribuível ao tipo '{ c: { d: { e: string; }; }; }'.
//       Tipos da propriedade 'c' são incompatíveis.
//         Tipo '{ d: { e: number; }; }' não é atribuível ao tipo '{ d: { e: string; }; }'.
//           Tipos da propriedade 'd' são incompatíveis.
//             Tipo '{ e: number; }' não é atribuível ao tipo '{ e: string; }'.
//               Tipos da propriedade 'e' são incompatíveis.
//                 Tipo 'number' não é atribuível ao tipo 'string'

// Isso pode lidar com o trabalho por meio de diferentes tipos de objetos,
// para ainda fornecer uma mensagem de erro útil e concisa. 

class ClasseExemplo {
  state = "ok";
}

class OutraClasse {
  state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ClasseExemplo } } } } } };
let y = { a: { b: { c: { d: { e: { f: OutraClasse } } } } } };
x = y;

// Anteriormente na 3.6:
//
// Tipo '{ a: { b: { c: { d: { e: { f: typeof OutraClasse; }; }; }; }; }; }' não é atribuível ao tipo '{ a: { b: { c: { d: { e: { f: typeof ClasseExemplo; }; }; }; }; }; }'.
//   Tipos da propriedade 'a' são incompatíveis.
//     Tipo '{ b: { c: { d: { e: { f: typeof OutraClasse; }; }; }; }; }' não é atribuível ao tipo '{ b: { c: { d: { e: { f: typeof ClasseExemplo; }; }; }; }; }'.
//       Tipos da propriedade 'b' são incompatíveis.
//         Tipo '{ c: { d: { e: { f: typeof OutraClasse; }; }; }; }' não é atribuível ao tipo '{ c: { d: { e: { f: typeof ClasseExemplo; }; }; }; }'.
//           Tipos da propriedade 'c' são incompatíveis.
//             Tipo '{ d: { e: { f: typeof OutraClasse; }; }; }' não é atribuível ao tipo '{ d: { e: { f: typeof ClasseExemplo; }; }; }'.
//               Tipos da propriedade 'd' são incompatíveis.
//                 Tipo '{ e: { f: typeof OutraClasse; }; }' não é atribuível ao tipo '{ e: { f: typeof ClasseExemplo; }; }'.
//                   Tipos da propriedade 'e' são incompatíveis.
//                     Tipo '{ f: typeof OutraClasse; }' não é atribuível ao tipo '{ f: typeof ClasseExemplo; }'.
//                       Tipos da propriedade 'f' são incompatíveis.
//                         Tipo 'typeof OutraClasse' não é atribuível ao tipo 'typeof ClasseExemplo'.
//                           Tipo 'OutraClasse' não é atribuível ao tipo 'ClasseExemplo'.
//                             Tipos da propriedade 'stasão incompatíveis are incompatible.
//                               Tipo 'number' não é atribuível ao tipo 'string'
