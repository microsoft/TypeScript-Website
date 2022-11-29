// @ts-check
/*
  node packages/playground-handbook/scripts/generate.mjs
*/

import { writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "fs";

import { dirname, join } from "path";
import { domainToASCII, fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const files = readdirSync(root);
const mds = files.filter(f => f.includes(".md"));
const types = `export type PHandbookPage = ${mds.map(t => `"${t}"`).join(" | ")}`;
writeFileSync(join(__dirname, "types.d.ts"), types);

/** @type {import("./types").PHandbookPage[]} */
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
  "Plugins.md",             // 11
  "Exporting Your Code.md", // 12
];

/** @type {import("./types").PHandbookPage[]} */
// prettier-ignore
const extended = [
  "Extended Edition.md",       // 12
  "Twoslash Annotations.md",   // 13
  "Multi-File Playgrounds.md", // 14
  "Gist Docsets.md",           // 15
  "Bug Workbench.md",          // 16
  "Writing Plugins.md",        // 17
  "Implementation Details.md", // 18
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
json.docs.push({ type: "hr" });
add(extended);

writeFileSync(join(outputDir, "play-handbook.json"), JSON.stringify(json));
