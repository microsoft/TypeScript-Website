import { isSourceFile, isStringLiteral, SourceFile, TransformationContext, TransformerFactory, visitEachChild, visitNode, Node } from "typescript"
import { twoslasher } from "../src/index"

it("applies custom transformers", () => {
  const code = "console.log('Hello World!')"
  // A simple transformer that uppercases all string literals
  const transformer: TransformerFactory<SourceFile> = (ctx: TransformationContext) => {
    const visitor = (node: Node): Node => {
      if (isStringLiteral(node)) {
        return ctx.factory.createStringLiteral(node.text.toUpperCase());
      }
      return visitEachChild(node, visitor, ctx);
    };
    return node => visitNode(node, visitor, isSourceFile);
  };

  const result = twoslasher(code, "ts", {
    defaultOptions: { showEmit: true },
    customTransformers: {
      before: [transformer]
    }
  })
  expect(result.errors).toEqual([])
  expect(result.code).toContain('console.log("HELLO WORLD!")')
})
