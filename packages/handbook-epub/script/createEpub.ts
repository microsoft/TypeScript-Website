#!/usr/bin/env ts-node

/* With twoslash
   env CI=213 yarn workspace handbook-epub build
*/

const jetpack = require("fs-jetpack");
const { createReadStream } = jetpack;

const Streampub = require("streampub");
const toHAST = require(`mdast-util-to-hast`);
const hastToHTML = require(`hast-util-to-html`);
import {
  readdirSync,
  readFileSync,
  lstatSync,
  copyFileSync,
  mkdirSync,
} from "fs";
import runTwoSlashAcrossDocument from "gatsby-remark-shiki-twoslash";
const remark = require("remark");
import { join } from "path";
import { read as readMarkdownFile } from "gray-matter";

import { getDocumentationNavForLanguage } from "../../typescriptlang-org/src/lib/documentationNavigation";
import { exists } from "fs-jetpack";

// Reference: https://github.com/AABoyles/LessWrong-Portable/blob/master/build.js

const markdowns = new Map<string, ReturnType<typeof readMarkdownFile>>();
const handbookNavigation = getDocumentationNavForLanguage("en");

// Grab all the md + yml info from the handbook files on disk
// and add them to ^
// prettier-ignore
const handbookPath = join(
  __dirname,
  "..",
  "..",
  "documentation",
  "copy",
  "en",
  "handbook-v1",
);
readdirSync(handbookPath, "utf-8").forEach((path) => {
  const filePath = join(handbookPath, path);
  if (lstatSync(filePath).isDirectory() || !filePath.endsWith("md")) {
    return;
  }

  const md = readMarkdownFile(filePath);
  // prettier-ignore
  if (!md.data.permalink) {
    throw new Error(
      `${path} in the handbook did not have a permalink in the yml header`,
    );
  }
  const id = md.data.permalink;
  markdowns.set(id, md);
});

// Grab the handbook nav, and use that to pull out the order

const bookMetadata = {
  title: "TypeScript Handbook",
  author: "TypeScript Contributors",
  authorUrl: "https://www.typescriptlang.org/",
  modified: new Date(),
  source: "https://www.typescriptlang.org",
  description: "An offline guide to learning TypeScript.",
  publisher: "Microsoft",
  subject: "Non-fiction",
  includeTOC: true,
  ibooksSpecifiedFonts: true,
};

const dist = join(__dirname, "..", "dist");
if (!exists(dist)) mkdirSync(dist);

const epubPath = join(dist, "handbook.epub");

const startEpub = async () => {
  const handbook = handbookNavigation.find((i) => i.title === "Handbook");
  const epub = new Streampub(bookMetadata);

  epub.pipe(jetpack.createWriteStream(epubPath));

  // Add the cover
  epub.write(Streampub.newCoverImage(createReadStream("./assets/cover.png")));
  epub.write(Streampub.newFile("ts.png", createReadStream("./assets/ts.png")));

  // Import CSS
  epub.write(
    Streampub.newFile("style.css", createReadStream("./assets/ebook-style.css"))
  );

  const releaseInfo = getReleaseInfo();
  const intro = jetpack.read("./assets/intro.xhtml");
  const date = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const editedIntro = replaceAllInString(intro, {
    "%%DATE%%": date,
    "%%COMMIT_SHA%%": getGitSHA().slice(0, 6),
    "%%TS_VERSION%%": releaseInfo.tags.stableMajMin,
    "%%RELEASE_DOCS%%": releaseInfo.releaseNotesURL,
  });
  epub.write(Streampub.newChapter(bookMetadata.title, editedIntro, 0));

  for (const item of handbook!.items!) {
    const index = handbook!.items!.indexOf(item) + 1;
    await addHandbookPage(epub, item.permalink!, index);
  }

  epub.end();
};

// The epub generation is async-y, so just wait till everything is
// done to move over the file into the website's static assets.
process.once("exit", () => {
  copyFileSync(
    epubPath,
    join(
      __dirname,
      "../../typescriptlang-org/static/assets/typescript-handbook-beta.epub"
    )
  );
});

const addHandbookPage = async (epub: any, id: string, index: number) => {
  const md = markdowns.get(id);
  if (!md) throw new Error("Could not get markdown for " + id);
  const title = md.data.title;
  const prefix = `<link href="style.css" type="text/css" rel="stylesheet" /><h1>${title}</h1><div class='section'>`;
  const suffix = "</div>";
  const html = await getHTML(md.content, {});
  const edited = replaceAllInString(html, {
    'a href="/': 'a href="https://www.staging-typescript.org/',
  });

  epub.write(Streampub.newChapter(title, prefix + edited + suffix, index));
};

const getHTML = async (code: string, settings?: any) => {
  const markdownAST: Node = remark().parse(code);

  // Basically, only run with twoslash during prod builds
  if (process.env.CI) {
    await runTwoSlashAcrossDocument(
      { markdownAST },
      {
        theme: require.resolve(
          "../../typescriptlang-org/lib/themes/typescript-beta-light.json"
        ) as any,
      },
      {}
    );
  }

  const hAST = toHAST(markdownAST, { allowDangerousHTML: true });
  return hastToHTML(hAST, { allowDangerousHTML: true });
};

function replaceAllInString(_str: string, obj: any) {
  let str = _str;

  Object.keys(obj).forEach((before) => {
    str = str.replace(new RegExp(before, "g"), obj[before]);
  });
  return str;
}

const getGitSHA = () => {
  const gitRoot = join(__dirname, "..", "..", "..", ".git");
  const rev = readFileSync(join(gitRoot, "HEAD"), "utf8").trim();
  if (rev.indexOf(":") === -1) {
    return rev;
  } else {
    return readFileSync(join(gitRoot, rev.substring(5)), "utf8");
  }
};

const getReleaseInfo = () => {
  // prettier-ignore
  const releaseInfo = join(
    __dirname,
    "..",
    "..",
    "typescriptlang-org",
    "src",
    "lib",
    "release-info.json",
  );
  const info = JSON.parse(readFileSync(releaseInfo, "utf8"));
  return info;
};

startEpub();
