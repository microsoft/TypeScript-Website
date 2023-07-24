import ts from "typescript";

// These are all copy-pasta'd from the TS codebase

/** ES6 Map interface, only read methods included. */
export interface ReadonlyMap<T> {
  get(key: string): T | undefined;
  has(key: string): boolean;
  forEach(action: (value: T, key: string) => void): void;
  readonly size: number;
  keys(): Iterator<string>;
  values(): Iterator<T>;
  entries(): Iterator<[string, T]>;
}

/** ES6 Map interface. */
export interface Map<T> extends ReadonlyMap<T> {
  set(key: string, value: T): this;
  delete(key: string): boolean;
  clear(): void;
}

export interface DiagnosticMessage {
  key: string;
  category: ts.DiagnosticCategory;
  code: number;
  message: string;
  reportsUnnecessary?: {};
  /* @internal */
  elidedInCompatabilityPyramid?: boolean;
}

/* @internal */
export interface CommandLineOptionBase {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "list" | Map<number | string>; // a value of a primitive type, or an object literal mapping named values to actual values
  isFilePath?: boolean; // True if option value is a path or fileName
  shortName?: string; // A short mnemonic for convenience - for instance, 'h' can be used in place of 'help'
  description?: DiagnosticMessage; // The message describing what the command line switch does
  paramType?: DiagnosticMessage; // The name to be used for a non-boolean option's parameter
  isTSConfigOnly?: boolean; // True if option can only be specified via tsconfig.json file
  isCommandLineOnly?: boolean;
  showInSimplifiedHelpView?: boolean;
  category?: DiagnosticMessage;
  strictFlag?: true; // true if the option is one of the flag under strict
  affectsSourceFile?: true; // true if we should recreate SourceFiles after this option changes
  affectsModuleResolution?: true; // currently same effect as `affectsSourceFile`
  affectsBindDiagnostics?: true; // true if this affects binding (currently same effect as `affectsSourceFile`)
  affectsSemanticDiagnostics?: true; // true if option affects semantic diagnostics
  affectsEmit?: true; // true if the options affects emit
  transpileOptionValue?: boolean | undefined; // If set this means that the option should be set to this value when transpiling
}

/* @internal */
export interface CommandLineOptionOfPrimitiveType extends CommandLineOptionBase {
  type: "string" | "number" | "boolean";
}

/* @internal */
export interface CommandLineOptionOfCustomType extends CommandLineOptionBase {
  type: Map<number | string>; // an object literal mapping named values to actual values
}

/* @internal */
export interface TsConfigOnlyOption extends CommandLineOptionBase {
  type: "object";
  elementOptions?: Map<CommandLineOption>;
  extraKeyDiagnosticMessage?: DiagnosticMessage;
}

/* @internal */
export interface CommandLineOptionOfListType extends CommandLineOptionBase {
  type: "list";
  element: CommandLineOptionOfCustomType | CommandLineOptionOfPrimitiveType | TsConfigOnlyOption;
}

export type CommandLineOption =
  | CommandLineOptionOfCustomType
  | CommandLineOptionOfPrimitiveType
  | TsConfigOnlyOption
  | CommandLineOptionOfListType;
