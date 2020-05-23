#!/usr/bin/env ts-node

const jetpack = require("fs-jetpack");
const { createReadStream } = jetpack;

const Streampub = require("streampub");
const toHAST = require(`mdast-util-to-hast`);
const hastToHTML = require(`hast-util-to-html`);
import { readdirSync, lstatSync, copyFileSync } from "fs";
import runTwoSlashAcrossDocument from "gatsby-remark-shiki-twoslash";
const remark = require("remark");
import { join } from "path";
import { read as readMarkdownFile } from "gray-matter";

import { handbookNavigation } from "../../typescriptlang-org/src/lib/handbookNavigation";
import { idFromURL } from "../../typescriptlang-org/lib/bootup/ingestion/createPagesForOldHandbook";

// Reference: https://github.com/AABoyles/LessWrong-Portable/blob/master/build.js

const markdowns = new Map<string, ReturnType<typeof readMarkdownFile>>();

// Grab all the md + yml info from the handbook files on disk
// and add them to ^
const handbookPath = join(__dirname, "..", "..", "handbook-v1", "en");
readdirSync(handbookPath, "utf-8").forEach(path => {
  const filePath = join(handbookPath, path);
  if (lstatSync(filePath).isDirectory() || !filePath.endsWith("md")) {
    return;
  }

  const md = readMarkdownFile(filePath);
  // prettier-ignore
  if (!md.data.permalink) throw new Error(`${path} in the handbook did not have a permalink in the yml header`);

  const id = idFromURL(md.data.permalink);
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
  ibooksSpecifiedFonts: true
};

const epubPath = join(__dirname, "..", "dist", "handbook.epub");

const startEpub = async () => {
  const handbook = handbookNavigation.find(i => i.title === "Handbook");
  const epub = new Streampub(bookMetadata);

  epub.meta["ibooks:specified-fonts"] = true;

  epub.pipe(jetpack.createWriteStream(epubPath));

  // Add the cover
  epub.write(Streampub.newCoverImage(createReadStream("./assets/cover.png")));
  epub.write(Streampub.newFile("ts.png", createReadStream("./assets/ts.png")));

  // Import CSS
  epub.write(
    Streampub.newFile("style.css", createReadStream("./assets/style.css"))
  );

  epub.write(
    Streampub.newChapter(
      bookMetadata.title,
      jetpack.read("./assets/intro.xhtml"),
      0
    )
  );

  for (const item of handbook.items) {
    const index = handbook.items.indexOf(item) + 1;
    await addHandbookPage(epub, item.id, index);
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
  const title = md.data.title;
  const prefix = `<link href="style.css" type="text/css" rel="stylesheet" /><h1>${title}</h1><div class='section'>`;
  const suffix = "</div>";
  let html = await getHTML(md.content, {});

  const mapper = {
    'a href="/': 'a href="http://www.staging-typescript.org/'
  };

  Object.keys(mapper).forEach(before => {
    html = html.replace(new RegExp(before, "g"), mapper[before]);
  });
  epub.write(Streampub.newChapter(title, prefix + html + suffix, index));
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
        )
      }
    );
  }

  const hAST = toHAST(markdownAST, { allowDangerousHTML: true });
  return hastToHTML(hAST, { allowDangerousHTML: true });
};

startEpub();
