// @ts-check
// Loops through all the sample code and ensures that twoslash doesn't raise

// yarn workspace glossary lint

const chalk = require("chalk");

const tick = chalk.bold.greenBright("✓");
const cross = chalk.bold.redBright("⤫");

const { readdirSync, readFileSync } = require("fs");
const { join } = require("path");

const remark = require("remark");
const remarkTwoSlash = require("remark-shiki-twoslash");

const { read } = require("gray-matter");

const languages = readdirSync(join(__dirname, "..", "copy")).filter((f) => !f.startsWith("."));

console.log("Linting the sample code which uses twoslasher in ts-config");

// Pass in a 2nd arg to filter which markdown to run
const filterString = process.argv[2] ? process.argv[2] : "";

const errorReports = [];

const go = async () => {
  for (const lang of languages) {
    console.log("\n\nLanguage: " + chalk.bold(lang) + "\n");

    const locale = join(__dirname, "..", "copy", lang);
    let options;

    try {
      options = readdirSync(join(locale)).filter((f) => !f.startsWith("."));
    } catch {
      errorReports.push({
        path: join(locale, "options"),
        error: `Options directory ${join(locale, "options")} doesn't exist`,
      });
      return;
    }

    for (const option of options) {
      if (filterString.length && !option.includes(filterString)) return;

      const optionPath = join(locale, option);

      const markdown = readFileSync(optionPath, "utf8");
      const markdownAST = remark().parse(markdown);
      let hasError = false;

      try {
        await remarkTwoSlash.default({})(markdownAST);
      } catch (error) {
        hasError = true;
        errorReports.push({ path: optionPath, error });
      }

      const optionFile = read(optionPath);
      if (!optionFile.data.display) {
        hasError = true;
        // prettier-ignore
        errorReports.push({ path: optionPath, error: new Error("Did not have a 'display' property in the YML header") });
      }

      const sigil = hasError ? cross : tick;
      const name = hasError ? chalk.red(option) : option;
      process.stdout.write(name + " " + sigil + ", ");
    }
  }

  if (errorReports.length) {
    process.exitCode = 1;

    errorReports.forEach((err) => {
      console.log(`\n> ${chalk.bold.red(err.path)}\n`);
      err.error.stack = undefined;
      console.log(err.error);
    });
    console.log("\n\n");

    console.log(
      "Note: you can add an extra argument to the lint script ( yarn workspace glossary lint [opt] ) to just run one lint."
    );
  }
};
go();
