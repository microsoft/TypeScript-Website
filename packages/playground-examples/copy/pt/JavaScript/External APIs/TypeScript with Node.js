//// { order: 3, isJavaScript: true }

// Node.js é um ambiente de execução muito popular feito com v8,
// a ferramenta JavaScript que da vida ao Chrome. Você pode usa-la
// para construir servers, clientes front-end e qualquer coisa que
// esteja entre os dois.

// https://nodejs.org/

// Node.js vem com um grupo de bibliotecas basais que estendem o 
// ambiente de execução Javascript. 
// Abrangendo des dê tratamento de caminhos:

import { join } from "path";
const myPath = join("~", "downloads", "todo_list.json");

// a manipulação de arquivos:

import { readFileSync } from "fs";
const todoListText = readFileSync(myPath, "utf8");

// Você pode adicionar tipos de forma incremental ao seus projetos Javascript
// usando tipos JSDoc-style. Iremos fazer um para nosso item da lista de AFAZER
// baseados na estrutura JSON:

/**
 * @typedef {Object} TODO um item AFAZER
 * @property {string} title O nome de exibição para o item da lista de AFAZER.
 * @property {string} body A descrição do item da lista de AFAZER.
 * @property {boolean} done Se o item da lista de AFAZER está completo
 */

// Agora atribui isso ao valor de retorno do JSON.parse
// para saber mais sobre isso, veja: exemplo:jsdoc-support

/** @type {TODO[]} uma lista de AFAZERES */
const todoList = JSON.parse(todoListText);

// E tratamento de processos:
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.done)
  .forEach(todo => {
    // Use o cliente ghi para criar uma issue para cada item
    // da lista de afazeres que ainda não foram concluídos.

    // Note que você tem auto-complete e documentação
    // no JS quando você destaca 'todo.title' abaixo.
    spawnSync(`ghi open --message "${todo.title}\n${todo.body}"`);
  });

// TypeScript tem definições de tipo atualizadas para todos os 
// módulos embutidos via DefinitelyTyped - que significa que você
// pode escrever programas node com uma forte cobertura de tipos.
