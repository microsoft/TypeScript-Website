export interface Target {
  _declaration: Declaration;
  _comment: string;
  Project: Project;
}

export interface Project {
  _attributes: ProjectAttributes;
  PropertyGroup: PropertyGroup[];
  UsingTask: UsingTask[];
  ItemGroup: ProjectItemGroup;
  _comment: string[];
  Target: TargetElement[];
}

export interface ProjectItemGroup {
  ProjectCapability: ProjectCapability;
}

export interface ProjectCapability {
  _attributes: ProjectCapabilityAttributes;
}

export interface ProjectCapabilityAttributes {
  Include: string;
}

export interface PropertyGroup {
  TSCompilerOutputLogDirectory?: TscYieldDuringToolExecution[];
  TSDefaultOutputLog?: BuiltProjectOutputGroupDependsOn;
  TypeScriptProjectDir?: TscYieldDuringToolExecution;
  _comment?: string[] | string;
  TypeScriptTaskAssembly?: TscYieldDuringToolExecution;
  CompileTypeScriptDependsOn?: BuiltProjectOutputGroupDependsOn;
  CompileTypeScriptBeforeTargets?: BuiltProjectOutputGroupDependsOn;
  CompileTypeScriptAfterTargets?: BuiltProjectOutputGroupDependsOn;
  CompileDependsOn?: BuiltProjectOutputGroupDependsOn;
  PublishPipelineCollectFilesCore?: BuiltProjectOutputGroupDependsOn;
  CleanDependsOn?: BuiltProjectOutputGroupDependsOn;
  BuiltProjectOutputGroupDependsOn?: BuiltProjectOutputGroupDependsOn;
  GetCopyToOutputDirectoryItemsDependsOn?: BuiltProjectOutputGroupDependsOn;
  CfgPropertyPagesGuidsAddCSharp?: BuiltProjectOutputGroupDependsOn;
  CfgPropertyPagesGuidsAddVB?: BuiltProjectOutputGroupDependsOn;
  CfgPropertyPagesGuidsAddTypeScript?: BuiltProjectOutputGroupDependsOn;
  TypeScriptEnabled?: BuiltProjectOutputGroupDependsOn;
  TypeScriptCompileBlocked?: TscYieldDuringToolExecution;
  TypeScriptCompileOnSaveEnabled?: TscYieldDuringToolExecution[];
  JsxPreserve?: TscYieldDuringToolExecution[];
  GenerateDeclarationFiles?: TscYieldDuringToolExecution[];
  GenerateSourceMaps?: TscYieldDuringToolExecution[];
  TypeScriptConfigFileAdditionalFlags?: BuiltProjectOutputGroupDependsOn;
  EnableTSIncrementalMSBuild?: TscYieldDuringToolExecution[];
  _attributes?: TscYieldDuringToolExecutionAttributes;
  TypeScriptBuildConfigurations?: TscYieldDuringToolExecution[];
  TypeScriptToolsVersion?: TscYieldDuringToolExecution[];
  TSJavaScriptFile?: TscYieldDuringToolExecution[];
  TscToolPath?: BuiltProjectOutputGroupDependsOn;
  NodePath?: TscYieldDuringToolExecution[];
  TscYieldDuringToolExecution?: TscYieldDuringToolExecution;
}

export interface BuiltProjectOutputGroupDependsOn {
  _text: string;
}

export interface TscYieldDuringToolExecution {
  _text: string;
  _attributes?: TscYieldDuringToolExecutionAttributes;
}

export interface TscYieldDuringToolExecutionAttributes {
  Condition: string;
}

export interface TargetElement {
  _attributes: TargetAttributes;
  CheckFileSystemCaseSensitive?: CheckFileSystemCaseSensitive;
  FindConfigFiles?: FindConfigFiles;
  ItemGroup?: ItemGroupElement[] | PurpleItemGroup;
  GenerateOutputLogs?: GenerateOutputLogs;
  VsTsc?: VsTsc;
  _comment?: string[] | string;
  CreateProperty?: CreateProperty;
  AssignTargetPath?: AssignTargetPath;
  Message?: Message;
  ReadLinesFromFile?: ReadLinesFromFile;
  Delete?: Delete[];
}

export interface AssignTargetPath {
  _attributes: AssignTargetPathAttributes;
  Output: OutputElement;
}

export interface OutputElement {
  _attributes: PurpleAttributes;
}

export interface PurpleAttributes {
  TaskParameter: string;
  ItemName: string;
}

export interface AssignTargetPathAttributes {
  Files: string;
  RootFolder: string;
}

export interface CheckFileSystemCaseSensitive {
  _attributes: CheckFileSystemCaseSensitiveAttributes;
  Output: CheckFileSystemCaseSensitiveOutput;
}

export interface CheckFileSystemCaseSensitiveOutput {
  _attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  TaskParameter: string;
  PropertyName: string;
}

export interface CheckFileSystemCaseSensitiveAttributes {
  MSBuildThisFileFullPath: string;
}

export interface CreateProperty {
  _attributes: CreatePropertyAttributes;
  Output: CheckFileSystemCaseSensitiveOutput;
}

export interface CreatePropertyAttributes {
  Value: string;
}

export interface Delete {
  _attributes: DeleteAttributes;
}

export interface DeleteAttributes {
  Files: string;
  Condition: string;
}

export interface FindConfigFiles {
  _attributes: FindConfigFilesAttributes;
  Output: OutputElement;
}

export interface FindConfigFilesAttributes {
  ProjectDir: string;
  ContentFiles: string;
  IsFileSystemCaseSensitive: string;
}

export interface GenerateOutputLogs {
  _attributes: GenerateOutputLogsAttributes;
  Output: OutputElement;
}

export interface GenerateOutputLogsAttributes {
  ConfigFiles: string;
  IsFileSystemCaseSensitive: string;
  OutputLogDirectory: string;
}

export interface ItemGroupElement {
  emittedFiles?: EmittedFiles;
  GeneratedJavascript: GeneratedJavascript;
}

export interface GeneratedJavascript {
  _attributes: GeneratedJavascriptAttributes;
}

export interface GeneratedJavascriptAttributes {
  Remove?: string;
  Condition?: string;
  Include?: string;
  KeepDuplicates?: string;
}

export interface EmittedFiles {
  _attributes: EmittedFilesAttributes;
}

export interface EmittedFilesAttributes {
  Remove: string;
  Condition: string;
}

export interface PurpleItemGroup {
  ConfigFiles?: ConfigFiles;
  GeneratedJavascript?: GeneratedJavascript[];
  _comment?: string[];
  FilesForPackagingFromProject?: ProjectCapability;
  ContentWithTargetPath?: ProjectCapability;
  Content?: ProjectCapability;
  AllItemsFullPathWithTargetPath?: AllItemsFullPathWithTargetPath;
  _SourceItemsToCopyToOutputDirectoryAlways?: AllItemsFullPathWithTargetPath;
  _SourceItemsToCopyToOutputDirectory?: AllItemsFullPathWithTargetPath;
  TSOutputLogsToDelete?: AllItemsFullPathWithTargetPath;
  TSOutputLogsFromOtherBuilds?: TSOutputLogsFromOtherBuilds;
}

export interface AllItemsFullPathWithTargetPath {
  _attributes: AllItemsFullPathWithTargetPathAttributes;
}

export interface AllItemsFullPathWithTargetPathAttributes {
  Include: string;
  Condition?: string;
}

export interface ConfigFiles {
  _attributes: ConfigFilesAttributes;
}

export interface ConfigFilesAttributes {
  Include: string;
  KeepDuplicates: string;
}

export interface TSOutputLogsFromOtherBuilds {
  _attributes: TSOutputLogsFromOtherBuildsAttributes;
}

export interface TSOutputLogsFromOtherBuildsAttributes {
  Include: string;
  Exclude: string;
}

export interface Message {
  _attributes: MessageAttributes;
}

export interface MessageAttributes {
  Text: string;
}

export interface ReadLinesFromFile {
  _attributes: ReadLinesFromFileAttributes;
  Output: OutputElement;
}

export interface ReadLinesFromFileAttributes {
  File: string;
  Condition: string;
}

export interface VsTsc {
  _attributes: VsTscAttributes;
  Output?: OutputElement[] | OutputElement;
}

export interface VsTscAttributes {
  NodePath: string;
  ToolExe: string;
  IsFileSystemCaseSensitive: string;
  PreferredUILang: string;
  TSConfigFile?: string;
  AdditionalFlagsForInvocationWithConfigFile?: string;
  TSJavaScriptFile: string;
  YieldDuringToolExecution: string;
  ProjectDir: string;
  BuildMode: string;
  ToolsVersion: string;
  TypeScriptCompileBlocked: string;
  ComputeInputAndOutputOnly?: string;
  OutputLogFile?: string;
  OutputLogDirectory: string;
  Configurations?: string;
  FullPathsToFiles?: string;
  OutFile?: string;
  OutDir?: string;
  RootDir?: string;
  JsxPreserve?: string;
  GenerateDeclarationFiles?: string;
  GenerateSourceMaps?: string;
  Clean?: string;
}

export interface TargetAttributes {
  Name: string;
  Condition?: string;
  DependsOnTargets?: string;
  BeforeTargets?: string;
  AfterTargets?: string;
  Inputs?: string;
  Outputs?: string;
}

export interface UsingTask {
  _attributes: UsingTaskAttributes;
}

export interface UsingTaskAttributes {
  TaskName: string;
  AssemblyFile: string;
}

export interface ProjectAttributes {
  DefaultTargets: string;
  xmlns: string;
}

export interface Declaration {
  _attributes: DeclarationAttributes;
}

export interface DeclarationAttributes {
  version: string;
  encoding: string;
}
