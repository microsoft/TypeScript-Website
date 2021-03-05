#!/usr/bin/env ts-node

import { join } from "path";
import { writeFileSync, readFileSync } from "fs";
import { generateV2Markdowns, getHTML, replaceAllInString } from "./setupPages";
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
body {
  margin-top: 5rem;
}

article {
  page-break-after: always;
  margin-bottom: 4rem;
}

pre {
  page-break-inside:avoid
}

#handbook-content .whitespace, #handbook-content .whitespace-tight {
  margin: 0;
}

.raised {
  box-shadow: none;
}

pre.twoslash span.error {
  color: #bf1818;
}

data-err {
  text-decoration: underline;
  text-decoration-color: #bf1818;
}
    `;
  return css + thisCSS;
};

const generateHTML = async () => {
  const handbookNavigation = getDocumentationNavForLanguage("en");
  const handbook = handbookNavigation.find((i) => i.title === "Handbook");
  let counter = 0;
  let html = "<html>";

  const css = generateCSS();

  // prettier-ignore
  // const style = readFileSync(join(__dirname, "..", "assets", "ebook-style.css"), "utf8");
  html += `<head><style type='text/css'>${css}</style></head>`;

  html += "<body><div id='handbook-content'>";
  for (const item of handbook!.items!) {
    if (item.permalink) {
      html += await addHandbookPage(item.permalink, counter);
      counter++;
    }
    if (item.items) {
      for (const subitem of item.items) {
        html += await addHandbookPage(subitem.permalink!, counter);
        counter++;
      }
    }
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
  const prefix = `<h1>${title}</h1><article><div class="whitespace raised"><div class="markdown">`;
  const suffix = "</div></div></article>";

  const html = await getHTML(md.content, {});
  const edited = replaceAllInString(html, {
    'a href="/': 'a href="https://www.typescriptlang.org/',
  });

  const content = prefix + edited + suffix;
  return content;
};

generateHTML();
generatePDF();
