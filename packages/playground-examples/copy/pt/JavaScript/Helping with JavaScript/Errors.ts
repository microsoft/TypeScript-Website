//// { order: 3, isJavaScript: true }

// Por padrão o TypeScript não fornece mensagens
// de erro dentro do JavaScript. Em vez disso o ferramental
// é focado em prover um suporte avançado para editores.

// Ativar os erros entretanto, é muito fácil. Em um
// arquivo JS comum, tudo o que é necessário para ativar as
// mensagens de erro do TypeScript é adicionar o seguinte comentário:

// @ts-check

let myString = "123";
myString = {};

// Isso pode começar a adicionar vários rabiscos vermelhos
// dentro do seu arquivo JS. Ainda que continue funcionando
// dentro do JavaScript, você tem algumas ferramentas para
// corrigir esses erros.

// Para alguns do erros, onde você não sente que mudanças
// no código devem ocorrer, você pode usar as anotações JSDoc
// para dizer ao TypeScript quais devem ser os tipos:

/** @type {string | {}} */
let myStringOrObject = "123";
myStringOrObject = {};

// Você pode ler mais aqui: example:jsdoc-support

// Você pode declarar a falha sem importância, dizendo
// ao TypeScript para ignorar o próximo erro:

let myIgnoredError = "123";
// @ts-ignore
myStringOrObject = {};

// Você pode usar inferência de tipo através do fluxo de código
// para realizar mudanças no seu JavaSript: example:code-flow