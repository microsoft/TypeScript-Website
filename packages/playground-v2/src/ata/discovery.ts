import type { API } from "@typescript/typescript/unstable/sync"
import { isCallExpression, isIdentifier, isStringLiteral, type Node } from "@typescript/typescript/unstable/ast"
import type { Dependency, DiscoverDependencies, SourceFile } from "./types"

function dependency(specifier: string, kind: Dependency["kind"], text: string, end: number): Dependency {
  const lineEnd = text.slice(end).split(/\r?\n/, 1)[0]
  const version = /\/\/\s*types:\s*(\S+)/.exec(lineEnd)?.[1]
  return { kind, specifier, ...(version ? { version } : {}) }
}

function unique(dependencies: readonly Dependency[]) {
  return [...new Map(dependencies.map(item => [`${item.kind}:${item.specifier}:${item.version ?? ""}`, item])).values()]
}

export function corsaDiscovery(api: API): (file: SourceFile) => readonly Dependency[] {
  return file => {
    const retained = api.createSourceFile(file.path, file.text)
    try {
      const source = retained.sourceFile
      const dependencies: Dependency[] = source.typeReferenceDirectives.map(reference =>
        dependency(reference.fileName, "types", file.text, reference.end)
      )
      for (const node of source.imports) {
        if (isStringLiteral(node)) dependencies.push(dependency(node.text, "import", file.text, node.end))
      }
      const visit = (node: Node): void => {
        if (
          isCallExpression(node) &&
          isIdentifier(node.expression) &&
          node.expression.text === "require" &&
          node.arguments.length === 1 &&
          isStringLiteral(node.arguments[0])
        ) {
          dependencies.push(dependency(node.arguments[0].text, "import", file.text, node.arguments[0].end))
        }
        node.forEachChild(visit)
      }
      visit(source)
      return unique(dependencies)
    } finally {
      retained.dispose()
    }
  }
}

export function stradaDiscovery(ts: typeof import("typescript")): DiscoverDependencies {
  return file => {
    const source = ts.createSourceFile(file.path, file.text, ts.ScriptTarget.Latest, true)
    const dependencies: Dependency[] = source.typeReferenceDirectives.map(reference =>
      dependency(reference.fileName, "types", file.text, reference.end)
    )
    const add = (node: import("typescript").Node | undefined) => {
      if (node?.kind === ts.SyntaxKind.StringLiteral) {
        dependencies.push(dependency((node as import("typescript").StringLiteral).text, "import", file.text, node.end))
      }
    }
    const visit = (node: import("typescript").Node): void => {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
        case ts.SyntaxKind.ExportDeclaration:
          add((node as import("typescript").ImportDeclaration | import("typescript").ExportDeclaration).moduleSpecifier)
          break
        case ts.SyntaxKind.ExternalModuleReference:
          add((node as import("typescript").ExternalModuleReference).expression)
          break
        case ts.SyntaxKind.ImportType: {
          const argument = (node as import("typescript").ImportTypeNode).argument
          if (argument.kind === ts.SyntaxKind.LiteralType) {
            add((argument as import("typescript").LiteralTypeNode).literal)
          }
          break
        }
        case ts.SyntaxKind.CallExpression: {
          const call = node as import("typescript").CallExpression
          if (
            call.arguments.length === 1 &&
            (call.expression.kind === ts.SyntaxKind.ImportKeyword ||
              (call.expression.kind === ts.SyntaxKind.Identifier &&
                (call.expression as import("typescript").Identifier).text === "require"))
          ) {
            add(call.arguments[0])
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    return unique(dependencies)
  }
}
