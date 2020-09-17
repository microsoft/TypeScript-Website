//// { order: 3, isJavaScript: true }

// Node.js é um ambiente de execução muito popular baseado no v8,
// a engine JavaScript que da vida ao Chrome. Você pode usa-la
// para construir servers, clientes front-end e qualquer coisa que
// esteja entre os dois.

// https://nodejs.org/

// Node.js vem com um grupo de bibliotecas base que estendem o 
// ambiente de execução Javascript. 
// Abrangendo desde tratamento de caminhos:

import { join } from "path";
const caminho = join("~", "downloads", "todo_list.json");

// a manipulação de arquivos:

import { readFileSync } from "fs";
const textoTodoList = readFileSync(caminho, "utf8");

// Você pode adicionar tipos de forma incremental ao seus projetos Javascript
// usando tipos no estilo JSDoc. Iremos fazer um para nossa lista de afazeres
// baseados na estrutura JSON:

/**
 * @typedef {Object} todo um item da lista
 * @property {string} titulo O nome de exibição para o item da lista.
 * @property {string} corpo A descrição do item da lista.
 * @property {boolean} completo Se o item da lista está completo
 */

// Agora atribuímos isso ao valor de retorno do JSON.parse
// para saber mais sobre isso, veja: exemplo:jsdoc-support

/** @type {todo[]} uma lista de afazeres */
const todoList = JSON.parse(textoTodoList);

// E tratamento de processos:
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.completo)
  .forEach(todo => {
    // Use o cliente ghi para criar uma issue para cada item
    // da lista de afazeres que ainda não foram concluídos.

    // Note que você tem auto-complete e documentação
    // no JS quando você destaca 'todo.titulo' abaixo.
    spawnSync(`ghi open --message "${todo.titulo}\n${todo.corpo}"`);
  });

// TypeScript tem definições de tipo atualizadas para todos os 
// módulos embutidos via DefinitelyTyped - que significa que você
// pode escrever programas node com uma forte cobertura de tipos.
