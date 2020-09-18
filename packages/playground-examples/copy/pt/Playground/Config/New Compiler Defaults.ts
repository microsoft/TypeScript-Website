//// { order: 1 }

// Sim, nós sabemos, os padrões para o tsconfig do TypeScript não
// tem strict ativado. Entretanto, em toda chance que temos o
// time recomenda que os usuários tentem migrar para ter o modo
// strict ativado nas suas configurações.

// Porém, para o playground, felizmente podemos estabelecer os
// padrões como strict. O playground também vai manter um 
// acompanhamento das flags do compilador que mudaram dos padrões
// do playground e fazer elas serem compartilháveis na URL.

// Você pode ler mais sobre as URLs em:
// exemplo:urls-compartilháveis

// Se perguntando quais são os novos padrões?

declare const trueInTS: boolean;
declare const trueInJS: boolean;
declare const monaco: any;

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
};
