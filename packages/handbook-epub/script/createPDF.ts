#!/usr/bin/env ts-node

import { join } from "path";
import { writeFileSync, copyFileSync } from "fs";
import {
  generateV2Markdowns,
  getGitSHA,
  getHTML,
  getReleaseInfo,
  replaceAllInString,
} from "./setupPages";
import { getDocumentationNavForLanguage } from "../../typescriptlang-org/src/lib/documentationNavigation";
const { chromium } = require("playwright");
const sass = require("sass");

const markdowns = generateV2Markdowns();

// Grab the handbook nav, and use that to pull out the order

const bookMetadata = {
  title: "TypeScript Handbook",
  author: "TypeScript Team and Open Source Contributors",
  authorUrl: "https://www.typescriptlang.org/",
  modified: new Date(),
  source: "https://www.typescriptlang.org",
  description: "An offline guide to learning TypeScript.",
  publisher: "Microsoft",
  subject: "Non-fiction",
  includeTOC: true,
  ibooksSpecifiedFonts: true,
};

// Convert the important SCSS files to JS for the book:

const generateCSS = () => {
  console.log("Generating CSS from SCSS files");

  const scssFiles = [
    "../../typescriptlang-org/src/components/layout/main.scss",
    "../../typescriptlang-org/src/templates/documentation.scss",
    "../../typescriptlang-org/src/templates/markdown.scss",
    "../../typescriptlang-org/src/templates/markdown-twoslash.scss",
  ];

  const css = scssFiles
    .map((path) => {
      const scss = sass.renderSync({
        file: join(__dirname, path),
      });
      return scss.css.toString();
    })
    .join("\n\n");

  const thisCSS = `
html {
  background-color: #EEEEEE;
}

body {
  padding-top: 5rem;
  -webkit-print-color-adjust: exact !important;
}

article {
  page-break-after: always;
  margin-bottom: 4rem;
}

pre {
  page-break-inside:avoid
}

.raised {
  box-shadow: none;
}

#pdf-intro {
  page-break-after: always
}

#pdf-intro table {
  width: 600px;
  margin: 0 auto;
}

pre .error-behind {
  color: white;
}

.code-container .line {
  white-space: pre-wrap;
}

    `;
  return css + thisCSS;
};

const generateHTML = async () => {
  const handbookNavigation = getDocumentationNavForLanguage("en");
  const handbook = handbookNavigation.find((i) => i.title === "Handbook");
  let html = "<html>";

  const css = generateCSS();
  const releaseInfo = getReleaseInfo();

  // prettier-ignore
  // const style = readFileSync(join(__dirname, "..", "assets", "ebook-style.css"), "utf8");
  html += `<head><style type='text/css'>${css}</style></head>`;

  html += "<body><div id='handbook-content'>";

  const date = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sha = getGitSHA().slice(0, 6);
  html += `
  <div id="pdf-intro">
  <center style="page-break-after: always">
    <img src="./ts.png" width=200>
    <p style='width: 340px;'>This copy of the TypeScript handbook was created on ${date} against
    commit
    <a href="https://github.com/microsoft/TypeScript-Website/tree/${sha}"><code>${sha}</code></a>
    with
    <a href="https://www.typescriptlang.org/${releaseInfo.releaseNotesURL}">TypeScript ${releaseInfo.tags.stableMajMin}</a>.
    </p>
  </center>
  `;

  const allPages = [];

  for (const item of handbook!.items!) {
    if (item.permalink) {
      allPages.push(item);
    }
    if (item.items) {
      for (const subitem of item.items) {
        allPages.push(subitem);
      }
    }
  }

  html += tableOfContents(allPages);
  html += "</div>"; //   <div id="pdf-intro">

  for (const item of allPages) {
    const i = allPages.indexOf(item);
    html += await addHandbookPage(item.permalink!, i);
  }

  writeFileSync(join(__dirname, "..", "assets", "all.html"), html);
};

const generatePDF = async () => {
  console.log("Starting up Chromium");
  const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  console.log("Loading the html");
  await page.goto("file://" + join(__dirname, "..", "assets", "all.html"));

  console.log("Rendering the PDF");
  await page.emulateMedia({ media: "screen" });
  await page.pdf({
    path: join(__dirname, "..", "dist", "handbook.pdf"),
    margin: { top: 40, bottom: 60 },
  });

  console.log("Done");
  await browser.close();
};

const addHandbookPage = async (id: string, index: number) => {
  const md = markdowns.get(id);
  if (!md)
    // prettier-ignore
    throw new Error("Could not get markdown for " + id + `\n\nAll MDs: ${Array.from(markdowns.keys())}`);

  const title = md.data.title;
  const prefix = `<h1 style='margin: 0 2rem' id='title-${index}'>${title}</h1><article><div class="whitespace raised"><div class="markdown">`;
  const suffix = "</div></div></article>";

  const html = await getHTML(md.content, {});
  const edited = replaceAllInString(html, {
    'a href="/': 'a href="https://www.typescriptlang.org/',
  });

  const content = prefix + edited + suffix;
  return content;
};

const tableOfContents = (items: any[]) => {
  const start = `<h1 style='margin: 0 2rem; margin-bottom: 4rem;'>Table of Contents</h1><table><tbody>`;
  const middle = items.map(
    (item, i) =>
      `<tr><td style='width: 200px;'><a href="#title-${i}">${item.title}</a></td><td>${item.oneline}</td></tr>`
  );
  const end = `</tbody></table>`;
  return start + middle.join("\n") + end;
};

const go = async () => {
  await generateHTML();
  await generatePDF();
  copyFileSync(
    join(__dirname, "..", "dist", "handbook.pdf"),
    // prettier-ignore
    join( __dirname, "..", "..", "typescriptlang-org", "static", "assets", "typescript-handbook.pdf")
  );
};

go();
