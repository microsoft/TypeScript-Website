// @ts-check

const { join, dirname, basename } = require("path");
const { writeFileSync } = require("fs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const JSON5 = require("json5");
const os = require("os");

/** Recursively retrieve file paths from a given folder and its subfolders. */
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
 * @property {string} lang - the language for the example
 * @property {number} sortIndex - when listing the objects
 * @property {string} hash - the md5 of the content
 * @property {any} compilerSettings - name
 */

const root = join(__dirname, "..", "copy", "en");
const categories = fs.readdirSync(root).filter(path => !path.startsWith(".") && !path.includes("."));
/** @type {string[]} */
const allEnglishExampleFiles = categories.map(c => getFilePaths(join(root, c)));
const all = [].concat
  .apply([], allEnglishExampleFiles)
  .filter(p => p.endsWith(".ts") || p.endsWith(".tsx") || p.endsWith(".js"));

const englishSection = JSON5.parse(fs.readFileSync(join(root, "sections.json"), "utf8"));

const langs = fs.readdirSync(join(__dirname, "..", "copy")).filter(l => !l.startsWith("."));
langs.forEach(lang => {
  if (lang.startsWith(".")) return;
  const root = join(__dirname, "..", "copy", lang);

  const examples = all.map(englishExamplePath => {
    const localExample = englishExamplePath.replace("copy/en", "copy/" + lang);
    const fileExistsInLang = fs.existsSync(localExample);
    const filePath = fileExistsInLang ? localExample : englishExamplePath;
    let contents = fs.readFileSync(filePath, "utf8");

    // Grab compiler options, and potential display titles
    let compiler = {};
    let index = 1;
    let inlineTitle = undefined;
    if (contents.startsWith("//// {")) {
      // convert windows newlines to linux new lines
      const preJSON = contents.replace(/\r\n/g, "\n").split("//// {")[1].split("}\n")[0];
      contents = contents.split("\n").slice(1).join("\n");

      const code = "{" + preJSON + "}";

      try {
        const obj = JSON.parse(code);
        if (obj.order) {
          index = obj.order;
          delete obj.order;
        }
        if (obj.title) {
          inlineTitle = obj.title;
          delete obj.title;
        }
        compiler = obj.compiler;
      } catch (err) {
        console.error(">>>> " + filePath);
        console.error("Issue with: ", code);
        throw err;
      }
    }

    const title = path.basename(filePath).split(".").slice(0, -1).join(".");

    /** @type Item */
    const item = {
      path: dirname(filePath).split(path.sep).slice(-2),
      title: inlineTitle || title,
      name: basename(filePath),
      lang: fileExistsInLang ? lang : "en",
      id: title
        .toLowerCase()
        .replace(/[^\x00-\x7F]/g, "-")
        .replace(/ /g, "-")
        .replace(/\//g, "-")
        .replace(/\+/g, "-"),

      sortIndex: index,
      hash: crypto.createHash("md5").update(contents).digest("hex"),

      compilerSettings: compiler,
    };

    return item;
  });

  const toc = JSON5.parse(fs.readFileSync(join(root, "sections.json"), "utf8"));
  toc.examples = examples;
  toc.sortedSubSections = englishSection.sortedSubSections;
  validateTOC(toc);

  const prodTableOfContentsFile = join(__dirname, "..", "generated", lang + ".json");
  writeFileSync(prodTableOfContentsFile, JSON.stringify(toc));

  function validateTOC(toc) {
    // Ensure all subfolders are in the sorted section
    const allSubFolders = [];
    all.forEach(filepath => {
      const subPath = dirname(filepath).split(path.sep).pop();
      if (!allSubFolders.includes(subPath)) {
        allSubFolders.push(subPath);
      }
    });
    allSubFolders.forEach(s => {
      if (!toc.sortedSubSections.includes(s)) {
        throw new Error("Expected '" + s + "' in " + toc.sortedSubSections);
      }
    });
  }
});

console.log("Created playground example TOCs for: " + langs.join(", "));
