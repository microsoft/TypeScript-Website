// @ts-check

// Creates a web version of tstwoslash which sets a global of 'tstwoslash'.
// Relies on tsvfs already existing

const fs = require("fs")
const path = require("path")

const esm = fs.readFileSync(path.join(__dirname, "..", "dist", "twoslash.esm.js"), "utf8")
const body = esm
  .replace("import {", "const {")
  .replace("} from '@typescript/vfs';", "} = globals.tsvfs")
  .replace("export {", "const twoslash = {")
const prefix = `
const getGlobal = function () { 
  if (typeof self !== 'undefined') { return self; } 
  if (typeof window !== 'undefined') { return window; } 
  if (typeof global !== 'undefined') { return global; } 
  throw new Error('unable to locate global object'); 
}; 

const globals = getGlobal();
if (typeof globals.tsvfs === 'undefined') throw new Error("Could not find tsvfs on the global object")
`

const suffix = `
globals.twoslash = twoslash`

fs.writeFileSync(path.join(__dirname, "..", "dist", "twoslash.globals.js"), prefix + body + suffix, "utf8")
