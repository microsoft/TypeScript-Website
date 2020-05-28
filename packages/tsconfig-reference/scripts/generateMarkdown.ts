// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/

/**
 * This sets up:
 *
 *   - language (en, ja, zh, pt, etc)
 *     - Intro
 *     - Quick Jump for any compiler flag
 *     - Sections
 *       - Top Level Fields
 *       - Compiler Options
 *       - Watch Options
 *
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
  "Command_line_Options_6171",
  "Watch_Options_999",
];

// Makes sure all categories are accounted for in ^
assert.deepEqual(
  Object.keys(categories).sort(),
  orderedCategories.map((c) => c.split("_").pop()).sort()
);

// Extract out everthing which doesn't live in compilerOptions
const notCompilerOptions = ["Project_Files_0", "Watch_Options_999"];
const compilerOptions = orderedCategories.filter((o) => !notCompilerOptions.includes(o));

// The TSConfig Reference is a collection of sections which
const sections = [
  { name: "top_level", categories: ["Project_Files_0"] },
  { name: "compilerOptions", categories: compilerOptions },
  { name: "watchOptions", categories: ["Watch_Options_999"] },
];

const parseMarkdown = (md: string) => remark().use(remarkHTML).processSync(md);

const languages = readdirSync(join(__dirname, "..", "copy")).filter((f) => !f.startsWith("."));

languages.forEach((lang) => {
  const locale = join(__dirname, "..", "copy", lang);
  const fallbackLocale = join(__dirname, "..", "copy", "en");

  const markdownChunks: string[] = [];

  const getPathInLocale = (path: string, optionalExampleContent?: string) => {
    if (existsSync(join(locale, path))) return join(locale, path);
    if (existsSync(join(fallbackLocale, path))) return join(fallbackLocale, path);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    throw new Error(
      "Could not find a path for " + path + " in " + localeDesc + optionalExampleContent || ""
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

  const intro = parseMarkdown(readFileSync(getPathInLocale("intro.md"), "utf8"));
  markdownChunks.push(intro + "\n");

  const categoryOverviews = orderedCategories.map((cID) => {
    const categoryPath = getPathInLocale(join("categories", cID + ".md"));
    return {
      md: readMarkdownFile(categoryPath),
      id: cID,
      code: Number(cID.split("_").pop()),
    };
  });

  // Shows the full list of compiler options straight away
  markdownChunks.push("<div id='full-option-list' class='indent'>");
  categoryOverviews.forEach((c) => {
    if (c.code === 6178) return;
    markdownChunks.push(`<div class="tsconfig-nav-top">`);
    markdownChunks.push(`<h5><a href=${"#" + c.id}>${c.md.data.display}</a></h5>`);
    markdownChunks.push("<ul>");

    const optionsForCategory = options.filter((o) => o.categoryCode === c.code);
    optionsForCategory.forEach((opt) => {
      markdownChunks.push(`<li><a href=${"#" + opt.name}>${opt.name}</a></li>`);
    });

    markdownChunks.push("</ul></div>");
  });
  markdownChunks.push("<br />");

  // Special case the 'advanced' section because it is so long
  const advanced = categoryOverviews.find((c) => c.code === 6178);

  const advancedOpts = options.filter((o) => o.categoryCode === advanced.code);
  const chunkedOptions = chunk(advancedOpts, 10);

  chunkedOptions.forEach((opts, index) => {
    markdownChunks.push(`<div class="tsconfig-nav-top">`);

    if (index === 0) {
      markdownChunks.push(`<h5><a href=${"#" + advanced.id}>${advanced.md.data.display}</a></h5>`);
    } else {
      markdownChunks.push(`<h5>&nbsp;</h5>`);
    }

    markdownChunks.push("<ul>");
    opts.forEach((opt) => {
      markdownChunks.push(`<li><a href=${"#" + opt.name}>${opt.name}</a></li>`);
    });
    markdownChunks.push("</ul>");

    markdownChunks.push("</div>");
  });

  markdownChunks.push("</div>");

  sections.forEach((section) => {
    const sectionCategories = section.categories;
    // Heh, the section uses an article and the categories use a section
    markdownChunks.push(`<article id='${section.name}'>`);

    // Intro to the section
    const sectionsPath = getPathInLocale(join("sections", section.name + ".md"));
    const sectionsFile = readMarkdownFile(sectionsPath);
    markdownChunks.push("\n" + sectionsFile.content + "\n");

    // Show a sticky sub-nav for the categories
    if (sectionCategories.length > 1) {
      markdownChunks.push(`<nav id="sticky"><ul>`);

      sectionCategories.forEach((categoryID) => {
        const categoryPath = getPathInLocale(join("categories", categoryID + ".md"));
        const categoryFile = readMarkdownFile(categoryPath);

        markdownChunks.push(`<li><a href="#${categoryID}">${categoryFile.data.display}</a></li>`);
      });
      markdownChunks.push("</ul></nav>");
    }

    markdownChunks.push("<div class='indent'>");

    sectionCategories.forEach((categoryID) => {
      const category = Object.values(categories).find((c: any) => c.key === categoryID);
      // prettier-ignore
      assert.ok(category, "Could not find category markdown file for ID: " + categoryID + "\n\n" + JSON.stringify(categories));

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
      const optionsForCategory = options.filter((o) => o.categoryCode === category.code);

      const localisedOptions = [] as { name: string; anchor: string }[];

      optionsForCategory.forEach((option) => {
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
          categoryDisplay: categoryFile.data.display,
        });

        markdownChunks.push("<section class='compiler-option'>");

        // Let the title change it's display but keep the same ID
        const titleLink = `<a aria-label="Link to the compiler option: ${option.name}" title="Link to the compiler option:${option.name}" id='${option.name}' href='#${option.name}' name='${option.name}'>#</a>`;
        const title = `<h3 id='${option.name}-config'>${titleLink} ${optionFile.data.display} - <code>${option.name}</code></h3>`;
        markdownChunks.push(title);

        // Make a flexbox container for the table and content
        markdownChunks.push("<div class='compiler-content'>");

        markdownChunks.push("<div class='markdown'>");
        // Push in the content of the file
        markdownChunks.push(optionFile.content);

        markdownChunks.push("</div>");

        // Make a markdown table of the important metadata
        const mdTableRows = [] as [string, string][];

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
          const optionValue = option.related.map((r) => `[\`${r}\`](#${r})`).join(", ");
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
            .map((r) => `<tr><td>${r[0]}</td><td>${parseMarkdown(r[1])}<td/></tr>`)
            .join("\n") +
          "</table>";
        markdownChunks.push(table);

        markdownChunks.push("</div></section>");

        localisedOptions.push({ anchor: option.name, name: optionFile.data.display });
      });

      allCategories.push({
        display: categoryFile.data.display,
        anchor: categoryID,
        options: localisedOptions,
      });
    });

    markdownChunks.push("</div>"); // Closes div class='indent'
    markdownChunks.push(`</article>`);
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

  // This is used by the playgrounbd
  writeFileSync(
    join(__dirname, "..", "output", lang + "-summary.json"),
    JSON.stringify({ options: optionsSummary })
  );

  // Do a quick linter at the end
  // const unfound = options.filter(o => !markdown.includes(o.name))
  // if (unfound.length) throw new Error(`Could not find these options in ${lang}: ${unfound.map(u => u.name).join(', ')}`)
});

writeFileSync(join(__dirname, "..", "output", "languages.json"), JSON.stringify({ languages }));

// From https://stackoverflow.com/questions/8495687/split-array-into-chunks
function chunk<T>(arr: T[], chunkSize: number): T[][] {
  const newArray = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize)
    newArray.push(arr.slice(i, i + chunkSize));
  return newArray;
}
