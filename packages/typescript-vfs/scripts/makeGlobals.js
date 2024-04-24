// @ts-check

// Creates a web version of tsvfs which sets a global of 'tsvfs'.

const fs = require("fs")
const path = require("path")

const esm = fs.readFileSync(path.join(__dirname, "..", "dist", "vfs.esm.js"), "utf8")
const body = esm.replace("export {", "const tsvfs = {")
const suffix = `
const getGlobal = function () { 
  if (typeof self !== 'undefined') { return self; } 
  if (typeof window !== 'undefined') { return window; } 
  if (typeof global !== 'undefined') { return global; } 
  throw new Error('unable to locate global object'); 
}; 

const globals = getGlobal(); 
globals.tsvfs = tsvfs;
`

fs.writeFileSync(path.join(__dirname, "..", "dist", "vfs.globals.js"), body + suffix, "utf8")
