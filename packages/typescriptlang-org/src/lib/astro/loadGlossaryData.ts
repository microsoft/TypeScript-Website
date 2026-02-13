import fs from "node:fs";
import path from "node:path";
import { markdownToHTML } from "./markdownProcessor";

export interface GlossaryPageData {
  locale: string;
  html: string;
  languageMeta: { terms: { id: string; display: string }[] };
}

export async function loadGlossaryPage(
  lang: string = "en"
): Promise<GlossaryPageData> {
  const projectRoot = process.cwd();
  const outputDir = path.resolve(projectRoot, "..", "glossary", "output");

  // Load the terms metadata
  const termsPath = path.join(outputDir, `${lang}.json`);
  const languageMeta = JSON.parse(fs.readFileSync(termsPath, "utf-8"));

  // Load the rendered markdown
  const mdPath = path.join(outputDir, `${lang}.md`);
  const mdContent = fs.readFileSync(mdPath, "utf-8");
  const html = await markdownToHTML(mdContent);

  return {
    locale: lang,
    html,
    languageMeta,
  };
}
