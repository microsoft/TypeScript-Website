// @ts-check
// prettier-ignore
const { readdirSync, statSync, existsSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { enRoot, getFilePaths } = require("./generateTypesForFilesInDocs");
const { read: readMarkdownFile } = require("gray-matter");

// This file is the definitive sidebar navigation source. It takes either:
//
// a  { file: 'path; }
// a  { href: "url" title: "Button title", oneliner: "some info" }
// or { title: "Button title", items: SubItems }
//
// For files we use the same language lookup system the rest of the site uses,
// to leave titles, hrefs etc to be done on the document itself

// The results are written to output/navigation.json for the site and other consumers.

/* 
  Run this after any changes to propagate:
     pnpm run --filter=documentation create-handbook-nav
*/

/** @type {HandbookNavItem[]} */
// prettier-ignore
const handbookPages = [
  {
    title: "Get Started",
    summary: "Quick introductions based on your background or preference.",
    items: [
      { file: "get-started/TS for the New Programmer.md" },
      { file: "get-started/TS for JS Programmers.md" },
      { file: "get-started/TS for OOPers.md" },
      { file: "get-started/TS for Functional Programmers.md" },
      { file: "tutorials/TypeScript Tooling in 5 minutes.md" },
    ],
  },
  {
    title: "Handbook",
    summary: "A great first read for your daily TS work.",
    chronological: true,
    items: [
      { file: "handbook-v2/The Handbook.md" },
      { file: "handbook-v2/Basics.md" },
      { file: "handbook-v2/Everyday Types.md" },
      { file: "handbook-v2/Narrowing.md" },
      { file: "handbook-v2/More on Functions.md" },
      { file: "handbook-v2/Object Types.md" },
      {
        title: "Type Manipulation",
        chronological: true,
        items: [
          { file: "handbook-v2/Type Manipulation/_Creating Types from Types.md" },
          { file: "handbook-v2/Type Manipulation/Generics.md" },
          { file: "handbook-v2/Type Manipulation/Keyof Type Operator.md" },
          { file: "handbook-v2/Type Manipulation/Typeof Type Operator.md" },
          { file: "handbook-v2/Type Manipulation/Indexed Access Types.md" },
          { file: "handbook-v2/Type Manipulation/Conditional Types.md" },
          { file: "handbook-v2/Type Manipulation/Mapped Types.md" },
          { file: "handbook-v2/Type Manipulation/Template Literal Types.md" },
        ]
      },
      { file: "handbook-v2/Classes.md" },
      { file: "handbook-v2/Modules.md" },
    ],
  },
  {
    title: "Reference",
    summary: "Deep dive reference materials.",
    items: [
      { file: "reference/Utility Types.md" },
      {
        href: "/cheatsheets",
        title: "Cheat Sheets",
        oneliner: "Syntax overviews for common code"
      },
      { file: "reference/Decorators.md" },
      { file: "reference/Declaration Merging.md" },
      { file: "reference/Enums.md" },
      { file: "reference/Iterators and Generators.md" },
      { file: "reference/JSX.md" },
      { file: "reference/Mixins.md" },
      { file: "reference/Namespaces.md" },
      { file: "reference/Namespaces and Modules.md" },
      { file: "reference/Symbols.md" },
      { file: "reference/Triple-Slash Directives.md" },
      { file: "reference/Type Compatibility.md" },
      { file: "reference/Type Inference.md" },
      { file: "reference/Variable Declarations.md" },
    ],
  },
  {
    title: "Modules Reference",
    summary: "How TypeScript models JavaScript modules.",
    items: [
      { title: "Introduction", file: "modules-reference/Introduction.md" },
      { title: "Theory", file: "modules-reference/Theory.md" },
      {
        title: "Guides",
        items: [
          { title: "Choosing Compiler Options", file: "modules-reference/guides/Choosing Compiler Options.md" },
        ]
      },
      { title: "Reference", file: "modules-reference/Reference.md" },
      {
        title: "Appendices",
        items: [
          { file: "modules-reference/appendices/ESM-CJS-Interop.md" },
        ]
      }
    ]
  },
  {
    title: "Tutorials",
    summary: "Using TypeScript in several environments.",
    items: [
      { file: "tutorials/ASP.NET Core.md" },
      { file: "tutorials/Gulp.md" },
      { file: "tutorials/DOM Manipulation.md" },
      { file: "tutorials/Migrating from JavaScript.md" },
      { file: "tutorials/Babel with TypeScript.md" },
    ],
  },
  {
    title: "What's New",
    summary:
      "Find out how TypeScript has evolved and what's new in the releases.",
    items: [
      // This is auto-filled
    ],
  },
  {
    title: "Declaration Files",
    summary:
      "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
    chronological: true,
    items: [
      { file: "declaration-files/Introduction.md" },
      { file: "declaration-files/By Example.md" },
      { file: "declaration-files/Library Structures.md" },
      {
        title: ".d.ts Templates",
        items: [
          { file: "declaration-files/templates/module.d.ts.md" },
          { file: "declaration-files/templates/module-plugin.d.ts.md" },
          { file: "declaration-files/templates/module-class.d.ts.md" },
          { file: "declaration-files/templates/module-function.d.ts.md" },
          { file: "declaration-files/templates/global.d.ts.md" },
          { file: "declaration-files/templates/global-modifying-module.d.ts.md" },
        ]
      },
      { file: "declaration-files/Do's and Don'ts.md" },
      { file: "declaration-files/Deep Dive.md" },
      { file: "declaration-files/Publishing.md" },
      { file: "declaration-files/Consumption.md" },
    ],
  },
  {
    title: "JavaScript",
    summary: "How to use TypeScript-powered JavaScript tooling.",
    chronological: true,
    items: [
      { file: "javascript/Intro to JS with TS.md", },
      { file: "javascript/Type Checking JavaScript Files.md" },
      { file: "javascript/JSDoc Reference.md" },
      { file: "javascript/Creating DTS files From JS.md" },
    ],
  },
  {
    title: "Project Configuration",
    summary: "Compiler configuration reference.",
    items: [
      { file: "project-config/tsconfig.json.md" },
      { file: "project-config/Compiler Options in MSBuild.md" },
      {
        href: "/tsconfig",
        title: "TSConfig Reference",
        oneliner: "The page covering every TSConfig option"
      },
      { file: "project-config/Compiler Options.md" },
      { file: "project-config/Project References.md" },
      { file: "project-config/Integrating with Build Tools.md" },
      { file: "project-config/Configuring Watch.md" },
      { file: "Nightly Builds.md" },
    ],
  }
];
fillReleaseInfo();

const copyPath = join(__dirname, "..", "copy");
const langs = readdirSync(copyPath).filter((f) =>
  statSync(join(copyPath, f)).isDirectory()
);

/** @type { Record<string, Map<string, import("gray-matter").GrayMatterFile<string>>> }>} */
const langInfo = {};

// Fill up a series of sets of language Maps which have the markdown info available in
for (const lang of langs) {
  const langMap = new Map();
  langInfo[lang] = langMap;

  const allEnPages = getFilePaths(enRoot).filter(
    (f) => !/[\\/]modules-reference[\\/]diagrams[\\/]/.test(f)
  );
  for (const page of allEnPages) {
    const relativeToLangPath = page.replace(enRoot, "");
    const localPage = join(copyPath, lang + relativeToLangPath);
    if (existsSync(localPage)) {
      const info = readMarkdownFile(localPage);
      if (lang !== "en") {
        validateNonEnglishMarkdownFile(info, lang, localPage);
      }
      validateMarkdownFile(info, localPage);
      // Looks like: path/to/file.md
      langMap.set(relativeToLangPath.slice(1).replace(/\\/g, "/"), info);
    }
  }
}

function createNavEntry(lang, sectionIndex, item) {
  if ("href" in item) {
    return {
      title: item.title,
      id: toID(sectionIndex, item.title),
      permalink: item.href,
      oneline: item.oneliner,
    };
  }

  if ("items" in item) {
    const entry = {
      title: item.title,
      id: toID(sectionIndex, item.title),
      oneline: item.oneliner,
      chronological: item.chronological || false,
    };

    if (item.items?.length) {
      entry.items = item.items.map((subItem) =>
        createNavEntry(lang, sectionIndex, subItem)
      );
    }

    return entry;
  }

  const subNavInfo =
    langInfo[lang].get(item.file) || langInfo["en"].get(item.file);
  if (!subNavInfo) throwForUnfoundFile(item, lang, langInfo["en"]);

  return {
    title: subNavInfo.data.short || subNavInfo.data.title,
    id: toID(sectionIndex, subNavInfo.data.title),
    permalink: subNavInfo.data.permalink,
    oneline: subNavInfo.data.oneline,
  };
}

function createNavigationForLanguage(lang) {
  return handbookPages.map((section, sectionIndex) => ({
    title: section.title,
    oneline: section.summary,
    id: section.title.toLowerCase().replace(/\s/g, "-"),
    chronological: section.chronological || false,
    items: section.items.map((item) =>
      createNavEntry(lang, sectionIndex, item)
    ),
  }));
}

const pathToNavigationArtifact = join(
  __dirname,
  "..",
  "output",
  "navigation.json"
);
const existingNavigationArtifacts = existsSync(pathToNavigationArtifact)
  ? JSON.parse(readFileSync(pathToNavigationArtifact, "utf8"))
  : {};
const navigationArtifacts = {
  ...existingNavigationArtifacts,
  ...Object.fromEntries(
    langs.map((lang) => [lang, createNavigationForLanguage(lang)])
  ),
};
writeFileSync(
  pathToNavigationArtifact,
  JSON.stringify(navigationArtifacts, null, 2) + "\n"
);

/**
 * @typedef {Object} HandbookNavSubItem
 * @property {import("./types/AllFilenames").AllDocsPages= } file - the reference to the file based on the lang root
 * @property {HandbookNavSubItem[]=} items - pages
 * or!
 * @property {string= } href - a language prefixless
 * @property {string= } title - the display only used when href exists
 * @property {string= } oneliner
 * @property {boolean=} chronological - should we recommend a next/prev
 */

/**
 * @typedef {Object} HandbookNavItem
 * @property {string} title - TBD
 * @property {string} summary - TDB
 * @property {boolean=} chronological - should we recommend a next/prev
 * @property {boolean=} beta - should it be shown differently
 * @property {HandbookNavSubItem[]} items - pages
 */

function validateNonEnglishMarkdownFile(info, lang, filepath) {
  if (!info.data.permalink.startsWith("/" + lang + "/")) {
    throw new Error(
      `Permalink in ${filepath} does not start with '/${lang}/'\n\nExpected ${info.data.permalink} to be /${lang}${info.data.permalink}\n\n`
    );
  }
}

function validateMarkdownFile(info, filepath) {
  // const needed = ["permalink", "oneline", "title"];
  const needed = ["permalink", "title"];
  const missing = [];
  for (const needs of needed) {
    if (info.data[needs] === undefined) {
      missing.push(needs);
    }
  }
  if (missing.length) {
    // prettier-ignore
    throw new Error(`You need to have '${missing.join("', '")}' in the YML for ${filepath}\n\n`);
  }
}

function throwForUnfoundFile(subItem, lang, langInfo) {
  const keys = [...langInfo.keys()];
  // prettier-ignore
  throw new Error(`Could not find the file '${subItem.file}' from the handbook nav in either ${lang} or 'en' - has: ${keys.join(", ")}`);
}

function fillReleaseInfo() {
  const whatIsNew = handbookPages.find((h) => h.title === "What's New");
  const files = readdirSync(
    join(__dirname, "..", "copy", "en", "release-notes")
  );
  for (const file of files.reverse()) {
    if (file.toLowerCase().includes("overview")) return;
    // @ts-ignore
    whatIsNew.items.push({ file: "release-notes/" + file });
  }
}

function toID(secIdx, str) {
  return secIdx.toString() + "-" + str.toLowerCase().replace(/\s/g, "-");
}
