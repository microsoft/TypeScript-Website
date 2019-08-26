// @ts-check

const {join} = require("path")
const { writeFileSync } = require("fs")
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/** Retrieve file paths from a given folder and its subfolders. */
// https://gist.github.com/kethinov/6658166#gistcomment-2936675
const getFilePaths = (folderPath) => {
  const entryPaths = fs.readdirSync(folderPath).map(entry => path.join(folderPath, entry));
  const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
  const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(getFilePaths(curr)), []);
  return [...filePaths, ...dirFiles];
};


/**
 * @typedef {Object} Item - an item in the TOC
 * @property {string[]} path - the path to get to this file
 * @property {string} id - an id for the slug
 * @property {string} title - name
 * @property {string} body - the text for the example
 * @property {number} sortIndex - when listing the objects
 * @property {string} hash - the md5 of the content
 * @property {any} compilerSettings - name
 */

const root = join(__dirname, "..", "en")
const allJS = getFilePaths(join(root, "JavaScript"))
const allTS = getFilePaths(join(root, "JavaScript"))

/** @type {string[]} */
const all = [...allJS, ...allTS].filter(p => p.endsWith(".ts") || p.endsWith(".tsx")) 

const toc = all.map(m => {
  let contents = fs.readFileSync(m, "utf8")
  const relative = path.relative(root, m)
  const title = path.basename(m).split('.').slice(0, -1).join('.')
  let compiler = {}
  let index = 1

  if (contents.startsWith("//// {")) {
    const preJSON = contents.split("//// {")[1].split("}\n")[0]
    contents = contents.split("\n").slice(1).join("\n")
    const code ="({" + preJSON + "})"

    try {
      const obj = eval(code)
      if (obj.order) {
        index = obj.order
        delete obj.order
      }
      compiler = obj

    } catch(err) {
      console.error(">>>> " + m)
      console.error("Issue with: ", code)
      throw err
    }
  }
   /** @type Item */
  const item = {
    path: relative.split("/"),
    title: title,
    id: title.toLowerCase().replace(/[^\x00-\x7F]/g, "-").replace(/ /g, "-").replace(/\//g, "-").replace(/\+/g, "-"),
    body: contents,
    sortIndex: index,
    hash: crypto.createHash('md5').update(contents).digest("hex"),
    compilerSettings: compiler
  }

  return item
}) 

const tableOfContentsFile = join("site/examplesTableOfContents.json")
writeFileSync(tableOfContentsFile, JSON.stringify(toc))
