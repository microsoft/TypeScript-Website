//// { order: 3, isJavaScript: true }
// Por padrão TypeScript não disponibiliza mensagens de erro
// no JavaScript. Ao invés disso a ferramenta é focada em 
// disponibilizar um amplo suporte aos editores. 

// Habilitar erros, por outro lado, é bastante fácil. Em
// um arquivo JS qualquer, tudo o que se precisa fazer para 
// habilitar as mensagens de erro do TypeScript é adicionar
// o seguinte comentário:

// @ts-check

let myString = "123";
myString = {};

// Isto pode começar a adicionar vários sublinhados vermelhos
// em seu arquivo JS. Enquanto estiver trabalhando dentro do 
// JavaScript, você tem algumas ferramentas disponívels para 
// consertar estes erros.

// Para alguns dos erros mais complicados, nos quais você 
// sente que mudanças no código não deveriam ser feitas, você
// pode usar anotações JSDoc para informar ao TypeScript
// quais os tipos deveriam ser:

/** @type {string | {}} */
let myStringOrObject = "123";
myStringOrObject = {};

// No qual você pode ler mais aqui: exemplo: jsdoc-support

// Você pode também declarar a falha como irrelevante
// ao informar ao TypeScript que ignore o próximo erro:

let myIgnoredError = "123";
// @ts-ignore
myStringOrObject = {};

// Você pode usar inferência de tipo através do fluxo do
// código para fazer mudanças no seu JavaScript: exemplo:code-flow
