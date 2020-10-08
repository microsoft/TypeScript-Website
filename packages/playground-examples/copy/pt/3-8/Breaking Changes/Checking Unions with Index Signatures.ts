//// { compiler: { ts: "3.8.3" } }
// Nas versões anteriores do TypeScript, o verificador não valida
// se os campos não declarados em uma união de tipos estavam em 
// conformidade com qualquer tipo indexado na união.

// Você pode aprender mais sobre tipagens indexadas aqui: example:indexed-types

// Por exemplo, o IdentifierCache abaixo indica que qualquer
// 'key' no objeto, será um número:

type IdentifierCache = { [key: string]: number };

// Significa que isso irá falhar, porque 'file_a' é uma string.

const cacheWithString: IdentifierCache = { file_a: "12343" };

// No entanto, quando você coloca isso em uma união,
// a verificação de validação não aconteceria

let userCache: IdentifierCache | { index: number };
userCache = { file_one: 5, file_two: "abc" };

// Isso foi corrigido e haveria um erro do compilador no 'file_two' 

// Isso também leva em consideração quando a key é de um tipo
// diferente, por exemplo: ([key: string] and [key: number])

type IdentifierResponseCache = { [key: number]: number };

let resultCache: IdentifierCache | IdentifierResponseCache;
resultCache = { file_one: "abc" };
