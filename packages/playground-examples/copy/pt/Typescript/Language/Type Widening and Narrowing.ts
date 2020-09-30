// Deve ser mais fácil para começar a discussão do
// widening e narrowing com um exemplo:

const welcomeString = "Hello There";
let replyString = "Hey";

// Além das diferenças de texto das strings, welcomeString
// é uma const (no qual significa que o valor nunca mudará)
// e replyString é um let (no qual significa que pode mudar).

// Se você hover sobre ambas as variáveis, você pega muito diferente
// tipo de informação do TypeScript:
//
//   const welcomeString: "Hello There"
//
//   let replyString: string

// TypeScript tem tipo de inferência do welcomeString para ser
// a string literal "Hello There", onde replyString
// é uma string genérica.

// Isso é porque um let precisa ter um tipo vasto, você
// pode determinar replyString para ser qualquer outra string - no qual significa
// ter uma grande group de possibilidades.

replyString = "Hi :wave:";

// Se replyString tiver uma string literal "Hey" - então
// você nunca poderia mudar o valor porque ele poderia mudar
// para apenas "Hey" de novo.

// Widening e Narrowing tipos é sobre expandir e reduzir
// as possibilidades no qual um type poderia representar.

// An example of type narrowing is working with unions, the
// example on code flow analysis is almost entirely based on
// narrowing: example:code-flow

// Type narrowing is what powers the strict mode of TypeScript
// via the nullability checks. With strict mode turned off,
// markers for nullability like undefined and null are ignored
// in a union.

declare const quantumString: string | undefined;
// This will fail in strict mode only
quantumString.length;

// In strict mode the onus is on the code author to ensure
// that the type has been narrowed to the non-null type.
// Usually this is as simple as an if check:

if (quantumString) {
  quantumString.length;
}

// In strict mode the type quantumString has two representations.
// Inside the if, the type was narrowed to just string.

// You can see more examples of narrowing in:
//
// example:union-and-intersection-types
// example:discriminate-types

// And even more resources on the web:
//
// https://mariusschulz.com/blog/literal-type-widening-in-typescript
// https://sandersn.github.io/manual/Widening-and-Narrowing-in-Typescript.html
