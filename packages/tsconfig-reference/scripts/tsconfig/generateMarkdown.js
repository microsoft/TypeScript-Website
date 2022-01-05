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
 *     - Sections
 *       - Top Level Fields
 *       - Compiler Options
 *       - Watch Options
 *
 */
console.log("TSConfig Ref: MD for TSConfig");
import { writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import * as assert from "assert";
import matter from "gray-matter";
import prettier from "prettier";
import { typeAcquisitionCompilerOptNames, buildOptionCompilerOptNames, watchOptionCompilerOptNames, rootOptNames, parseMarkdown, } from "../tsconfigRules.js";
// @ts-ignore
import options from "../../data/tsconfigOpts.json";
// @ts-ignore
import categories from "../../data/tsconfigCategories.json";
const orderedCategories = [
    "Project_Files_0",
    "Type_Checking_6248",
    "Modules_6244",
    "Emit_6246",
    "JavaScript_Support_6247",
    "Editor_Support_6249",
    "Interop_Constraints_6252",
    "Backwards_Compatibility_6253",
    "Language_and_Environment_6254",
    "Compiler_Diagnostics_6251",
    "Projects_6255",
    "Output_Formatting_6256",
    "Completeness_6257",
    "Command_line_Options_6171",
    "Watch_and_Build_Modes_6250",
    "Watch_Options_999",
];
// Makes sure all categories are accounted for in ^
const got = Object.keys(categories).sort();
const expected = orderedCategories.map((c) => c.split("_").pop()).sort();
assert.deepEqual(got, expected, `Expected to find everything in ${orderedCategories}`);
// Extract out everything which doesn't live in compilerOptions
const notCompilerOptions = ["Project_Files_0", "Watch_Options_999"];
const categoriesForCompilerOpts = orderedCategories.filter((c) => !notCompilerOptions.includes(c));
const compilerOptions = options.filter((o) => !typeAcquisitionCompilerOptNames.includes(o.name) &&
    !watchOptionCompilerOptNames.includes(o.name) &&
    !buildOptionCompilerOptNames.includes(o.name) &&
    !rootOptNames.includes(o.name));
// The TSConfig Reference is a collection of sections which have options or
// a collection of categories which have options
const sections = [
    { name: "Top Level", options: rootOptNames },
    {
        name: "compilerOptions",
        categories: categoriesForCompilerOpts,
    },
    { name: "watchOptions", options: watchOptionCompilerOptNames, idPrefix: "watch" },
    { name: "typeAcquisition", options: typeAcquisitionCompilerOptNames, idPrefix: "type" },
];
const languages = readdirSync(new URL("../../copy", import.meta.url)).filter((f) => !f.startsWith("."));
languages.forEach((lang) => {
    const locale = new URL(`../../copy/${lang}/`, import.meta.url);
    const fallbackLocale = new URL("../../copy/en/", import.meta.url);
    const mdChunks = [];
    const getPathInLocale = (path, optionalExampleContent, failable = false) => {
        if (existsSync(new URL(path, locale)))
            return new URL(path, locale);
        if (existsSync(new URL(path, fallbackLocale)))
            return new URL(path, fallbackLocale);
        const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
        if (!failable)
            // prettier-ignore
            throw new Error("Could not find a path for " + path + " in " + localeDesc + " " + optionalExampleContent || "");
    };
    // Make a JSON dump of the category anchors someone wrapping the markdown
    const allCategories = [];
    const optionsSummary = [];
    sections.forEach((section) => {
        const sectionCategories = section.categories || [section.name];
        // Heh, the section uses an article and the categories use a section
        mdChunks.push(`<div class="tsconfig raised main-content-block markdown"><article id='${section.name}'>`);
        // Intro to the section
        const sectionsPath = getPathInLocale(join("sections", section.name + ".md"));
        const sectionsFile = matter.read(fileURLToPath(sectionsPath));
        mdChunks.push("\n" + sectionsFile.content + "\n");
        // Show a sticky sub-nav for the categories
        if (sectionCategories.length > 1) {
            mdChunks.push(`<nav id="sticky"><ul>`);
            sectionCategories.forEach((categoryID) => {
                const categoryPath = getPathInLocale(join("categories", categoryID + ".md"));
                const categoryFile = matter.read(fileURLToPath(categoryPath));
                mdChunks.push(`<li><a href="#${categoryID}">${categoryFile.data.display}</a></li>`);
            });
            mdChunks.push("</ul></nav>");
        }
        mdChunks.push("<div>");
        sectionCategories.forEach((categoryID) => {
            // We need this to look up the category ID
            const category = Object.values(categories).find((c) => c.key === categoryID);
            let categoryName = categoryID;
            if (category) {
                const categoryPath = getPathInLocale(join("categories", categoryID + ".md"));
                const categoryFile = matter.read(fileURLToPath(categoryPath));
                assert.ok(categoryFile.data.display, "No display data for category: " + categoryID); // Must have a display title in the front-matter
                categoryName = categoryFile.data.display;
                mdChunks.push("<div class='category'>");
                // Let the title change its display but keep the same ID
                const title = `<h2 id='${categoryID}' ><a href='#${categoryID}' name='${categoryID}' aria-label="Link to the section ${categoryName}" aria-labelledby='${categoryID}'>#</a>${categoryName}</h2>`;
                mdChunks.push(title);
                // Push the category copy
                mdChunks.push(categoryFile.content);
                mdChunks.push("</div>");
            }
            // Pull out their options for the section
            const optionsForCategory = section.options
                ? section.options
                    .map((opt) => {
                    const richOpt = options.find((o) => o.name === opt);
                    // if (!richOpt) throw new Error(`Could not find an option for ${opt} in ${section.name}`);
                    return richOpt;
                })
                    .filter(Boolean)
                : compilerOptions.filter((o) => o.categoryCode === category.code);
            // prettier-ignore
            assert.ok(optionsForCategory, "Could not find options for " + categoryID + " in " + JSON.stringify(categories));
            const localisedOptions = [];
            optionsForCategory.forEach((option) => {
                var _a;
                const optionName = option.name;
                const optionUID = section.idPrefix ? `${section.idPrefix}-${option.name}` : option.name;
                const mdPath = join("options", optionName + ".md");
                const scopedMDPath = join("options", section.name, optionName + ".md");
                const fullPath = new URL(`../../copy/${lang}/${mdPath}`, import.meta.url);
                const exampleOptionContent = `\n\n\n Run:\n    echo '---\\ndisplay: "${optionName}"\\noneline: "Does something"\\n---\\n${(_a = option.description) === null || _a === void 0 ? void 0 : _a.message}\\n' > ${fullPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n`;
                const optionPath = getPathInLocale(mdPath, exampleOptionContent, true);
                const scopedOptionPath = getPathInLocale(scopedMDPath, exampleOptionContent, true);
                const optionFile = matter.read(fileURLToPath(scopedOptionPath || optionPath));
                // prettier-ignore
                assert.ok(optionFile, "Could not find an optionFile: " + optionName);
                // Must have a display title in the front-matter
                // prettier-ignore
                assert.ok(optionFile.data.display, "Could not find a 'display' for option: " + optionName + " in " + lang);
                // prettier-ignore
                assert.ok(optionFile.data.oneline, "Could not find a 'oneline' for option: " + optionName + " in " + lang);
                optionsSummary.push({
                    id: optionName,
                    display: optionFile.data.display,
                    oneliner: String(parseMarkdown(optionFile.data.oneline)),
                    categoryID: categoryID,
                    categoryDisplay: categoryName,
                });
                mdChunks.push("<section class='compiler-option'>");
                // Let the title change its display but keep the same ID
                const titleLink = `<a aria-label="Link to the compiler option: ${optionName}" id='${optionUID}' href='#${optionUID}' name='${optionUID}' aria-labelledby="${optionUID}-config">#</a>`;
                const title = `<h3 id='${optionUID}-config'>${titleLink} ${optionFile.data.display} - <code>${optionName}</code></h3>`;
                mdChunks.push(title);
                // Make a flexbox container for the table and content
                mdChunks.push("<div class='compiler-content'>");
                mdChunks.push("<div class='markdown'>");
                // Push in the content of the file
                mdChunks.push(optionFile.content);
                mdChunks.push("</div>");
                // Make a markdown table of the important metadata
                const mdTableRows = [];
                if (option.deprecated)
                    mdTableRows.push(["Deprecated"]);
                if (option.recommended)
                    mdTableRows.push(["Recommended"]);
                if (option.internal) {
                    mdTableRows.push(["Internal"]);
                }
                if (option.defaultValue) {
                    mdTableRows.push(["Default", option.defaultValue]);
                }
                if (option.allowedValues) {
                    mdTableRows.push(["Allowed", option.allowedValues]);
                }
                if (option.related) {
                    const optionValue = option.related.map((r) => `<a href='#${r}' aria-label="Jump to compiler option info for ${r}" ><code>${r}</code></a>`);
                    mdTableRows.push(["Related", optionValue]);
                }
                if (option.releaseVersion) {
                    const underscores = option.releaseVersion.replace(".", "-");
                    const link = `/docs/handbook/release-notes/typescript-${underscores}.html`;
                    mdTableRows.push([
                        "Released",
                        `<a aria-label="Release notes for TypeScript ${option.releaseVersion}" href="${link}">${option.releaseVersion}</a>`,
                    ]);
                }
                const table = "<ul class='compiler-option-md'>" +
                    mdTableRows
                        .map((r) => `<li><span>${r[0]}${r.length > 1 ? ":" : ""}</span>${parseMarkdown(r[1])}</li>`)
                        .join("\n") +
                    "</ul>";
                if (!scopedOptionPath)
                    mdChunks.push(table);
                mdChunks.push("</div></section>");
                localisedOptions.push({ anchor: optionName, name: optionFile.data.display });
            });
            allCategories.push({
                display: categoryName,
                anchor: categoryID,
                options: localisedOptions,
            });
        });
        mdChunks.push("</div>"); // Closes div class='indent'
        mdChunks.push(`</article></div>`);
    });
    // Write the Markdown and JSON
    const markdown = prettier.format(mdChunks.join("\n"), {
        filepath: "index.md",
    });
    const mdPath = new URL(`../../output/${lang}.md`, import.meta.url);
    writeFileSync(mdPath, markdown);
    writeFileSync(new URL(`../../output/${lang}.json`, import.meta.url), JSON.stringify({ categories: allCategories }));
    // This is used by the playground
    writeFileSync(new URL(`../../output/${lang}-summary.json`, import.meta.url), JSON.stringify({ options: optionsSummary }));
    const jsonDir = new URL("../../../typescriptlang-org/static/js/json/", import.meta.url);
    if (!existsSync(jsonDir))
        mkdirSync(jsonDir);
    // This is used by the tsconfig popups
    writeFileSync(new URL(`${lang}-tsconfig-popup.json`, jsonDir), JSON.stringify(Object.fromEntries(optionsSummary.map((data) => [data.id, data.oneliner]))));
});
writeFileSync(new URL("../../output/languages.json", import.meta.url), JSON.stringify({ languages }));
// From https://stackoverflow.com/questions/8495687/split-array-into-chunks
function chunk(arr, chunkSize) {
    const newArray = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize)
        newArray.push(arr.slice(i, i + chunkSize));
    return newArray;
}
console.log(`Wrote TSConfig files for: ${languages.join(", ")}}`);
