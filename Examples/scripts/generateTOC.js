// @ts-check

const {join} = require("path")
const { writeFileSync } = require("fs")

/**
 * @typedef {Object} Item - an item in the TOC
 * @property {string[]} path - the path to get to this file
 * @property {string} title - name
 * @property {string} body - the text for the example
 * @property {number} sortIndex - when listing the objects
 * @property {any} compilerSettings - name
 */


 /** @type Item */
const example1 = {
  path: ["JavaScript", "Functions with JavaScript", "Function Chaining.ts"],
  title: "Function Chaining",
  body: "",
  sortIndex: 0,
  compilerSettings: {}
}

 /** @type Item */
const example2 = {
  path: ["JavaScript", "Modern JavaScript", "JSDoc Support.ts"],
  title: "JSDoc support",
  body: "",
  sortIndex: 3,
  compilerSettings: { isJavaScript: true }
}


const tableOfContentsFile = join("site/examplesTableOfContents.json")
writeFileSync(tableOfContentsFile, JSON.stringify([example1, example2]))
