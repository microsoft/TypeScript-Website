//// { order: 3, compiler: { strictNullChecks: false } }

// No JavaScript existem duas maneiras de declarar valores que não
// existem, o TypeScript adiciona sintaxe extra que nos proporciona
// mais maneiras de declarar algo como opcional ou nulo.

// Primeiramente a diferença entre os dois primitivos
// no JavaScript: undefined e null.

// Undefined é quando algo não foi encontrado ou definido.

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// Null é usado quando se quer intencionalmente mostrar que
// o valor não existe.

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// Por que não usar undefined? Pricipalmente, porque agora podemos
// verificar que text foi incluido corretamente. Se text retornasse
// undefined então o resultado seria o mesmo que dizer que não
// foi declarado.

// Isso pode parecer superficial, mas quando convertido
// em uma string JSON, se o text fosse undefined, nāo seria
// incluido na conversão para string.

// Strict Null Types

// Antes do TypeScript 2.0, undefined e null eram efetivamente
// ignorados no sistema de tipagem. Isso fazia com que TypeScript
// pudesse prover um ambiente de desenvolvimento mais próximo de
// um JavaScript sem tipagem.

// A versāo 2.0 adiciona uma configuração de compilação (flag),
// chamada "strictNullChecks". Essa flag requer que undefined e null
// sejam tratados como tipos, o que significa que devem ser manipulados
// via análise de fluxo de código (code-flow).
// ( veja mais em example:code-flow )

// Para um exemplo da diferença quando se usa o strict null
// checks no TypeScript, passe o mouse por cima de "Potential String" abaixo:

type PotentialString = string | undefined | null;

// O PotentialString discarta o undefined e null. Se você ir
// até as configurações, ligar o strict mode e voltar
// você pode ver que ao passar o mouse por cima de PotencialString
// agora pode ver a união completa.

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// Somente em strict mode a linha acima vai falhar^

// Existem maneiras de dizer ao TypeScript que você sabe mais
// sobre a tipagem, como type assertion ou através do
// non-null assertion operator (!)

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// Ou pode com segurança checar a existência do valor usando if:

if (userID) {
  console.log(userID);
}

// Optional Properties

// Void

// Void é a tipagem de retorno quando uma função não
// tem um valor de retorno.

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// Isso geralmente é um acidente, e o TypeScript mantém o tipo void
// para que você tenha erros de compilação - mesmo que em
// tempo de execução ele seria um valor undefined.
