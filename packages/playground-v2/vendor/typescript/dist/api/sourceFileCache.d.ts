import type { Path } from "../ast/index.ts";
import type { RemoteSourceFile } from "./node/node.ts";
import type { SnapshotChanges, SourceFileDescriptor } from "./proto.ts";
/**
 * A cached source file entry, identified by content hash.
 */
export interface CachedSourceFile<TSymbol> {
    /** The cached source file object, once its AST has been requested. */
    file?: RemoteSourceFile | undefined;
    /** Complete identity available before an AST response is materialized. */
    readonly descriptor: SourceFileDescriptor;
    /** Set of snapshot/project or direct-lease ref keys that reference this entry */
    refs: Set<string>;
    /** Binder symbols owned by this exact source-file incarnation. */
    readonly symbolsById: Map<number, TSymbol>;
    /** Successfully resolved declaration symbols. */
    readonly symbolsByDeclarationNodeIndex: Map<number, TSymbol>;
    /** In-flight async declaration symbol lookups. */
    readonly declarationSymbolRequests: Map<number, Promise<TSymbol>>;
}
/**
 * Client-side cache for source files keyed by (path, fileName, scriptKind, parseOptionsKey, contentHash).
 *
 * Supports multiple versions of the same file at the same path (e.g., from
 * different snapshots with different file contents). Each version is identified
 * by its script kind, content hash, and parse options key.
 *
 * Entries are ref-counted by (snapshot, project) pairs and direct source-file
 * leases. Releasing an owner evicts entries with no remaining references.
 *
 * When a new snapshot is created, unchanged cache entries from the previous
 * snapshot are retained per-project. Only files within changed or removed
 * projects are invalidated.
 */
export declare class SourceFileCache<TSymbol> {
    /** Map from path to all cached versions of that file */
    private cache;
    /** Map from snapshotId to (projectId → Set of paths fetched through that project) */
    private snapshotProjectPaths;
    /** Map from direct lease ID to its retained path */
    private leasePaths;
    /** Map from source-file node ID to its record, for resolving compact symbol references */
    private recordsByNodeId;
    /**
     * Get a cached source file already retained for the given (snapshot, project) pair.
     * This does not require a content hash or parse options key — it returns the entry
     * if one exists with a matching ref. Used to skip the server request entirely when
     * retainForSnapshot has already carried over the ref.
     *
     * A given (snapshot, project) pair always parses a file the same way, so there is
     * at most one matching entry per ref.
     */
    getRetained(path: Path, snapshotId: number, projectId: string): RemoteSourceFile | undefined;
    get(file: RemoteSourceFile): RemoteSourceFile | undefined;
    getOrCreateRecord(file: SourceFileDescriptor, snapshotId: number, projectId: string): CachedSourceFile<TSymbol>;
    /** Find the live record for a source-file node ID without creating or retaining one. */
    findRecord(nodeId: string): CachedSourceFile<TSymbol> | undefined;
    /** Retain an existing record for a snapshot/project that reused one of its cached objects. */
    retainRecord(record: CachedSourceFile<TSymbol>, snapshotId: number, projectId: string): void;
    /** Attach a source file fetched by its descriptor to its existing record. */
    attachFile(record: CachedSourceFile<TSymbol>, file: RemoteSourceFile): RemoteSourceFile;
    getOrCreateSymbol(record: CachedSourceFile<TSymbol>, file: SourceFileDescriptor, id: number, create: () => TSymbol): TSymbol;
    /**
     * Store a source file in the cache and retain it for the given (snapshot, project) pair.
     * Returns the cached file — which may be an existing entry if the hash matches.
     */
    set(file: RemoteSourceFile, snapshotId: number, projectId: string): RemoteSourceFile;
    /**
     * Store a source file in the cache and retain it for a direct lease.
     * Returns the cached file so leased and program-owned files share identity.
     */
    setForLease(file: RemoteSourceFile, leaseId: number): RemoteSourceFile;
    private setWithRef;
    private addRecord;
    private retainRecordForSnapshot;
    private find;
    private findDescriptor;
    /**
     * Retain cache entries from a previous snapshot for a new snapshot.
     * For each project in the previous snapshot:
     *   - Removed projects: skip (don't retain any refs).
     *   - Changed projects: retain refs for files not listed in changedFiles/deletedFiles.
     *   - Unchanged projects: retain all refs.
     */
    retainForSnapshot(newSnapshotId: number, previousSnapshotId: number, changes: SnapshotChanges | undefined): void;
    /**
     * Release all entries retained by the given snapshot across all projects.
     * Only visits paths that the snapshot actually referenced.
     * Entries with no remaining refs are evicted.
     */
    releaseSnapshot(snapshotId: number): void;
    releaseLease(leaseId: number): void;
    private releaseRef;
    private trackPath;
    /**
     * Drop local cache ownership without releasing server-side snapshots or leases.
     * Caller-held ASTs may keep detached records alive; newly cached records need not
     * preserve object identity with those detached records.
     */
    clear(): void;
    /**
     * Get the number of unique paths in the cache.
     */
    get size(): number;
    /**
     * Check if a path is in the cache.
     */
    has(path: Path): boolean;
}
//# sourceMappingURL=sourceFileCache.d.ts.map