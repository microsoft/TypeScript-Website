// @ts-check
// prettier-ignore
const { readdirSync, statSync, existsSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { format } = require("prettier");
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

// The results are a generated TS function in put into the file:
// packages/typescriptlang-org/src/lib/documentationNavigation.ts
// where it's used in the website / epub / etc
//

/* 
  Run this after any changes to propagate:
     yarn workspace documentation create-handbook-nav
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
      { file: "reference/Modules.md" },
      { file: "reference/Module Resolution.md" },
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
      { file: "release-notes/Overview.md" },
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
]
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

  const allEnPages = getFilePaths(enRoot);
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

const codeForTheHandbook = [
  `
  /* This function is completely auto-generated via the \`yarn bootstrap\` phase of
  the app. You can re-run it when adding new localized handbook pages by running:

  yarn workspace documentation create-handbook-nav

  Find the source of truth at packages/documentation/scripts/generateDocsNavigationPerLanguage.js
*/

import type { SidebarNavItem } from "./documentationNavigationUtils"


export function getDocumentationNavForLanguage(langRequest: string): SidebarNavItem[] {
  const langs = ['${langs.join("', '")}']
  const lang = langs.includes(langRequest) ? langRequest : "en"
  const navigations: Record<string, SidebarNavItem[]> = {} 
`,
];

for (const lang of langs) {
  codeForTheHandbook.push(`navigations.${lang} = [`);

  handbookPages.forEach((section, sectionIndex) => {
    // Section metadata:
    codeForTheHandbook.push(`{ 
      title: "${section.title}",
      oneline: "${section.summary}",
      id: "${section.title.toLowerCase().replace(/\s/g, "-")}",
      chronological: ${section.chronological || false},
    `);

    /** @param {{ items?: HandbookNavSubItem[] }} itemable */
    function addItems(itemable) {
      // Lots of 2nd level navs dont have subnav, bail for them
      if ("items" in itemable === false) return;

      codeForTheHandbook.push("items: [");
      for (const subItem of itemable.items) {
        codeForTheHandbook.push(`{ `);

        // Is it a special link?
        if ("href" in subItem) {
          codeForTheHandbook.push(`
        title: "${subItem.title}",
        id: "${toID(sectionIndex, subItem.title)}",
        permalink: "${subItem.href}",
        oneline: "${subItem.oneliner}"
      },`);
        } else if ("items" in subItem) {
          //Is is a sub-sub-section?
          codeForTheHandbook.push(`
            title: "${subItem.title}",
            id: "${toID(sectionIndex, subItem.title)}",
            oneline: "${subItem.oneliner}",
            chronological: ${subItem.chronological || false},
          `);
          addItems(subItem);
          codeForTheHandbook.push(",");
        } else if ("file" in subItem) {
          // It's a file reference
          const subNavInfo =
            langInfo[lang].get(subItem.file) ||
            langInfo["en"].get(subItem.file);

          if (!subNavInfo) throwForUnfoundFile(subItem, lang, langInfo["en"]);

          codeForTheHandbook.push(`
            title: "${subNavInfo.data.short || subNavInfo.data.title}",
            id: "${toID(sectionIndex, subNavInfo.data.title)}",
            permalink: "${subNavInfo.data.permalink}",
            oneline: "${subNavInfo.data.oneline}",
          `);

          const isLast =
            itemable.items.indexOf(subItem) === itemable.items.length - 1;
          const suffix = isLast ? "" : ",";
          codeForTheHandbook.push(`}${suffix} `);
        }
      }
      // closes the outer 'items'
      codeForTheHandbook.push("]\n }");
    }

    // Set up the 1st level of recursion for the 2nd level items
    addItems(section);

    // close subnav items
    const isLast = handbookPages.indexOf(section) === section.items.length - 1;
    const suffix = isLast ? "," : ",";
    codeForTheHandbook.push(`${suffix}`);
  });
  // close sections
  codeForTheHandbook.push(`]`);
}

codeForTheHandbook.push(`
  return navigations[lang]
}`);

// prettier-ignore
const pathToFileWeEdit = join(__dirname, "..", "..", "typescriptlang-org", "src", "lib", "documentationNavigation.ts");
const newCode = "\n\n" + codeForTheHandbook.join("\n") + "\n\n";
writeFileSync(
  pathToFileWeEdit,
  format(newCode, { filepath: pathToFileWeEdit })
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
