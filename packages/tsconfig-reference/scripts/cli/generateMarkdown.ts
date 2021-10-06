// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/
console.log("TSConfig Ref: MD for CLI Opts");

import { writeFileSync, readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { read as readMarkdownFile } from "gray-matter";
import * as prettier from "prettier";
import { CompilerOptionJSON } from "./generateJSON.js";
import { parseMarkdown } from "../tsconfigRules";

const options = require(join(__dirname, "../../data/cliOpts.json")) as {
  options: CompilerOptionJSON[];
  build: CompilerOptionJSON[];
  watch: CompilerOptionJSON[];
  cli: CompilerOptionJSON[];
};

const knownTypes: Record<string, string> = {};

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

  function renderTable(title: string, options: CompilerOptionJSON[], opts?: { noDefaults: true }) {
    markdownChunks.push(`<h3>${title}</h3>`);

    // Trim leading whitespaces so that it is not rendered as a markdown code block
    const tableHeader = `
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>${opts?.noDefaults ? "" : "\n      <th>Default</th>"}
    </tr>
  </thead>
  <tbody>
`.trim()

    markdownChunks.push(tableHeader);

    options.forEach((option, index) => {
      // Heh, the section uses an article and the categories use a section

      // CLI description
      let description = option.description?.message;
      try {
        const sectionsPath = getPathInLocale(join("options", option.name + ".md"));
        const optionFile = readMarkdownFile(sectionsPath);
        description = optionFile.data.oneline;
      } catch (error) {
        try {
          const sectionsPath = getPathInLocale(join("cli", option.name + ".md"));
          const optionFile = readMarkdownFile(sectionsPath);
          description = optionFile.data.oneline;
        } catch (error) { }
      }

      const oddEvenClass = index % 2 === 0 ? "odd" : "even";
      markdownChunks.push(`<tr class='${oddEvenClass}' name='${option.name}'>`);

      let name = "--" + option.name;
      if (option.isTSConfigOnly) name = `<a href='/tsconfig/#${option.name}'>--${option.name}</a>`;
      markdownChunks.push(`  <td><code>${name}</code></td>`);

      let optType: string;
      if (typeof option.type === "string") {
        optType = `\`${option.type}\``;
      } else if (option.allowedValues) {
        if ("ListFormat" in Intl) {
          // @ts-ignore
          const or = new Intl.ListFormat(lang, { type: "disjunction" });
          optType = or.format(
            option.allowedValues.map((v) =>
              v.replace(/^[-.0-9_a-z]+$/i, "`$&`")
            )
          );
        } else {
          optType = option.allowedValues
            .map((v) => v.replace(/^[-.0-9_a-z]+$/i, "`$&`"))
            .join(", ");
        }
      } else {
        optType = "";
      }
      markdownChunks.push(`  <td>${parseMarkdown(optType)}</td>`);

      if (!opts?.noDefaults) {
        markdownChunks.push(`  <td>${parseMarkdown(option.defaultValue)}</td>`);
      }
      markdownChunks.push(`</tr>`);

      // Add a new row under the current one for the description, this uses the 'odd' / 'even' classes
      // to fake looking like a single row
      markdownChunks.push(`<tr class="option-description ${oddEvenClass}"><td colspan="3">`);
      markdownChunks.push(`${parseMarkdown(description)}`.trim());
      markdownChunks.push(`</td></tr>\n`);
    });
    markdownChunks.push(`</tbody></table>\n`);
  }

  renderTable("CLI Commands", options.cli, { noDefaults: true });
  renderTable("Build Options", options.build, { noDefaults: true });
  renderTable("Watch Options", options.watch, { noDefaults: true });
  renderTable("Compiler Flags", options.options);

  // Write the Markdown and JSON
  const markdown = prettier.format(markdownChunks.join("\n"), { filepath: "index.md" });
  const mdPath = join(__dirname, "..", "..", "output", lang + "-cli.md");
  writeFileSync(mdPath, markdown);
});

languages.forEach((lang) => {
  const mdCLI = join(__dirname, "..", "..", "output", lang + "-cli.md");
  // prettier-ignore
  const compOptsPath = join(__dirname, "..", "..", "..", `documentation/copy/${lang}/project-config/Compiler Options.md`);

  if (existsSync(compOptsPath)) {
    const md = readFileSync(compOptsPath, "utf8");
    const newTable = readFileSync(mdCLI, "utf8");
    const start = "<!-- Start of replacement  -->";
    const end = "<!-- End of replacement  -->";
    const newMD = md.split(start)[0] + start + newTable + end + md.split(end)[1];
    writeFileSync(compOptsPath, newMD);
  }
});
