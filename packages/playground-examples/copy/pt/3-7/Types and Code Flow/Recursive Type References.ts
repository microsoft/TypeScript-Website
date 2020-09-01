//// { compiler: {  }, order: 2 }

// A escolha entre o uso de tipo x interface envolve as
// restrições nos recursos de cada um. Com o 3.7, uma das
// restrições no tipo, mas não na interface, foi removida.

// Você pode descobrir mais sobre isso em example:types-vs-interfaces

// Antes, você não podia se referir ao tipo que está definindo dentro
// do próprio tipo. Este era um limite que não existia dentro de uma
// interface e poderia ser contornado com um pouco de trabalho.

// Por exemplo, isso não é possível em 3.6:
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

// Uma implementação teria esta aparência, misturando o tipo
// com uma interface.
type ValueOrArray2<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray2<T>> {}

// Isso permite uma definição abrangente de JSON, que
// funciona referindo-se a si mesmo.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const exampleStatusJSON: Json = {
  available: true,
  username: "Jean-loup",
  room: {
    name: "Highcrest",
    // Não é possível adicionar funções ao tipo Json
    // update: () => {}
  },
};

// Há mais para aprender com as notas de lançamento da versão 3.7 beta e seu PR:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
