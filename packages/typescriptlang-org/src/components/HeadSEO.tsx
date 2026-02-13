/**
 * Legacy Gatsby component — replaced by BaseLayout.astro for <head> management.
 * Only the SeoProps type is still used.
 */

export type SeoProps = {
  title: string
  description: string
  ogTags?: { [key: string]: string }
}
