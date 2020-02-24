//// { title: 'TypeScript con Node', order: 3, isJavaScript: true }

// Node.js en un entorno de ejecución muy popular para JavaScript,
// construido sobre v8, el motor de JavaScript que utiliza Chrome. 
// Puedes usarlo para construir servidores, interfaces de usuario y
// cualquier otra cosa que se le parezca.

// https://nodejs.org/

// Node.js tiene con un conjunto de bibliotecas principales que
// extienden el entorno de ejecución de JavaScript. Van desde el 
// manejo de rutas del sistema operativo:

import { join } from "path";
const myPath = join("~", "downloads", "todo_list.json");

// hasta la manipulación de archivos:

import { readFileSync } from "fs";
const todoListText = readFileSync(myPath, "utf8");

// Puedes añadir incrementalmente tipos a tus proyectos de JavaScript
// usando tipos al estilo JSDoc. Haremos uno de los elementos de
// nuestra lista de tareas pendientes (en inglés TODOs) basados en 
// la estructura JSON:

/**
 * @typedef {Object} TODO un elemento de TODO
 * @property {string} title El nombre a mostrar del elemento TODO
 * @property {string} body La descripción del elemento TODO
 * @property {boolean} done Si el elemento TODO ha sido o no completado
 */

// Ahora asígnalo al valor de retorno de JSON.parse.
// Para más información, dirígete a: example:jsdoc-support

/** @type {TODO[]} una lista de TODOs */
const todoList = JSON.parse(todoListText);

// Y manejo de procesos:
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.done)
  .forEach(todo => {
    // Usa el cliente ghi para crear una incidencia por cada
    // elemento de la lista que no se ha completado aún.

    // Observa que se activa correctamente el autocompletamiento
    // y la documentación en JS cuando señalas debajo a 'todo.title'.
    spawnSync(`ghi open --message "${todo.title}\n${todo.body}"`);
  });

// TypeScript tiene definiciones de tipos actualizadas para todos
// los módulos incorporados por defecto, mediante DefinitelyTyped;
// lo que significa que puedes escribir programas de node con una
// sólida cobertura de tipos.
