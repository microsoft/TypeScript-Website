// @ts-check
/*
  node packages/playground-handbook/scripts/generate.mjs
*/

import { writeFileSync, existsSync, mkdirSync } from "fs";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// prettier-ignore
const contents = [
  "Compiler Settings.md",   // 1
  "Examples.md",            // 2
  "JS + DTS sidebars.md",   // 3
  "Running Code.md",        // 4
  "Type Acquisition.md",    // 5
  "Settings Panel.md",      // 6
  "Writing JavaScript.md",  // 7
  "Writing DTS Files.md",   // 8
  "TypeScript Versions.md", // 9
  "URL Structure.md",       // 10
  "Exporting Your Code.md", // 11
  "Twoslash Annotations.md",// 12
];

const outputDir = join(__dirname, "../output");
if (!existsSync(outputDir)) mkdirSync(outputDir);

const json = {
  docs: [],
};

const idize = string =>
  string
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "-")
    .replace(/ /g, "-")
    .replace(/\//g, "-")
    .replace(/\+/g, "-");

const add = strs =>
  strs.forEach((path, i) => {
    json.docs.push({
      type: "href",
      title: path.replace(".md", ""),
      href: "/_playground-handbook/" + idize(path.replace(".md", "")) + ".html",
    });
  });

add(contents);
writeFileSync(join(outputDir, "play-handbook.json"), JSON.stringify(json));
