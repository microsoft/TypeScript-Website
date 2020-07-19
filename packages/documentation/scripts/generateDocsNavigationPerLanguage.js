// @ts-check
const {
  readdirSync,
  statSync,
  existsSync,
  readFileSync,
  writeFileSync,
} = require("fs");
const { join } = require("path");
const { format } = require("prettier");
const { enRoot, getFilePaths } = require("./generateTypesForFilesInDocs");
const { read: readMarkdownFile } = require("gray-matter");

/**
 * @typedef {Object} HandbookNavSubItem
 * @property {import("./types/AllFilenames").AllDocsPages= } file - the reference to the file based on the lang root
 * @property {HandbookNavSubItem[]=} items - pages
 * or!
 * @property {string= } href - a language prefixless
 * @property {string= } title - the display only used when href exists
 * @property {string= } oneliner
 */

/**
 * @typedef {Object} HandbookNavItem
 * @property {string} title - TBD
 * @property {string} summary - TDB
 * @property {boolean=} chronological - should we recommend a next/prev
 * @property {HandbookNavSubItem[]} items - pages
 */

// prettier-ignore
/** @type {HandbookNavItem[]} */
const handbookPages = [
  {
    title: "Get Started",
    summary: "Quick introductions based on your background or preference.",
    items: [
      { file: "Get Started/TS for the New Programmer.md" },
      { file: "Get Started/TS for JS Programmers.md" },
      { file: "Get Started/TS for OOPers.md" },
      { file: "Get Started/TS for Functional Programmers.md" },
      { file: "tutorials/TypeScript Tooling in 5 minutes.md" },
    ],
  },
  {
    title: "Handbook",
    summary: "A good first read for your daily TS work.",
    chronological: true,
    items: [
      { file: "The Handbook.md" },
      { file: "Basic Types.md" },
      { file: "Interfaces.md" },
      { file: "Functions.md" },
      { file: "Literal Types.md" },
      { file: "Unions and Intersections.md" },
      { file: "Classes.md" },
      { file: "Enums.md" },
      { file: "Generics.md" },
    ],
  },
  {
    title: "Tutorials",
    summary: "Using TypeScript in several environments.",
    items: [
      { file: "tutorials/ASP.NET Core.md" },
      { file: "tutorials/Gulp.md" },
      { file: "tutorials/Migrating from JavaScript.md" },
      { file: "tutorials/Babel with TypeScript.md" },
    ],
  },
  {
    title: "What's New",
    summary:
      "Find out how TypeScript has evolved and what's new in the releases.",
    items: [
      { file: "release notes/Overview.md" },
      // This is auto-filled
    ],
  },
  {
    title: "Declaration Files",
    summary:
      "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
    chronological: true,
    items: [
      { file: "declaration files/Introduction.md"},
      { file: "declaration files/By Example.md"},
      { file: "declaration files/Do's and Don'ts.md"},
      { file: "declaration files/Deep Dive.md" },
      { file: "declaration files/Library Structures.md" },
      { title: "Templates", items: [
        { file: "declaration files/templates/global.d.ts.md" },
        { file: "declaration files/templates/global-modifying-module.d.ts.md"},
        { file: "declaration files/templates/module.d.ts.md" },
        { file: "declaration files/templates/module-plugin.d.ts.md" },
        { file: "declaration files/templates/module-class.d.ts.md" },
        { file: "declaration files/templates/module-function.d.ts.md" },
      ]}
      { file: "declaration files/Publishing.md" },
      { file: "declaration files/Consumption.md"},
    ],
  },
  {
    title: "JavaScript",
    summary: "How to use TypeScript-powered JavaScript tooling.",
    chronological: true,
    items: [
      { file: "Intro to JS with TS.md", },
      { file:"Type Checking JavaScript Files.md" },
      { file:"JSDoc Reference.md" },
      { file: "declaration files/Creating DTS files From JS.md" },
    ],
  },
  {
    title: "Project Configuration",
    summary: "Compiler configuration reference.",
    items: [
      {
        href: "/tsconfig",
        title: "TSConfig Reference",
        oneliner: "The page covering every TSConfig option"
      },
      { file: "tutorials/tsconfig.json.md" },
      { file: "Compiler Options.md" },
      { file: "Project References.md" },
      { file: "Compiler Options in MSBuild.md" },
      { file: "Integrating with Build Tools.md" },
      { file: "Configuring Watch.md" },
      { file: "Nightly Builds.md" },
    ],
  },
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
      langMap.set(relativeToLangPath.slice(1), info);
    }
  }
}

const codeForTheHandbook = [
  `
export function getHandbookNavForLanguage(langRequest: string) {
  const langs = ['${langs.join("', '")}']
  const lang = langs.includes(langRequest) ? langRequest : "en"

`,
];

for (const lang of langs) {
  codeForTheHandbook.push(`const ${lang} = [`);

  handbookPages.forEach((section) => {
    // Section metadata:
    codeForTheHandbook.push(`{ 
      title: "${section.title}",
      id: "${section.title.toLowerCase().replace(/\s/g, "-")}",
      chronological: ${section.chronological || false},
      items: [
    `);

    // 1st level subnav:
    for (const subItem of section.items) {
      codeForTheHandbook.push(`{ `);

      // Is it a special link?
      if ("href" in subItem) {
        codeForTheHandbook.push(`
        title: "${subItem.title}",
        permalink: "${subItem.href}",
        oneline: "${subItem.oneliner}",
      },`);
      } else {
        // It's a file reference
        const subNavInfo =
          langInfo[lang].get(subItem.file) || langInfo["en"].get(subItem.file);

        if (!subNavInfo) throwForUnfoundFile(subItem, lang);

        codeForTheHandbook.push(`
        title: "${subNavInfo.data.title}",
        permalink: "${subNavInfo.data.permalink}",
        oneline: "${subNavInfo.data.oneline}",
      `);

        const isLast =
          section.items.indexOf(subItem) === section.items.length - 1;
        const suffix = isLast ? "" : ",";
        codeForTheHandbook.push(`}${suffix} `);
      }
    }

    // close subnav items
    const isLast = handbookPages.indexOf(section) === section.items.length - 1;
    const suffix = isLast ? "" : ",";
    codeForTheHandbook.push(`]\n }${suffix}`);
  });
  // close sections
  codeForTheHandbook.push(`]`);
}

codeForTheHandbook.push("}");

// prettier-ignore
const pathToFileWeEdit = join(__dirname, "..", "..", "typescriptlang-org", "src", "lib", "handbookNavigation.ts");
const startMarker = "/** ---INSERT--- */";
const endMarker = "/** ---INSERT-END--- */";
const oldCode = readFileSync(pathToFileWeEdit, "utf8");
const newCode =
  oldCode.split(startMarker)[0] +
  startMarker +
  "\n\n" +
  codeForTheHandbook.join("\n") +
  "\n\n" +
  endMarker +
  oldCode.split(endMarker)[1];

writeFileSync(
  pathToFileWeEdit,
  format(newCode, { filepath: pathToFileWeEdit })
);

/// ------------------

function validateNonEnglishMarkdownFile(info, lang, filepath) {
  if (!info.data.permalink.startsWith("/" + lang + "/")) {
    throw new Error(
      `Permalink in ${filepath} does not start with '/${lang}/'\n\n`
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

function throwForUnfoundFile(subItem, lang) {
  throw new Error(
    `Could not find the file '${subItem.file}' from the handbook nav in either ${lang} or 'en'`
  );
}

function fillReleaseInfo() {
  const whatIsNew = handbookPages.find((h) => h.title === "What's New");
  const files = readdirSync(
    join(__dirname, "..", "copy", "en", "release notes")
  );
  for (const file of files.reverse()) {
    // @ts-ignore
    whatIsNew.items.push({ file: "release notes/" + file });
  }
}
