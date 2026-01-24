import "typescript"

// These are all copy-pasted from https://github.com/microsoft/TypeScript/tree/be8678315541e814da14316848a9468e8f90ab11
declare module "typescript" {
  /** @internal */
  const optionDeclarations: CommandLineOption[]
  /** @internal */
  const optionsForWatch: CommandLineOption[]
  /** @internal */
  export const commonOptionsWithBuild: CommandLineOption[]
  /** @internal */
  export const buildOpts: CommandLineOption[]
  /** @internal */
  const typeAcquisitionDeclarations: CommandLineOption[]
  /** @internal */
  const defaultInitCompilerOptions: CompilerOptions
  /**
   * A map of lib names to lib files. This map is used both for parsing the "lib" command line
   * option as well as for resolving lib reference directives.
   *
   * @internal
   */
  export const libMap: Map<string, string>

  /** @internal */
  export interface OptionsNameMap {
    optionsNameMap: Map<string, CommandLineOption>
    shortOptionNames: Map<string, string>
  }

  // prettier-ignore
  /** @internal */
  export interface CommandLineOptionBase {
    name: string;
    type: "string" | "number" | "boolean" | "object" | "list" | "listOrElement" | Map<string, number | string>;    // a value of a primitive type, or an object literal mapping named values to actual values
    isFilePath?: boolean;                                   // True if option value is a path or fileName
    shortName?: string;                                     // A short mnemonic for convenience - for instance, 'h' can be used in place of 'help'
    description?: DiagnosticMessage;                        // The message describing what the command line switch does.
    defaultValueDescription?: string | number | boolean | DiagnosticMessage | undefined;   // The message describing what the dafault value is. string type is prepared for fixed chosen like "false" which do not need I18n.
    paramType?: DiagnosticMessage;                          // The name to be used for a non-boolean option's parameter
    isTSConfigOnly?: boolean;                               // True if option can only be specified via tsconfig.json file
    isCommandLineOnly?: boolean;
    showInSimplifiedHelpView?: boolean;
    category?: DiagnosticMessage;
    strictFlag?: true;                                      // true if the option is one of the flag under strict
    allowJsFlag?: true;
    affectsSourceFile?: true;                               // true if we should recreate SourceFiles after this option changes
    affectsModuleResolution?: true;                         // currently same effect as `affectsSourceFile`
    affectsBindDiagnostics?: true;                          // true if this affects binding (currently same effect as `affectsSourceFile`)
    affectsSemanticDiagnostics?: true;                      // true if option affects semantic diagnostics
    affectsEmit?: true;                                     // true if the options affects emit
    affectsProgramStructure?: true;                         // true if program should be reconstructed from root files if option changes and does not affect module resolution as affectsModuleResolution indirectly means program needs to reconstructed
    affectsDeclarationPath?: true;                          // true if the options affects declaration file path computed
    affectsBuildInfo?: true;                                // true if this options should be emitted in buildInfo
    transpileOptionValue?: boolean | undefined;             // If set this means that the option should be set to this value when transpiling
    extraValidation?: (value: CompilerOptionsValue) => [DiagnosticMessage, ...string[]] | undefined; // Additional validation to be performed for the value to be valid
    disallowNullOrUndefined?: true;                         // If set option does not allow setting null
    allowConfigDirTemplateSubstitution?: true;              // If set option allows substitution of `${configDir}` in the value
}

  /** @internal */
  export interface CommandLineOptionOfStringType extends CommandLineOptionBase {
    type: "string"
    defaultValueDescription?: string | undefined | DiagnosticMessage
  }

  /** @internal */
  export interface CommandLineOptionOfNumberType extends CommandLineOptionBase {
    type: "number"
    defaultValueDescription: number | undefined | DiagnosticMessage
  }

  /** @internal */
  export interface CommandLineOptionOfBooleanType extends CommandLineOptionBase {
    type: "boolean"
    defaultValueDescription: boolean | undefined | DiagnosticMessage
  }

  /** @internal */
  export interface CommandLineOptionOfCustomType extends CommandLineOptionBase {
    type: Map<string, number | string> // an object literal mapping named values to actual values
    defaultValueDescription: number | string | undefined | DiagnosticMessage
    deprecatedKeys?: Set<string>
  }

  /** @internal */
  export interface AlternateModeDiagnostics {
    diagnostic: DiagnosticMessage
    getOptionsNameMap: () => OptionsNameMap
  }

  /** @internal */
  export interface DidYouMeanOptionsDiagnostics {
    alternateMode?: AlternateModeDiagnostics
    optionDeclarations: CommandLineOption[]
    unknownOptionDiagnostic: DiagnosticMessage
    unknownDidYouMeanDiagnostic: DiagnosticMessage
  }

  /** @internal */
  export interface TsConfigOnlyOption extends CommandLineOptionBase {
    type: "object"
    elementOptions?: Map<string, CommandLineOption>
    extraKeyDiagnostics?: DidYouMeanOptionsDiagnostics
  }

  /** @internal */
  export interface CommandLineOptionOfListType extends CommandLineOptionBase {
    type: "list" | "listOrElement"
    element:
      | CommandLineOptionOfCustomType
      | CommandLineOptionOfStringType
      | CommandLineOptionOfNumberType
      | CommandLineOptionOfBooleanType
      | TsConfigOnlyOption
    listPreserveFalsyValues?: boolean
  }

  /** @internal */
  export type CommandLineOption =
    | CommandLineOptionOfCustomType
    | CommandLineOptionOfStringType
    | CommandLineOptionOfNumberType
    | CommandLineOptionOfBooleanType
    | TsConfigOnlyOption
    | CommandLineOptionOfListType
}
