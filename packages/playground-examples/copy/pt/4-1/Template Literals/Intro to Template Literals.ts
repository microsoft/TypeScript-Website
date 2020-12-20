//// { compilador: { ts: "4.1.0-dev.20201028" } }

// O TypeScript já suporta o tratamento de um string/número exato 
// como um literal, por exemplo esta função permite somente duas
// strings exatas e somente isto:

declare function enableFeature(command: "redesign" | "newArtistPage"): void;
enableFeature("redesign");
enableFeature(`newArtistPage`);
enableFeature("newPaymentSystem");

// Strings literais suportam a mesma forma como você escreve uma
// string no ES2020, com o TypeScript 4.1 estendemos o 
//  suporte a interpolação dentro de uma string literal.

type Features = "Redesign" | "newArtistPage";

// Isto pega a união na variável Features acima, e transforma
// cada pedaço desta união para adicionar o trecho `-branch` depois da string
type FeatureBranch = `${Features}-branch`;

// A 4.1 suporta um conjunto de palavras chave genéricas que 
// você pode utilizar dentro de uma template literal para manipular strings.
// Estas são: Uppercase, Lowercase, Capitalize e Uncapitalize

type FeatureID = `${Lowercase<Features>}-id`;
type FeatureEnvVar = `${ Uppercase<Features>} - ID`;

// Strings em uniões são avaliados de forma cruzada, então se utilizado mais
// de um tipo de união cada membro de uma união é avaliado
// contra cada membro da outra união.

type EnabledStates = "enabled" | "disabled";
type FeatureUIStrings = `${ Features } is ${ EnabledStates }`;

// Isto garante que qualquer combinação possível de cada
// união é considerada.

// Este type pode então ser utilizado com uma assinatura indexada
// para rapidamente criar uma lista de chaves:

type SetFeatures = {
  [K in FeatureID]: boolean
};

// Continue aprendendo mais sobre template literals em
// mapped-types-with-template-literals

// Ou leia o artigo em nosso blog:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
