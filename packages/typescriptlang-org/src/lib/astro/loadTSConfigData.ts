import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHTML } from "./markdownProcessor";

export interface TSConfigPageData {
  locale: string;
  html: string;
  categories: any[];
  intro: {
    html: string;
    header: string;
    preview: string;
  };
}

export async function loadTSConfigReference(
  lang: string = "en"
): Promise<TSConfigPageData> {
  const projectRoot = process.cwd();
  const outputDir = path.resolve(projectRoot, "..", "tsconfig-reference", "output");

  // Load categories from the generated JSON
  const categoriesPath = path.join(outputDir, `${lang}.json`);
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));

  // Load the rendered markdown
  const mdPath = path.join(outputDir, `${lang}.md`);
  const mdContent = fs.readFileSync(mdPath, "utf-8");
  const html = await markdownToHTML(mdContent);

  // Load the intro from copy
  const copyDir = path.resolve(projectRoot, "..", "tsconfig-reference", "copy");
  const localeIntroPath = path.join(copyDir, lang, "intro.md");
  const enIntroPath = path.join(copyDir, "en", "intro.md");
  const introPath = fs.existsSync(localeIntroPath) ? localeIntroPath : enIntroPath;
  const introFile = matter(fs.readFileSync(introPath, "utf-8"));
  const introHTML = await markdownToHTML(introFile.content);

  return {
    locale: lang,
    html,
    categories: categoriesData.categories,
    intro: {
      html: introHTML,
      header: introFile.data.header,
      preview: introFile.data.firstLine,
    },
  };
}

export interface TSConfigOptionPage {
  name: string;
  html: string;
  redirectHref: string;
}

export async function loadTSConfigOptionPages(): Promise<TSConfigOptionPage[]> {
  const projectRoot = process.cwd();
  const optionsDir = path.resolve(
    projectRoot,
    "..",
    "tsconfig-reference",
    "copy",
    "en",
    "options"
  );

  if (!fs.existsSync(optionsDir)) return [];

  const files = fs.readdirSync(optionsDir).filter((f) => f.endsWith(".md"));
  const pages: TSConfigOptionPage[] = [];

  for (const file of files) {
    const name = file.replace(".md", "");
    const content = fs.readFileSync(path.join(optionsDir, file), "utf-8");
    const { content: md } = matter(content);
    const html = await markdownToHTML(md);

    pages.push({
      name,
      html,
      redirectHref: `/tsconfig#${name}`,
    });
  }

  return pages;
}
