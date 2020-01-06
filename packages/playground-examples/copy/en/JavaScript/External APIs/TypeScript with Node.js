//// { order: 3, isJavaScript: true }

// Node.js is a very popular JavaScript runtime built on v8,
// the JavaScript engine which powers Chrome. You can use it
// to build servers, front-end clients and anything in-between.

// https://nodejs.org/

// Node.js comes with a set of core libraries which extend the
// JavaScript runtime. They range from path handling:

import { join } from "path";
const myPath = join("~", "downloads", "todo_list.json");

// To file manipulation:

import { readFileSync } from "fs";
const todoListText = readFileSync(myPath, "utf8");

// You can incrementally add types to your JavaScript projects
// using JSDoc-style type. We'll make one for our TODO list item
// based on the JSON structure:

/**
 * @typedef {Object} TODO a TODO item
 * @property {string} title The display name for the TODO item
 * @property {string} body The description of the TODO item
 * @property {boolean} done Whether the TODO item is completed
 */

// Now assign that to the return value of JSON.parse
// to learn more about this, see: example:jsdoc-support

/** @type {TODO[]} a list of TODOs */
const todoList = JSON.parse(todoListText);

// And process handling:
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.done)
  .forEach(todo => {
    // Use the ghi client to create an issue for every todo
    // list item which hasn't been completed yet.

    // Note that you get correct auto-complete and
    // docs in JS when you highlight 'todo.title' below.
    spawnSync(`ghi open --message "${todo.title}\n${todo.body}"`);
  });

// TypeScript has up-to-date type definitions for all of the
// built in modules via DefinitelyTyped - which means you
// can write node programs with strong type coverage.
