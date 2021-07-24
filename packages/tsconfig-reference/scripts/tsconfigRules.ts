import { CompilerOptionName } from "../data/_types";
import * as ts from "typescript";

/**
 * Changes to these rules should be reflected in the following files:
 * https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/tsconfig.json
 * https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/jsconfig.json
 */

/** Options which should never show on the references, basically anything that's for the CLI not the TSConfig */
export const denyList: CompilerOptionName[] = [
  "help",
  "init",
  "all",
  "watch",
  "version",
  "build",
  "project",
  "locale",
  "clean",
  "dry",
  "enableAutoDiscovery",
];

/** Things we should document, but really want to help move people away from */
export const deprecated: CompilerOptionName[] = [
  "out",
  "charset",
  "keyofStringsOnly",
  "diagnostics",
];

/** Things which people really shouldn't use, but need to document  */
export const internal: CompilerOptionName[] = ["preserveWatchOutput", "stripInternal"];

// @ts-ignore
// prettier-ignore
export const typeAcquisitionCompilerOptNames: string[] = ts.typeAcquisitionDeclarations.map((c) => c.name);

// @ts-ignore
export const watchOptionCompilerOptNames: string[] = ts.optionsForWatch.map((c) => c.name);

// @ts-ignore
const common = ts.commonOptionsWithBuild;
// @ts-ignore
export const buildOptionCompilerOptNames: string[] = ts.buildOpts
  .filter((c) => !common.includes(c))
  .map((c) => c.name);

export const rootOptNames = ["files", "extends", "include", "exclude", "references"];

/** You should use this! They are off by default */
export const recommended: CompilerOptionName[] = [
  "strict",
  "forceConsistentCasingInFileNames",
  "alwaysStrict",
  "strictNullChecks",
  "strictBindCallApply",
  "strictFunctionTypes",
  "strictPropertyInitialization",
  "noImplicitThis",
  "noImplicitAny",
  "esModuleInterop",
  "skipLibCheck",
  "exactOptionalPropertyTypes",
];

type RootProperties = "files" | "extends" | "include" | "exclude";
type WatchProperties =
  | "force"
  | "watchFile"
  | "watchDirectory"
  | "fallbackPolling"
  | "synchronousWatchDirectory"
  | "excludeFiles"
  | "excludeDirectories";
type BuildProperties =
  | "dry"
  | "force"
  | "verbose"
  | "incremental"
  | "assumeChangesOnlyAffectDirectDependencies"
  | "traceResolution";

type AnOption = WatchProperties | RootProperties | CompilerOptionName;

/** Allows linking between options */
export const relatedTo: [AnOption, AnOption[]][] = [
  [
    "strict",
    [
      "alwaysStrict",
      "strictNullChecks",
      "strictBindCallApply",
      "strictFunctionTypes",
      "strictPropertyInitialization",
      "noImplicitAny",
      "noImplicitThis",
      "useUnknownInCatchVariables",
    ],
  ],
  ["alwaysStrict", ["strict"]],
  ["strictNullChecks", ["strict"]],
  ["strictBindCallApply", ["strict"]],
  ["strictFunctionTypes", ["strict"]],
  ["strictPropertyInitialization", ["strict"]],
  ["noImplicitAny", ["strict"]],
  ["noImplicitThis", ["strict"]],
  ["useUnknownInCatchVariables", ["strict"]],

  ["allowSyntheticDefaultImports", ["esModuleInterop"]],
  ["esModuleInterop", ["allowSyntheticDefaultImports"]],

  ["out", ["outDir", "outFile"]],
  ["outDir", ["out", "outFile"]],
  ["outFile", ["out", "outDir"]],

  ["diagnostics", ["extendedDiagnostics"]],
  ["extendedDiagnostics", ["diagnostics"]],

  ["experimentalDecorators", ["emitDecoratorMetadata"]],
  ["emitDecoratorMetadata", ["experimentalDecorators"]],

  ["files", ["include", "exclude"]],
  ["include", ["files", "exclude"]],
  ["exclude", ["include", "files"]],

  ["importHelpers", ["noEmitHelpers", "downlevelIteration"]],
  ["noEmitHelpers", ["importHelpers"]],
  ["downlevelIteration", ["importHelpers"]],

  ["incremental", ["composite", "tsBuildInfoFile"]],
  ["composite", ["incremental", "tsBuildInfoFile"]],
  ["tsBuildInfoFile", ["incremental", "composite"]],

  ["types", ["typeRoots"]],
  ["typeRoots", ["types"]],

  ["noLib", ["lib"]],
  ["lib", ["noLib"]],

  ["allowJs", ["checkJs", "emitDeclarationOnly"]],
  ["checkJs", ["allowJs", "emitDeclarationOnly"]],
  ["declaration", ["declarationDir", "emitDeclarationOnly"]],
  ["declarationDir", ["declaration"]],
  ["emitDeclarationOnly", ["declaration"]],

  ["moduleResolution", ["module"]],
  ["module", ["moduleResolution"]],

  ["jsx", ["jsxFactory", "jsxFragmentFactory", "jsxImportSource"]],
  ["jsxFactory", ["jsx", "jsxFragmentFactory", "jsxImportSource"]],
  ["jsxFragmentFactory", ["jsx", "jsxFactory", "jsxImportSource"]],
  ["jsxImportSource", ["jsx", "jsxFactory"]],

  ["suppressImplicitAnyIndexErrors", ["noImplicitAny"]],

  ["listFiles", ["explainFiles"]],
];

/**
 * Options are taken from the compiler flags markdown docs...
 * So err, they are like 90% reliable.
 */

export const defaultsForOptions = {
  allowJs: "false",
  allowSyntheticDefaultImports: 'module === "system" or esModuleInterop',
  allowUmdGlobalAccess: "false",
  allowUnreachableCode: "undefined",
  allowUnusedLabels: "undefined",
  charset: "utf8",
  checkJs: "false",
  composite: "false",
  alwaysStrict: "`false`, unless `strict` is set",
  declaration: "`false`, unless `composite` is set",
  declarationDir: " n/a",
  declarationMap: "false",
  diagnostics: "false",
  disableSizeLimit: "false",
  downlevelIteration: "false",
  emitBOM: "false",
  emitDeclarationOnly: "false",
  esModuleInterop: "false",
  exclude:
    '`["node_modules", "bower_components", "jspm_packages"]`, plus the value of `outDir` if one is specified.',
  extendedDiagnostics: "false",
  forceConsistentCasingInFileNames: "false",
  generateCpuProfile: " profile.cpuprofile",
  importHelpers: "false",
  include: ' `[]` if `files` is specified, otherwise `["**/*"]`',
  incremental: "`true` if `composite`, `false` otherwise",
  inlineSourceMap: "false",
  inlineSources: "false",
  isolatedModules: "false",
  jsx: "undefined",
  jsxFactory: "`React.createElement`",
  jsxImportSource: "react",
  keyofStringsOnly: "false",
  listEmittedFiles: "false",
  listFiles: "false",
  locale: "Platform specific",
  maxNodeModuleJsDepth: "0",
  moduleResolution:
    "module === `AMD` or `UMD` or `System` or `ES6`, then `Classic`<br/><br/>Otherwise `Node`",
  newLine: "Platform specific",
  noEmit: "false",
  noEmitHelpers: "false",
  noEmitOnError: "false",
  noErrorTruncation: "false",
  noFallthroughCasesInSwitch: "false",
  noImplicitAny: "`false`, unless `strict` is set",
  noImplicitReturns: "false",
  noImplicitThis: "`false`, unless `strict` is set",
  noImplicitUseStrict: "false",
  noPropertyAccessFromIndexSignature: "false",
  noLib: "false",
  noResolve: "false",
  noStrictGenericChecks: "false",
  noUnusedLocals: "false",
  noUnusedParameters: "false",
  out: "n/a",
  outDir: "n/a",
  outFile: "n/a",
  preserveConstEnums: "false",
  preserveSymlinks: "false",
  preserveWatchOutput: "false",
  pretty: "true",
  reactNamespace: '"React"',
  removeComments: "false",
  resolveJsonModule: "false",
  rootDir: "Computed from the list of input files",
  skipDefaultLibCheck: "false",
  skipLibCheck: "false",
  sourceMap: "false",
  strict: "false",
  strictBindCallApply: "`false`, unless `strict` is set",
  strictFunctionTypes: "`false`, unless `strict` is set",
  useUnknownInCatchVariables: "`false`, unless `strict` is set",
  strictPropertyInitialization: "`false`, unless `strict` is set",
  strictNullChecks: "`false`, unless `strict` is set",
  suppressExcessPropertyErrors: "false",
  suppressImplicitAnyIndexErrors: "false",
  target: "ES3",
  traceResolution: "false",
  tsBuildInfoFile: ".tsbuildinfo",
  useDefineForClassFields: "false",
};

export const allowedValues = {
  jsx: ["`react`", "`react-jsx`", "`react-jsxdev`", "`react-native`", "`preserve`"],
  jsxFactory: ["Any identifier or dotted identifier"],
  lib: ["See main content"],
  target: [
    "`ES3` (default)",
    "`ES5`",
    "`ES6`/`ES2015` (synonymous)",
    "`ES7`/`ES2016`",
    "`ES2017`",
    "`ES2018`",
    "`ES2019`",
    "`ES2020`",
    "`ESNext`",
  ],
  module: [
    "`CommonJS` (default if `target` is `ES3` or `ES5`)",
    "",
    "`ES6`",
    "`ES2015`",
    "`ES2020`",
    "",
    "`None`",
    "`UMD`",
    "`AMD`",
    "`System`",
    "`ESNext`",
  ],
  importsNotUsedAsValues: ["remove", "preserve", "error"],
  watchFile: [
    "fixedPollingInterval",
    "priorityPollingInterval",
    "dynamicPriorityPolling",
    "useFsEvents",
    "useFsEventsOnParentDirectory",
  ],
  fallbackPolling: ["fixedPollingInterval", "priorityPollingInterval", "dynamicPriorityPolling"],
  watchDirectory: ["fixedPollingInterval", "dynamicPriorityPolling", "useFsEvents"],
};

export const releaseToConfigsMap: { [key: string]: AnOption[] } = {
  "4.4": ["exactOptionalPropertyTypes", "useUnknownInCatchVariables"],
  "4.3": ["noImplicitOverride"],
  "4.2": ["noPropertyAccessFromIndexSignature", "explainFiles"],
  "4.1": ["jsxImportSource", "noUncheckedIndexedAccess", "disableFilenameBasedTypeAcquisition"],
  "4.0": ["jsxFragmentFactory", "disableReferencedProjectLoad"],
  "3.8": [
    "assumeChangesOnlyAffectDirectDependencies",
    "importsNotUsedAsValues",
    "disableSolutionSearching",
    "fallbackPolling",
    "watchDirectory",
    "watchFile",
  ],
  "3.7": [
    "disableSourceOfProjectReferenceRedirect",
    "generateCpuProfile",
    "useDefineForClassFields",
  ],
  "3.5": ["allowUmdGlobalAccess"],
  "3.4": ["incremental", "tsBuildInfoFile"],
  "3.2": ["strictBindCallApply", "showConfig"],
  "3.0": ["composite", "build"],
  "2.9": ["keyofStringsOnly", "declarationMap"],
  "2.8": ["emitDeclarationOnly"],
  "2.7": ["strictPropertyInitialization", "esModuleInterop"],
  "2.6": ["strictFunctionTypes"],
  "2.4": ["noStrictGenericChecks"],
  "2.3": ["strict", "downlevelIteration", "init", "checkJs"],
  "2.2": ["jsx"],
  "2.1": ["extends", "alwaysStrict"],
  "2.0": [
    "declarationDir",
    "skipLibCheck",
    "noUnusedLocals",
    "noUnusedParameters",
    "lib",
    "strictNullChecks",
    "noImplicitThis",
    "rootDirs",
    "traceResolution",
    "include",
  ],
  "1.8": [
    "allowJs",
    "allowSyntheticDefaultImports",
    "allowUnreachableCode",
    "allowUnusedLabels",
    "noImplicitReturns",
    "noFallthroughCasesInSwitch",
  ],
  "1.5": ["inlineSourceMap", "noEmitHelpers", "newLine", "inlineSources", "rootDir"],
  "1.4": ["noEmitOnError"],
  "1.0": ["declaration", "target", "module", "outFile"],
};

export const additionalOptionDescriptors: Record<string, { categoryCode: number }> = {
  plugins: {
    categoryCode: 6172,
  },
};

/** When a particular compiler flag (or CLI command...) was added  */
export const configToRelease = {};
Object.keys(releaseToConfigsMap).forEach((v) => {
  releaseToConfigsMap[v].forEach((key) => {
    configToRelease[key] = v;
  });
});
