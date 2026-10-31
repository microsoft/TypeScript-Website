import type { API } from "@typescript/typescript/sync"
import type * as Ast from "@typescript/typescript/ast"
import type { Node } from "@typescript/typescript/ast"
import type { Dependency, DiscoverDependencies, SourceFile } from "./types"

type TrailingComments = (text: string, position: number) => readonly { pos: number; end: number }[] | undefined

function dependency(
  specifier: string,
  kind: Dependency["kind"],
  text: string,
  end: number,
  comments?: TrailingComments
): Dependency {
  const tails = comments
    ? (comments(text, end) ?? []).map(range => text.slice(range.pos, range.end))
    : [
        text
          .slice(end)
          .split(/[\r\n\u2028\u2029]/, 1)[0]
          .replace(/^["']?\s*\/>\s*/, ""),
      ]
  const pattern = /^\/\/\s*types:\s*(\S+)/
  const version = tails.map(tail => pattern.exec(tail)?.[1]).find(value => value !== undefined)
  return { kind, specifier, ...(version ? { version } : {}) }
}

function statementEnd<T extends { end: number; parent?: T }>(node: T, isStatement: (node: T) => boolean) {
  while (!isStatement(node) && node.parent) node = node.parent
  return node.end
}

function unique(dependencies: readonly Dependency[]) {
  return [...new Map(dependencies.map(item => [`${item.kind}:${item.specifier}:${item.version ?? ""}`, item])).values()]
}

export function corsaDiscovery(
  api: API,
  { getTrailingCommentRanges, isCallExpression, isIdentifier, isStatement, isStringLiteral }: typeof Ast
): (file: SourceFile) => readonly Dependency[] {
  return file => {
    const retained = api.createSourceFile(file.path, file.text)
    try {
      const source = retained.sourceFile
      const dependencies: Dependency[] = source.typeReferenceDirectives.map(reference =>
        dependency(reference.fileName, "types", file.text, reference.end)
      )
      for (const node of source.imports) {
        if (isStringLiteral(node)) {
          dependencies.push(
            dependency(node.text, "import", file.text, statementEnd<Node>(node, isStatement), getTrailingCommentRanges)
          )
        }
      }
      const visit = (node: Node): void => {
        if (
          isCallExpression(node) &&
          isIdentifier(node.expression) &&
          node.expression.text === "require" &&
          node.arguments.length === 1 &&
          isStringLiteral(node.arguments[0])
        ) {
          dependencies.push(
            dependency(
              node.arguments[0].text,
              "import",
              file.text,
              statementEnd<Node>(node, isStatement),
              getTrailingCommentRanges
            )
          )
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
        dependencies.push(
          dependency(
            (node as import("typescript").StringLiteral).text,
            "import",
            file.text,
            statementEnd(node, ts.isStatement),
            ts.getTrailingCommentRanges
          )
        )
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
