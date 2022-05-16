import { CompilerOptionName } from "../data/_types";
import remark from "remark";
import remarkHTML from "remark-html";
import ts from "typescript";

export interface CommandLineOption {
  name: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "list"
    | Map<string, number | string>;
  defaultValueDescription?: string | number | boolean | ts.DiagnosticMessage;
  category?: ts.DiagnosticMessage;
  element: CommandLineOption;
}

declare module "typescript" {
  const optionDeclarations: CommandLineOption[];
  const optionsForWatch: CommandLineOption[];
  const typeAcquisitionDeclarations: CommandLineOption[];
}

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
  ["preserveValueImports", ["isolatedModules", "importsNotUsedAsValues"]]
];

/**
 * Options are taken from the compiler flags markdown docs...
 * So err, they are like 90% reliable.
 */

function trueIf(name: string) {
  return [
    `\`true\` if [\`${name}\`](#${name}),`,
    "`false` otherwise.",
  ];
}

export const defaultsForOptions = {
  ...Object.fromEntries(
    ts.optionDeclarations.map((option) => [
      option.name,
      typeof option.defaultValueDescription === "object"
        ? option.defaultValueDescription.message
        : formatDefaultValue(
            option.defaultValueDescription,
            option.type === "list" ? option.element.type : option.type
          ),
    ])
  ),
  allowSyntheticDefaultImports: [
    "`true` if [`module`](#module) is `system`, or [`esModuleInterop`](#esModuleInterop) and [`module`](#module) is not `es6`/`es2015` or `esnext`,",
    "`false` otherwise.",
  ],
  alwaysStrict: trueIf("strict"),
  declaration: trueIf("composite"),
  exclude: [
    "node_modules",
    "bower_components",
    "jspm_packages",
    "[`outDir`](#outDir)",
  ],
  include: ["`[]` if [`files`](#files) is specified,", "`**` otherwise."],
  incremental: trueIf("composite"),
  jsxFactory: "React.createElement",
  locale: "Platform specific.",
  module: [
    "`CommonJS` if [`target`](#target) is `ES3` or `ES5`,",
    "`ES6`/`ES2015` otherwise.",
  ],
  moduleResolution: [
    "`Classic` if [`module`](#module) is `AMD`, `UMD`, `System` or `ES6`/`ES2015`,",
    "Matches if [`module`](#module) is `node12` or `nodenext`,",
    "`Node` otherwise.",
  ],
  newLine: "Platform specific.",
  noImplicitAny: trueIf("strict"),
  noImplicitThis: trueIf("strict"),
  preserveConstEnums: trueIf("isolatedModules"),
  reactNamespace: "React",
  rootDir: "Computed from the list of input files.",
  rootDirs: "Computed from the list of input files.",
  strictBindCallApply: trueIf("strict"),
  strictFunctionTypes: trueIf("strict"),
  useUnknownInCatchVariables: trueIf("strict"),
  strictPropertyInitialization: trueIf("strict"),
  strictNullChecks: trueIf("strict"),
  target: "ES3",
  useDefineForClassFields: [
    "`true` if [`target`](#target) is `ES2022` or higher, including `ESNext`,",
    "`false` otherwise.",
  ],
};

function formatDefaultValue(
  defaultValue: CommandLineOption["defaultValueDescription"],
  type: CommandLineOption["type"]
) {
  if (defaultValue === undefined || typeof type !== "object")
    return defaultValue;
  // e.g. ScriptTarget.ES2015 -> "es6/es2015"
  const synonyms = [...type]
    .filter(([, value]) => value === defaultValue)
    .map(([name]) => name);
  return synonyms.length > 1
    ? synonyms.map((name) => `\`${name}\``).join("/")
    : synonyms[0];
}

export const allowedValues = {
  ...Object.fromEntries(
    [...ts.optionDeclarations, ...ts.optionsForWatch].map((option) => [
      option.name,
      formatAllowedValues(
        option.type === "list" ? option.element.type : option.type
      ),
    ])
  ),
  jsxFactory: ["Any identifier or dotted identifier."],
  lib: undefined,
};

function formatAllowedValues(type: CommandLineOption["type"]) {
  if (typeof type !== "object") return;
  // Group and format synonyms: `es6`/`es2015`
  const inverted: { [value: string]: string[] } = {};
  for (const [name, value] of type) {
    (inverted[value] ||= []).push(name);
  }
  return Object.values(inverted).map((synonyms) =>
    synonyms.length > 1
      ? synonyms.map((name) => `\`${name}\``).join("/")
      : synonyms[0]
  );
}

export const releaseToConfigsMap: { [key: string]: AnOption[] } = {
  "4.7": ["moduleDetection", "moduleSuffixes"],
  "4.5": ["preserveValueImports"],
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

export const parseMarkdown = (value: string | string[]) =>
  Array.isArray(value)
    ? `<ul>${value
        .map((element) => `<li>${parseMarkdown(element)}</li>`)
        .join("")}</ul>`
    : remark()
        .use(remarkHTML)
        .processSync(value !== undefined ? String(value).replace(/^[-.0-9_a-z]+$/i, "`$&`") : undefined);
