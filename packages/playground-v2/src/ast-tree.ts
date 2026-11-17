export type AstNode = {
  detail: string
  hasChildren: boolean
  id: string
  kind: string
  start: number
  end: number
}

export type AstSnapshot = {
  revision: number
  root: AstNode
}

export type AstSyntaxNode = {
  kind: number
  flags?: number
  forEachChild<T>(callback: (child: any) => T | undefined): T | undefined
  getEnd(): number
}

// Enum reverse mappings resolve to the marker aliases declared last
// (FirstStatement for VariableStatement), so keep the first declared name.
export function syntaxKindNames(syntaxKind: Record<string, string | number>) {
  const names = new Map<number, string>()
  for (const [name, value] of Object.entries(syntaxKind)) {
    if (typeof value === "number" && !names.has(value)) names.set(value, name)
  }
  return (kind: number) => names.get(kind)
}

type CachedAstNode = AstNode & { children: CachedAstNode[] }

// Snapshots the tree so child and path requests keep resolving against the
// source text the root was built from, even after later compiles.
export class AstCache {
  private revision = 0
  private readonly nodes = new Map<string, CachedAstNode>()

  store<T extends AstSyntaxNode>(
    root: T | undefined,
    kindName: (kind: number) => string | undefined,
    start: (node: T) => number
  ): AstSnapshot | undefined {
    this.revision++
    this.nodes.clear()
    if (!root) return undefined
    const cachedRoot = describe(root, "", kindName, start)
    this.nodes.set("", cachedRoot)
    const pending: Array<[T, CachedAstNode]> = [[root, cachedRoot]]
    while (pending.length) {
      const [node, cached] = pending.pop()!
      node.forEachChild((child: T) => {
        const id = cached.id === "" ? String(cached.children.length) : `${cached.id}.${cached.children.length}`
        const entry = describe(child, id, kindName, start)
        cached.children.push(entry)
        this.nodes.set(id, entry)
        pending.push([child, entry])
        return undefined
      })
      cached.hasChildren = cached.children.length > 0
    }
    return { revision: this.revision, root: summarize(cachedRoot) }
  }

  children(revision: number, id: string): AstNode[] | undefined {
    if (revision !== this.revision) return undefined
    return this.nodes.get(id)?.children.map(summarize)
  }

  path(revision: number, position: number): AstNode[] | undefined {
    if (revision !== this.revision) return undefined
    let node = this.nodes.get("")
    const path: AstNode[] = []
    while (node) {
      path.push(summarize(node))
      node = node.children.find(child => position >= child.start && position <= child.end)
    }
    return path
  }
}

function describe<T extends AstSyntaxNode>(
  node: T,
  id: string,
  kindName: (kind: number) => string | undefined,
  start: (node: T) => number
): CachedAstNode {
  const properties = node as T & { text?: unknown; escapedText?: unknown }
  const text =
    typeof properties.text === "string"
      ? properties.text
      : typeof properties.escapedText === "string"
      ? properties.escapedText
      : ""
  const preview = text ? JSON.stringify(text.length > 60 ? `${text.slice(0, 57)}…` : text) : ""
  const flags = typeof node.flags === "number" && node.flags !== 0 ? `flags=${node.flags}` : ""
  return {
    children: [],
    detail: [preview, flags].filter(Boolean).join(" · "),
    end: node.getEnd(),
    hasChildren: false,
    id,
    kind: kindName(node.kind) ?? String(node.kind),
    start: start(node),
  }
}

function summarize({ children: _children, ...node }: CachedAstNode): AstNode {
  return node
}
