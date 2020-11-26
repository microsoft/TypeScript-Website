//// { compilador: { ts: "4.1.0-dev.20201028" } }

// O TypeScript 4.1 adiciona suporte para as template literals, você pode
// aprender os conceitos básicos em intro-to-template-literals

// A 4.1 introduz uma nova sintaxe dentro declaração mapeada de tipos,
// agora você pode utilizar "as `templated string`" que pode ser utilizado para transformar
// strings dentro de uma união.

// Por exemplo, este tipo irá transformar todas as propriedades de um tipo existente
// em quatro funções que correspondem a chamadas REST tradicionais.

// String literals template para descrever cada endpoint da API:
type GET<T extends string> =  `get${Capitalize<T>}`
type POST<T extends string> =  `post${ Capitalize<T>}`
type PUT<T extends string> =  `put${ Capitalize<T>}`
type DELETE<T extends string> =  `delete${ Capitalize<T>}`

// Uma união dos tipos literais acima
type REST<T extends string> = GET<T> | POST<T> | PUT<T> | DELETE<T>

// Pega um tipo, então para cada propriedade da string no tipo, mapeia
// esta chave para a REST acima, que criaria as quatro funções.

type RESTify<Type> = {
  [Key in keyof Type as REST<Key extends string ? Key : never>]: () => Type[Key]
};

// A expressão `Key extends string ? Key : never` é necessária porque um objeto
// pode conter strings, números e símbolos como chaves. Podemos manipular somente 
// os casos de chaves string aqui.

// Agora temos uma lista de objetos disponíveis através da API:

interface APIs {
  artwork: { id: string, title: string};
  artist: { id: string, name: string};
  location: { id: string, address: string, country: string }
}

// Entao quanto temos um objeto que usa estes tipos
declare const api: RESTify<APIs>

// Então todas estas funções são criadas automaticamente 
api.getArtist()
api.postArtist()
api.putLocation()

// Continue aprendendo mais sobre template literals em:
// string-manipulation-with-template-literals

// Ou leia o artigo em nosso blog:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
