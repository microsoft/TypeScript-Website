// @ts-check

const { existsSync } = require("fs");
const { join, dirname, basename} = require("path");
const { writeFileSync } = require("fs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/** Retrieve file paths from a given folder and its subfolders. */
// https://gist.github.com/kethinov/6658166#gistcomment-2936675
const getFilePaths = folderPath => {
  const entryPaths = fs.readdirSync(folderPath).map(entry => path.join(folderPath, entry));
  const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
  const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(getFilePaths(curr)), []);
  return [...filePaths, ...dirFiles];
};

/**
 * @typedef {Object} Item - an item in the TOC
 * @property {string[]} path - the path to get to this file
 * @property {string} name - the filename
 * @property {string} id - an id for the slug
 * @property {string} title - name
 * @property {number} sortIndex - when listing the objects
 * @property {string} hash - the md5 of the content
 * @property {any} compilerSettings - name
 */

//  * @property {string} body - the text for the example

const root = join(__dirname, "..", "en");
const allJS = getFilePaths(join(root, "JavaScript"));
const allTS = getFilePaths(join(root, "TypeScript"));

const all37Examples = getFilePaths(join(root, "3-7"));
const allPlaygroundExamples = getFilePaths(join(root, "Playground"));

/** @type {string[]} */
const all = [...allJS, ...allTS, ...all37Examples, ...allPlaygroundExamples]
              .filter(p => p.endsWith(".ts") || p.endsWith(".tsx") || p.endsWith(".js"));

const examples = all.map(m => {
  let contents = fs.readFileSync(m, "utf8");
  const relative = path.relative(root, m);
  const title = path
    .basename(m)
    .split(".")
    .slice(0, -1)
    .join(".");
  let compiler = {};
  let index = 1;

  if (contents.startsWith("//// {")) {
    const preJSON = contents.split("//// {")[1].split("}\n")[0];
    contents = contents
      .split("\n")
      .slice(1)
      .join("\n");
    const code = "({" + preJSON + "})";

    try {
      const obj = eval(code);
      if (obj.order) {
        index = obj.order;
        delete obj.order;
      }
      compiler = obj.compiler;
    } catch (err) {
      console.error(">>>> " + m);
      console.error("Issue with: ", code);
      throw err;
    }
  }

  /** @type Item */
  const item = {
    path: dirname(relative).split("/"),
    title: title,
    name: basename(relative),
    id: title
      .toLowerCase()
      .replace(/[^\x00-\x7F]/g, "-")
      .replace(/ /g, "-")
      .replace(/\//g, "-")
      .replace(/\+/g, "-"),

    // body: contents,
    sortIndex: index,
    hash: crypto
      .createHash("md5")
      .update(contents)
      .digest("hex"),

    compilerSettings: compiler
  };

  return item;
});

const toc = {
  sections: [{
    name: "JavaScript",
    subtitle: "See how TypeScript improves day to day working with JavaScript with minimal additional syntax."
  },
  {
    name: "TypeScript",
    subtitle: "Explore how TypeScript extends JavaScript to add more safety and tooling."
  },
  {
    name: "3.7",
    subtitle: "See the <a href='https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-beta/'>Beta Release notes</a>.",
    whatisnew: true
  },
  {
    name: "Playground",
    subtitle: "Learn what has changed in this website.",
    whatisnew: true
  }],
  sortedSubSections: [
    // JS
    "JavaScript Essentials",
    "Functions with JavaScript",
    "Working With Classes",
    "Modern JavaScript",
    "External APIs",
    "Helping with JavaScript",
    // TS
    "Primitives",
    "Type Primitives",
    "Meta-Types",
    "Language",
    "Language Extensions",
    // Examples
    "Syntax and Messaging",
    "Types and Code Flow",
    "Fixits",
    // Playground
    "Config",
    "Tooling"
  ],
  examples
}

validateTOC(toc)

const prodTableOfContentsFile = join(__dirname, "..", "..", "site/examplesTOC.json");
const devTableOfContentsFile = join(__dirname, "..", "..", "serve/examplesTOC.json");
if (existsSync( join(__dirname, "..", "..", "site"))) {
  writeFileSync(prodTableOfContentsFile, JSON.stringify(toc));
}
if (existsSync( join(__dirname, "..", "..", "serve"))) {
  writeFileSync(devTableOfContentsFile, JSON.stringify(toc));
}


function validateTOC(toc) {
  // Ensure all subfolders are in the sorted section
  const allSubFolders = []
  all.forEach(path => {
    const subPath = dirname(path).split("/").pop()
    if (!allSubFolders.includes(subPath)){ allSubFolders.push(subPath) }
  });
  allSubFolders.forEach(s => {
    if(!toc.sortedSubSections.includes(s)) {
      throw new Error("Expected '" + s + "' in " + toc.sortedSubSections)
    }
  })
}
