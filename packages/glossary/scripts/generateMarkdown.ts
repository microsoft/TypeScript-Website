// @ts-check
// Converts the glossary markdowns into per-language files

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     pnpm ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/

/**
 * This sets up:
 *
 *   - language (en, ja, zh, pt, etc)
 *     - Set of markdowns
 *
 */

import { writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as assert from "assert";
import { read as readMarkdownFile } from "gray-matter";
import * as prettier from "prettier";

// import * as remark from "remark";
// import * as remarkHTML from "remark-html";

const languages = readdirSync(join(__dirname, "..", "copy")).filter((f) => !f.startsWith("."));

const outputDir = join(__dirname, "..", "output");
if (!existsSync(outputDir)) mkdirSync(outputDir);

languages.forEach((lang) => {
  const locale = join(__dirname, "..", "copy", lang);
  const fallbackLocale = join(__dirname, "..", "copy", "en");

  const languageMeta = { terms: [] };
  const markdownChunks: string[] = [];

  const glossaryTerms = readdirSync(join(__dirname, "..", "copy", "en")).filter(
    (f) => !f.startsWith(".")
  );

  const getPathInLocale = (path: string, optionalExampleContent?: string) => {
    if (existsSync(join(locale, path))) return join(locale, path);
    if (existsSync(join(fallbackLocale, path))) return join(fallbackLocale, path);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    throw new Error(
      "Could not find a path for " + path + " in " + localeDesc + optionalExampleContent || ""
    );
  };

  const container = (str: string, func: Function) => {
    markdownChunks.push(`<${str}>`);
    func();
    markdownChunks.push(`</${str.split(" ")[0]}>`);
  };

  glossaryTerms.forEach((filename) => {
    const glossaryMdPath = getPathInLocale(filename);
    console.log(glossaryMdPath);

    container("article", () => {
      container("div class='whitespace raised content main-content-block'", () => {
        const md = readMarkdownFile(glossaryMdPath);
        assert.ok(md.data.display, "No display data for term: " + filename);

        const termID = filename.split(".")[0].toLowerCase();
        const termDisplay = md.data.display;
        languageMeta.terms.push({ display: termDisplay, id: termID });

        const title = `<h3 id='${termID}' ><a href='#${termID}' name='${termDisplay}' aria-label="Link to the section ${termDisplay}" aria-labelledby='${termID}'>#</a> ${termDisplay}</h3>`;
        markdownChunks.push(title);

        markdownChunks.push(md.content);
      });
    });
  });

  // Write the Markdown and JSON
  const markdown = prettier.format(markdownChunks.join("\n"), { filepath: "index.md" });
  const mdPath = join(__dirname, "..", "output", lang + ".md");
  writeFileSync(mdPath, markdown);

  const jsonInfo = prettier.format(JSON.stringify(languageMeta), { filepath: "index.json" });
  const jsonPath = join(__dirname, "..", "output", lang + ".json");
  writeFileSync(jsonPath, jsonInfo);
});

writeFileSync(join(__dirname, "..", "output", "languages.json"), JSON.stringify({ languages }));
