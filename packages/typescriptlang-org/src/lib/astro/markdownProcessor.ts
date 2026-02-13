import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeStringify, { allowDangerousHtml: true });

/**
 * Process a markdown string into HTML.
 */
export async function markdownToHTML(md: string): Promise<string> {
  const result = await processor.process(md);
  return String(result);
}

/**
 * Extract heading nodes from a markdown string (simple regex-based).
 */
export function extractHeadings(
  md: string
): { value: string; depth: number }[] {
  const headings: { value: string; depth: number }[] = [];
  for (const line of md.split("\n")) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({ depth: match[1].length, value: match[2].trim() });
    }
  }
  return headings;
}
