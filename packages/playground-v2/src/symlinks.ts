export type Symlinks = Readonly<Record<string, string>>

export function normalizeVirtualPath(fileName: string) {
  let path = fileName.replaceAll("\\", "/").replace(/^file:\/\//, "")
  if (!path.startsWith("/")) path = `/workspace/${path}`
  const parts: string[] = []
  for (const part of path.split("/")) {
    if (part === "..") parts.pop()
    else if (part && part !== ".") parts.push(part)
  }
  return `/${parts.join("/")}`
}

export function resolveSymlinks(fileName: string, symlinks: Symlinks, followFinal = true): string | undefined {
  let path = fileName.replaceAll("\\", "/").replace(/^file:\/\//, "")
  if (!path.startsWith("/")) path = `/workspace/${path}`
  const remaining = path.split("/")
  const parts: string[] = []
  let followed = 0
  for (let index = 0; index < remaining.length; index++) {
    const part = remaining[index]
    if (!part || part === ".") continue
    if (part === "..") {
      parts.pop()
      continue
    }
    const link = symlinks[`/${[...parts, part].join("/")}`]
    if (link !== undefined && (followFinal || index < remaining.length - 1)) {
      if (++followed > 40) return undefined
      if (link.startsWith("/")) parts.length = 0
      remaining.splice(index, 1, ...link.split("/"))
      index--
    } else {
      parts.push(part)
    }
  }
  return `/${parts.join("/")}`
}

export function validateProjectSymlinks(files: Readonly<Record<string, string>>, symlinks: Symlinks) {
  const paths = [...Object.keys(files), ...Object.keys(symlinks)]
  for (const [path, target] of Object.entries(symlinks)) {
    if (
      !path.startsWith("/workspace/") ||
      normalizeVirtualPath(path) !== path ||
      /[\\\0]/.test(path) ||
      !target ||
      /[\\\0]/.test(target)
    ) {
      throw new Error(`Invalid symbolic link: ${path}`)
    }
    if (
      files[path] !== undefined ||
      paths.some(other => other !== path && (other.startsWith(`${path}/`) || path.startsWith(`${other}/`)))
    ) {
      throw new Error(`Symbolic link conflicts with another project path: ${path}`)
    }
    const resolved = resolveSymlinks(path, symlinks)
    if (!resolved) throw new Error(`Symbolic link cycle: ${path}`)
    if (resolved !== "/workspace" && !resolved.startsWith("/workspace/")) {
      throw new Error(`Symbolic link targets must stay inside the project: ${path}`)
    }
  }
}
