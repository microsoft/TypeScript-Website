import { Client, type ClientSocketOptions, type ClientSpawnOptions } from "#asyncClient";
import { CheckFlags } from "#enums/checkFlags";
import { CompletionItemKind } from "#enums/completionItemKind";
import { DiagnosticCategory } from "#enums/diagnosticCategory";
import { ElementFlags } from "#enums/elementFlags";
import { EmitOnly } from "#enums/emitOnly";
import { IndexKind } from "#enums/indexKind";
import { JsxEmit } from "#enums/jsxEmit";
import { ModuleKind } from "#enums/moduleKind";
import { ModuleResolutionKind } from "#enums/moduleResolutionKind";
import { NodeBuilderFlags } from "#enums/nodeBuilderFlags";
import { ObjectFlags } from "#enums/objectFlags";
import { SignatureFlags } from "#enums/signatureFlags";
import { SignatureKind } from "#enums/signatureKind";
import { SymbolFlags } from "#enums/symbolFlags";
import { TypeFlags } from "#enums/typeFlags";
import { TypeFormatFlags } from "#enums/typeFormatFlags";
import { TypePredicateKind } from "#enums/typePredicateKind";
import { type __String, type CallLikeExpression, type Declaration, type Expression, type FileReference, type Identifier, ModifierFlags, type NamedTupleMember, type Node, type ParameterDeclaration, type Path, type SourceFile, type StringLiteralLikeNode, type SyntaxKind, type TypeNode } from "../../ast/index.ts";
import type { APIOptions, // @sync:     SyncAPIOptions as APIOptions,
LSPConnectionOptions } from "../options.ts";
import type { APIFileChanges, CompilerOptions, CreateProgramOptions, Diagnostic, DocumentIdentifier, DocumentPosition, LSPUpdateSnapshotParams, PackageId, ParsedCommandLine, ProjectReference, ProjectResponse, ReadConfigFileResponse, ResolvedModule, ResolvedTypeReferenceDirective, SignaturePropertyMethod, SignatureResponse, SourceFileMetadata, SymbolPropertyMethod, SymbolResponse, SymbolsPropertyMethod, TextEdit, TypeAcquisition, TypePropertyMethod, TypeResponse, TypesPropertyMethod, UpdateSnapshotParams, UpdateSnapshotResponse } from "../proto.ts";
import { SourceFileCache } from "../sourceFileCache.ts";
import type { RequestTiming, TimingAccumulators, TimingInfo } from "../timing.ts";
import type { AssertsIdentifierTypePredicate, AssertsThisTypePredicate, BigIntLiteralType, BooleanLiteralType, CompletionEntry, CompletionInfo, CompletionOptions, ConditionalType, EmitOutput, EmitOutputFile, EmitResult, FormatDiagnosticsHost, FreshableType, GenericType, GetImportEditsForSymbolsOptions, IdentifierTypePredicate, ImportAdderAction as APIImportAdderAction, IndexedAccessType, IndexInfo, IndexType, InterfaceType, IntersectionType, IntrinsicType, JSDocTagInfo, LiteralType, NumberLiteralType, ObjectType, StringLiteralType, StringMappingType, StructuredType, SubstitutionType, TemplateLiteralType, ThisTypePredicate, TupleType, TupleTypeReference, Type, TypeParameter, TypePredicate, TypePredicateBase, TypeReference, UnionOrIntersectionType, UnionType } from "./types.ts";
export { formatDiagnostics, formatDiagnosticsWithColorAndContext } from "../diagnosticFormatter.ts";
export { documentURIToFileName, fileNameToDocumentURI } from "../path.ts";
export { CheckFlags, CompletionItemKind, DiagnosticCategory, ElementFlags, EmitOnly, IndexKind, JsxEmit, ModifierFlags, ModuleKind, ModuleResolutionKind, NodeBuilderFlags, ObjectFlags, SignatureFlags, SignatureKind, SymbolFlags, TypeFlags, TypeFormatFlags, TypePredicateKind };
export type { APIFileChanges, APIImportAdderAction as ImportAdderAction, APIOptions, AssertsIdentifierTypePredicate, AssertsThisTypePredicate, BigIntLiteralType, BooleanLiteralType, ClientSocketOptions, ClientSpawnOptions, CompilerOptions, CompletionEntry, CompletionInfo, CompletionOptions, ConditionalType, CreateProgramOptions, Diagnostic, DocumentIdentifier, DocumentPosition, EmitOutput, EmitOutputFile, EmitResult, FormatDiagnosticsHost, FreshableType, GenericType, GetImportEditsForSymbolsOptions, IdentifierTypePredicate, IndexedAccessType, IndexInfo, IndexType, InterfaceType, IntersectionType, IntrinsicType, JSDocTagInfo, LiteralType, LSPConnectionOptions, NumberLiteralType, ObjectType, PackageId, ParsedCommandLine, ProjectReference, ReadConfigFileResponse, RequestTiming, ResolvedModule, ResolvedTypeReferenceDirective, SourceFileMetadata, StringLiteralType, StringMappingType, StructuredType, SubstitutionType, TemplateLiteralType, TextEdit, ThisTypePredicate, TimingAccumulators, TimingInfo, TupleType, TupleTypeReference, Type, TypeAcquisition, TypeParameter, TypePredicate, TypePredicateBase, TypeReference, UnionOrIntersectionType, UnionType, };
export interface TranspileOptions {
    compilerOptions?: CompilerOptions;
    fileName?: string;
    reportDiagnostics?: boolean;
}
export interface TranspileOutput {
    outputText: string;
    diagnostics?: readonly Diagnostic[] | undefined;
    sourceMapText?: string | undefined;
}
export declare class API<FromLSP extends boolean = false> implements FormatDiagnosticsHost {
    private client;
    private sourceFileCache;
    private toPath;
    private currentDirectory;
    private getCanonicalFileNameWorker;
    private initialized;
    private initializing;
    private activeSnapshots;
    private latestSnapshot;
    readonly internal: InternalAPI;
    constructor(options?: APIOptions | LSPConnectionOptions);
    /**
     * Create an API instance from an existing LSP connection's API session.
     * Use this when connecting to an API pipe provided by an LSP server via custom/initializeAPISession.
     */
    static fromLSPConnection(options: LSPConnectionOptions): Promise<API<true>>;
    batchContext(): {
        [globalThis.Symbol.dispose](): void;
    };
    private ensureInitialized;
    private initializeWorker;
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    getNewLine(): string;
    parseConfigFile(file: DocumentIdentifier): Promise<ParsedCommandLine>;
    parseCommandLine(commandLine: readonly string[]): Promise<ParsedCommandLine>;
    readConfigFile(file: DocumentIdentifier): Promise<ReadConfigFileResponse>;
    parseJsonConfigFileContent(json: any, options: {
        configDirectory: string;
        configFileName?: never;
    } | {
        configFileName: DocumentIdentifier;
        configDirectory?: never;
    }): Promise<ParsedCommandLine>;
    transpileModule(input: string, options?: TranspileOptions): Promise<TranspileOutput>;
    transpileModuleFromFile(file: DocumentIdentifier, options?: TranspileOptions): Promise<TranspileOutput>;
    transpileDeclaration(input: string, options?: TranspileOptions): Promise<TranspileOutput>;
    transpileDeclarationFromFile(file: DocumentIdentifier, options?: TranspileOptions): Promise<TranspileOutput>;
    updateSnapshot(params?: FromLSP extends true ? LSPUpdateSnapshotParams : UpdateSnapshotParams): Promise<Snapshot>;
    /** @internal */
    updateSnapshotFrom(baseSnapshot: Snapshot, params?: UpdateSnapshotParams): Promise<Snapshot>;
    private updateSnapshotWorker;
    [globalThis.Symbol.asyncDispose](): Promise<void>;
    close(): Promise<void>;
    clearSourceFileCache(): void;
    runWithTemporaryFileUpdate(baseSnapshot: Snapshot, file: DocumentIdentifier, newText: string, cb: (newSnapshot: Snapshot) => void | Promise<void>): Promise<void>;
    /**
     * Returns a snapshot of collected timing information for requests made
     * through this API instance: client-measured round-trip latency and bytes
     * transferred, folded together with the server's own per-request processing
     * time and an estimated transport overhead (round-trip minus server time).
     *
     * Fetching the snapshot issues a lightweight request to the server to
     * retrieve its timing collection. Collection must be enabled via the
     * `collectTiming` option; when it is not, the returned snapshot has
     * `enabled: false` and zeroed totals.
     */
    getTimingInfo(): Promise<TimingInfo>;
    /** Clears all accumulated timing totals and recent-request history, on both the client and the server. */
    resetTimingInfo(): Promise<void>;
    private isProgramActive;
    /**
     * Creates a program from current filesystem state, or derives one from oldProgram after applying fileChanges.
     */
    createProgram(rootFiles: readonly DocumentIdentifier[], createProgramOptions: CreateProgramOptions, oldProgram?: Program, fileChanges?: APIFileChanges): Promise<Program>;
}
type EnsureInitialized = () => Promise<void>;
interface SnapshotOwner extends FormatDiagnosticsHost {
    updateSnapshotFrom(baseSnapshot: Snapshot, params?: UpdateSnapshotParams): Promise<Snapshot>;
}
export declare class InternalAPI {
    private client;
    private ensureInitialized;
    /** @internal */
    constructor(client: Client, ensureInitialized: EnsureInitialized);
    startCPUProfile(dir: string): Promise<void>;
    stopCPUProfile(): Promise<string>;
    saveHeapProfile(dir: string): Promise<string>;
}
export declare class Snapshot {
    readonly id: number;
    private projectMap;
    private toPath;
    private client;
    private disposed;
    private disposePromise;
    private onDispose;
    private api;
    private snapshotRegistry;
    readonly internal: SnapshotInternalAPI;
    constructor(data: UpdateSnapshotResponse, client: Client, sourceFileCache: SourceFileCache, toPath: (fileName: string) => Path, api: SnapshotOwner, onDispose: () => void);
    getProjects(): readonly Project[];
    getProject(configFileName: string): Project | undefined;
    getDefaultProjectForFile(file: DocumentIdentifier): Promise<Project | undefined>;
    /**
     * Creates the next snapshot, layering its filesystem over this snapshot's
     * filesystem. This snapshot must still be active and be the latest snapshot.
     */
    update(params?: UpdateSnapshotParams): Promise<Snapshot>;
    [globalThis.Symbol.dispose](): void;
    dispose(): Promise<void>;
    private disposeWorker;
    isDisposed(): boolean;
    private ensureNotDisposed;
}
declare class SnapshotObjectRegistry {
    private readonly symbols;
    private readonly client;
    private readonly snapshotId;
    private readonly resolveProject;
    constructor(client: Client, snapshotId: number, resolveProject: (projectId: Path) => Project | undefined);
    /** Resolve a project id (a config file path) to its Project within this snapshot. */
    getProject(projectId: Path): Project | undefined;
    getOrCreateSymbol(data: SymbolResponse): Symbol;
    getSymbol(id: number): Symbol | undefined;
    clear(): void;
    fetchSymbol(source: Symbol | Signature | Type, method: SymbolPropertyMethod, handle: number | undefined, projectId: Path): Promise<Symbol>;
    fetchSymbols(source: Symbol | Signature | Type, method: SymbolsPropertyMethod, handles: readonly number[] | undefined, projectId: Path): Promise<readonly Symbol[]>;
}
declare class ProjectObjectRegistry {
    private client;
    private snapshotId;
    private project;
    private snapshotRegistry;
    private types;
    private signatures;
    constructor(client: Client, snapshotId: number, project: Project, snapshotRegistry: SnapshotObjectRegistry);
    getOrCreateSymbol(data: SymbolResponse): Symbol;
    getSymbol(id: number): Symbol | undefined;
    getOrCreateType(data: TypeResponse): TypeObject;
    getType(id: number): TypeObject | undefined;
    createNodeHandle<T extends Node>(handle: string): NodeHandle<T>;
    getOrCreateSignature(data: SignatureResponse): Signature;
    getSignature(id: number): Signature | undefined;
    clear(): void;
    fetchOptionalType<T extends Type>(source: Symbol | Signature | Type, method: TypePropertyMethod, handle: number | false | undefined): Promise<T | undefined>;
    fetchType<T extends Type>(source: Symbol | Signature | Type, method: TypePropertyMethod, handle: number | false | undefined): Promise<T>;
    fetchSymbol(source: Symbol | Signature | Type, method: SymbolPropertyMethod, handle: number | undefined): Promise<Symbol>;
    fetchSignature(source: Symbol | Signature | Type, method: SignaturePropertyMethod, handle: number | undefined): Promise<Signature>;
    fetchTypes(source: Symbol | Signature | Type, method: TypesPropertyMethod, handles?: readonly number[]): Promise<readonly Type[]>;
    fetchSymbols(source: Symbol | Signature | Type, method: SymbolsPropertyMethod, handles?: readonly number[]): Promise<readonly Symbol[]>;
    fetchBaseTypes(source: Type): Promise<readonly Type[]>;
    fetchPropertiesOfType(source: Type): Promise<readonly Symbol[]>;
    fetchApparentPropertiesOfType(source: Type): Promise<readonly Symbol[]>;
    fetchPropertyOfType(source: Type, name: string): Promise<Symbol | undefined>;
    fetchSignaturesOfType(source: Type, kind: SignatureKind): Promise<readonly Signature[]>;
    fetchIndexInfosOfType(source: Type): Promise<readonly IndexInfo[]>;
    fetchTypeParameterAtPosition(source: Signature, pos: number): Promise<Type>;
}
export declare class Project {
    readonly id: Path;
    readonly configFileName: string;
    readonly currentDirectory: string;
    readonly parsedCommandLine: ParsedCommandLine;
    /** @deprecated Use `parsedCommandLine.options`. */
    readonly compilerOptions: CompilerOptions;
    /** @deprecated Use `parsedCommandLine.fileNames`. */
    readonly rootFiles: readonly string[];
    readonly program: Program;
    readonly checker: Checker;
    readonly emitter: Emitter;
    readonly languageService: LanguageService;
    private client;
    private snapshotId;
    constructor(data: ProjectResponse, snapshotId: number, client: Client, sourceFileCache: SourceFileCache, toPath: (fileName: string) => Path, formatDiagnosticsHost: FormatDiagnosticsHost, snapshotRegistry: SnapshotObjectRegistry);
    /** @deprecated Use `languageService.getImportAdderEdits`. */
    getImportAdderEdits(file: DocumentIdentifier, actions: readonly APIImportAdderAction[]): Promise<readonly TextEdit[]>;
    /** @deprecated Use `languageService.getImportEditsForSymbols`. */
    getImportEditsForSymbols(file: DocumentIdentifier, symbols: readonly Symbol[], options?: GetImportEditsForSymbolsOptions): Promise<readonly TextEdit[]>;
    dispose(): void;
}
export declare class LanguageService {
    private snapshotId;
    private project;
    private client;
    private objectRegistry;
    constructor(snapshotId: number, project: Project, client: Client, objectRegistry: ProjectObjectRegistry);
    getImportAdderEdits(file: DocumentIdentifier, actions: readonly APIImportAdderAction[]): Promise<readonly TextEdit[]>;
    getImportEditsForSymbols(file: DocumentIdentifier, symbols: readonly Symbol[], options?: GetImportEditsForSymbolsOptions): Promise<readonly TextEdit[]>;
    getReferencedSymbolsForNode(node: Node, position: number): Promise<ReferencedSymbolEntry[]>;
    getSignatureUsage(signatureDecl: Node): Promise<SignatureUsage[]>;
    getCompletionsAtPosition(document: string, position: number, options?: CompletionOptions): Promise<CompletionInfo | undefined>;
}
export declare class Program implements FormatDiagnosticsHost {
    /** @internal */
    readonly snapshotId: number;
    private readonly project;
    private readonly client;
    private readonly sourceFileCache;
    private readonly toPath;
    private readonly formatDiagnosticsHost;
    private readonly decoder;
    private readonly sourceFileMetadataCache;
    private ownedSnapshot;
    private disposePromise;
    constructor(snapshotId: number, project: Project, client: Client, sourceFileCache: SourceFileCache, toPath: (fileName: string) => Path, formatDiagnosticsHost: FormatDiagnosticsHost);
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    getNewLine(): string;
    /** @internal */
    setOwnedSnapshot(snapshot: Snapshot): void;
    [globalThis.Symbol.dispose](): void;
    dispose(): Promise<void>;
    private disposeWorker;
    getCompilerOptions(): CompilerOptions;
    getSourceFile(file: DocumentIdentifier): Promise<SourceFile | undefined>;
    getResolvedModule(file: DocumentIdentifier, moduleName: string, mode: ModuleKind): Promise<ResolvedModule | undefined>;
    getResolvedModuleFromModuleSpecifier(moduleSpecifier: StringLiteralLikeNode, sourceFile?: DocumentIdentifier): Promise<ResolvedModule | undefined>;
    getResolvedTypeReferenceDirective(file: DocumentIdentifier, typeDirectiveName: string, mode: ModuleKind): Promise<ResolvedTypeReferenceDirective | undefined>;
    getResolvedTypeReferenceDirectiveFromTypeReferenceDirective(typeReferenceDirective: FileReference, sourceFile: DocumentIdentifier): Promise<ResolvedTypeReferenceDirective | undefined>;
    getSourceFileNames(): Promise<readonly string[]>;
    /**
     * Returns program-stored metadata for the given source file, or `undefined` if the file
     * is not part of the program. Metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    getSourceFileMetadata(file: DocumentIdentifier): Promise<SourceFileMetadata | undefined>;
    /**
     * Returns program-stored metadata for the source file at the given path, or `undefined`
     * if the file is not part of the program. Like {@link getSourceFileMetadata}, but skips
     * the file name to path conversion. Metadata is fetched lazily per file and cached on
     * this `Program` instance.
     */
    getSourceFileMetadataByPath(path: Path): Promise<SourceFileMetadata | undefined>;
    private fetchSourceFileMetadata;
    /**
     * Returns whether the given source file was loaded as part of an external library
     * (e.g. a dependency resolved from `node_modules`). The underlying program metadata is
     * fetched lazily per file and cached on this `Program` instance.
     */
    isSourceFileFromExternalLibrary(file: SourceFile): Promise<boolean>;
    /**
     * Returns whether the given source file is a default library file (e.g. `lib.d.ts`).
     * The underlying program metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    isSourceFileDefaultLibrary(file: SourceFile): Promise<boolean>;
    /**
     * Get all config source file names associated with this program's project config.
     * Includes the root config file and any extended config files.
     */
    getConfigFileNames(): Promise<readonly string[]>;
    /**
     * Get a config source file by file name/URI.
     * This can return the project's root tsconfig file or one of its extended config files.
     */
    getConfigSourceFile(file: DocumentIdentifier): Promise<SourceFile | undefined>;
    /**
     * Get syntactic (parse) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    getSyntacticDiagnostics(file?: DocumentIdentifier | readonly DocumentIdentifier[]): Promise<readonly Diagnostic[]>;
    /**
     * Get binder diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    getBindDiagnostics(file?: DocumentIdentifier | readonly DocumentIdentifier[]): Promise<readonly Diagnostic[]>;
    /**
     * Get semantic (type-check) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    getSemanticDiagnostics(file?: DocumentIdentifier | readonly DocumentIdentifier[]): Promise<readonly Diagnostic[]>;
    /**
     * Get suggestion diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    getSuggestionDiagnostics(file?: DocumentIdentifier | readonly DocumentIdentifier[]): Promise<readonly Diagnostic[]>;
    /**
     * Get declaration emit diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    getDeclarationDiagnostics(file?: DocumentIdentifier | readonly DocumentIdentifier[]): Promise<readonly Diagnostic[]>;
    /**
     * Get program-wide diagnostics for the project, including compiler options diagnostics.
     */
    getProgramDiagnostics(): Promise<readonly Diagnostic[]>;
    /**
     * Get global (non-file-specific) semantic diagnostics for the project.
     */
    getGlobalDiagnostics(): Promise<readonly Diagnostic[]>;
    /**
     * Get config file parsing diagnostics for the project.
     */
    getConfigFileParsingDiagnostics(): Promise<readonly Diagnostic[]>;
    /**
     * Emits files to the configured filesystem. Layer and host filesystems are
     * written through; full filesystems remain immutable and return emitted
     * files in {@link EmitResult.fileSystem}.
     */
    emit(emitOnly?: EmitOnly): Promise<EmitResult>;
    /**
     * Emits files and returns their contents without writing to the filesystem.
     */
    emitToString(emitOnly?: EmitOnly): Promise<EmitOutput>;
    /**
     * Gets JavaScript output for selected files regardless of project `noEmit`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    getJavaScriptEmit(files: readonly DocumentIdentifier[]): Promise<EmitOutput>;
    /**
     * Gets declaration output for selected files regardless of project `noEmit`, `declaration`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    getDeclarationEmit(files: readonly DocumentIdentifier[]): Promise<EmitOutput>;
    getProject(): Project;
}
export declare class Checker {
    private snapshotId;
    private project;
    private client;
    private objectRegistry;
    private wellKnownSymbols;
    private wellKnownSignatures;
    constructor(snapshotId: number, project: Project, client: Client, objectRegistry: ProjectObjectRegistry);
    dispose(): void;
    getSymbolAtLocation(node: Node): Promise<Symbol | undefined>;
    getSymbolAtLocation(nodes: readonly Node[]): Promise<(Symbol | undefined)[]>;
    getSymbolAtPosition(file: DocumentIdentifier, position: number): Promise<Symbol | undefined>;
    getSymbolAtPosition(file: DocumentIdentifier, positions: readonly number[]): Promise<(Symbol | undefined)[]>;
    getSymbolOfSourceFile(file: DocumentIdentifier): Promise<Symbol | undefined>;
    getSymbolOfSourceFile(files: readonly DocumentIdentifier[]): Promise<(Symbol | undefined)[]>;
    /**
     * Get the type of a symbol. Always returns a type; for symbols whose type
     * cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    getTypeOfSymbol(symbol: Symbol): Promise<Type>;
    getTypeOfSymbol(symbols: readonly Symbol[]): Promise<Type[]>;
    /**
     * Get the declared type of a symbol. Always returns a type; for symbols whose
     * declared type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    getDeclaredTypeOfSymbol(symbol: Symbol): Promise<Type>;
    /**
     * Get the type of a symbol, excluding the missing type when
     * `exactOptionalPropertyTypes: true` is set; for symbols whose
     * type cannot be determined the checker yields the error type
     * (use {@link Type.isErrorType} to detect it).
     */
    getNonMissingTypeOfSymbol(symbol: Symbol): Promise<Type>;
    getReferencesToSymbolInFile(file: DocumentIdentifier, symbol: Symbol): Promise<NodeHandle[]>;
    /** @deprecated Use `project.languageService.getReferencedSymbolsForNode`. */
    getReferencedSymbolsForNode(node: Node, position: number): Promise<ReferencedSymbolEntry[]>;
    /** @deprecated Use `project.languageService.getSignatureUsage`. */
    getSignatureUsage(signatureDecl: Node): Promise<SignatureUsage[]>;
    /** @deprecated Use `project.languageService.getCompletionsAtPosition`. */
    getCompletionsAtPosition(document: string, position: number, options?: CompletionOptions): Promise<CompletionInfo | undefined>;
    /**
     * Get the type at a node location. Always returns a type; for nodes whose
     * type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    getTypeAtLocation(node: Node): Promise<Type>;
    getTypeAtLocation(nodes: readonly Node[]): Promise<Type[]>;
    getSignaturesOfType(type: Type, kind: SignatureKind): Promise<readonly Signature[]>;
    /**
     * Get the resolved signature of a call-like expression. Always returns a
     * signature; when a call cannot be resolved the checker yields the unknown
     * signature (use {@link Checker.isUnknownSignature} to detect it).
     */
    getResolvedSignature(node: Node): Promise<Signature>;
    getTypeAtPosition(file: DocumentIdentifier, position: number): Promise<Type | undefined>;
    getTypeAtPosition(file: DocumentIdentifier, positions: readonly number[]): Promise<(Type | undefined)[]>;
    resolveName(name: string, meaning: SymbolFlags, location?: Node | DocumentPosition, excludeGlobals?: boolean): Promise<Symbol | undefined>;
    /**
     * Returns all symbols with the given meaning that are visible at `location`.
     */
    getSymbolsInScope(location: Node | DocumentPosition, meaning: SymbolFlags): Promise<readonly Symbol[]>;
    getResolvedSymbol(node: Identifier): Promise<Symbol | undefined>;
    getContextualType(node: Expression): Promise<Type | undefined>;
    getContextualTypeForArgumentAtIndex(node: CallLikeExpression, argIndex: number): Promise<Type | undefined>;
    getAwaitedType(type: Type): Promise<Type | undefined>;
    /** Get the base type of a literal type (e.g. `number` for `42`). Always returns a type. */
    getBaseTypeOfLiteralType(type: Type): Promise<Type>;
    /** Get the type with `null` and `undefined` removed. Always returns a type. */
    getNonNullableType(type: Type): Promise<Type>;
    /**
     * Get the type for a type node. Always returns a type; for type nodes whose
     * type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    getTypeFromTypeNode(node: TypeNode): Promise<Type>;
    /** Get the widened type. Always returns a type. */
    getWidenedType(type: Type): Promise<Type>;
    /**
     * Get the type of the parameter at the given index in a signature. Always
     * returns a type; an out-of-range index yields the `any` type.
     */
    getParameterType(signature: Signature, index: number): Promise<Type>;
    isArrayLikeType(type: Type): Promise<boolean>;
    isTypeAssignableTo(source: Type, target: Type): Promise<boolean>;
    getShorthandAssignmentValueSymbol(node: Node): Promise<Symbol | undefined>;
    /**
     * Get the type of a symbol as narrowed at a specific location. Always returns
     * a type; for symbols whose type cannot be determined the checker yields the
     * error type (use {@link Type.isErrorType} to detect it).
     */
    getTypeOfSymbolAtLocation(symbol: Symbol, location: Node): Promise<Type>;
    private getIntrinsicType;
    getAnyType(): Promise<Type>;
    getStringType(): Promise<Type>;
    getNumberType(): Promise<Type>;
    getBooleanType(): Promise<Type>;
    getVoidType(): Promise<Type>;
    getUndefinedType(): Promise<Type>;
    getNullType(): Promise<Type>;
    getNeverType(): Promise<Type>;
    getUnknownType(): Promise<Type>;
    getBigIntType(): Promise<Type>;
    getESSymbolType(): Promise<Type>;
    getNonPrimitiveType(): Promise<Type>;
    typeToTypeNode(type: Type, enclosingDeclaration?: Node, flags?: number): Promise<TypeNode | undefined>;
    signatureToSignatureDeclaration(signature: Signature, kind: SyntaxKind, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): Promise<Node | undefined>;
    typeToString(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): Promise<string>;
    isContextSensitive(node: Node): Promise<boolean>;
    isArrayType(type: Type): Promise<boolean>;
    isTupleType(type: Type): Promise<boolean>;
    isTupleTypeTarget(type: Type): Promise<boolean>;
    /**
     * The following symbols are considered read-only:
     * - Properties with a `readonly` modifier
     * - Variables declared with `const`
     * - Get accessors without matching set accessors
     * - Enum members
     * - `Object.defineProperty` assignments with `writable: false` or no setter
     * - Unions and intersections of the above
     */
    isReadonlySymbol(symbol: Symbol): Promise<boolean>;
    /** Get the return type of a signature. Always returns a type. */
    getReturnTypeOfSignature(signature: Signature): Promise<Type>;
    /**
     * Get the rest type of a signature. Always returns a type; a signature with
     * no rest parameter yields the `any` type.
     */
    getRestTypeOfSignature(signature: Signature): Promise<Type>;
    getTypePredicateOfSignature(signature: Signature): Promise<TypePredicate | undefined>;
    /**
     * Get the base types of a class or interface type. A type with no base types
     * yields an empty array.
     */
    getBaseTypes(type: InterfaceType): Promise<readonly Type[]>;
    /** Get the apparent type of a type. Always returns a type. */
    getApparentType(type: Type): Promise<Type>;
    /** Get the reduced type of a type. Always returns a type. */
    getReducedType(type: Type): Promise<Type>;
    getPropertiesOfType(type: Type): Promise<readonly Symbol[]>;
    getIndexInfosOfType(type: Type): Promise<readonly IndexInfo[]>;
    getIndexInfoOfType(type: Type, kind: IndexKind): Promise<IndexInfo | undefined>;
    getIndexTypeOfType(type: Type, kind: IndexKind): Promise<Type | undefined>;
    getTypeOfPropertyOfType(type: Type, propertyName: string): Promise<Type | undefined>;
    /**
     * Get the constraint of a type parameter (the `T` in `<U extends T>`), or
     * undefined if it has none.
     */
    getConstraintOfTypeParameter(type: TypeParameter): Promise<Type | undefined>;
    getDefaultFromTypeParameter(type: TypeParameter): Promise<Type | undefined>;
    getBaseConstraintOfType(type: Type): Promise<Type | undefined>;
    getPropertyOfType(type: Type, name: string): Promise<Symbol | undefined>;
    getConstantValue(node: Node): Promise<string | number | undefined>;
    /** Get the signature of a function-like declaration. Always returns a signature. */
    getSignatureFromDeclaration(node: Node): Promise<Signature>;
    getExportSpecifierLocalTargetSymbol(node: Node): Promise<Symbol | undefined>;
    /**
     * Follow all aliases to get the original symbol. Always returns a symbol; for
     * an unresolved alias the checker yields the unknown symbol (use
     * {@link Checker.isUnknownSymbol} to detect it).
     */
    getAliasedSymbol(symbol: Symbol): Promise<Symbol>;
    /**
     * Get the fully qualified name of a symbol, walking up its parent chain
     * (e.g. `"/path/to/module".Namespace.Name`).
     */
    getFullyQualifiedName(symbol: Symbol): Promise<string>;
    getImmediateAliasedSymbol(symbol: Symbol): Promise<Symbol | undefined>;
    /**
     * Get the target symbol if instantiated, or the provided symbol otherwise.
     */
    getTargetSymbol(symbol: Symbol): Promise<Symbol>;
    getExportSymbolOfSymbol(symbol: Symbol): Promise<Symbol>;
    /**
     * Fetch (once, then cache) the handle ids of the per-checker singleton
     * symbols (unknown, undefined, arguments). These ids are stable for the life
     * of the project's checker, so identity checks against them are local after
     * the first call.
     */
    private getWellKnownSymbols;
    /**
     * Returns `true` if the symbol is the checker's "unknown" symbol (e.g. the
     * result of {@link Checker.getAliasedSymbol} on an unresolved alias).
     */
    isUnknownSymbol(symbol: Symbol): Promise<boolean>;
    /**
     * Returns `true` if the symbol is the checker's "undefined" symbol.
     */
    isUndefinedSymbol(symbol: Symbol): Promise<boolean>;
    /**
     * Returns `true` if the symbol is the checker's "arguments" symbol.
     */
    isArgumentsSymbol(symbol: Symbol): Promise<boolean>;
    /**
     * Fetch (once, then cache) the handle id of the per-checker unknown
     * signature. This id is stable for the life of the project's checker, so
     * identity checks against it are local after the first call.
     */
    private getWellKnownSignatures;
    /**
     * Returns `true` if the signature is the checker's "unknown" signature (e.g.
     * the result of {@link Checker.getResolvedSignature} on a call that cannot be
     * resolved).
     */
    isUnknownSignature(signature: Signature): Promise<boolean>;
    getExportsOfModule(symbol: Symbol): Promise<readonly Symbol[]>;
    getMemberInModuleExports(symbol: Symbol, name: string): Promise<Symbol | undefined>;
    getJsDocTagsOfSymbol(symbol: Symbol): Promise<readonly JSDocTagInfo[]>;
    getDocumentationCommentOfSymbol(symbol: Symbol): Promise<string>;
    /**
     * Get the type arguments of a type reference (e.g. the `string` in `Array<string>`).
     */
    getTypeArguments(type: TypeReference): Promise<readonly Type[]>;
}
export interface PrintNodeOptions {
    preserveSourceNewlines?: boolean | undefined;
    neverAsciiEscape?: boolean | undefined;
    terminateUnterminatedLiterals?: boolean | undefined;
}
export declare class Emitter {
    private client;
    constructor(client: Client);
    printNode(node: Node, options?: PrintNodeOptions): Promise<string>;
}
export declare class SnapshotInternalAPI {
    private snapshotId;
    private client;
    constructor(snapshotId: number, client: Client);
    /**
     * Format a synthesized node with the correct indentation for insertion at a
     * specific position in an existing source file.
     *
     * @param node The synthesized AST node to format.
     * @param file The target file where the node will be inserted.
     * @param position The UTF-16 code-unit offset in the target file for insertion.
     * @returns The formatted text of the node, indented for the insertion position.
     */
    formatNodeForInsertion(node: Node, file: DocumentIdentifier, position: number): Promise<string>;
}
export declare class NodeHandle<out T extends Node = Node> {
    /**
     * The project this handle was produced in, used as the default for {@link resolve}.
     * Node handles are only meaningful within a project's program, so the producing project
     * is remembered so callers don't have to pass it explicitly.
     */
    private readonly canonicalProject;
    readonly index: number;
    readonly kind: SyntaxKind;
    readonly path: Path;
    constructor(handle: string, canonicalProject: Project);
    /**
     * Resolve this handle to the actual AST node by fetching the source file from a project
     * and looking up the node by index. If no project is passed, the project that produced
     * the handle is used.
     */
    resolve(project?: Project): Promise<T | undefined>;
}
/** A symbol definition paired with all of its reference nodes. */
export interface ReferencedSymbolEntry {
    /** The node handle for the symbol's definition. */
    definition: NodeHandle;
    /** The resolved symbol for the definition, if available. */
    symbol?: Symbol | undefined;
    /** The node handles for each reference to the symbol. */
    references: NodeHandle[];
}
/** A single usage of a signature, pairing the reference name with its call expression (if any). */
export interface SignatureUsage {
    /** The node handle for the name reference. */
    name: NodeHandle;
    /** The node handle for the call expression, if the reference is invoked. */
    call?: NodeHandle | undefined;
}
export declare class Symbol {
    private objectRegistry;
    /**
     * The project this symbol was first observed in, used as the default project for
     * lookups that need a project context (members/exports/parent). Symbols are shared
     * snapshot-wide, so these lookups can otherwise be ambiguous about which project to use.
     */
    private readonly canonicalProject;
    readonly id: number;
    /** The escaped (`__String`) name, used as the key in member/export tables. */
    readonly escapedName: __String;
    /** The display name (escaped underscores removed). */
    readonly name: string;
    readonly flags: SymbolFlags;
    readonly checkFlags: CheckFlags;
    readonly declarations: readonly NodeHandle<Declaration>[];
    readonly valueDeclaration: NodeHandle<Declaration> | undefined;
    private readonly parent;
    private readonly exportSymbol;
    private membersCache;
    private exportsCache;
    constructor(data: SymbolResponse, objectRegistry: SnapshotObjectRegistry);
    getParent(): Promise<Symbol | undefined>;
    /**
     * Get this symbol's members keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    getMembers(): Promise<ReadonlyMap<__String, Symbol>>;
    /**
     * Get this symbol's exports keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    getExports(): Promise<ReadonlyMap<__String, Symbol>>;
    private fetchSymbolTable;
    getExportSymbol(): Promise<Symbol>;
    getJsDocTags(checker: Checker): Promise<readonly JSDocTagInfo[]>;
    getDocumentationComment(checker: Checker): Promise<string>;
}
declare class TypeObject implements Type {
    private objectRegistry;
    readonly id: number;
    readonly flags: TypeFlags;
    readonly objectFlags: ObjectFlags;
    readonly symbol: number;
    readonly value: string | number | boolean | bigint;
    readonly intrinsicName: string;
    readonly isThisType: boolean;
    readonly freshType: number;
    readonly regularType: number;
    readonly target: number;
    private readonly tupleType;
    readonly typeParameters: readonly number[];
    readonly outerTypeParameters: readonly number[];
    readonly localTypeParameters: readonly number[];
    readonly thisType: number;
    readonly aliasTypeArguments: readonly number[];
    readonly aliasSymbol: number;
    readonly elementFlags: readonly ElementFlags[];
    readonly fixedLength: number;
    readonly readonly: boolean;
    readonly labeledElementDeclarations?: readonly (NodeHandle<NamedTupleMember | ParameterDeclaration> | undefined)[];
    readonly texts: readonly string[];
    readonly objectType: number;
    readonly indexType: number;
    readonly checkType: number;
    readonly extendsType: number;
    readonly baseType: number;
    readonly substConstraint: number;
    private trueType;
    private falseType;
    private constraint;
    private default;
    private nonNullableType;
    private apparentType;
    private reducedType;
    private properties;
    private apparentProperties;
    private callSignatures;
    private constructSignatures;
    private indexInfos;
    private baseTypes;
    private stringIndexType;
    private numberIndexType;
    constructor(data: TypeResponse, objectRegistry: ProjectObjectRegistry);
    getSymbol(): Promise<Symbol | undefined>;
    getProperties(): Promise<readonly Symbol[]>;
    getProperty(propertyName: string): Promise<Symbol | undefined>;
    getApparentProperties(): Promise<readonly Symbol[]>;
    getCallSignatures(): Promise<readonly Signature[]>;
    getConstructSignatures(): Promise<readonly Signature[]>;
    getNonNullableType(): Promise<Type>;
    getStringIndexType(): Promise<Type | undefined>;
    private getStringIndexTypeWorker;
    getNumberIndexType(): Promise<Type | undefined>;
    private getNumberIndexTypeWorker;
    getApparentType(): Promise<Type>;
    getReducedType(): Promise<Type>;
    getIndexInfos(): Promise<readonly IndexInfo[]>;
    getAliasSymbol(): Promise<Symbol | undefined>;
    getTarget(): Promise<Type>;
    getFreshType(): Promise<FreshableType | undefined>;
    getRegularType(): Promise<FreshableType | undefined>;
    getTypes(): Promise<readonly Type[] | undefined>;
    getTypeParameters(): Promise<readonly TypeParameter[]>;
    getOuterTypeParameters(): Promise<readonly TypeParameter[]>;
    getLocalTypeParameters(): Promise<readonly TypeParameter[]>;
    getThisType(): Promise<TypeParameter | undefined>;
    getAliasTypeArguments(): Promise<readonly Type[]>;
    getObjectType(): Promise<Type>;
    getIndexType(): Promise<Type>;
    getCheckType(): Promise<Type>;
    getExtendsType(): Promise<Type>;
    getBaseType(): Promise<Type>;
    getConstraint(): Promise<Type | undefined>;
    getDefault(): Promise<Type | undefined>;
    getTrueType(): Promise<Type>;
    getFalseType(): Promise<Type>;
    /**
     * Get the base types of this type. Returns `undefined` for any type that is
     * not a class or interface.
     */
    getBaseTypes(): Promise<readonly Type[] | undefined>;
    isClassOrInterface(): this is InterfaceType;
    isUnionType(): this is UnionType;
    isIntersectionType(): this is IntersectionType;
    isObjectType(): this is ObjectType;
    isIntrinsicType(): this is IntrinsicType;
    isErrorType(): boolean;
    isLiteralType(): this is LiteralType;
    isStringLiteralType(): this is StringLiteralType;
    isNumberLiteralType(): this is NumberLiteralType;
    isBigIntLiteralType(): this is BigIntLiteralType;
    isBooleanLiteralType(): this is BooleanLiteralType;
    isTypeReference(): this is TypeReference;
    isTupleType(): this is TupleTypeReference;
    isTupleTypeTarget(): this is TupleType;
    isIndexType(): this is IndexType;
    isIndexedAccessType(): this is IndexedAccessType;
    isConditionalType(): this is ConditionalType;
    isSubstitutionType(): this is SubstitutionType;
    isTemplateLiteralType(): this is TemplateLiteralType;
    isStringMappingType(): this is StringMappingType;
    isTypeParameter(): this is TypeParameter;
}
export declare function isUnionType(type: Type): type is UnionType;
export declare function isIntersectionType(type: Type): type is IntersectionType;
export declare function isObjectType(type: Type): type is ObjectType;
export declare function isClassOrInterfaceType(type: Type): type is InterfaceType;
export declare function isIntrinsicType(type: Type): type is IntrinsicType;
/**
 * Whether this is the error type — the placeholder the checker produces when a
 * type cannot be determined (e.g. an unresolved reference). It is an intrinsic
 * type named `"error"` (this covers both the singleton error type and the
 * per-alias error types manufactured for unresolved type alias references).
 */
export declare function isErrorType(type: Type): boolean;
export declare function isLiteralType(type: Type): type is LiteralType;
export declare function isStringLiteralType(type: Type): type is StringLiteralType;
export declare function isNumberLiteralType(type: Type): type is NumberLiteralType;
export declare function isBigIntLiteralType(type: Type): type is BigIntLiteralType;
export declare function isBooleanLiteralType(type: Type): type is BooleanLiteralType;
export declare function isTypeReference(type: Type): type is TypeReference;
export declare function isTupleType(type: Type): type is TupleTypeReference;
export declare function isTupleTypeTarget(type: Type): type is TupleType;
export declare function isIndexType(type: Type): type is IndexType;
export declare function isIndexedAccessType(type: Type): type is IndexedAccessType;
export declare function isConditionalType(type: Type): type is ConditionalType;
export declare function isSubstitutionType(type: Type): type is SubstitutionType;
export declare function isTemplateLiteralType(type: Type): type is TemplateLiteralType;
export declare function isStringMappingType(type: Type): type is StringMappingType;
export declare function isTypeParameter(type: Type): type is TypeParameter;
export declare class Signature {
    private flags;
    private objectRegistry;
    readonly id: number;
    readonly declaration?: NodeHandle<Declaration> | undefined;
    readonly typeParameters?: readonly number[] | undefined;
    readonly parameters: readonly number[];
    readonly thisParameter?: number | undefined;
    readonly target?: number | undefined;
    private returnType;
    constructor(data: SignatureResponse, project: Project, objectRegistry: ProjectObjectRegistry);
    getTypeParameters(): Promise<readonly TypeParameter[]>;
    getParameters(): Promise<readonly Symbol[]>;
    getThisParameter(): Promise<Symbol | undefined>;
    getTarget(): Promise<Signature | undefined>;
    getReturnType(): Promise<Type>;
    getTypeParameterAtPosition(pos: number): Promise<Type>;
    get hasRestParameter(): boolean;
    get isConstruct(): boolean;
    get isAbstract(): boolean;
}
//# sourceMappingURL=api.d.ts.map