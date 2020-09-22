//// { order: 3, isJavaScript: true }

// O TypeScript tem um suporte muito rico ao JSDoc, para muitos casos
// você pode até não utilizar arquivos .ts e apenas usar anotações de JSDoc
// para criar um ambiente de desenvolvimento rico.
//
// Um comentário JSDoc é um comentário de múltiplas linhas que 
// começam com dois asteriscos ao invés de um.

/* Este é um comentário normal */
/** Este é um comentário JSDoc */

// Comentários JSDoc pertencem ao código JavaScript mais 
// próximo abaixo dele

const minhaVariavel = "Oi";

// Se você passar o mouse sobre minhaVariavel, você pode ver que 
// ela tem o texto do comentário JSDoc acima.

// Comentários JSDoc são um meio de fornecer para o TypeScript e editores 
// informação sobre os tipos utilizados. Vamos começar com um fácil,
// definindo o tipo de uma variável como um tipo nativo. 

// Para todos os exemplos, você pode passar o mouse sobre o nome.
// E na próxima linha tente escrever [exemplo] para ver
// as opções de auto-complete.

/** @type {number} */
var meuNumero;

// Você pode ver todas as tags disponíveis no manual:
//
// https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc

// Entretanto, nós vamos tentar cobrir alguns exemplos a mais aqui. 
// Você também pode copiar e colar aqui quaisquer exemplos do manual.

// Importando tipos para arquivos de configuração em JavaScript.

/** @type { import("webpack").Config } */
const config = {};

// Criando um tipo complexo para reutilizar em múltiplos lugares:

/**
 * @typedef {Object} Usuario - a conta de um usuario
 * @property {string} nome - o nome de usuario
 * @property {number} id - um id único
 */

// Então use-o através do nome do typedef:

/** @type { Usuario } */
const usuario = {};

// Existe em TypeScript uma definição de tipo em linha ("inline type shorthand") que é equivalente
// e a qual você pode usar para ambos: o type e o typedef.

/** @type {{ dono: Usuario, nome: string }} */
const recurso;

/** @typedef {{dono: Usuario, nome: string}} Recurso */

/** @type {Recurso} */
const outroRecurso;


// Declarando uma função com tipos:

/**
 * Adiciona dois números
 * @param {number} a O primeiro número
 * @param {number} b O segundo número
 * @returns {number}
 */
function adicionaDoisNumeros(a, b) {
  return a + b;
}

// Você pode usar a maioria das ferramentas de tipos do TypeScript, como uniões ("unions"):

/** @type {(string | boolean)} */
let stringOuBoolean = "";
stringOuBoolean = false;

// Estender globais em JSDoc é um processo mais complicado
// que você pode conferir no manual do VS Code:
//
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking

// Adicionar comentários do JSDoc em suas funções é uma situação
// em que todos ganham. Você tem melhores ferramentas assim como
// todo os consumidores da sua API.
