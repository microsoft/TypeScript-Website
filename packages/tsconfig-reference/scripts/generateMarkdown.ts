// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/

import { writeFileSync, readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import * as assert from "assert";
import { read as readMarkdownFile } from "gray-matter";
import * as prettier from "prettier";
import { CompilerOptionJSON } from "./generateJSON.js";

import * as remark from "remark";
import * as remarkHTML from "remark-html";

const options = require("../data/tsconfigOpts.json").options as CompilerOptionJSON[];
const categories = require("../data/tsconfigCategories.json") as typeof import("../data/tsconfigCategories.json");

const orderedCategories = [
  "Project_Files_0",
  "Basic_Options_6172",
  "Strict_Type_Checking_Options_6173",
  "Module_Resolution_Options_6174",
  "Source_Map_Options_6175",
  "Additional_Checks_6176",
  "Experimental_Options_6177",
  "Advanced_Options_6178",
  "Command_line_Options_6171"
];

// Makes sure all categories are accounted for in ^
assert.deepEqual(
  Object.keys(categories).sort(),
  orderedCategories.map(c => c.split("_").pop()).sort()
);

const parseMarkdown = (md: string) =>
  remark()
    .use(remarkHTML)
    .processSync(md);

const languages = readdirSync(join(__dirname, "..", "copy")).filter(f => !f.startsWith("."));

languages.forEach(lang => {
  const locale = join(__dirname, "..", "copy", lang);
  const fallbackLocale = join(__dirname, "..", "copy", "en");

  const markdownChunks: string[] = [];

  const getPathInLocale = (path: string, optionalExampleContent?: string) => {
    if (existsSync(join(locale, path))) return join(locale, path);
    if (existsSync(join(fallbackLocale, path))) return join(fallbackLocale, path);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    throw new Error(
      "Could not find a path for " + path + " in " + localeDesc + optionalExampleContent
    );
  };

  // Make a JSON dump of the category anchors someone wrapping the markdown
  const allCategories = [] as {
    display: string;
    anchor: string;
    options: { name: string; anchor: string }[];
  }[];

  const optionsSummary = [] as {
    display: string;
    oneliner: string;
    id: string;
    categoryID: string;
    categoryDisplay: string;
  }[];

  orderedCategories.forEach(categoryID => {
    const category = Object.values(categories).find((c: any) => c.key === categoryID);
    assert.ok(category, "Could not find category for ID: " + categoryID);

    const categoryPath = getPathInLocale(join("categories", categoryID + ".md"));
    const categoryFile = readMarkdownFile(categoryPath);

    assert.ok(categoryFile.data.display, "No display data for category: " + categoryID); // Must have a display title in the front-matter

    markdownChunks.push("<div class='category'>");

    // Let the title change it's display but keep the same ID
    const title = `<h2 id='${categoryID}'><a href='#${categoryID}' name='${categoryID}'>#</a> ${categoryFile.data.display}</h2>`;
    markdownChunks.push(title);

    // Push the category copy
    markdownChunks.push(categoryFile.content);
    markdownChunks.push("</div>");

    // Loop through their options
    const optionsForCategory = options.filter(o => o.categoryCode === category.code);

    const localisedOptions = [] as { name: string; anchor: string }[];

    optionsForCategory.forEach(option => {
      const mdPath = join("options", option.name + ".md");
      const fullPath = join(__dirname, "..", "copy", lang, mdPath);
      // prettier-ignore
      const tsVersion = JSON.parse(readFileSync("../../node_modules/typescript/package.json", "utf8")).version;
      const exampleOptionContent = `\n\n\n Run:\n    echo '---\\ndisplay: "${option.name}"\\noneline: "Does something"\\n---\\n${option.description.message}\\n' > ${fullPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n`;

      const optionPath = getPathInLocale(mdPath, exampleOptionContent);
      const optionFile = readMarkdownFile(optionPath);

      // Must have a display title in the front-matter
      // prettier-ignore
      assert.ok(optionFile.data.display, "Could not find a 'display' for option: " + option.name + " in " + lang);
      // prettier-ignore
      assert.ok(optionFile.data.oneline, "Could not find a 'oneline' for option: " + option.name + " in " + lang);

      optionsSummary.push({
        id: option.name,
        display: optionFile.data.display,
        oneliner: optionFile.data.oneline,
        categoryID: categoryID,
        categoryDisplay: categoryFile.data.display
      });

      markdownChunks.push("<section class='compiler-option'>");

      // Let the title change it's display but keep the same ID
      const titleLink = `<a aria-label="Link to the compiler option:${option.name}" title="Link to the compiler option:${option.name}" href='#${option.name}' name='${option.name}'>#</a>`;
      const title = `<h3 id='${option.name}'>${titleLink} ${optionFile.data.display} - <code>${option.name}</code></h3>`;
      markdownChunks.push(title);

      // Make a flexbox container for the table and content
      markdownChunks.push("<div class='compiler-content'>");

      markdownChunks.push("<div class='markdown'>");
      // Push in the content of the file
      markdownChunks.push(optionFile.content);

      markdownChunks.push("</div>");

      // Make a markdown table of the important metadata
      const mdTableRows = [] as [string, string][];

      mdTableRows.push(["Flag", option.name]);
      if (option.deprecated) mdTableRows.push(["Status", "Deprecated"]);

      if (option.recommended) mdTableRows.push(["Recommended", "True"]);

      if (option.defaultValue) {
        const value = option.defaultValue.includes(" ")
          ? option.defaultValue
          : "`" + option.defaultValue + "`";
        mdTableRows.push(["Default", value]);
      }

      if (option.allowedValues) {
        const optionValue = option.allowedValues.join(", ");
        mdTableRows.push(["Allowed", optionValue]);
      }

      if (option.related) {
        const optionValue = option.related.map(r => `[\`${r}\`](#${r})`).join(", ");
        mdTableRows.push(["Related", optionValue]);
      }

      if (option.internal) {
        mdTableRows.push(["Status", "internal"]);
      }

      if (option.deprecated) {
        mdTableRows.push(["Status", "Deprecated"]);
      }

      if (option.releaseVersion) {
        const underscores = option.releaseVersion.replace(".", "-");
        const link = `/docs/handbook/release-notes/typescript-${underscores}.html`;
        mdTableRows.push(["Released", `<a href="${link}">${option.releaseVersion}</a>`]);
      }

      const table =
        "<table class='compiler-option-md'><tr><th /><th /></tr>" +
        mdTableRows
          .map(r => `<tr><td>${r[0]}</td><td>${parseMarkdown(r[1])}<td/></tr>`)
          .join("\n") +
        "</table>";
      markdownChunks.push(table);

      markdownChunks.push("</div></section>");

      localisedOptions.push({ anchor: option.name, name: optionFile.data.display });
    });

    allCategories.push({
      display: categoryFile.data.display,
      anchor: categoryID,
      options: localisedOptions
    });
  });

  // Write the Markdown and JSON
  const markdown = prettier.format(markdownChunks.join("\n"), { filepath: "index.md" });
  const mdPath = join(__dirname, "..", "output", lang + ".md");
  writeFileSync(mdPath, markdown);
  console.log(mdPath);

  writeFileSync(
    join(__dirname, "..", "output", lang + ".json"),
    JSON.stringify({ categories: allCategories })
  );

  writeFileSync(
    join(__dirname, "..", "output", lang + "-summary.json"),
    JSON.stringify({ options: optionsSummary })
  );

  // Do a quick linter at the end
  // const unfound = options.filter(o => !markdown.includes(o.name))
  // if (unfound.length) throw new Error(`Could not find these options in ${lang}: ${unfound.map(u => u.name).join(', ')}`)
});

writeFileSync(join(__dirname, "..", "output", "languages.json"), JSON.stringify({ languages }));
