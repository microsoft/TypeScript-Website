// @ts-check
// Loops through all the sample code and ensures that twoslash doesn't raise

const chalk = require("chalk");

const tick = chalk.bold.greenBright("✓");
const cross = chalk.bold.redBright("⤫");

const { readdirSync, readFileSync } = require("fs");
const fs = require("fs");
const { join } = require("path");
const path = require("path");

const remark = require("remark");
const remarkTwoSlash = require("remark-shiki-twoslash");

const languages = readdirSync(join(__dirname, "..", "copy")).filter(
  (f) => !f.startsWith(".")
);

console.log("Linting the docs pages");

// Pass in a 2nd arg to filter which markdown to run
const filterString = process.argv[2] ? process.argv[2] : "";
const errorReports = [];

const go = async () => {
  for (const lang of languages) {
    const locale = join(__dirname, "..", "copy", lang);
    const options = recursiveReadDirSync(locale);

    console.log("\n\nLanguage: " + chalk.bold(lang) + "\n");

    for (const option of options) {
      if (filterString.length && !option.includes(filterString)) continue;

      const optionPath = option; //join(locale, "options", option);

      const markdown = readFileSync(optionPath, "utf8");
      const markdownAST = remark().parse(markdown);
      let hasError = false;

      try {
        await remarkTwoSlash.default({})(markdownAST);
      } catch (error) {
        hasError = true;
        errorReports.push({ path: optionPath, error });
      }

      // const optionFile = read(optionPath);

      const sigil = hasError ? cross : tick;
      const name = hasError ? chalk.red(option) : option;
      const miniPath = name.replace(join(__dirname, "..", "copy"), "");
      console.log(miniPath + " " + sigil);
    }
  }

  if (errorReports.length) {
    process.exitCode = 1;

    errorReports.forEach((err) => {
      console.log(`\n> ${chalk.bold.red(err.path)}\n`);
      err.error.stack = undefined;
      console.log(err.error.message);
    });
    console.log("\n\n");

    console.log(
      "Note: you can add an extra argument to the lint script ( yarn workspace documentation lint [opt] ) to just run one lint."
    );
  }
};

go();

/** Recursively retrieve file paths from a given folder and its subfolders. */
// https://gist.github.com/kethinov/6658166#gistcomment-2936675
/** @returns {string[]} */
function recursiveReadDirSync(folderPath) {
  if (!fs.existsSync(folderPath)) return [];

  const entryPaths = fs
    .readdirSync(folderPath)
    .map((entry) => path.join(folderPath, entry));

  const filePaths = entryPaths.filter((entryPath) =>
    fs.statSync(entryPath).isFile()
  );
  const dirPaths = entryPaths.filter(
    (entryPath) => !filePaths.includes(entryPath)
  );
  const dirFiles = dirPaths.reduce(
    (prev, curr) => prev.concat(recursiveReadDirSync(curr)),
    []
  );

  return [...filePaths, ...dirFiles].filter(
    (f) => !f.endsWith(".DS_Store") && !f.endsWith("README.md")
  );
}
