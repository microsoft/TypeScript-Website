//// { order: 3, compiler: { strictNullChecks: true } }

//Como o fluxo de código dentro de nossos arquivos JavaScript podem afetar
//a tipagem ao longo de nosso programa.

const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }];

//Iremos verificar se encontramos um usuário com nome "jon".
const jon = users.find((u) => u.name === "jon");

//No caso acima, o método 'find' pode falhar. Neste caso, 
//não temos um objeto. Isto cria a tipagem:
//
//   { name: string } | undefined
//
//Se você passar o mouse por cima dos três casos de uso de 'jon' abaixo,
//você verá que a tipagem muda dependendo de onde a palavra está alocada:

if (jon) {
  jon;
} else {
  jon;
}

//O tipo '{ name: string } | undefined' usa uma ferramenta do TypeScript
//chamado de union types (união de tipagens). Uma union type é uma forma 
//de declarar que um objeto pode ser uma de muitas coisas.
//
//O pipe (barra vertical) atua como um separador entre duas diferentes tipagens.
//A natureza dinâmica do JavaScript permite que muitas funções
//recebam e retornem objetos de tipagens não-relacionadas e nós
//precisamos ser capazes de expressar com quais podemos estar lidando.

//Nós podemos usar isso em várias formas. Vamos começar observando
//um array cujos valores são de tipagens diferentes.

const identifiers = ["Hello", "World", 24, 19];

//Nós podemos usar a sintaxe JavaScript 'typeof x === y' para a verificação
//da tipagem do primeiro elemento. Você pode passar o mouse sobre a palavra 
//'randomIdentifier' abaixo e ver como ela muda conforme suas 
//diferentes localizações.

const randomIdentifier = identifiers[0];
if (typeof randomIdentifier === "number") {
  randomIdentifier;
} else {
  randomIdentifier;
}

//Essa análise do controle de fluxo significa que nós podemos escrever
//Javascript puro e o TypeScript tentará entender como a tipagem do código
//mudará em diferentes localizações.

//Para entender mais sobre a análise do fluxo de código:
// - example:type-guards

//Para continuar lendo os exemplos você poderá pular para os seguintes
//tópicos agora: 
//
// - Modern JavaScript: example:immutability
// - Type Guards: example:type-guards
// - Functional Programming with JavaScript example:function-chaining
