//// { compilador: { ts: "4.1.0-dev.20201028" } }

// Template literals podem ser utilizados para extrair e manipular tipos de strings literais.
// Estes tipos de string literal, por sua vez, podem ser usados como propriedades, e podem descrever
// possíveis transformações de uma string para um objeto em uma API.

// ## Dividindo uma string para um Objeto

// Template literals podem utilizar padrões como "pontos-de-divisão" para inferir as
// substrings necessárias. Por exemplo...

// Este tipo é uma string literal que conforma com uma string padrão SemVer.
type TSVersion = "4.1.2"

// Podemos criar um tipo para extrair os componentes desta string.
// Vamos dividir em dois caracteres '.'.
type ExtractSemver<SemverString extends string> =
  SemverString extends `${infer Major}.${ infer Minor }.${ infer Patch } ` ? 
        { major: Major, minor: Minor, patch: Patch } : { error: "Cannot parse semver string" }

// A linha 1 deve lhe parecer familiar se você observou os exemplos anteriores:
// intro-to-template-literals / mapped-types-with-template-literals

// A linha 2 é um tipo condicional, o TypeScript valida que o padrão de inferência combina
// com o parâmetro SemverString.

// A linha3 é o resultado da condição, se verdadeiro então resulta em um objeto
// com as substrings informadas em diferentes posições em um objeto. Se a string 
// não corresponder, então retorna o tipo com uma formatação de erro.

type TS = ExtractSemver<TSVersion>

// Isto não representa um SemVer 100%, como no exemplo:
type BadSemverButOKString = ExtractSemver<"4.0.Four.4444">

// Entretanto, o ExtractSemver irá falhar em strings que não tiverem o formato correto. Este caso
// só irá funcionar quando a string tiver o formato "X.Y.Z", que na linha abaixo não tem:
type SemverError = ExtractSemver<"Four point Zero point Five">

// ## Divisão Recursiva de String

// O exemplo anterior vai funcionar somente quando você tiver uma string exata para comparar,
// para os demais casos você deverá utilizar a feature do TypeScript 4.0: tuplas-variáveis.

// Para dividir uma string em componentes reutilizáveis, Tuplas são uma boa maneira para manter
// o registro dos resultados. Aqui temos um tipo de Split:

type Split<S extends string, D extends string> =
    string extends S ? string[] :
        S extends '' ? [] :
            S extends `${ infer T } ${ D } ${ infer U } ` ?  [T, ...Split<U, D>] :  [S];

// A linha 1 declara dois parâmetros, iremos utilizar um único caractere por abreviação
// S representa a string por dividir, e D o delimitador. Esta
// linha garante que ambas são strings.

// A linha 2 verifica se a string é literal, checando se uma string usual
// pode ser estendida de uma string de entrada. Caso sim, retorna um array de strings. Não
// podemos utilizar com strings não literais.

// Por exemplo neste caso:
type S1 = Split<string, ".">

// A linha 3 verifica se a string está vazia, Caso sim retorna uma tupla vazia
type S2 = Split<"", ".">

// A linha 4 possui uma verificação similar a nossa ExtractSemver. Se a string combina com
// `[Prefix as T][Deliminator][Suffix as U]` então extrai o prefixo (T) no
// primeiro parâmetro da tupla, executa novamente a divisão no sufixo (U) para garantir
// que mais de uma combinação pode ser encontrada.
//
// Se a string não incluir um delimitador, então retorna uma tupla de comprimento 1 
// que contém a string passada como argumento (S).

// Caso simples
type S3 = Split<"1.2", ".">

// Irá executar recursivamente até ter todos os .'s divididos
type S4 = Split<"1.2.3", ".">


// Com este conhecimento, você deve ser capaz de ler e entender um pouco
// dos exemplos da comunidade sobre template literals, por exemplo:
//
// - Um extrator de rotas express por Dan Vanderkam
// https://twitter.com/danvdk/status/1301707026507198464
//
// - Uma definição de document.querySelector por Mike Ryan
// https://twitter.com/mikeryandev/status/1308472279010025477
//
// Algumas pessoas também expirementaram exemplos mais complexos de analisadores de strings 
// utilizando string template literals, o que é interessante - mas não recomendado para
// códigos em ambientes de produção.
//
// https://github.com/ghoullier/awesome-template-literal-types
// 
// Ou leia o artigo em nosso blog:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
