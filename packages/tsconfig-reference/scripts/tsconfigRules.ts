import { CompilerOptionName } from "../data/_types";

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
];

/** Things we should document, but really want to help move people away from */
export const deprecated: CompilerOptionName[] = [
  "out",
  "charset",
  "keyofStringsOnly",
  "noErrorTruncation",
  "diagnostics",
];

/** Things which people really shouldn't use, but need to document  */
export const internal: CompilerOptionName[] = ["preserveWatchOutput", "stripInternal"];

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
];

type RootProperties = "files" | "extends" | "include" | "exclude";
type WatchProperties = "watchFile" | "watchDirectory" | "fallbackPolling";

type AnOption = WatchProperties | RootProperties | CompilerOptionName;

/** Allows linking between options */
export const relatedTo: [AnOption, AnOption[]][] = [
  ["strict", ["alwaysStrict", "strictNullChecks", "strictBindCallApply", "strictFunctionTypes", "strictPropertyInitialization", "noImplicitAny", "noImplicitThis"]],
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

  ["importHelpers", ["noEmitHelpers", "downlevelIteration", "importHelpers"]],
  ["noEmitHelpers", ["importHelpers"]],

  ["incremental", ["composite", "tsBuildInfoFile"]],
  ["composite", ["incremental", "tsBuildInfoFile"]],

  ["types", ["typeRoots"]],
  ["typeRoots", ["types"]],
  ["declaration", ["emitDeclarationOnly"]],

  ["noLib", ["lib"]],

  ["allowJs", ["checkJs", "emitDeclarationOnly"]],
  ["checkJs", ["allowJs", "emitDeclarationOnly"]],
  ["declaration", ["declarationDir", "emitDeclarationOnly"]],

  ["moduleResolution", ["module"]],

  ["jsxFactory", ["jsxFragmentFactory"]],
  ["jsxFragmentFactory", ["jsxFactory"]],
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
  allowUnusedLabels: "false",
  alwaysStrict: "`false`, unless `strict` is set",
  charset: "utf8",
  checkJs: "false",
  composite: "true",
  declaration: "True when TS",
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
  includes: ' `[]` if `files` is specified, otherwise `["**/*"]`',
  incremental: "true",
  inlineSourceMap: "false",
  inlineSources: "false",
  isolatedModules: "false",
  jsxFactory: "`React.createElement`",
  keyofStringsOnly: "false",
  listEmittedFiles: "false",
  listFiles: "false",
  locale: "Platform specific",
  maxNodeModuleJsDepth: "0",
  moduleResolution:
    "module === `AMD`, `UMD`, `System` or `ES6` then `Classic`<br/><br/>Otherwise `Node`",
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
  strictPropertyInitialization: "`false`, unless `strict` is set",
  strictNullChecks: "`false`, unless `strict` is set",
  suppressExcessPropertyErrors: "false",
  suppressImplicitAnyIndexErrors: "false",
  target: "es5",
  traceResolution: "false",
  tsBuildInfoFile: ".tsbuildinfo",
  useDefineForClassFields: "false",
};

export const allowedValues = {
  jsx: ["`react` (default)", "`react-native`", "`preserve`"],
  jsxFactory: ["Any identifier or dotted identifier"],
  lib: ["See main content"],
  target: [
    "`ES3` (default)",
    "`ES5`",
    "`ES6`/`ES2015` (synonomous)",
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
    "`ES6`/`ES2015` (synonymous, default for `target` `ES6` and higher)",
    "",
    "`ES2020`",
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
  fallbackPolling: [
    "fixedPollingInterval",
    "dynamicPriorityPolling",
    "useFsEvents",
    "synchronousWatchDirectory",
  ],
  watchDirectory: ["fixedPollingInterval", "dynamicPriorityPolling", "useFsEvents"],
};

export const releaseToConfigsMap: { [key: string]: AnOption[] } = {
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
    "downlevelIteration",
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
  "2.3": ["strict", "downlevelIteration", "init"],
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
