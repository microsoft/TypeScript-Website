// Tipos Condicionais fornecem uma maneira simples de adicionar
// lógica no sistema de tipos do Typescript. Esse é um recurso
// avançado, e é muito possível que você não precise utilizá-lo
// no seu código do dia a dia.

// Um tipo condicional se parece com:
//
//   A extends B ? C : D
//
// Onde a condição é: se um tipo se extende a uma expressão,
// e que tipo deveria ser retornado.

// Vamos passar por alguns exemplos, por questões de brevidade
// usaremos apenas uma letra para tipos genéricos. Isso é opcional,
// mas nos restringimos à 60 caracteres para caber na tela.

type Gato = { miau: true };
type Cachorro = { latido: true };
type Guepardo = { miau: true; rapido: true };
type Lobo = { latido: true; uivos: true };

// Podemos criar um tipo condicional onde é possível extrair
// tipos que se aplicam apenas com algo que late.

type ExtrairLatidos<A> = A extends { latido: true } ? A : never;

// Assim podemos criar tipos envolvidos pelo ExtrairLatidos:

// Um gato não late, então iremos retornar never
type GatoNever = ExtrairLatidos<Gato>;
// Um lobo late, então retornaremos a forma de lobo
type TipoLobo = ExtrairLatidos<Lobo>;

// Isso se torna útil quando você quer trabalhar com uma união
// de vários tipos e reduzir o número de potenciais opções:

type Animais = Gato | Cachorro | Guepardo | Lobo;

// Quando você aplica ExtrairLatidos para um tipo de união,
// é o mesmo que testar a condição com todos os membros do tipo:

type Latido = ExtrairLatidos<Animais>;

// = ExtrairLatidos<Gato> | ExtrairLatidos<Cachorro> |
//   ExtrairLatidos<Guepardo> | ExtrairLatidos<Lobo>
//
// = never | Cachorro | never | Lobo
//
// = Cachorro | Lobo (veja example:unknown-and-never)

// Isso é chamado de tipo condicional distributivo porque
// o tipo distribui para cada membro da união.

// Tipos condicionais diferidos

// Tipos condicionais podem ser usados para diminuir suas APIs
// que podem retornar diferentes tipos dependendo dos inputs.

// Por exemplo, essa função pode retornar tanto uma string
// quanto um number dependendo do boolean passado.

declare function pegarID<T extends boolean>(legal: T): T extends true ? string : number;

// Então dependendo do quanto o sistema de tipos sabe sobre o boolean
// você irá receber um tipo de retorno diferente:
let retornoDeString = pegarID(true);
let retornoDeNumber = pegarID(false);
let stringOuNumber = pegarID(Math.random() < 0.5);

// Nesse caso acima o TypeScript sabe o tipo de retorno imediatamente.
// Contudo, você pode usar tipos condicionais em funções
// onde o tipo não é conhecido. Isso é chamado tipo condicional diferido.

// O mesmo que o nosso ExtrairLatidos acima, mas como uma função
declare function extrairMiado<T>(x: T): T extends { miau: true } ? T : undefined;

// Existe uma ferramenta muito útil dentro dos tipos condicionais, na qual
// é possível especificamente dizer ao TypeScript que ele deve inferir o tipo
// quando diferido. Essa é a palavra chave 'infer'.

// 'infer' é normalmente usado para criar metatipos que inspecionam
// os tipos existentes no seu código, pense nisso como a criação de uma
// nova variável dentro do tipo.

type PegarOTipoDoRetorno<T> = T extends (...args: any[]) => infer R ? R : T;

// Brevemente:
//
//  - esse é um tipo genérico condicional chamado PegarOTipoDoRetorno
//    que recebe um tipo como primeiro parâmetro
//
//  - a condição checa se o tipo é uma função, e se for cria um novo tipo
//    chamado R baseado no retorno do valor da função
//
//  - se a checagem passar, o valor do tipo é inferido como o valor do
//    retorno da função, caso contrario é o tipo original
//

type retornoDoPegarID = PegarOTipoDoRetorno<typeof pegarID>;

// Isso falha na verifição de ser uma função, e iria apenas retornar o tipo
// passado a ele.
type pegarGato = PegarOTipoDoRetorno<Gato>;
