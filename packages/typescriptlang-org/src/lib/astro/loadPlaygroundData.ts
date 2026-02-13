import fs from "node:fs";
import path from "node:path";

export interface PlaygroundPageData {
  lang: string;
  examplesTOC: any;
  optionsSummary: any;
  playgroundHandbookTOC: any;
}

export function loadPlaygroundData(lang: string = "en"): PlaygroundPageData {
  const projectRoot = process.cwd();
  const appRoot = path.resolve(projectRoot, "..");

  // Examples TOC
  const examplesPath = path.join(
    appRoot,
    "playground-examples",
    "generated",
    `${lang}.json`
  );
  const examplesTOC = JSON.parse(fs.readFileSync(examplesPath, "utf-8"));

  // Playground handbook TOC
  const handbookTOCPath = path.join(
    appRoot,
    "playground-handbook",
    "output",
    "play-handbook.json"
  );
  const playgroundHandbookTOC = JSON.parse(
    fs.readFileSync(handbookTOCPath, "utf-8")
  );

  // Compiler options summary
  const compilerOptsPath = path.join(
    appRoot,
    "tsconfig-reference",
    "output",
    `${lang}-summary.json`
  );
  const compilerOptsFallback = path.join(
    appRoot,
    "tsconfig-reference",
    "output",
    "en-summary.json"
  );
  const optionsPath = fs.existsSync(compilerOptsPath)
    ? compilerOptsPath
    : compilerOptsFallback;
  const optionsSummary = JSON.parse(
    fs.readFileSync(optionsPath, "utf-8")
  ).options;

  return {
    lang,
    examplesTOC,
    optionsSummary,
    playgroundHandbookTOC,
  };
}

export interface PlaygroundExamplePage {
  slug: string;
  name: string;
  title: string;
  html: string;
  lang: string;
  redirectHref: string;
}

export function loadPlaygroundExamplePages(
  lang: string = "en"
): PlaygroundExamplePage[] {
  const projectRoot = process.cwd();
  const appRoot = path.resolve(projectRoot, "..");
  const copyDir = path.join(appRoot, "playground-examples", "copy");

  if (!fs.existsSync(copyDir)) return [];

  const pages: PlaygroundExamplePage[] = [];

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
        const relativePath = path.relative(copyDir, fullPath);
        const parts = relativePath.split(path.sep);
        const fileLang = parts[0];
        if (fileLang !== lang) return;

        const name = entry.name;
        const code = fs.readFileSync(fullPath, "utf-8");

        const idize = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^\x00-\x7F]/g, "-")
            .replace(/ /g, "-")
            .replace(/\//g, "-")
            .replace(/\+/g, "-");

        const postLangPath = parts.slice(1).map(idize).join("/");
        const id = postLangPath.split("/").slice(-1)[0].split(".")[0];
        const { inlineTitle, compilerSettings } =
          getCompilerDetailsFromCode(code);

        const isJS = name.indexOf(".js") !== -1;
        const prefix = isJS ? "filetype=js" : "";
        const params = compilerSettings || {};
        const queryParams = Object.keys(params)
          .map((key) => key + "=" + (params as any)[key])
          .join("&");
        const hash = "example/" + id;
        const langURL = lang === "en" ? "" : lang;
        const redirectHref = `${langURL}/play/?${prefix + queryParams}#${hash}`;

        pages.push({
          slug: postLangPath,
          name,
          title: inlineTitle || name,
          html: invertCodeToHTML(code),
          lang,
          redirectHref,
        });
      }
    }
  }

  walkDir(path.join(copyDir, lang));
  return pages;
}

function getCompilerDetailsFromCode(contents: string) {
  let compilerSettings: Record<string, any> = {};
  let inlineTitle: string | undefined;

  if (contents.startsWith("//// {")) {
    const preJSON = contents
      .replace(/\r\n/g, "\n")
      .split("//// {")[1]
      .split("}\n")[0];
    const code = "{" + preJSON + "}";
    try {
      const obj = JSON.parse(code);
      if (obj.title) {
        inlineTitle = obj.title;
        delete obj.title;
      }
      compilerSettings = obj.compiler || {};
    } catch {
      // ignore parse errors
    }
  }
  return { compilerSettings, inlineTitle };
}

function invertCodeToHTML(code: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre><code>${escaped}</code></pre>`;
}

export interface PlaygroundHandbookPage {
  slug: string;
  title: string;
  html: string;
}

export async function loadPlaygroundHandbookPages(): Promise<
  PlaygroundHandbookPage[]
> {
  const projectRoot = process.cwd();
  const handbookDir = path.resolve(
    projectRoot,
    "..",
    "playground-handbook",
    "copy"
  );

  if (!fs.existsSync(handbookDir)) return [];

  const { markdownToHTML } = await import("./markdownProcessor");
  const matter = (await import("gray-matter")).default;

  const pages: PlaygroundHandbookPage[] = [];

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const { data: frontmatter, content: md } = matter(content);
        const name = entry.name.replace(".md", "");
        const idize = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^\x00-\x7F]/g, "-")
            .replace(/ /g, "-")
            .replace(/\//g, "-")
            .replace(/\+/g, "-");

        pages.push({
          slug: idize(name),
          title: frontmatter.title || name,
          html: md, // Will be processed later
        });
      }
    }
  }

  walkDir(handbookDir);

  // Process markdown to HTML
  for (const page of pages) {
    page.html = await markdownToHTML(page.html);
  }

  return pages;
}
