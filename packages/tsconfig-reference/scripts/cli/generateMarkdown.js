// @ts-check
// Data-dump all the TSConfig options
/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
*/
console.log("TSConfig Ref: MD for CLI Opts");
import { writeFileSync, readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import prettier from "prettier";
import { parseMarkdown } from "../tsconfigRules.js";
// @ts-ignore
import cliOpts from "../../data/cliOpts.json";
const knownTypes = {};
const languages = readdirSync(new URL("../../copy", import.meta.url)).filter((f) => !f.startsWith("."));
languages.forEach((lang) => {
    const locale = new URL(`../../copy/${lang}/`, import.meta.url);
    const fallbackLocale = new URL("../../copy/en/", import.meta.url);
    const markdownChunks = [];
    const getPathInLocale = (path, optionalExampleContent) => {
        if (existsSync(new URL(path, locale)))
            return new URL(path, locale);
        if (existsSync(new URL(path, fallbackLocale)))
            return new URL(path, fallbackLocale);
        const en = new URL(path, fallbackLocale);
        const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
        // prettier-ignore
        throw new Error("Could not find a path for " + path + " in " + localeDesc + (optionalExampleContent || "") + `\n\nLooked at ${en}}`);
    };
    function renderTable(title, options, opts) {
        markdownChunks.push(`<h3>${title}</h3>`);
        // Trim leading whitespaces so that it is not rendered as a markdown code block
        const tableHeader = `
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>${(opts === null || opts === void 0 ? void 0 : opts.noDefaults) ? "" : "\n      <th>Default</th>"}
    </tr>
  </thead>
  <tbody>
`.trim();
        markdownChunks.push(tableHeader);
        options.forEach((option, index) => {
            // Heh, the section uses an article and the categories use a section
            var _a;
            // CLI description
            let description = (_a = option.description) === null || _a === void 0 ? void 0 : _a.message;
            try {
                const sectionsPath = getPathInLocale(join("options", option.name + ".md"));
                const optionFile = matter.read(fileURLToPath(sectionsPath));
                description = optionFile.data.oneline;
            }
            catch (error) {
                try {
                    const sectionsPath = getPathInLocale(join("cli", option.name + ".md"));
                    const optionFile = matter.read(fileURLToPath(sectionsPath));
                    description = optionFile.data.oneline;
                }
                catch (error) { }
            }
            const oddEvenClass = index % 2 === 0 ? "odd" : "even";
            markdownChunks.push(`<tr class='${oddEvenClass}' name='${option.name}'>`);
            let name = "--" + option.name;
            if (option.isTSConfigOnly)
                name = `<a href='/tsconfig/#${option.name}'>--${option.name}</a>`;
            markdownChunks.push(`  <td><code>${name}</code></td>`);
            let optType;
            if (typeof option.type === "string") {
                optType = `\`${option.type}\``;
            }
            else if (option.allowedValues) {
                if ("ListFormat" in Intl) {
                    // @ts-ignore
                    const or = new Intl.ListFormat(lang, { type: "disjunction" });
                    optType = or.format(option.allowedValues.map((v) => v.replace(/^[-.0-9_a-z]+$/i, "`$&`")));
                }
                else {
                    optType = option.allowedValues
                        .map((v) => v.replace(/^[-.0-9_a-z]+$/i, "`$&`"))
                        .join(", ");
                }
            }
            else {
                optType = "";
            }
            markdownChunks.push(`  <td>${parseMarkdown(optType)}</td>`);
            if (!(opts === null || opts === void 0 ? void 0 : opts.noDefaults)) {
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
    renderTable("CLI Commands", cliOpts.cli, { noDefaults: true });
    renderTable("Build Options", cliOpts.build, { noDefaults: true });
    renderTable("Watch Options", cliOpts.watch, { noDefaults: true });
    renderTable("Compiler Flags", cliOpts.options);
    // Write the Markdown and JSON
    const markdown = prettier.format(markdownChunks.join("\n"), {
        filepath: "index.md",
    });
    const mdPath = new URL(`../../output/${lang}-cli.md`, import.meta.url);
    writeFileSync(mdPath, markdown);
});
languages.forEach((lang) => {
    const mdCLI = new URL(`../../output/${lang}-cli.md`, import.meta.url);
    // prettier-ignore
    const compOptsPath = new URL(`../../../documentation/copy/${lang}/project-config/Compiler Options.md`, import.meta.url);
    if (existsSync(compOptsPath)) {
        const md = readFileSync(compOptsPath, "utf8");
        const newTable = readFileSync(mdCLI, "utf8");
        const start = "<!-- Start of replacement  -->";
        const end = "<!-- End of replacement  -->";
        const newMD = md.split(start)[0] + start + newTable + end + md.split(end)[1];
        writeFileSync(compOptsPath, newMD);
    }
});
