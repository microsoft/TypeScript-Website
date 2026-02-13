import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHTML, extractHeadings } from "./markdownProcessor";
import { getDocumentationNavForLanguage } from "../documentationNavigation";
import {
  getNextPageID,
  getPreviousPageID,
  type SidebarNavItem,
} from "../documentationNavigationUtils";

export interface DocPage {
  permalink: string;
  title: string;
  oneline?: string;
  html: string;
  headings: { value: string; depth: number }[];
  frontmatter: Record<string, any>;
  repoPath: string;
  slug: string;
  lang: string;
  modifiedTime: string;
  id?: string;
  prev?: { title: string; oneline: string; permalink: string };
  next?: { title: string; oneline: string; permalink: string };
}

function getAllMdFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip diagram directories
      if (entry.name === "diagrams") continue;
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function findNavIDByPermalink(
  items: SidebarNavItem[],
  permalink: string
): string | undefined {
  for (const item of items) {
    if (item.permalink === permalink) return item.id;
    if (item.items) {
      const found = findNavIDByPermalink(item.items, permalink);
      if (found) return found;
    }
  }
  return undefined;
}

function findPermalinkByID(
  items: SidebarNavItem[],
  id: string
): string | undefined {
  for (const item of items) {
    if (item.id === id) return item.permalink;
    if (item.items) {
      const found = findPermalinkByID(item.items, id);
      if (found) return found;
    }
  }
  return undefined;
}

export async function loadAllDocPages(
  lang: string = "en"
): Promise<DocPage[]> {
  const projectRoot = process.cwd();
  const docsDir = path.resolve(projectRoot, "..", "documentation", "copy", lang);

  if (!fs.existsSync(docsDir)) {
    console.warn(`Documentation directory not found: ${docsDir}`);
    return [];
  }

  const files = getAllMdFiles(docsDir);
  const repoRoot = path.resolve(projectRoot, "..", "..");

  // First pass: parse all files for frontmatter and build permalink map
  const rawPages: {
    filePath: string;
    frontmatter: Record<string, any>;
    content: string;
    modifiedTime: string;
    repoPath: string;
  }[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const { data: frontmatter, content: md } = matter(content);
    if (!frontmatter.permalink) continue;
    const stat = fs.statSync(file);
    rawPages.push({
      filePath: file,
      frontmatter,
      content: md,
      modifiedTime: stat.mtime.toISOString(),
      repoPath: file.replace(repoRoot + "/", ""),
    });
  }

  // Build permalink → frontmatter map for prev/next lookup
  const permalinkMap = new Map<
    string,
    { title: string; oneline: string; permalink: string }
  >();
  for (const raw of rawPages) {
    permalinkMap.set(raw.frontmatter.permalink, {
      title: raw.frontmatter.title || "",
      oneline: raw.frontmatter.oneline || "",
      permalink: raw.frontmatter.permalink,
    });
  }

  // Get nav for prev/next resolution
  const nav = getDocumentationNavForLanguage(lang);

  // Second pass: process markdown and resolve nav links
  const pages: DocPage[] = [];

  for (const raw of rawPages) {
    const html = await markdownToHTML(raw.content);
    const headings = extractHeadings(raw.content);
    const permalink = raw.frontmatter.permalink;

    // Find this page's position in the nav tree
    const navID = findNavIDByPermalink(nav, permalink);

    let prev: DocPage["prev"] = undefined;
    let next: DocPage["next"] = undefined;

    if (navID) {
      const prevInfo = getPreviousPageID(nav, navID);
      if (prevInfo?.path) {
        prev = permalinkMap.get(prevInfo.path);
      }

      const nextInfo = getNextPageID(nav, navID);
      if (nextInfo?.path) {
        next = permalinkMap.get(nextInfo.path);
      }
    }

    pages.push({
      permalink,
      title: raw.frontmatter.title || "",
      oneline: raw.frontmatter.oneline,
      html,
      headings,
      frontmatter: raw.frontmatter,
      repoPath: raw.repoPath,
      slug: permalink,
      lang,
      modifiedTime: raw.modifiedTime,
      id: navID,
      prev,
      next,
    });
  }

  return pages;
}

/**
 * Convert a permalink like /docs/handbook/2/basic-types.html to a slug
 * suitable for Astro's [...slug] catch-all route.
 * The .html extension is auto-added by Astro's build.format: 'file'.
 */
export function docPermalinkToSlug(permalink: string): string {
  return permalink.replace(/^\/docs\//, "").replace(/\.html$/, "");
}
