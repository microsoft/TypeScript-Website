/**
 * Shim for Gatsby's withPrefix utility.
 * In Astro, there's no path prefix by default, so this is an identity function.
 */
export function withPrefix(path: string): string {
  return path;
}
