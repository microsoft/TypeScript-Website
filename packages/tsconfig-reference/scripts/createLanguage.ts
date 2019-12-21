/**
 * Sets up the copy folder structure for a language

  node ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/createLanguage.ts
*/

const languageToCreate = "en";

import { writeFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const copyRoot = join(__dirname, "..", "copy");

const langRoot = join(copyRoot, languageToCreate);
if (!existsSync(langRoot)) mkdirSync(langRoot);

const optsRoot = join(langRoot, "options");
if (!existsSync(optsRoot)) mkdirSync(optsRoot);

const categoriesRoot = join(langRoot, "categories");
if (!existsSync(categoriesRoot)) mkdirSync(categoriesRoot);

const options = require("../data/tsconfigOpts.json");
options.forEach(opt => {
  const optionPath = join(optsRoot, opt.name + ".md");

  // if (existsSync(optionPath)) return

  // Make a pretty display title, which will use the compiler flag name
  // fot the anchor.
  const titleCase = opt.name
    .replace(/^.| ./g, m => m.toUpperCase())
    .replace(/[A-Z]/g, m => " " + m)
    .replace(/Ts/, "TS")
    .replace(/Js/, "JS")
    .trim();

  const yml = '```\ndisplay: "' + titleCase + '"\n```\n\n';
  const content = yml + opt.description.message;
  writeFileSync(optionPath, content);
});

const categories = require("../data/tsconfigCategories.json");
Object.values(categories).forEach((category: any) => {
  const categoryPath = join(categoriesRoot, category.key + ".md");

  if (existsSync(categoryPath)) return;
  writeFileSync(categoryPath, "");
});
