// Node is a very popular JavaScript runtime built on v8,
// the JavaScript engine which powers Chrome. You can use it
// to build servers, front-end clients and anything in-between.

// https://nodejs.org/en/

// Node comes with a set of core libraries which extend the
// JavaScript runtime, they range from path handling:

import {join} from "path"
const myPath = join("~", "downloads", "todo_list.json")

// To file manipulation:

import {readFileSync} from "fs"
const todoListText = readFileSync(myPath, "utf8")

interface TODO {
  title: string
  description: string
  done: boolean
}

const todoList = JSON.parse(todoListText) as TODO[]

// And process handling:
import {spawnSync} from "child_process"
todoList.filter(todo => !todo.done)
        .forEach(todo => {
  // Use the ghi client to create an issue for every todo 
  // list item which hasn't been completed yet
  spawnSync(`ghi open --message "${todo.title}\n${todo.description}" `)
});

// TypeScript has up-to-date type definitions for all of the 
// built in modules via DefinitelyTyped - which means you 
// can write node programs with strong type coverage
