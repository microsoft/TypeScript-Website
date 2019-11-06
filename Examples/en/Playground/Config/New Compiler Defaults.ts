//// { order: 1 }

// Yes, we know, the defaults for TypeScript's tsconfig do
// not have strict turned on. However, at every chance we
// can the team recommends that users try migrate towards
// having strict mode enabled in their configs.

// For the playground however, we can happily set the defaults
// to be strict. The playground will also keep track of the
// compiler flags which have changed from the playground's
// defaults and make them sharable in the URL.

// You can read more about the URLs in
// example:sharable-urls

// Wonder what the new defaults are?

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
