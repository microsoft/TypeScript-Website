// @ts-check
// Loops through all the sample code and ensures that twoslash doesn't raise

// yarn workspace tsconfig-reference lint

import chalk from "chalk";

const tick = chalk.bold.greenBright("✓");
const cross = chalk.bold.redBright("⤫");

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

import remark from "remark";
import remarkTwoSlash from "remark-shiki-twoslash";

import matter from "gray-matter";

const languages = readdirSync(new URL("../copy", import.meta.url)).filter(
  (f) => !f.startsWith(".")
);

console.log("Linting the sample code which uses twoslasher in ts-config");

// Pass in a 2nd arg to filter which markdown to run
const filterString = process.argv[2] ? process.argv[2] : "";

const errorReports = [];

const go = async () => {
  for (const lang of languages) {
    console.log("\n\nLanguage: " + chalk.bold(lang) + "\n");

    const locale = new URL(`../copy/${lang}/`, import.meta.url);
    let options;

    try {
      options = readdirSync(new URL("options", locale)).filter(
        (f) => !f.startsWith(".")
      );
    } catch {
      errorReports.push({
        path: new URL("options", locale),
        error: `Options directory ${new URL("options", locale)} doesn't exist`,
      });
      continue;
    }

    const runTwoslash = remarkTwoSlash.default({});
    for (const option of options) {
      if (filterString.length && !option.includes(filterString)) continue;

      const optionPath = new URL(`options/${option}`, locale);

      const isDir = statSync(optionPath).isDirectory();
      if (isDir) continue;

      const markdown = readFileSync(optionPath, "utf8");
      const markdownAST = remark().parse(markdown);
      let hasError = false;

      try {
        await runTwoslash(markdownAST);
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

      if (!optionFile.data.oneline) {
        hasError = true;
        // prettier-ignore

        errorReports.push({ path: optionPath, error: new Error("Did not have a 'oneline' property in the YML header") });
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
      "Note: you can add an extra argument to the lint script ( yarn workspace tsconfig-reference lint [opt] ) to just run one lint."
    );
  }
};

go();
