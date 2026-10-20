import { type FileReference, type LineAndCharacter, type MappedDiagnosticDirective, type Node, type PathKey, type RootedFilePath, SpanMap, SyntaxKind } from "../../ast/index.ts";
import type { API as AsyncAPI } from "../async/api.ts";
import type { CachedSourceFile } from "../sourceFileCache.ts";
import type { API as SyncAPI } from "../sync/api.ts";
import type { TimingCollector } from "../timing.ts";
import { RemoteNode, RemoteNodeList } from "./node.generated.ts";
import { type SourceFileInfo, type TextDecoder } from "./node.infrastructure.ts";
export { RemoteNode, RemoteNodeList } from "./node.generated.ts";
export { readParseOptionsKey, readSourceFileHash, readSourceFileLease, readSourceFileNodeId, RemoteNodeBase } from "./node.infrastructure.ts";
export declare class RemoteSourceFile extends RemoteNode implements SourceFileInfo {
    readonly api: AsyncAPI<boolean> | SyncAPI<boolean> | undefined;
    symbolCache: CachedSourceFile<unknown> | undefined;
    readonly nodes: (RemoteNode | RemoteNodeList)[];
    readonly _offsetNodes: number;
    readonly _offsetStringTableOffsets: number;
    readonly _offsetStringTable: number;
    readonly _offsetExtendedData: number;
    readonly _offsetStructuredData: number;
    readonly _decoder: TextDecoder;
    readonly _timing: TimingCollector | undefined;
    private _lineStarts;
    private _cachedText;
    private _cachedReferencedFiles;
    private _cachedTypeReferenceDirectives;
    private _cachedLibReferenceDirectives;
    private _cachedImports;
    private _cachedModuleAugmentations;
    private _cachedAmbientModuleNames;
    private _cachedSpanMap;
    private _spanMapRead;
    private _cachedSupplementalSourceFileNames;
    private _cachedDiagnosticDirectives;
    private _diagnosticDirectivesRead;
    private _handleFileKey;
    constructor(data: Uint8Array, decoder: TextDecoder, timing?: TimingCollector, api?: AsyncAPI<boolean> | SyncAPI<boolean> | undefined);
    readFileReferences(structuredDataOffset: number): readonly FileReference[];
    readNodeIndexArray(structuredDataOffset: number): readonly Node[];
    readStringArray(structuredDataOffset: number): readonly string[];
    getOrCreateNodeAtIndex(index: number): Node;
    private get extendedDataOffset();
    private getFileName;
    private getPathKey;
    private readFileNameArray;
    get fileName(): RootedFilePath;
    get path(): PathKey;
    get languageVariant(): number;
    get scriptKind(): number;
    get referencedFiles(): readonly FileReference[];
    get typeReferenceDirectives(): readonly FileReference[];
    get libReferenceDirectives(): readonly FileReference[];
    get imports(): readonly Node[];
    get moduleAugmentations(): readonly Node[];
    get ambientModuleNames(): readonly string[];
    get externalModuleIndicator(): Node | true | undefined;
    get originalText(): string;
    get spanMap(): SpanMap | undefined;
    get supplementalSourceFileNames(): readonly RootedFilePath[] | undefined;
    get canonicalSourceFileName(): RootedFilePath | undefined;
    get contentMapper(): string | undefined;
    get virtualFileName(): RootedFilePath | undefined;
    get diagnosticDirectives(): readonly MappedDiagnosticDirective[] | undefined;
    get isDeclarationFile(): boolean;
    get text(): string;
    getLineStarts(): readonly number[];
    getLineAndCharacterOfPosition(position: number): LineAndCharacter;
    getPositionOfLineAndCharacter(line: number, character: number): number;
}
/**
 * Find a descendant node at a specific position with matching kind and end position.
 */
export declare function findDescendant(root: Node, pos: number, end: number, kind: SyntaxKind): Node | undefined;
/**
 * Parsed components of a node handle.
 */
export interface ParsedNodeHandle {
    index: number;
    kind: SyntaxKind;
    sourceFileId: string;
    path: PathKey;
}
/**
 * Parse a compiler-produced node handle into its components.
 * Handle format: "index.kind.#sourceFileId.path" where path may contain dots.
 */
export declare function parseNodeHandleFromCompiler(handle: string): ParsedNodeHandle;
/**
 * Decode binary-encoded AST data into a Node.
 * Works for any binary-encoded node, including synthetic nodes
 * (e.g. from typeToTypeNode) that don't have a source file.
 */
export declare function decodeNode(data: Uint8Array): Node;
/**
 * Get the unique ID string for a remote node.
 * Throws if the node is not a RemoteNode (i.e. not decoded from binary data).
 */
export declare function getNodeId(node: Node): string;
//# sourceMappingURL=node.d.ts.map