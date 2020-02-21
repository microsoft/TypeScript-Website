//// { order: 1 }

// 是的我们知道，TypeScript 的 tsconfig 默认没有打开严格模式。
// 但是我们团队会尽可能建议用户将其配置迁移至启用严格模式。

// 但是对于在线演示来说，我们可以很开心的将默认值设置为严格模式。
// 在线演示还将追踪与默认值不同的编译选项，并使他们可以在 URL 中共享。

// 你可以了解更多关于 URL 的信息：
// example:sharable-urls

// 想知道新的默认值是什么吗？

declare const trueInTS: boolean
declare const trueInJS: boolean
declare const monaco: any

const defaultCompilerOptions = {
  noImplicitAny: true,
  strictNullChecks: trueInTS,
  strictFunctionTypes: true,
  strictPropertyInitialization: true,
  strictBindCallApply: true,
  noImplicitThis: true,
  noImplicitReturns: true,

  alwaysStrict: true,
  allowUnreachableCode: false,
  allowUnusedLabels: false,

  downlevelIteration: false,
  noEmitHelpers: false,
  noLib: false,
  noStrictGenericChecks: false,
  noUnusedLocals: false,
  noUnusedParameters: false,

  esModuleInterop: true,
  preserveConstEnums: false,
  removeComments: false,
  skipLibCheck: false,

  checkJs: trueInJS,
  allowJs: trueInJS,

  experimentalDecorators: false,
  emitDecoratorMetadata: false,

  target: monaco.languages.typescript.ScriptTarget.ES2017,
  jsx: monaco.languages.typescript.JsxEmit.None,
}
