//// { order: 1, target: "ES5" }

// O JavaScript adicionou import/export à linguagem em 2016
// e TypeScript tem suporte completo para esse estilo de
// conexão entre arquivos e entre modulos externos.
// O TypeScript expande essa sintaxe ao permitir que tipos
// sejam importados e exportados junto com o código.

// Vamos ver o import de código de um módulo.

import { danger, message, warn, DangerDSLType } from "danger";

// Aqui importamos um conjunto de import nomeados
// ("named imports") de um módulo do Node chamado danger.
// Apesar de haver mais do que quatro imports,
// esses são os únicos que nós escolhemos importar.

// Nomeando especificamente quais imports você precisa,
// permite que ferramentas tenham a habilidade de remover
// código não utilizado em seu applicativo, e ajuda você a
// entender o que está sendo utilizado nessa arquivo em particular.

// Nesse caso: danger, message e warn são imports de JavaScript
// enquanto que DangerDSLType é uma interface.

// O TypeScript permite que engenheiros documentem seus códigos usando
// JSDoc, e a documentação é importada também. Por exemplo, se você
// passar o mouse sobre diferentes partes abaixo, você verá
// explicações sobre o que elas são.

danger.git.modified_files;

// Se você quiser saber como criar essas anotações de documentação
// leia o exemplo:jsdoc-support

// Outro modo de importar código é através do export
// padrão de um módulo. Um exemplo disso é o módulo debug, o qual
// expõe uma função que cria uma função de log.

import debug from "debug";
const log = debug("playground");
log("Código começou a rodar");

// Por conta das exports padrões ("default exports") não terem um nome,
// elas podem ser delicadas de se trabalhar junto com ferramentas de análise estática
// como o suporte a refactoração em TypeScript, mas elas têm o seu próprio uso.

// Por haver uma longa história sobre import/export de código
// em JavaScript, existe uma parte confusa sobre o export padrão:
// alguns módulos exportados tem documentação que sugere que você possa
// escrever um import como este:

import req from "request";

// Entretanto, isto apresenta uma erro. E então você encontra no
// Stack Overflow uma recomendação de import como esta:

import * as req from "request";

// E este funciona. Por que? Nós vamos voltar a isso no final
// da nossa sessão sobre export.

// Para realizar um import, você precisa fazer um export.
// O modo moderno de escrever exports é através da palavra-chave export

/** O número atual de adesivos que sobraram no rolo  */
export const numeroDeAdesivos = 11;

// Isso poderia ter sido importado em outro arquivo usando:
//
// import { numeroDeAdesivos } from "./caminho/para/o/arquivo"

// Vocé pode ter tantas importações em um arquivo quantas forem necessárias.
// Já um export padrão é bem parecido com isso.

/** Cria um adesivo para você */
const geradorDeAdesivos = () => {};
export default geradorDeAdesivos;

// Isto poderia ser importado em outro arquivo usando:
//
// import pegueAdesivos from "./caminho/para/o/arquivo"
//
// O nome é decidido pelo módulo que está realizando o import.

// Estes não são os únicos tipos de import, apenas os
// mais comuns em código moderno. Há um tópico bem abrangente
// sobre todos os modos que um código pode cruzar as fronteiras
// de um módulo no manual:
//
// https://www.typescriptlang.org/docs/handbook/modules.html

// Entretanto, para tentar responder a última questão. Se você
// observar o código JavaScript desse exemplo, você verá isto:

// var geradorDeAdesivos = function () { };
// exports.default = geradorDeAdesivos;

// Isso define a propriedade padrão ("default") no objeto exports como
// geradorDeAdesivos. Existe código que define o exports como uma
// função ao invés de um objeto.
//
// O TypeScript optou por utilizar a especificação ECMAScript
// sobre como lidar com esses casos, que é criar um erro.
// Entretanto, existe uma configuração do compilador que lida
// automaticamente com esses casos para você, que é a esModuleInterop.
//
// Se você ativar ela nesse exemplo, você verá que o erro desaparece.
