// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/

import { writeFileSync, readdirSync, existsSync, readFileSync, copyFileSync } from "fs";
import { join } from "path";
import { read as readMarkdownFile } from "gray-matter";
import * as prettier from "prettier";
import { CompilerOptionJSON } from "./generateJSON.js";

import * as remark from "remark";
import * as remarkHTML from "remark-html";

const options = require(join(__dirname, "../../data/cliOpts.json")) as {
  options: CompilerOptionJSON[];
  cli: CompilerOptionJSON[];
};
const parseMarkdown = (md: string) => remark().use(remarkHTML).processSync(md);

const languages = readdirSync(join(__dirname, "..", "..", "copy")).filter(
  (f) => !f.startsWith(".")
);

languages.forEach((lang) => {
  const locale = join(__dirname, "..", "..", "copy", lang);
  const fallbackLocale = join(__dirname, "..", "..", "copy", "en");

  const markdownChunks: string[] = [];

  const getPathInLocale = (path: string, optionalExampleContent?: string) => {
    if (existsSync(join(locale, path))) return join(locale, path);
    if (existsSync(join(fallbackLocale, path))) return join(fallbackLocale, path);
    const en = join(fallbackLocale, path);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    // prettier-ignore
    throw new Error(
      "Could not find a path for " + path + " in " + localeDesc + (optionalExampleContent || "") + `\n\nLooked at ${en}}`
    );
  };

  const intro = readFileSync(getPathInLocale("cli/intro.md"), "utf8");
  markdownChunks.push(intro + "\n");

  function renderTable(title: string, options: CompilerOptionJSON[], opts?: { noDefaults: true }) {
    markdownChunks.push(`<h3>${title}</h3>`);

    markdownChunks.push(`
  <table class='cli-option' width="100%">
    <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
      ${opts?.noDefaults ? "" : "<th>Default</th>"}
    </tr>
  </thead>
  <tbody>
`);

    options.forEach((option, index) => {
      // Heh, the section uses an article and the categories use a section

      // CLI description
      let description = option.description?.message;
      try {
        const sectionsPath = getPathInLocale(join("options", option.name + ".md"));
        const optionFile = readMarkdownFile(sectionsPath);
        description = optionFile.data.oneline;
      } catch (error) {}

      const oddEvenClass = index % 2 === 0 ? "odd" : "even";
      markdownChunks.push(`<tr class='${oddEvenClass}' name='${option.name}'>`);

      let name = option.name;
      if (option.isTSConfigOnly) name = `<a href='/tsconfig/#${option.name}'>${option.name}</a>`;
      markdownChunks.push(`<td><code>--${name}</code></td>`);

      let optType: string;
      if (typeof option.type === "string") {
        optType = option.type;
      } else if (option.allowedValues) {
        optType = option.allowedValues.map((v) => `<code>${v}</code>`).join(", ");
      } else {
        optType = "";
      }
      markdownChunks.push(`  <td><code>${optType}</code></td>`);

      if (!opts?.noDefaults) {
        markdownChunks.push(`  <td>${parseMarkdown(option.defaultValue)}</td>`);
      }
      markdownChunks.push(`</tr>`);

      // Add a new row under the current one for the description, this uses the 'odd' / 'even' classes
      // to fake looking like a single row
      markdownChunks.push(`<tr class="option-description ${oddEvenClass}"><td colspan="3">`);
      markdownChunks.push(`${description}`);
      markdownChunks.push(`</tr></td>`);
    });
    markdownChunks.push(`</tbody></table>`);
  }

  renderTable("CLI Commands", options.cli, { noDefaults: true });
  renderTable("Compiler Flags", options.options);

  const outro = readFileSync(getPathInLocale("cli/outro.md"), "utf8");
  markdownChunks.push("\n\n" + outro + "\n");

  // Write the Markdown and JSON
  const markdown = prettier.format(markdownChunks.join("\n"), { filepath: "index.md" });
  const mdPath = join(__dirname, "..", "..", "output", lang + "-cli.md");
  writeFileSync(mdPath, markdown);
});

const enMDCLI = join(__dirname, "..", "..", "output", "en-cli.md");
// prettier-ignore
const compOptsPath = join( __dirname, "..", "..", "..", "documentation/copy/en/project-config/Compiler Options.md");
console.log(`Copying ${enMDCLI} -> ${compOptsPath}`);
copyFileSync(enMDCLI, compOptsPath);
