import { apiRequest, cacheGeneratorMethod, } from "./generatorSupport.js";
import { CheckFlags } from "#enums/checkFlags";
import { CompletionItemKind } from "#enums/completionItemKind";
import { DiagnosticCategory } from "#enums/diagnosticCategory";
import { ElementFlags } from "#enums/elementFlags";
import { EmitOnly } from "#enums/emitOnly";
import { IndexKind } from "#enums/indexKind";
import { JsxEmit } from "#enums/jsxEmit";
import { ModuleKind } from "#enums/moduleKind";
import { ModuleResolutionKind } from "#enums/moduleResolutionKind";
import { NewLineKind } from "#enums/newLineKind";
import { NodeBuilderFlags } from "#enums/nodeBuilderFlags";
import { ObjectFlags } from "#enums/objectFlags";
import { SignatureFlags } from "#enums/signatureFlags";
import { SignatureKind } from "#enums/signatureKind";
import { SymbolFlags } from "#enums/symbolFlags";
import { TypeFlags } from "#enums/typeFlags";
import { TypeFormatFlags } from "#enums/typeFormatFlags";
import { TypePredicateKind } from "#enums/typePredicateKind";
import { Client, } from "#syncClient";
import { ModifierFlags, unescapeLeadingUnderscores, } from "../../ast/index.js";
import { assertNever } from "../../internal/utils.js";
import { encodeNode, uint8ArrayToBase64, } from "../node/encoder.js";
import { decodeNode, getNodeId, parseNodeHandle, readParseOptionsKey, readSourceFileHash, RemoteSourceFile, } from "../node/node.js";
import { Wtf8Decoder } from "../node/wtf8.js";
import { createGetCanonicalFileName, toPath, } from "../path.js";
import { resolveFileName, toUpdateSnapshotRequest, } from "../proto.js";
import { SourceFileCache } from "../sourceFileCache.js";
export { formatDiagnostics, formatDiagnosticsWithColorAndContext } from "../diagnosticFormatter.js";
export { documentURIToFileName, fileNameToDocumentURI } from "../path.js";
export { CheckFlags, CompletionItemKind, DiagnosticCategory, ElementFlags, EmitOnly, IndexKind, JsxEmit, ModifierFlags, ModuleKind, ModuleResolutionKind, NodeBuilderFlags, ObjectFlags, SignatureFlags, SignatureKind, SymbolFlags, TypeFlags, TypeFormatFlags, TypePredicateKind };
export { all, defer } from "./generatorSupport.js";
import { executeRequestGenerators, } from "./generatorSupport.js";
export class API {
    client;
    sourceFileCache;
    toPath;
    currentDirectory;
    getCanonicalFileNameWorker;
    initialized = false;
    initializing;
    activeSnapshots = new Set();
    latestSnapshot;
    internal;
    constructor(options = {}) {
        this.client = new Client(options);
        this.sourceFileCache = new SourceFileCache();
        this.internal = new InternalAPI(this.client, this.ensureInitialized);
    }
    /**
     * Create an API instance from an existing LSP connection's API session.
     * Use this when connecting to an API pipe provided by an LSP server via custom/initializeAPISession.
     */
    static get fromLSPConnection() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fromLSPConnection", function (options) {
            const api = new API(options);
            api.ensureInitialized();
            return api;
        }, function* (options) {
            const api = new API(options);
            yield* api.ensureInitialized.gen();
            return api;
        });
    }
    batch(...requestGenerators) {
        return executeRequestGenerators(requestGenerators, requests => this.client.batchRequests(requests).responses);
    }
    get ensureInitialized() {
        const owner = this;
        return cacheGeneratorMethod(owner, "ensureInitialized", function () {
            if (owner.initialized)
                return;
            return owner.initializing ??= owner.initializeWorker();
        }, function* () {
            if (owner.initialized)
                return;
            return owner.initializing ??= yield* owner.initializeWorker.gen();
        });
    }
    get initializeWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "initializeWorker", function () {
            try {
                const response = owner.client.apiRequest("initialize", null);
                const getCanonicalFileName = createGetCanonicalFileName(response.useCaseSensitiveFileNames);
                const currentDirectory = response.currentDirectory;
                owner.getCanonicalFileNameWorker = getCanonicalFileName;
                owner.currentDirectory = currentDirectory;
                owner.toPath = (fileName) => toPath(fileName, currentDirectory, getCanonicalFileName);
                owner.initialized = true;
            }
            catch (error) {
                owner.initializing = undefined;
                throw error;
            }
        }, function* () {
            try {
                const response = yield* apiRequest("initialize", null);
                const getCanonicalFileName = createGetCanonicalFileName(response.useCaseSensitiveFileNames);
                const currentDirectory = response.currentDirectory;
                owner.getCanonicalFileNameWorker = getCanonicalFileName;
                owner.currentDirectory = currentDirectory;
                owner.toPath = (fileName) => toPath(fileName, currentDirectory, getCanonicalFileName);
                owner.initialized = true;
            }
            catch (error) {
                owner.initializing = undefined;
                throw error;
            }
        });
    }
    getCurrentDirectory() {
        if (this.currentDirectory === undefined) {
            throw new Error("API has not been initialized");
        }
        return this.currentDirectory;
    }
    getCanonicalFileName(fileName) {
        if (this.getCanonicalFileNameWorker === undefined) {
            throw new Error("API has not been initialized");
        }
        return this.getCanonicalFileNameWorker(fileName);
    }
    getNewLine() {
        return "\n";
    }
    get parseConfigFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "parseConfigFile", function (file) {
            owner.ensureInitialized();
            return owner.client.apiRequest("parseConfigFile", { file });
        }, function* (file) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("parseConfigFile", { file });
        });
    }
    get parseCommandLine() {
        const owner = this;
        return cacheGeneratorMethod(owner, "parseCommandLine", function (commandLine) {
            owner.ensureInitialized();
            return owner.client.apiRequest("parseCommandLine", { commandLine });
        }, function* (commandLine) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("parseCommandLine", { commandLine });
        });
    }
    get readConfigFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "readConfigFile", function (file) {
            owner.ensureInitialized();
            return owner.client.apiRequest("readConfigFile", { file });
        }, function* (file) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("readConfigFile", { file });
        });
    }
    get parseJsonConfigFileContent() {
        const owner = this;
        return cacheGeneratorMethod(owner, "parseJsonConfigFileContent", function (json, options) {
            owner.ensureInitialized();
            return owner.client.apiRequest("parseJsonConfigFileContent", { json, ...options });
        }, function* (json, options) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("parseJsonConfigFileContent", { json, ...options });
        });
    }
    get transpileModule() {
        const owner = this;
        return cacheGeneratorMethod(owner, "transpileModule", function (input, options = {}) {
            owner.ensureInitialized();
            return owner.client.apiRequest("transpileModule", { input, options });
        }, function* (input, options = {}) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("transpileModule", { input, options });
        });
    }
    get transpileModuleFromFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "transpileModuleFromFile", function (file, options = {}) {
            owner.ensureInitialized();
            return owner.client.apiRequest("transpileModuleFromFile", { fileName: resolveFileName(file), options });
        }, function* (file, options = {}) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("transpileModuleFromFile", { fileName: resolveFileName(file), options });
        });
    }
    get transpileDeclaration() {
        const owner = this;
        return cacheGeneratorMethod(owner, "transpileDeclaration", function (input, options = {}) {
            owner.ensureInitialized();
            return owner.client.apiRequest("transpileDeclaration", { input, options });
        }, function* (input, options = {}) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("transpileDeclaration", { input, options });
        });
    }
    get transpileDeclarationFromFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "transpileDeclarationFromFile", function (file, options = {}) {
            owner.ensureInitialized();
            return owner.client.apiRequest("transpileDeclarationFromFile", { fileName: resolveFileName(file), options });
        }, function* (file, options = {}) {
            yield* owner.ensureInitialized.gen();
            return yield* apiRequest("transpileDeclarationFromFile", { fileName: resolveFileName(file), options });
        });
    }
    get updateSnapshot() {
        const owner = this;
        return cacheGeneratorMethod(owner, "updateSnapshot", function (params) {
            return owner.updateSnapshotWorker(params);
        }, function* (params) {
            return yield* owner.updateSnapshotWorker.gen(params);
        });
    }
    /** @internal */
    get updateSnapshotFrom() {
        const owner = this;
        return cacheGeneratorMethod(owner, "updateSnapshotFrom", function (baseSnapshot, params) {
            if (!owner.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
                throw new Error("Cannot update an inactive snapshot");
            }
            if (baseSnapshot !== owner.latestSnapshot) {
                // TODO: Support forking active memory/cache snapshots once the server-side
                // ownership, project state, and cache semantics have been worked out.
                throw new Error("Snapshot.update can only update the latest snapshot");
            }
            return owner.updateSnapshotWorker(params, baseSnapshot);
        }, function* (baseSnapshot, params) {
            if (!owner.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
                throw new Error("Cannot update an inactive snapshot");
            }
            if (baseSnapshot !== owner.latestSnapshot) {
                // TODO: Support forking active memory/cache snapshots once the server-side
                // ownership, project state, and cache semantics have been worked out.
                throw new Error("Snapshot.update can only update the latest snapshot");
            }
            return yield* owner.updateSnapshotWorker.gen(params, baseSnapshot);
        });
    }
    get updateSnapshotWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "updateSnapshotWorker", function (params, baseSnapshot) {
            owner.ensureInitialized();
            const requestParams = toUpdateSnapshotRequest(params, baseSnapshot?.id);
            const data = owner.client.apiRequest("updateSnapshot", requestParams);
            // Retain cached source files from previous snapshot for unchanged files
            if (owner.latestSnapshot) {
                owner.sourceFileCache.retainForSnapshot(data.snapshot, owner.latestSnapshot.id, data.changes);
                if (owner.latestSnapshot.isDisposed()) {
                    owner.sourceFileCache.releaseSnapshot(owner.latestSnapshot.id);
                }
            }
            const snapshot = new Snapshot(data, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                if (snapshot !== owner.latestSnapshot) {
                    owner.sourceFileCache.releaseSnapshot(snapshot.id);
                }
            });
            owner.latestSnapshot = snapshot;
            owner.activeSnapshots.add(snapshot);
            return snapshot;
        }, function* (params, baseSnapshot) {
            yield* owner.ensureInitialized.gen();
            const requestParams = toUpdateSnapshotRequest(params, baseSnapshot?.id);
            const data = yield* apiRequest("updateSnapshot", requestParams);
            // Retain cached source files from previous snapshot for unchanged files
            if (owner.latestSnapshot) {
                owner.sourceFileCache.retainForSnapshot(data.snapshot, owner.latestSnapshot.id, data.changes);
                if (owner.latestSnapshot.isDisposed()) {
                    owner.sourceFileCache.releaseSnapshot(owner.latestSnapshot.id);
                }
            }
            const snapshot = new Snapshot(data, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                if (snapshot !== owner.latestSnapshot) {
                    owner.sourceFileCache.releaseSnapshot(snapshot.id);
                }
            });
            owner.latestSnapshot = snapshot;
            owner.activeSnapshots.add(snapshot);
            return snapshot;
        });
    }
    [globalThis.Symbol.dispose]() {
        this.close();
    }
    get close() {
        const owner = this;
        return cacheGeneratorMethod(owner, "close", function () {
            // Dispose all active snapshots
            try {
                for (const snapshot of [...owner.activeSnapshots]) {
                    snapshot.dispose();
                }
                // Release the latest snapshot's cache refs if still held
                if (owner.latestSnapshot) {
                    owner.sourceFileCache.releaseSnapshot(owner.latestSnapshot.id);
                    owner.latestSnapshot = undefined;
                }
                owner.sourceFileCache.clear();
            }
            finally {
                owner.client.close(); // always close the underlying connection
            }
        }, function* () {
            // Dispose all active snapshots
            try {
                for (const snapshot of [...owner.activeSnapshots]) {
                    yield* snapshot.dispose.gen();
                }
                // Release the latest snapshot's cache refs if still held
                if (owner.latestSnapshot) {
                    owner.sourceFileCache.releaseSnapshot(owner.latestSnapshot.id);
                    owner.latestSnapshot = undefined;
                }
                owner.sourceFileCache.clear();
            }
            finally {
                owner.client.close(); // always close the underlying connection
            }
        });
    }
    clearSourceFileCache() {
        this.sourceFileCache.clear();
    }
    get runWithTemporaryFileUpdate() {
        const owner = this;
        return cacheGeneratorMethod(owner, "runWithTemporaryFileUpdate", function (baseSnapshot, file, newText, cb) {
            owner.ensureInitialized();
            if (!owner.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
                throw new Error("Cannot run a temporary file update on an inactive snapshot");
            }
            const data = owner.client.apiRequest("updateTemporarySnapshot", { snapshot: baseSnapshot.id, file, newText });
            // Retain cached source files from the base snapshot for files unchanged by
            // the temporary update. The temporary snapshot is not the latest snapshot, so
            // we never release the latest snapshot's cache here.
            owner.sourceFileCache.retainForSnapshot(data.snapshot, baseSnapshot.id, data.changes);
            const snapshot = new Snapshot(data, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                owner.sourceFileCache.releaseSnapshot(snapshot.id);
            });
            owner.activeSnapshots.add(snapshot);
            try {
                cb(snapshot);
            }
            finally {
                snapshot.dispose();
            }
        }, function* (baseSnapshot, file, newText, cb) {
            yield* owner.ensureInitialized.gen();
            if (!owner.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
                throw new Error("Cannot run a temporary file update on an inactive snapshot");
            }
            const data = yield* apiRequest("updateTemporarySnapshot", { snapshot: baseSnapshot.id, file, newText });
            // Retain cached source files from the base snapshot for files unchanged by
            // the temporary update. The temporary snapshot is not the latest snapshot, so
            // we never release the latest snapshot's cache here.
            owner.sourceFileCache.retainForSnapshot(data.snapshot, baseSnapshot.id, data.changes);
            const snapshot = new Snapshot(data, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                owner.sourceFileCache.releaseSnapshot(snapshot.id);
            });
            owner.activeSnapshots.add(snapshot);
            try {
                yield* (cb(snapshot) ?? []);
            }
            finally {
                yield* snapshot.dispose.gen();
            }
        });
    }
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
    get getTimingInfo() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTimingInfo", function () {
            return owner.client.getTimingInfo();
        }, function* () {
            return owner.client.getTimingInfo();
        });
    }
    /** Clears all accumulated timing totals and recent-request history, on both the client and the server. */
    get resetTimingInfo() {
        const owner = this;
        return cacheGeneratorMethod(owner, "resetTimingInfo", function () {
            return owner.client.resetTimingInfo();
        }, function* () {
            return owner.client.resetTimingInfo();
        });
    }
    isProgramActive(program) {
        const project = program.getProject();
        for (const snapshot of this.activeSnapshots) {
            if (!snapshot.isDisposed() && snapshot.getProject(project.configFileName)?.program === program) {
                return true;
            }
        }
        return false;
    }
    /**
     * Creates a program from current filesystem state, or derives one from oldProgram after applying fileChanges.
     */
    get createProgram() {
        const owner = this;
        return cacheGeneratorMethod(owner, "createProgram", function (rootFiles, createProgramOptions, oldProgram, fileChanges) {
            owner.ensureInitialized();
            if (fileChanges && !oldProgram) {
                throw new Error("fileChanges requires an oldProgram");
            }
            if (oldProgram && !owner.isProgramActive(oldProgram)) {
                throw new Error("oldProgram must belong to this API instance and reference an active snapshot");
            }
            const data = owner.client.apiRequest("createProgram", {
                rootFiles,
                createProgramOptions,
                oldProgram: oldProgram ? { snapshot: oldProgram.snapshotId, project: oldProgram.getProject().id } : undefined,
                fileChanges,
            });
            if (!data.project) {
                throw new Error("createProgram did not return a project");
            }
            const snapshot = new Snapshot({ snapshot: data.snapshot, projects: [data.project] }, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                owner.sourceFileCache.releaseSnapshot(snapshot.id);
            });
            const program = snapshot.getProjects()[0].program;
            program.setOwnedSnapshot(snapshot);
            owner.activeSnapshots.add(snapshot);
            return program;
        }, function* (rootFiles, createProgramOptions, oldProgram, fileChanges) {
            yield* owner.ensureInitialized.gen();
            if (fileChanges && !oldProgram) {
                throw new Error("fileChanges requires an oldProgram");
            }
            if (oldProgram && !owner.isProgramActive(oldProgram)) {
                throw new Error("oldProgram must belong to this API instance and reference an active snapshot");
            }
            const data = yield* apiRequest("createProgram", {
                rootFiles,
                createProgramOptions,
                oldProgram: oldProgram ? { snapshot: oldProgram.snapshotId, project: oldProgram.getProject().id } : undefined,
                fileChanges,
            });
            if (!data.project) {
                throw new Error("createProgram did not return a project");
            }
            const snapshot = new Snapshot({ snapshot: data.snapshot, projects: [data.project] }, owner.client, owner.sourceFileCache, owner.toPath, owner, () => {
                owner.activeSnapshots.delete(snapshot);
                owner.sourceFileCache.releaseSnapshot(snapshot.id);
            });
            const program = snapshot.getProjects()[0].program;
            program.setOwnedSnapshot(snapshot);
            owner.activeSnapshots.add(snapshot);
            return program;
        });
    }
}
export class InternalAPI {
    client;
    ensureInitialized;
    /** @internal */
    constructor(client, ensureInitialized) {
        this.client = client;
        this.ensureInitialized = ensureInitialized;
    }
    get startCPUProfile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "startCPUProfile", function (dir) {
            owner.ensureInitialized();
            owner.client.apiRequest("startCPUProfile", { dir });
        }, function* (dir) {
            yield* owner.ensureInitialized.gen();
            yield* apiRequest("startCPUProfile", { dir });
        });
    }
    get stopCPUProfile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "stopCPUProfile", function () {
            owner.ensureInitialized();
            const result = owner.client.apiRequest("stopCPUProfile", null);
            return result.file;
        }, function* () {
            yield* owner.ensureInitialized.gen();
            const result = yield* apiRequest("stopCPUProfile", null);
            return result.file;
        });
    }
    get saveHeapProfile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "saveHeapProfile", function (dir) {
            owner.ensureInitialized();
            const result = owner.client.apiRequest("saveHeapProfile", { dir });
            return result.file;
        }, function* (dir) {
            yield* owner.ensureInitialized.gen();
            const result = yield* apiRequest("saveHeapProfile", { dir });
            return result.file;
        });
    }
}
export class Snapshot {
    id;
    projectMap;
    toPath;
    client;
    disposed = false;
    disposePromise;
    onDispose;
    api;
    snapshotRegistry;
    internal;
    constructor(data, client, sourceFileCache, toPath, api, onDispose) {
        this.id = data.snapshot;
        this.client = client;
        this.toPath = toPath;
        this.api = api;
        this.onDispose = onDispose;
        this.projectMap = new Map();
        this.snapshotRegistry = new SnapshotObjectRegistry(client, this.id, projectId => this.projectMap.get(projectId));
        for (const projData of data.projects) {
            const project = new Project(projData, this.id, client, sourceFileCache, toPath, api, this.snapshotRegistry);
            this.projectMap.set(toPath(projData.configFileName), project);
        }
        this.internal = new SnapshotInternalAPI(this.id, client);
    }
    getProjects() {
        this.ensureNotDisposed();
        return [...this.projectMap.values()];
    }
    getProject(configFileName) {
        this.ensureNotDisposed();
        return this.projectMap.get(this.toPath(configFileName));
    }
    get getDefaultProjectForFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDefaultProjectForFile", function (file) {
            owner.ensureNotDisposed();
            const data = owner.client.apiRequest("getDefaultProjectForFile", {
                snapshot: owner.id,
                file,
            });
            if (!data)
                return undefined;
            return owner.projectMap.get(owner.toPath(data.configFileName));
        }, function* (file) {
            owner.ensureNotDisposed();
            const data = yield* apiRequest("getDefaultProjectForFile", {
                snapshot: owner.id,
                file,
            });
            if (!data)
                return undefined;
            return owner.projectMap.get(owner.toPath(data.configFileName));
        });
    }
    /**
     * Creates the next snapshot, layering its filesystem over this snapshot's
     * filesystem. This snapshot must still be active and be the latest snapshot.
     */
    get update() {
        const owner = this;
        return cacheGeneratorMethod(owner, "update", function (params) {
            owner.ensureNotDisposed();
            return owner.api.updateSnapshotFrom(owner, params);
        }, function* (params) {
            owner.ensureNotDisposed();
            return yield* owner.api.updateSnapshotFrom.gen(owner, params);
        });
    }
    [globalThis.Symbol.dispose]() {
        void this.dispose();
    }
    get dispose() {
        const owner = this;
        return cacheGeneratorMethod(owner, "dispose", function () {
            return owner.disposePromise ??= owner.disposeWorker();
        }, function* () {
            return owner.disposePromise ??= yield* owner.disposeWorker.gen();
        });
    }
    get disposeWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "disposeWorker", function () {
            if (owner.disposed)
                return;
            owner.disposed = true;
            for (const project of owner.projectMap.values()) {
                project.dispose();
            }
            owner.projectMap.clear();
            owner.snapshotRegistry.clear();
            try {
                owner.client.apiRequest("release", { snapshot: owner.id });
            }
            finally {
                owner.onDispose();
            }
        }, function* () {
            if (owner.disposed)
                return;
            owner.disposed = true;
            for (const project of owner.projectMap.values()) {
                project.dispose();
            }
            owner.projectMap.clear();
            owner.snapshotRegistry.clear();
            try {
                yield* apiRequest("release", { snapshot: owner.id });
            }
            finally {
                owner.onDispose();
            }
        });
    }
    isDisposed() {
        return this.disposed;
    }
    ensureNotDisposed() {
        if (this.disposed) {
            throw new Error("Snapshot is disposed");
        }
    }
}
class SnapshotObjectRegistry {
    symbols = new Map();
    client;
    snapshotId;
    resolveProject;
    constructor(client, snapshotId, resolveProject) {
        this.client = client;
        this.snapshotId = snapshotId;
        this.resolveProject = resolveProject;
    }
    /** Resolve a project id (a config file path) to its Project within this snapshot. */
    getProject(projectId) {
        return this.resolveProject(projectId);
    }
    getOrCreateSymbol(data) {
        let symbol = this.symbols.get(data.id);
        if (!symbol) {
            symbol = new Symbol(data, this);
            this.symbols.set(data.id, symbol);
        }
        return symbol;
    }
    getSymbol(id) {
        return this.symbols.get(id);
    }
    clear() {
        this.symbols.clear();
    }
    get fetchSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSymbol", function (source, method, handle, projectId) {
            if (!handle)
                return undefined;
            const cached = owner.getSymbol(handle);
            if (cached)
                return cached;
            const data = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: projectId,
                objectId: source.id,
            });
            if (!data)
                throw new Error(`${method} returned null symbol for ${source.constructor.name} ${source.id}`);
            return owner.getOrCreateSymbol(data);
        }, function* (source, method, handle, projectId) {
            if (!handle)
                return undefined;
            const cached = owner.getSymbol(handle);
            if (cached)
                return cached;
            const data = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: projectId,
                objectId: source.id,
            });
            if (!data)
                throw new Error(`${method} returned null symbol for ${source.constructor.name} ${source.id}`);
            return owner.getOrCreateSymbol(data);
        });
    }
    get fetchSymbols() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSymbols", function (source, method, handles, projectId) {
            if (handles) {
                const result = new Array(handles.length);
                let allCached = true;
                for (let i = 0; i < handles.length; i++) {
                    const cached = owner.getSymbol(handles[i]);
                    if (!cached) {
                        allCached = false;
                        break;
                    }
                    result[i] = cached;
                }
                if (allCached)
                    return result;
            }
            const symbolData = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: projectId,
                objectId: source.id,
            });
            if (symbolData == null)
                return [];
            else
                return symbolData.map(data => owner.getOrCreateSymbol(data));
        }, function* (source, method, handles, projectId) {
            if (handles) {
                const result = new Array(handles.length);
                let allCached = true;
                for (let i = 0; i < handles.length; i++) {
                    const cached = owner.getSymbol(handles[i]);
                    if (!cached) {
                        allCached = false;
                        break;
                    }
                    result[i] = cached;
                }
                if (allCached)
                    return result;
            }
            const symbolData = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: projectId,
                objectId: source.id,
            });
            if (symbolData == null)
                return [];
            else
                return symbolData.map(data => owner.getOrCreateSymbol(data));
        });
    }
}
class ProjectObjectRegistry {
    client;
    snapshotId;
    project;
    snapshotRegistry;
    types = new Map();
    signatures = new Map();
    constructor(client, snapshotId, project, snapshotRegistry) {
        this.client = client;
        this.snapshotId = snapshotId;
        this.project = project;
        this.snapshotRegistry = snapshotRegistry;
    }
    getOrCreateSymbol(data) {
        return this.snapshotRegistry.getOrCreateSymbol(data);
    }
    getSymbol(id) {
        return this.snapshotRegistry.getSymbol(id);
    }
    getOrCreateType(data) {
        let type = this.types.get(data.id);
        if (!type) {
            type = new TypeObject(data, this);
            this.types.set(data.id, type);
        }
        return type;
    }
    getType(id) {
        return this.types.get(id);
    }
    createNodeHandle(handle) {
        return new NodeHandle(handle, this.project);
    }
    getOrCreateSignature(data) {
        let sig = this.signatures.get(data.id);
        if (!sig) {
            sig = new Signature(data, this.project, this);
            this.signatures.set(data.id, sig);
        }
        return sig;
    }
    getSignature(id) {
        return this.signatures.get(id);
    }
    clear() {
        this.types.clear();
        this.signatures.clear();
    }
    get fetchOptionalType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchOptionalType", function (source, method, handle) {
            if (handle !== false) {
                if (!handle)
                    return undefined;
                const cached = owner.getType(handle);
                if (cached)
                    return cached;
            }
            const data = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (!data)
                return undefined;
            return owner.getOrCreateType(data);
        }, function* (source, method, handle) {
            if (handle !== false) {
                if (!handle)
                    return undefined;
                const cached = owner.getType(handle);
                if (cached)
                    return cached;
            }
            const data = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (!data)
                return undefined;
            return owner.getOrCreateType(data);
        });
    }
    get fetchType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchType", function (source, method, handle) {
            const result = owner.fetchOptionalType(source, method, handle);
            if (result === undefined)
                throw new Error(`${method} returned no type for ${source.constructor.name} ${source.id}`);
            return result;
        }, function* (source, method, handle) {
            const result = yield* owner.fetchOptionalType.gen(source, method, handle);
            if (result === undefined)
                throw new Error(`${method} returned no type for ${source.constructor.name} ${source.id}`);
            return result;
        });
    }
    get fetchSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSymbol", function (source, method, handle) {
            return owner.snapshotRegistry.fetchSymbol(source, method, handle, owner.project.id);
        }, function* (source, method, handle) {
            return yield* owner.snapshotRegistry.fetchSymbol.gen(source, method, handle, owner.project.id);
        });
    }
    get fetchSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSignature", function (source, method, handle) {
            if (!handle)
                return undefined;
            const cached = owner.getSignature(handle);
            if (cached)
                return cached;
            const data = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (!data)
                throw new Error(`${method} returned null signature for ${source.constructor.name} ${source.id}`);
            return owner.getOrCreateSignature(data);
        }, function* (source, method, handle) {
            if (!handle)
                return undefined;
            const cached = owner.getSignature(handle);
            if (cached)
                return cached;
            const data = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (!data)
                throw new Error(`${method} returned null signature for ${source.constructor.name} ${source.id}`);
            return owner.getOrCreateSignature(data);
        });
    }
    get fetchTypes() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchTypes", function (source, method, handles) {
            if (handles) {
                const result = new Array(handles.length);
                let allCached = true;
                for (let i = 0; i < handles.length; i++) {
                    const cached = owner.getType(handles[i]);
                    if (!cached) {
                        allCached = false;
                        break;
                    }
                    result[i] = cached;
                }
                if (allCached)
                    return result;
            }
            const typesData = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (typesData == null)
                return [];
            else
                return typesData.map(data => owner.getOrCreateType(data));
        }, function* (source, method, handles) {
            if (handles) {
                const result = new Array(handles.length);
                let allCached = true;
                for (let i = 0; i < handles.length; i++) {
                    const cached = owner.getType(handles[i]);
                    if (!cached) {
                        allCached = false;
                        break;
                    }
                    result[i] = cached;
                }
                if (allCached)
                    return result;
            }
            const typesData = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            if (typesData == null)
                return [];
            else
                return typesData.map(data => owner.getOrCreateType(data));
        });
    }
    get fetchSymbols() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSymbols", function (source, method, handles) {
            return owner.snapshotRegistry.fetchSymbols(source, method, handles, owner.project.id);
        }, function* (source, method, handles) {
            return yield* owner.snapshotRegistry.fetchSymbols.gen(source, method, handles, owner.project.id);
        });
    }
    // getBaseTypes is a checker-level endpoint keyed by `type` (not `objectId`),
    // so it cannot go through fetchTypes. This helper reuses that server method.
    get fetchBaseTypes() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchBaseTypes", function (source) {
            const typesData = owner.client.apiRequest("getBaseTypes", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            if (typesData == null)
                return [];
            return typesData.map(data => owner.getOrCreateType(data));
        }, function* (source) {
            const typesData = yield* apiRequest("getBaseTypes", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            if (typesData == null)
                return [];
            return typesData.map(data => owner.getOrCreateType(data));
        });
    }
    get fetchPropertiesOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchPropertiesOfType", function (source) {
            const data = owner.client.apiRequest("getPropertiesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            return data ? data.map(symbol => owner.getOrCreateSymbol(symbol)) : [];
        }, function* (source) {
            const data = yield* apiRequest("getPropertiesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            return data ? data.map(symbol => owner.getOrCreateSymbol(symbol)) : [];
        });
    }
    get fetchApparentPropertiesOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchApparentPropertiesOfType", function (source) {
            const data = owner.client.apiRequest("getApparentPropertiesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            return data ? data.map(symbol => owner.getOrCreateSymbol(symbol)) : [];
        }, function* (source) {
            const data = yield* apiRequest("getApparentPropertiesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                objectId: source.id,
            });
            return data ? data.map(symbol => owner.getOrCreateSymbol(symbol)) : [];
        });
    }
    get fetchPropertyOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchPropertyOfType", function (source, name) {
            const data = owner.client.apiRequest("getPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
                name,
            });
            return data ? owner.getOrCreateSymbol(data) : undefined;
        }, function* (source, name) {
            const data = yield* apiRequest("getPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
                name,
            });
            return data ? owner.getOrCreateSymbol(data) : undefined;
        });
    }
    get fetchSignaturesOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSignaturesOfType", function (source, kind) {
            const data = owner.client.apiRequest("getSignaturesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
                kind,
            });
            return data.map(signature => owner.getOrCreateSignature(signature));
        }, function* (source, kind) {
            const data = yield* apiRequest("getSignaturesOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
                kind,
            });
            return data.map(signature => owner.getOrCreateSignature(signature));
        });
    }
    get fetchIndexInfosOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchIndexInfosOfType", function (source) {
            const data = owner.client.apiRequest("getIndexInfosOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            if (!data)
                return [];
            return data.map(info => ({
                keyType: owner.getOrCreateType(info.keyType),
                valueType: owner.getOrCreateType(info.valueType),
                isReadonly: info.isReadonly ?? false,
                declaration: info.declaration ? new NodeHandle(info.declaration, owner.project) : undefined,
            }));
        }, function* (source) {
            const data = yield* apiRequest("getIndexInfosOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: source.id,
            });
            if (!data)
                return [];
            return data.map(info => ({
                keyType: owner.getOrCreateType(info.keyType),
                valueType: owner.getOrCreateType(info.valueType),
                isReadonly: info.isReadonly ?? false,
                declaration: info.declaration ? new NodeHandle(info.declaration, owner.project) : undefined,
            }));
        });
    }
    get fetchTypeParameterAtPosition() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchTypeParameterAtPosition", function (source, pos) {
            const data = owner.client.apiRequest("getTypeParameterAtPosition", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: source.id,
                index: pos,
            });
            return owner.getOrCreateType(data);
        }, function* (source, pos) {
            const data = yield* apiRequest("getTypeParameterAtPosition", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: source.id,
                index: pos,
            });
            return owner.getOrCreateType(data);
        });
    }
}
export class Project {
    id;
    configFileName;
    currentDirectory;
    parsedCommandLine;
    /** @deprecated Use `parsedCommandLine.options`. */
    compilerOptions;
    /** @deprecated Use `parsedCommandLine.fileNames`. */
    rootFiles;
    program;
    checker;
    emitter;
    languageService;
    client;
    snapshotId;
    constructor(data, snapshotId, client, sourceFileCache, toPath, formatDiagnosticsHost, snapshotRegistry) {
        this.id = data.id;
        this.configFileName = data.configFileName;
        this.currentDirectory = data.currentDirectory;
        if (!data.parsedCommandLine?.options) {
            throw new Error(`Project '${data.configFileName}' has no parsed command line`);
        }
        this.parsedCommandLine = data.parsedCommandLine;
        this.compilerOptions = this.parsedCommandLine.options;
        this.rootFiles = this.parsedCommandLine.fileNames;
        this.client = client;
        this.snapshotId = snapshotId;
        this.program = new Program(snapshotId, this, client, sourceFileCache, toPath, formatDiagnosticsHost);
        const objectRegistry = new ProjectObjectRegistry(client, snapshotId, this, snapshotRegistry);
        this.checker = new Checker(snapshotId, this, client, objectRegistry);
        this.emitter = new Emitter(client);
        this.languageService = new LanguageService(snapshotId, this, client, objectRegistry);
    }
    /** @deprecated Use `languageService.getImportAdderEdits`. */
    get getImportAdderEdits() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getImportAdderEdits", function (file, actions) {
            return owner.languageService.getImportAdderEdits(file, actions);
        }, function* (file, actions) {
            return yield* owner.languageService.getImportAdderEdits.gen(file, actions);
        });
    }
    /** @deprecated Use `languageService.getImportEditsForSymbols`. */
    get getImportEditsForSymbols() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getImportEditsForSymbols", function (file, symbols, options = {}) {
            return owner.languageService.getImportEditsForSymbols(file, symbols, options);
        }, function* (file, symbols, options = {}) {
            return yield* owner.languageService.getImportEditsForSymbols.gen(file, symbols, options);
        });
    }
    dispose() {
        this.checker.dispose();
    }
}
export class LanguageService {
    snapshotId;
    project;
    client;
    objectRegistry;
    constructor(snapshotId, project, client, objectRegistry) {
        this.snapshotId = snapshotId;
        this.project = project;
        this.client = client;
        this.objectRegistry = objectRegistry;
    }
    get getImportAdderEdits() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getImportAdderEdits", function (file, actions) {
            const requestActions = actions.map(action => {
                switch (action.kind) {
                    case "importSymbol":
                        const importSymbolAction = {
                            kind: "importSymbol",
                            symbol: action.symbol.id,
                        };
                        if (action.isValidTypeOnlyUseSite !== undefined) {
                            importSymbolAction.isValidTypeOnlyUseSite = action.isValidTypeOnlyUseSite;
                        }
                        return importSymbolAction;
                    default:
                        return assertNever(action.kind);
                }
            });
            const data = owner.client.apiRequest("getImportAdderEdits", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                actions: requestActions,
            });
            return data ?? [];
        }, function* (file, actions) {
            const requestActions = actions.map(action => {
                switch (action.kind) {
                    case "importSymbol":
                        const importSymbolAction = {
                            kind: "importSymbol",
                            symbol: action.symbol.id,
                        };
                        if (action.isValidTypeOnlyUseSite !== undefined) {
                            importSymbolAction.isValidTypeOnlyUseSite = action.isValidTypeOnlyUseSite;
                        }
                        return importSymbolAction;
                    default:
                        return assertNever(action.kind);
                }
            });
            const data = yield* apiRequest("getImportAdderEdits", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                actions: requestActions,
            });
            return data ?? [];
        });
    }
    get getImportEditsForSymbols() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getImportEditsForSymbols", function (file, symbols, options = {}) {
            return owner.getImportAdderEdits(file, symbols.map((symbol) => {
                if (options.isValidTypeOnlyUseSite !== undefined) {
                    return {
                        kind: "importSymbol",
                        symbol,
                        isValidTypeOnlyUseSite: options.isValidTypeOnlyUseSite,
                    };
                }
                return {
                    kind: "importSymbol",
                    symbol,
                };
            }));
        }, function* (file, symbols, options = {}) {
            return yield* owner.getImportAdderEdits.gen(file, symbols.map((symbol) => {
                if (options.isValidTypeOnlyUseSite !== undefined) {
                    return {
                        kind: "importSymbol",
                        symbol,
                        isValidTypeOnlyUseSite: options.isValidTypeOnlyUseSite,
                    };
                }
                return {
                    kind: "importSymbol",
                    symbol,
                };
            }));
        });
    }
    get getReferencedSymbolsForNode() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReferencedSymbolsForNode", function (node, position) {
            const data = owner.client.apiRequest("getReferencedSymbolsForNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                node: getNodeId(node),
                position,
            });
            return (data ?? []).map(entry => ({
                definition: new NodeHandle(entry.definition, owner.project),
                symbol: entry.symbol ? owner.objectRegistry.getOrCreateSymbol(entry.symbol) : undefined,
                references: (entry.references ?? []).map(h => new NodeHandle(h, owner.project)),
            }));
        }, function* (node, position) {
            const data = yield* apiRequest("getReferencedSymbolsForNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                node: getNodeId(node),
                position,
            });
            return (data ?? []).map(entry => ({
                definition: new NodeHandle(entry.definition, owner.project),
                symbol: entry.symbol ? owner.objectRegistry.getOrCreateSymbol(entry.symbol) : undefined,
                references: (entry.references ?? []).map(h => new NodeHandle(h, owner.project)),
            }));
        });
    }
    get getSignatureUsage() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSignatureUsage", function (signatureDecl) {
            const data = owner.client.apiRequest("getSignatureUsages", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signatureDecl: getNodeId(signatureDecl),
            });
            return (data ?? []).map(entry => ({
                name: new NodeHandle(entry.name, owner.project),
                call: entry.call ? new NodeHandle(entry.call, owner.project) : undefined,
            }));
        }, function* (signatureDecl) {
            const data = yield* apiRequest("getSignatureUsages", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signatureDecl: getNodeId(signatureDecl),
            });
            return (data ?? []).map(entry => ({
                name: new NodeHandle(entry.name, owner.project),
                call: entry.call ? new NodeHandle(entry.call, owner.project) : undefined,
            }));
        });
    }
    get getCompletionsAtPosition() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getCompletionsAtPosition", function (document, position, options) {
            const data = owner.client.apiRequest("getCompletionsAtPosition", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: document,
                position,
                triggerCharacter: options?.triggerCharacter,
                includeSymbol: options?.includeSymbol,
            });
            if (!data)
                return undefined;
            return {
                isIncomplete: data.isIncomplete,
                entries: data.entries.map(e => ({
                    ...e,
                    symbol: e.symbol ? owner.objectRegistry.getOrCreateSymbol(e.symbol) : undefined,
                })),
            };
        }, function* (document, position, options) {
            const data = yield* apiRequest("getCompletionsAtPosition", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: document,
                position,
                triggerCharacter: options?.triggerCharacter,
                includeSymbol: options?.includeSymbol,
            });
            if (!data)
                return undefined;
            return {
                isIncomplete: data.isIncomplete,
                entries: data.entries.map(e => ({
                    ...e,
                    symbol: e.symbol ? owner.objectRegistry.getOrCreateSymbol(e.symbol) : undefined,
                })),
            };
        });
    }
}
export class Program {
    /** @internal */
    snapshotId;
    project;
    client;
    sourceFileCache;
    toPath;
    formatDiagnosticsHost;
    decoder = new Wtf8Decoder();
    sourceFileMetadataCache = new Map();
    ownedSnapshot;
    disposePromise;
    constructor(snapshotId, project, client, sourceFileCache, toPath, formatDiagnosticsHost) {
        this.snapshotId = snapshotId;
        this.project = project;
        this.client = client;
        this.sourceFileCache = sourceFileCache;
        this.toPath = toPath;
        this.formatDiagnosticsHost = formatDiagnosticsHost;
    }
    getCurrentDirectory() {
        return this.project.currentDirectory;
    }
    getCanonicalFileName(fileName) {
        return this.formatDiagnosticsHost.getCanonicalFileName(fileName);
    }
    getNewLine() {
        return this.project.compilerOptions.newLine === NewLineKind.CRLF ? "\r\n" : "\n";
    }
    /** @internal */
    setOwnedSnapshot(snapshot) {
        this.ownedSnapshot = snapshot;
    }
    [globalThis.Symbol.dispose]() {
        void this.dispose();
    }
    get dispose() {
        const owner = this;
        return cacheGeneratorMethod(owner, "dispose", function () {
            return owner.disposePromise ??= owner.disposeWorker();
        }, function* () {
            return owner.disposePromise ??= yield* owner.disposeWorker.gen();
        });
    }
    get disposeWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "disposeWorker", function () {
            const snapshot = owner.ownedSnapshot;
            owner.ownedSnapshot = undefined;
            if (snapshot)
                snapshot.dispose();
        }, function* () {
            const snapshot = owner.ownedSnapshot;
            owner.ownedSnapshot = undefined;
            if (snapshot)
                yield* snapshot.dispose.gen();
        });
    }
    getCompilerOptions() {
        return this.project.compilerOptions;
    }
    get getSourceFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSourceFile", function (file) {
            const fileName = resolveFileName(file);
            const path = owner.toPath(fileName);
            // Check if we already have a retained cache entry for this (snapshot, project) pair
            const retained = owner.sourceFileCache.getRetained(path, owner.snapshotId, owner.project.id);
            if (retained) {
                return retained;
            }
            // Fetch from server
            const binaryData = owner.client.apiRequestBinary("getSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
            });
            if (!binaryData) {
                return undefined;
            }
            const view = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
            const contentHash = readSourceFileHash(view);
            const parseOptionsKey = readParseOptionsKey(view);
            // Create a new RemoteSourceFile and cache it (set returns existing if hash matches)
            const sourceFile = new RemoteSourceFile(binaryData, owner.decoder, owner.client.getTimingCollector());
            return owner.sourceFileCache.set(path, sourceFile, parseOptionsKey, contentHash, owner.snapshotId, owner.project.id);
        }, function* (file) {
            const fileName = resolveFileName(file);
            const path = owner.toPath(fileName);
            // Check if we already have a retained cache entry for this (snapshot, project) pair
            const retained = owner.sourceFileCache.getRetained(path, owner.snapshotId, owner.project.id);
            if (retained) {
                return retained;
            }
            // Fetch from server
            const binaryData = owner.client.apiRequestBinary("getSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
            });
            if (!binaryData) {
                return undefined;
            }
            const view = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
            const contentHash = readSourceFileHash(view);
            const parseOptionsKey = readParseOptionsKey(view);
            // Create a new RemoteSourceFile and cache it (set returns existing if hash matches)
            const sourceFile = new RemoteSourceFile(binaryData, owner.decoder, owner.client.getTimingCollector());
            return owner.sourceFileCache.set(path, sourceFile, parseOptionsKey, contentHash, owner.snapshotId, owner.project.id);
        });
    }
    get getResolvedModule() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedModule", function (file, moduleName, mode) {
            const result = owner.client.apiRequest("getResolvedModule", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                moduleName,
                mode,
            });
            return result ?? undefined;
        }, function* (file, moduleName, mode) {
            const result = yield* apiRequest("getResolvedModule", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                moduleName,
                mode,
            });
            return result ?? undefined;
        });
    }
    get getResolvedModuleFromModuleSpecifier() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedModuleFromModuleSpecifier", function (moduleSpecifier, sourceFile) {
            const result = owner.client.apiRequest("getResolvedModuleFromModuleSpecifier", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                moduleSpecifier: getNodeId(moduleSpecifier),
                sourceFile,
            });
            return result ?? undefined;
        }, function* (moduleSpecifier, sourceFile) {
            const result = yield* apiRequest("getResolvedModuleFromModuleSpecifier", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                moduleSpecifier: getNodeId(moduleSpecifier),
                sourceFile,
            });
            return result ?? undefined;
        });
    }
    get getResolvedTypeReferenceDirective() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedTypeReferenceDirective", function (file, typeDirectiveName, mode) {
            const result = owner.client.apiRequest("getResolvedTypeReferenceDirective", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                typeDirectiveName,
                mode,
            });
            return result ?? undefined;
        }, function* (file, typeDirectiveName, mode) {
            const result = yield* apiRequest("getResolvedTypeReferenceDirective", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                typeDirectiveName,
                mode,
            });
            return result ?? undefined;
        });
    }
    get getResolvedTypeReferenceDirectiveFromTypeReferenceDirective() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedTypeReferenceDirectiveFromTypeReferenceDirective", function (typeReferenceDirective, sourceFile) {
            const result = owner.client.apiRequest("getResolvedTypeReferenceDirectiveFromTypeReferenceDirective", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                sourceFile,
                typeDirectiveName: typeReferenceDirective.fileName,
                resolutionMode: typeReferenceDirective.resolutionMode,
            });
            return result ?? undefined;
        }, function* (typeReferenceDirective, sourceFile) {
            const result = yield* apiRequest("getResolvedTypeReferenceDirectiveFromTypeReferenceDirective", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                sourceFile,
                typeDirectiveName: typeReferenceDirective.fileName,
                resolutionMode: typeReferenceDirective.resolutionMode,
            });
            return result ?? undefined;
        });
    }
    get getSourceFileNames() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSourceFileNames", function () {
            const data = owner.client.apiRequest("getSourceFileNames", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        }, function* () {
            const data = yield* apiRequest("getSourceFileNames", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        });
    }
    /**
     * Returns program-stored metadata for the given source file, or `undefined` if the file
     * is not part of the program. Metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    get getSourceFileMetadata() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSourceFileMetadata", function (file) {
            return owner.getSourceFileMetadataByPath(owner.toPath(resolveFileName(file)));
        }, function* (file) {
            return yield* owner.getSourceFileMetadataByPath.gen(owner.toPath(resolveFileName(file)));
        });
    }
    /**
     * Returns program-stored metadata for the source file at the given path, or `undefined`
     * if the file is not part of the program. Like {@link getSourceFileMetadata}, but skips
     * the file name to path conversion. Metadata is fetched lazily per file and cached on
     * this `Program` instance.
     */
    get getSourceFileMetadataByPath() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSourceFileMetadataByPath", function (path) {
            let metadata = owner.sourceFileMetadataCache.get(path);
            if (metadata === undefined) {
                metadata = owner.fetchSourceFileMetadata(path);
                owner.sourceFileMetadataCache.set(path, metadata);
            }
            return metadata;
        }, function* (path) {
            let metadata = owner.sourceFileMetadataCache.get(path);
            if (metadata === undefined) {
                metadata = yield* owner.fetchSourceFileMetadata.gen(path);
                owner.sourceFileMetadataCache.set(path, metadata);
            }
            return metadata;
        });
    }
    get fetchSourceFileMetadata() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSourceFileMetadata", function (path) {
            const data = owner.client.apiRequest("getSourceFileMetadata", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: path,
            });
            return data ?? undefined;
        }, function* (path) {
            const data = yield* apiRequest("getSourceFileMetadata", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: path,
            });
            return data ?? undefined;
        });
    }
    /**
     * Returns whether the given source file was loaded as part of an external library
     * (e.g. a dependency resolved from `node_modules`). The underlying program metadata is
     * fetched lazily per file and cached on this `Program` instance.
     */
    get isSourceFileFromExternalLibrary() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isSourceFileFromExternalLibrary", function (file) {
            const metadata = owner.getSourceFileMetadataByPath(file.path);
            return metadata?.isFromExternalLibrary ?? false;
        }, function* (file) {
            const metadata = yield* owner.getSourceFileMetadataByPath.gen(file.path);
            return metadata?.isFromExternalLibrary ?? false;
        });
    }
    /**
     * Returns whether the given source file is a default library file (e.g. `lib.d.ts`).
     * The underlying program metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    get isSourceFileDefaultLibrary() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isSourceFileDefaultLibrary", function (file) {
            const metadata = owner.getSourceFileMetadataByPath(file.path);
            return metadata?.isDefaultLibrary ?? false;
        }, function* (file) {
            const metadata = yield* owner.getSourceFileMetadataByPath.gen(file.path);
            return metadata?.isDefaultLibrary ?? false;
        });
    }
    /**
     * Get all config source file names associated with this program's project config.
     * Includes the root config file and any extended config files.
     */
    get getConfigFileNames() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConfigFileNames", function () {
            const data = owner.client.apiRequest("getConfigFileNames", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        }, function* () {
            const data = yield* apiRequest("getConfigFileNames", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        });
    }
    /**
     * Get a config source file by file name/URI.
     * This can return the project's root tsconfig file or one of its extended config files.
     */
    get getConfigSourceFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConfigSourceFile", function (file) {
            const binaryData = owner.client.apiRequestBinary("getConfigSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
            });
            if (!binaryData) {
                return undefined;
            }
            return new RemoteSourceFile(binaryData, owner.decoder);
        }, function* (file) {
            const binaryData = owner.client.apiRequestBinary("getConfigSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
            });
            if (!binaryData) {
                return undefined;
            }
            return new RemoteSourceFile(binaryData, owner.decoder);
        });
    }
    /**
     * Get syntactic (parse) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    get getSyntacticDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSyntacticDiagnostics", function (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = owner.client.apiRequest("getSyntacticDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        }, function* (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = yield* apiRequest("getSyntacticDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        });
    }
    /**
     * Get binder diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    get getBindDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBindDiagnostics", function (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = owner.client.apiRequest("getBindDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        }, function* (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = yield* apiRequest("getBindDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        });
    }
    /**
     * Get semantic (type-check) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    get getSemanticDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSemanticDiagnostics", function (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = owner.client.apiRequest("getSemanticDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        }, function* (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = yield* apiRequest("getSemanticDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        });
    }
    /**
     * Get suggestion diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    get getSuggestionDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSuggestionDiagnostics", function (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = owner.client.apiRequest("getSuggestionDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        }, function* (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = yield* apiRequest("getSuggestionDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        });
    }
    /**
     * Get declaration emit diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    get getDeclarationDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDeclarationDiagnostics", function (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = owner.client.apiRequest("getDeclarationDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        }, function* (file) {
            const files = file === undefined ? undefined
                : Array.isArray(file) ? file
                    : [file];
            const data = yield* apiRequest("getDeclarationDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return data ?? [];
        });
    }
    /**
     * Get program-wide diagnostics for the project, including compiler options diagnostics.
     */
    get getProgramDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getProgramDiagnostics", function () {
            const data = owner.client.apiRequest("getProgramDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        }, function* () {
            const data = yield* apiRequest("getProgramDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        });
    }
    /**
     * Get global (non-file-specific) semantic diagnostics for the project.
     */
    get getGlobalDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getGlobalDiagnostics", function () {
            const data = owner.client.apiRequest("getGlobalDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        }, function* () {
            const data = yield* apiRequest("getGlobalDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        });
    }
    /**
     * Get config file parsing diagnostics for the project.
     */
    get getConfigFileParsingDiagnostics() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConfigFileParsingDiagnostics", function () {
            const data = owner.client.apiRequest("getConfigFileParsingDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        }, function* () {
            const data = yield* apiRequest("getConfigFileParsingDiagnostics", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return data ?? [];
        });
    }
    /**
     * Emits files to the configured filesystem. Layer and host filesystems are
     * written through; full filesystems remain immutable and return emitted
     * files in {@link EmitResult.fileSystem}.
     */
    get emit() {
        const owner = this;
        return cacheGeneratorMethod(owner, "emit", function (emitOnly) {
            const response = owner.client.apiRequest("emit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                emitOnly,
            });
            const fileSystem = response.emittedFilesContents.length
                ? {
                    kind: "layer",
                    files: Object.fromEntries(response.emittedFiles.map((fileName, index) => [fileName, response.emittedFilesContents[index]])),
                }
                : undefined;
            return {
                emitSkipped: response.emitSkipped,
                diagnostics: response.diagnostics,
                emittedFiles: response.emittedFiles,
                ...(fileSystem ? { fileSystem } : {}),
            };
        }, function* (emitOnly) {
            const response = yield* apiRequest("emit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                emitOnly,
            });
            const fileSystem = response.emittedFilesContents.length
                ? {
                    kind: "layer",
                    files: Object.fromEntries(response.emittedFiles.map((fileName, index) => [fileName, response.emittedFilesContents[index]])),
                }
                : undefined;
            return {
                emitSkipped: response.emitSkipped,
                diagnostics: response.diagnostics,
                emittedFiles: response.emittedFiles,
                ...(fileSystem ? { fileSystem } : {}),
            };
        });
    }
    /**
     * Emits files and returns their contents without writing to the filesystem.
     */
    get emitToString() {
        const owner = this;
        return cacheGeneratorMethod(owner, "emitToString", function (emitOnly) {
            const response = owner.client.apiRequest("emitToString", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                emitOnly,
            });
            return toEmitOutput(response);
        }, function* (emitOnly) {
            const response = yield* apiRequest("emitToString", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                emitOnly,
            });
            return toEmitOutput(response);
        });
    }
    /**
     * Gets JavaScript output for selected files regardless of project `noEmit`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    get getJavaScriptEmit() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getJavaScriptEmit", function (files) {
            const response = owner.client.apiRequest("getJavaScriptEmit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return toEmitOutput(response);
        }, function* (files) {
            const response = yield* apiRequest("getJavaScriptEmit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return toEmitOutput(response);
        });
    }
    /**
     * Gets declaration output for selected files regardless of project `noEmit`, `declaration`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    get getDeclarationEmit() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDeclarationEmit", function (files) {
            const response = owner.client.apiRequest("getDeclarationEmit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return toEmitOutput(response);
        }, function* (files) {
            const response = yield* apiRequest("getDeclarationEmit", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                files,
            });
            return toEmitOutput(response);
        });
    }
    getProject() {
        return this.project;
    }
}
function toEmitOutput(response) {
    const outputFiles = new Map();
    for (const { fileName, ...outputFile } of response.outputFiles) {
        outputFiles.set(fileName, outputFile);
    }
    return {
        emitSkipped: response.emitSkipped,
        diagnostics: response.diagnostics,
        outputFiles,
    };
}
export class Checker {
    snapshotId;
    project;
    client;
    objectRegistry;
    wellKnownSymbols;
    wellKnownSignatures;
    constructor(snapshotId, project, client, objectRegistry) {
        this.snapshotId = snapshotId;
        this.project = project;
        this.client = client;
        this.objectRegistry = objectRegistry;
    }
    dispose() {
        this.objectRegistry.clear();
    }
    get getSymbolAtLocation() {
        const owner = this;
        function getSymbolAtLocation(nodeOrNodes) {
            if (Array.isArray(nodeOrNodes)) {
                const data = owner.client.apiRequest("getSymbolsAtLocations", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    locations: nodeOrNodes.map(node => getNodeId(node)),
                });
                return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
            }
            const data = owner.client.apiRequest("getSymbolAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(nodeOrNodes),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }
        function* gen(nodeOrNodes) {
            if (Array.isArray(nodeOrNodes)) {
                const data = yield* apiRequest("getSymbolsAtLocations", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    locations: nodeOrNodes.map(node => getNodeId(node)),
                });
                return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
            }
            const data = yield* apiRequest("getSymbolAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(nodeOrNodes),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }
        return cacheGeneratorMethod(owner, "getSymbolAtLocation", getSymbolAtLocation, gen);
    }
    get getSymbolAtPosition() {
        const owner = this;
        function getSymbolAtPosition(file, positionOrPositions) {
            if (typeof positionOrPositions === "number") {
                const data = owner.client.apiRequest("getSymbolAtPosition", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    file,
                    position: positionOrPositions,
                });
                return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
            }
            const data = owner.client.apiRequest("getSymbolsAtPositions", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                positions: positionOrPositions,
            });
            return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
        }
        function* gen(file, positionOrPositions) {
            if (typeof positionOrPositions === "number") {
                const data = yield* apiRequest("getSymbolAtPosition", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    file,
                    position: positionOrPositions,
                });
                return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
            }
            const data = yield* apiRequest("getSymbolsAtPositions", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                positions: positionOrPositions,
            });
            return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
        }
        return cacheGeneratorMethod(owner, "getSymbolAtPosition", getSymbolAtPosition, gen);
    }
    get getSymbolOfSourceFile() {
        const owner = this;
        function getSymbolOfSourceFile(fileOrFiles) {
            if (Array.isArray(fileOrFiles)) {
                const data = owner.client.apiRequest("getSymbolsOfSourceFiles", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    files: fileOrFiles,
                });
                return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
            }
            const data = owner.client.apiRequest("getSymbolOfSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: fileOrFiles,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }
        function* gen(fileOrFiles) {
            if (Array.isArray(fileOrFiles)) {
                const data = yield* apiRequest("getSymbolsOfSourceFiles", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    files: fileOrFiles,
                });
                return data.map(d => d ? owner.objectRegistry.getOrCreateSymbol(d) : undefined);
            }
            const data = yield* apiRequest("getSymbolOfSourceFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file: fileOrFiles,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }
        return cacheGeneratorMethod(owner, "getSymbolOfSourceFile", getSymbolOfSourceFile, gen);
    }
    /**
     * Get the type of a symbol. Always returns a type; for symbols whose type
     * cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    get getTypeOfSymbol() {
        const owner = this;
        function getTypeOfSymbol(symbolOrSymbols) {
            if (Array.isArray(symbolOrSymbols)) {
                const data = owner.client.apiRequest("getTypesOfSymbols", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    symbols: symbolOrSymbols.map(s => s.id),
                });
                return data.map(d => owner.objectRegistry.getOrCreateType(d));
            }
            const data = owner.client.apiRequest("getTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbolOrSymbols.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }
        function* gen(symbolOrSymbols) {
            if (Array.isArray(symbolOrSymbols)) {
                const data = yield* apiRequest("getTypesOfSymbols", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    symbols: symbolOrSymbols.map(s => s.id),
                });
                return data.map(d => owner.objectRegistry.getOrCreateType(d));
            }
            const data = yield* apiRequest("getTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbolOrSymbols.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }
        return cacheGeneratorMethod(owner, "getTypeOfSymbol", getTypeOfSymbol, gen);
    }
    /**
     * Get the declared type of a symbol. Always returns a type; for symbols whose
     * declared type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    get getDeclaredTypeOfSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDeclaredTypeOfSymbol", function (symbol) {
            const data = owner.client.apiRequest("getDeclaredTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (symbol) {
            const data = yield* apiRequest("getDeclaredTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    /**
     * Get the type of a symbol, excluding the missing type when
     * `exactOptionalPropertyTypes: true` is set; for symbols whose
     * type cannot be determined the checker yields the error type
     * (use {@link Type.isErrorType} to detect it).
     */
    get getNonMissingTypeOfSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNonMissingTypeOfSymbol", function (symbol) {
            const data = owner.client.apiRequest("getNonMissingTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (symbol) {
            const data = yield* apiRequest("getNonMissingTypeOfSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    get getReferencesToSymbolInFile() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReferencesToSymbolInFile", function (file, symbol) {
            const data = owner.client.apiRequest("getReferencesToSymbolInFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                symbol: symbol.id,
            });
            return (data ?? []).map(h => new NodeHandle(h, owner.project));
        }, function* (file, symbol) {
            const data = yield* apiRequest("getReferencesToSymbolInFile", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                symbol: symbol.id,
            });
            return (data ?? []).map(h => new NodeHandle(h, owner.project));
        });
    }
    /** @deprecated Use `project.languageService.getReferencedSymbolsForNode`. */
    get getReferencedSymbolsForNode() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReferencedSymbolsForNode", function (node, position) {
            return owner.project.languageService.getReferencedSymbolsForNode(node, position);
        }, function* (node, position) {
            return yield* owner.project.languageService.getReferencedSymbolsForNode.gen(node, position);
        });
    }
    /** @deprecated Use `project.languageService.getSignatureUsage`. */
    get getSignatureUsage() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSignatureUsage", function (signatureDecl) {
            return owner.project.languageService.getSignatureUsage(signatureDecl);
        }, function* (signatureDecl) {
            return yield* owner.project.languageService.getSignatureUsage.gen(signatureDecl);
        });
    }
    /** @deprecated Use `project.languageService.getCompletionsAtPosition`. */
    get getCompletionsAtPosition() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getCompletionsAtPosition", function (document, position, options) {
            return owner.project.languageService.getCompletionsAtPosition(document, position, options);
        }, function* (document, position, options) {
            return yield* owner.project.languageService.getCompletionsAtPosition.gen(document, position, options);
        });
    }
    /**
     * Get the type at a node location. Always returns a type; for nodes whose
     * type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    get getTypeAtLocation() {
        const owner = this;
        function getTypeAtLocation(nodeOrNodes) {
            if (Array.isArray(nodeOrNodes)) {
                const data = owner.client.apiRequest("getTypeAtLocations", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    locations: nodeOrNodes.map(node => getNodeId(node)),
                });
                return data.map(d => owner.objectRegistry.getOrCreateType(d));
            }
            const data = owner.client.apiRequest("getTypeAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(nodeOrNodes),
            });
            return owner.objectRegistry.getOrCreateType(data);
        }
        function* gen(nodeOrNodes) {
            if (Array.isArray(nodeOrNodes)) {
                const data = yield* apiRequest("getTypeAtLocations", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    locations: nodeOrNodes.map(node => getNodeId(node)),
                });
                return data.map(d => owner.objectRegistry.getOrCreateType(d));
            }
            const data = yield* apiRequest("getTypeAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(nodeOrNodes),
            });
            return owner.objectRegistry.getOrCreateType(data);
        }
        return cacheGeneratorMethod(owner, "getTypeAtLocation", getTypeAtLocation, gen);
    }
    get getSignaturesOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSignaturesOfType", function (type, kind) {
            return kind === SignatureKind.Call ? type.getCallSignatures() : type.getConstructSignatures();
        }, function* (type, kind) {
            return kind === SignatureKind.Call ? (yield* type.getCallSignatures.gen()) : (yield* type.getConstructSignatures.gen());
        });
    }
    /**
     * Get the resolved signature of a call-like expression. Always returns a
     * signature; when a call cannot be resolved the checker yields the unknown
     * signature (use {@link Checker.isUnknownSignature} to detect it).
     */
    get getResolvedSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedSignature", function (node) {
            const data = owner.client.apiRequest("getResolvedSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateSignature(data);
        }, function* (node) {
            const data = yield* apiRequest("getResolvedSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateSignature(data);
        });
    }
    get getTypeAtPosition() {
        const owner = this;
        function getTypeAtPosition(file, positionOrPositions) {
            if (typeof positionOrPositions === "number") {
                const data = owner.client.apiRequest("getTypeAtPosition", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    file,
                    position: positionOrPositions,
                });
                return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
            }
            const data = owner.client.apiRequest("getTypesAtPositions", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                positions: positionOrPositions,
            });
            return data.map(d => d ? owner.objectRegistry.getOrCreateType(d) : undefined);
        }
        function* gen(file, positionOrPositions) {
            if (typeof positionOrPositions === "number") {
                const data = yield* apiRequest("getTypeAtPosition", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    file,
                    position: positionOrPositions,
                });
                return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
            }
            const data = yield* apiRequest("getTypesAtPositions", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                file,
                positions: positionOrPositions,
            });
            return data.map(d => d ? owner.objectRegistry.getOrCreateType(d) : undefined);
        }
        return cacheGeneratorMethod(owner, "getTypeAtPosition", getTypeAtPosition, gen);
    }
    get resolveName() {
        const owner = this;
        return cacheGeneratorMethod(owner, "resolveName", function (name, meaning, location, excludeGlobals) {
            // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
            const isNode = location && "kind" in location;
            const data = owner.client.apiRequest("resolveName", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                name,
                meaning,
                location: isNode ? getNodeId(location) : undefined,
                file: !isNode && location ? location.document : undefined,
                position: !isNode && location ? location.position : undefined,
                excludeGlobals,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (name, meaning, location, excludeGlobals) {
            // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
            const isNode = location && "kind" in location;
            const data = yield* apiRequest("resolveName", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                name,
                meaning,
                location: isNode ? getNodeId(location) : undefined,
                file: !isNode && location ? location.document : undefined,
                position: !isNode && location ? location.position : undefined,
                excludeGlobals,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    /**
     * Returns all symbols with the given meaning that are visible at `location`.
     */
    get getSymbolsInScope() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSymbolsInScope", function (location, meaning) {
            // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
            const isNode = "kind" in location;
            const data = owner.client.apiRequest("getSymbolsInScope", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                meaning,
                location: isNode ? getNodeId(location) : undefined,
                file: isNode ? undefined : location.document,
                position: isNode ? undefined : location.position,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateSymbol(d)) : [];
        }, function* (location, meaning) {
            // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
            const isNode = "kind" in location;
            const data = yield* apiRequest("getSymbolsInScope", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                meaning,
                location: isNode ? getNodeId(location) : undefined,
                file: isNode ? undefined : location.document,
                position: isNode ? undefined : location.position,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateSymbol(d)) : [];
        });
    }
    get getResolvedSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getResolvedSymbol", function (node) {
            const text = node.text;
            if (!text)
                return undefined;
            return owner.resolveName(text, SymbolFlags.Value | SymbolFlags.ExportValue, node);
        }, function* (node) {
            const text = node.text;
            if (!text)
                return undefined;
            return yield* owner.resolveName.gen(text, SymbolFlags.Value | SymbolFlags.ExportValue, node);
        });
    }
    get getContextualType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getContextualType", function (node) {
            const data = owner.client.apiRequest("getContextualType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (node) {
            const data = yield* apiRequest("getContextualType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    get getContextualTypeForArgumentAtIndex() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getContextualTypeForArgumentAtIndex", function (node, argIndex) {
            const data = owner.client.apiRequest("getContextualTypeForArgument", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
                index: argIndex,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (node, argIndex) {
            const data = yield* apiRequest("getContextualTypeForArgument", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
                index: argIndex,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    get getAwaitedType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getAwaitedType", function (type) {
            const data = owner.client.apiRequest("getAwaitedType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (type) {
            const data = yield* apiRequest("getAwaitedType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    /** Get the base type of a literal type (e.g. `number` for `42`). Always returns a type. */
    get getBaseTypeOfLiteralType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBaseTypeOfLiteralType", function (type) {
            const data = owner.client.apiRequest("getBaseTypeOfLiteralType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (type) {
            const data = yield* apiRequest("getBaseTypeOfLiteralType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    /** Get the type with `null` and `undefined` removed. Always returns a type. */
    get getNonNullableType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNonNullableType", function (type) {
            return type.getNonNullableType();
        }, function* (type) {
            return yield* type.getNonNullableType.gen();
        });
    }
    /**
     * Get the type for a type node. Always returns a type; for type nodes whose
     * type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    get getTypeFromTypeNode() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeFromTypeNode", function (node) {
            const data = owner.client.apiRequest("getTypeFromTypeNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (node) {
            const data = yield* apiRequest("getTypeFromTypeNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    /** Get the widened type. Always returns a type. */
    get getWidenedType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getWidenedType", function (type) {
            const data = owner.client.apiRequest("getWidenedType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (type) {
            const data = yield* apiRequest("getWidenedType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    /**
     * Get the type of the parameter at the given index in a signature. Always
     * returns a type; an out-of-range index yields the `any` type.
     */
    get getParameterType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getParameterType", function (signature, index) {
            const data = owner.client.apiRequest("getParameterType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
                index,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (signature, index) {
            const data = yield* apiRequest("getParameterType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
                index,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    get isArrayLikeType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isArrayLikeType", function (type) {
            return owner.client.apiRequest("isArrayLikeType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
        }, function* (type) {
            return yield* apiRequest("isArrayLikeType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
        });
    }
    get isTypeAssignableTo() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isTypeAssignableTo", function (source, target) {
            return owner.client.apiRequest("isTypeAssignableTo", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                source: source.id,
                target: target.id,
            });
        }, function* (source, target) {
            return yield* apiRequest("isTypeAssignableTo", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                source: source.id,
                target: target.id,
            });
        });
    }
    get getShorthandAssignmentValueSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getShorthandAssignmentValueSymbol", function (node) {
            const data = owner.client.apiRequest("getShorthandAssignmentValueSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (node) {
            const data = yield* apiRequest("getShorthandAssignmentValueSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    /**
     * Get the type of a symbol as narrowed at a specific location. Always returns
     * a type; for symbols whose type cannot be determined the checker yields the
     * error type (use {@link Type.isErrorType} to detect it).
     */
    get getTypeOfSymbolAtLocation() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeOfSymbolAtLocation", function (symbol, location) {
            const data = owner.client.apiRequest("getTypeOfSymbolAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
                location: getNodeId(location),
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (symbol, location) {
            const data = yield* apiRequest("getTypeOfSymbolAtLocation", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
                location: getNodeId(location),
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    get getIntrinsicType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIntrinsicType", function (method) {
            const data = owner.client.apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (method) {
            const data = yield* apiRequest(method, {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    get getAnyType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getAnyType", function () {
            return owner.getIntrinsicType("getAnyType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getAnyType");
        });
    }
    get getStringType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getStringType", function () {
            return owner.getIntrinsicType("getStringType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getStringType");
        });
    }
    get getNumberType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNumberType", function () {
            return owner.getIntrinsicType("getNumberType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getNumberType");
        });
    }
    get getBooleanType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBooleanType", function () {
            return owner.getIntrinsicType("getBooleanType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getBooleanType");
        });
    }
    get getVoidType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getVoidType", function () {
            return owner.getIntrinsicType("getVoidType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getVoidType");
        });
    }
    get getUndefinedType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getUndefinedType", function () {
            return owner.getIntrinsicType("getUndefinedType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getUndefinedType");
        });
    }
    get getNullType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNullType", function () {
            return owner.getIntrinsicType("getNullType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getNullType");
        });
    }
    get getNeverType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNeverType", function () {
            return owner.getIntrinsicType("getNeverType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getNeverType");
        });
    }
    get getUnknownType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getUnknownType", function () {
            return owner.getIntrinsicType("getUnknownType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getUnknownType");
        });
    }
    get getBigIntType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBigIntType", function () {
            return owner.getIntrinsicType("getBigIntType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getBigIntType");
        });
    }
    get getESSymbolType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getESSymbolType", function () {
            return owner.getIntrinsicType("getESSymbolType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getESSymbolType");
        });
    }
    get getNonPrimitiveType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNonPrimitiveType", function () {
            return owner.getIntrinsicType("getNonPrimitiveType");
        }, function* () {
            return yield* owner.getIntrinsicType.gen("getNonPrimitiveType");
        });
    }
    get typeToTypeNode() {
        const owner = this;
        return cacheGeneratorMethod(owner, "typeToTypeNode", function (type, enclosingDeclaration, flags) {
            const binaryData = owner.client.apiRequestBinary("typeToTypeNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (!binaryData)
                return undefined;
            return decodeNode(binaryData);
        }, function* (type, enclosingDeclaration, flags) {
            const binaryData = owner.client.apiRequestBinary("typeToTypeNode", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (!binaryData)
                return undefined;
            return decodeNode(binaryData);
        });
    }
    get signatureToSignatureDeclaration() {
        const owner = this;
        return cacheGeneratorMethod(owner, "signatureToSignatureDeclaration", function (signature, kind, enclosingDeclaration, flags) {
            const binaryData = owner.client.apiRequestBinary("signatureToSignatureDeclaration", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
                kind,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (!binaryData)
                return undefined;
            return decodeNode(binaryData);
        }, function* (signature, kind, enclosingDeclaration, flags) {
            const binaryData = owner.client.apiRequestBinary("signatureToSignatureDeclaration", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
                kind,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (!binaryData)
                return undefined;
            return decodeNode(binaryData);
        });
    }
    get typeToString() {
        const owner = this;
        return cacheGeneratorMethod(owner, "typeToString", function (type, enclosingDeclaration, flags) {
            const result = owner.client.apiRequest("typeToString", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (typeof result !== "string")
                throw new TypeError("typeToString returned a non-string result");
            return result;
        }, function* (type, enclosingDeclaration, flags) {
            const result = yield* apiRequest("typeToString", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
                flags,
            });
            if (typeof result !== "string")
                throw new TypeError("typeToString returned a non-string result");
            return result;
        });
    }
    get isContextSensitive() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isContextSensitive", function (node) {
            return owner.client.apiRequest("isContextSensitive", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
        }, function* (node) {
            return yield* apiRequest("isContextSensitive", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
        });
    }
    get isArrayType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isArrayType", function (type) {
            return owner.client.apiRequest("isArrayType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
        }, function* (type) {
            return yield* apiRequest("isArrayType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
        });
    }
    get isTupleType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isTupleType", function (type) {
            return type.isTupleType();
        }, function* (type) {
            return type.isTupleType();
        });
    }
    get isTupleTypeTarget() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isTupleTypeTarget", function (type) {
            return type.isTupleTypeTarget();
        }, function* (type) {
            return type.isTupleTypeTarget();
        });
    }
    /**
     * The following symbols are considered read-only:
     * - Properties with a `readonly` modifier
     * - Variables declared with `const`
     * - Get accessors without matching set accessors
     * - Enum members
     * - `Object.defineProperty` assignments with `writable: false` or no setter
     * - Unions and intersections of the above
     */
    get isReadonlySymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isReadonlySymbol", function (symbol) {
            return owner.client.apiRequest("isReadonlySymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        }, function* (symbol) {
            return yield* apiRequest("isReadonlySymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        });
    }
    /** Get the return type of a signature. Always returns a type. */
    get getReturnTypeOfSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReturnTypeOfSignature", function (signature) {
            return signature.getReturnType();
        }, function* (signature) {
            return yield* signature.getReturnType.gen();
        });
    }
    /**
     * Get the rest type of a signature. Always returns a type; a signature with
     * no rest parameter yields the `any` type.
     */
    get getRestTypeOfSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getRestTypeOfSignature", function (signature) {
            const data = owner.client.apiRequest("getRestTypeOfSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        }, function* (signature) {
            const data = yield* apiRequest("getRestTypeOfSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
            });
            return owner.objectRegistry.getOrCreateType(data);
        });
    }
    get getTypePredicateOfSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypePredicateOfSignature", function (signature) {
            const data = owner.client.apiRequest("getTypePredicateOfSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
            });
            if (!data)
                return undefined;
            return {
                kind: data.kind,
                parameterIndex: data.parameterIndex,
                parameterName: data.parameterName,
                type: data.type ? owner.objectRegistry.getOrCreateType(data.type) : undefined,
            };
        }, function* (signature) {
            const data = yield* apiRequest("getTypePredicateOfSignature", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                signature: signature.id,
            });
            if (!data)
                return undefined;
            return {
                kind: data.kind,
                parameterIndex: data.parameterIndex,
                parameterName: data.parameterName,
                type: data.type ? owner.objectRegistry.getOrCreateType(data.type) : undefined,
            };
        });
    }
    /**
     * Get the base types of a class or interface type. A type with no base types
     * yields an empty array.
     */
    get getBaseTypes() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBaseTypes", function (type) {
            return type.getBaseTypes() ?? [];
        }, function* (type) {
            return (yield* type.getBaseTypes.gen()) ?? [];
        });
    }
    /** Get the apparent type of a type. Always returns a type. */
    get getApparentType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getApparentType", function (type) {
            return type.getApparentType();
        }, function* (type) {
            return yield* type.getApparentType.gen();
        });
    }
    /** Get the reduced type of a type. Always returns a type. */
    get getReducedType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReducedType", function (type) {
            return type.getReducedType();
        }, function* (type) {
            return yield* type.getReducedType.gen();
        });
    }
    get getPropertiesOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getPropertiesOfType", function (type) {
            return type.getProperties();
        }, function* (type) {
            return yield* type.getProperties.gen();
        });
    }
    get getIndexInfosOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIndexInfosOfType", function (type) {
            return type.getIndexInfos();
        }, function* (type) {
            return yield* type.getIndexInfos.gen();
        });
    }
    get getIndexInfoOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIndexInfoOfType", function (type, kind) {
            const data = owner.client.apiRequest("getIndexInfoOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                kind,
            });
            return data ? {
                keyType: owner.objectRegistry.getOrCreateType(data.keyType),
                valueType: owner.objectRegistry.getOrCreateType(data.valueType),
                isReadonly: data.isReadonly ?? false,
                declaration: data.declaration ? new NodeHandle(data.declaration, owner.project) : undefined,
            } : undefined;
        }, function* (type, kind) {
            const data = yield* apiRequest("getIndexInfoOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                kind,
            });
            return data ? {
                keyType: owner.objectRegistry.getOrCreateType(data.keyType),
                valueType: owner.objectRegistry.getOrCreateType(data.valueType),
                isReadonly: data.isReadonly ?? false,
                declaration: data.declaration ? new NodeHandle(data.declaration, owner.project) : undefined,
            } : undefined;
        });
    }
    get getIndexTypeOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIndexTypeOfType", function (type, kind) {
            const data = owner.client.apiRequest("getIndexTypeOfTypeByKind", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                kind,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (type, kind) {
            const data = yield* apiRequest("getIndexTypeOfTypeByKind", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                kind,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    get getTypeOfPropertyOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeOfPropertyOfType", function (type, propertyName) {
            const data = owner.client.apiRequest("getTypeOfPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                name: propertyName,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (type, propertyName) {
            const data = yield* apiRequest("getTypeOfPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                name: propertyName,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    /**
     * Get the constraint of a type parameter (the `T` in `<U extends T>`), or
     * undefined if it has none.
     */
    get getConstraintOfTypeParameter() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConstraintOfTypeParameter", function (type) {
            return type.getConstraint();
        }, function* (type) {
            return yield* type.getConstraint.gen();
        });
    }
    get getDefaultFromTypeParameter() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDefaultFromTypeParameter", function (type) {
            return type.getDefault();
        }, function* (type) {
            return yield* type.getDefault.gen();
        });
    }
    get getBaseConstraintOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBaseConstraintOfType", function (type) {
            const data = owner.client.apiRequest("getBaseConstraintOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        }, function* (type) {
            const data = yield* apiRequest("getBaseConstraintOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? owner.objectRegistry.getOrCreateType(data) : undefined;
        });
    }
    get getPropertyOfType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getPropertyOfType", function (type, name) {
            const data = owner.client.apiRequest("getPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                name,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (type, name) {
            const data = yield* apiRequest("getPropertyOfType", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
                name,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    get getConstantValue() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConstantValue", function (node) {
            const data = owner.client.apiRequest("getConstantValue", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return typeof data === "string" || typeof data === "number" ? data : undefined;
        }, function* (node) {
            const data = yield* apiRequest("getConstantValue", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return typeof data === "string" || typeof data === "number" ? data : undefined;
        });
    }
    /** Get the signature of a function-like declaration. Always returns a signature. */
    get getSignatureFromDeclaration() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSignatureFromDeclaration", function (node) {
            const data = owner.client.apiRequest("getSignatureFromDeclaration", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateSignature(data);
        }, function* (node) {
            const data = yield* apiRequest("getSignatureFromDeclaration", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return owner.objectRegistry.getOrCreateSignature(data);
        });
    }
    get getExportSpecifierLocalTargetSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExportSpecifierLocalTargetSymbol", function (node) {
            const data = owner.client.apiRequest("getExportSpecifierLocalTargetSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (node) {
            const data = yield* apiRequest("getExportSpecifierLocalTargetSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                location: getNodeId(node),
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    /**
     * Follow all aliases to get the original symbol. Always returns a symbol; for
     * an unresolved alias the checker yields the unknown symbol (use
     * {@link Checker.isUnknownSymbol} to detect it).
     */
    get getAliasedSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getAliasedSymbol", function (symbol) {
            const data = owner.client.apiRequest("getAliasedSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateSymbol(data);
        }, function* (symbol) {
            const data = yield* apiRequest("getAliasedSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateSymbol(data);
        });
    }
    /**
     * Get the fully qualified name of a symbol, walking up its parent chain
     * (e.g. `"/path/to/module".Namespace.Name`).
     */
    get getFullyQualifiedName() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getFullyQualifiedName", function (symbol) {
            return owner.client.apiRequest("getFullyQualifiedName", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        }, function* (symbol) {
            return yield* apiRequest("getFullyQualifiedName", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        });
    }
    get getImmediateAliasedSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getImmediateAliasedSymbol", function (symbol) {
            const data = owner.client.apiRequest("getImmediateAliasedSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (symbol) {
            const data = yield* apiRequest("getImmediateAliasedSymbol", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    /**
     * Get the target symbol if instantiated, or the provided symbol otherwise.
     */
    get getTargetSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTargetSymbol", function (symbol) {
            if (symbol.checkFlags & CheckFlags.Instantiated) {
                const data = owner.client.apiRequest("getTargetSymbol", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    symbol: symbol.id,
                });
                return owner.objectRegistry.getOrCreateSymbol(data);
            }
            return symbol;
        }, function* (symbol) {
            if (symbol.checkFlags & CheckFlags.Instantiated) {
                const data = yield* apiRequest("getTargetSymbol", {
                    snapshot: owner.snapshotId,
                    project: owner.project.id,
                    symbol: symbol.id,
                });
                return owner.objectRegistry.getOrCreateSymbol(data);
            }
            return symbol;
        });
    }
    get getExportSymbolOfSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExportSymbolOfSymbol", function (symbol) {
            const data = owner.client.apiRequest("getExportSymbolOfSymbolForChecker", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateSymbol(data);
        }, function* (symbol) {
            const data = yield* apiRequest("getExportSymbolOfSymbolForChecker", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return owner.objectRegistry.getOrCreateSymbol(data);
        });
    }
    /**
     * Fetch (once, then cache) the handle ids of the per-checker singleton
     * symbols (unknown, undefined, arguments). These ids are stable for the life
     * of the project's checker, so identity checks against them are local after
     * the first call.
     */
    get getWellKnownSymbols() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getWellKnownSymbols", function () {
            return owner.wellKnownSymbols ??= owner.client.apiRequest("getWellKnownSymbols", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
        }, function* () {
            return owner.wellKnownSymbols ??= yield* apiRequest("getWellKnownSymbols", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
        });
    }
    /**
     * Returns `true` if the symbol is the checker's "unknown" symbol (e.g. the
     * result of {@link Checker.getAliasedSymbol} on an unresolved alias).
     */
    get isUnknownSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isUnknownSymbol", function (symbol) {
            return symbol.id === (owner.getWellKnownSymbols()).unknown;
        }, function* (symbol) {
            return symbol.id === (yield* owner.getWellKnownSymbols.gen()).unknown;
        });
    }
    /**
     * Returns `true` if the symbol is the checker's "undefined" symbol.
     */
    get isUndefinedSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isUndefinedSymbol", function (symbol) {
            return symbol.id === (owner.getWellKnownSymbols()).undefined;
        }, function* (symbol) {
            return symbol.id === (yield* owner.getWellKnownSymbols.gen()).undefined;
        });
    }
    /**
     * Returns `true` if the symbol is the checker's "arguments" symbol.
     */
    get isArgumentsSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isArgumentsSymbol", function (symbol) {
            return symbol.id === (owner.getWellKnownSymbols()).arguments;
        }, function* (symbol) {
            return symbol.id === (yield* owner.getWellKnownSymbols.gen()).arguments;
        });
    }
    /**
     * Fetch (once, then cache) the handle id of the per-checker unknown
     * signature. This id is stable for the life of the project's checker, so
     * identity checks against it are local after the first call.
     */
    get getWellKnownSignatures() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getWellKnownSignatures", function () {
            return owner.wellKnownSignatures ??= owner.client.apiRequest("getWellKnownSignatures", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
        }, function* () {
            return owner.wellKnownSignatures ??= yield* apiRequest("getWellKnownSignatures", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
            });
        });
    }
    /**
     * Returns `true` if the signature is the checker's "unknown" signature (e.g.
     * the result of {@link Checker.getResolvedSignature} on a call that cannot be
     * resolved).
     */
    get isUnknownSignature() {
        const owner = this;
        return cacheGeneratorMethod(owner, "isUnknownSignature", function (signature) {
            return signature.id === (owner.getWellKnownSignatures()).unknown;
        }, function* (signature) {
            return signature.id === (yield* owner.getWellKnownSignatures.gen()).unknown;
        });
    }
    get getExportsOfModule() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExportsOfModule", function (symbol) {
            const data = owner.client.apiRequest("getExportsOfModule", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateSymbol(d)) : [];
        }, function* (symbol) {
            const data = yield* apiRequest("getExportsOfModule", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateSymbol(d)) : [];
        });
    }
    get getMemberInModuleExports() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getMemberInModuleExports", function (symbol, name) {
            const data = owner.client.apiRequest("getMemberInModuleExports", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
                name,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        }, function* (symbol, name) {
            const data = yield* apiRequest("getMemberInModuleExports", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
                name,
            });
            return data ? owner.objectRegistry.getOrCreateSymbol(data) : undefined;
        });
    }
    get getJsDocTagsOfSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getJsDocTagsOfSymbol", function (symbol) {
            const data = owner.client.apiRequest("getJsDocTags", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ?? [];
        }, function* (symbol) {
            const data = yield* apiRequest("getJsDocTags", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
            return data ?? [];
        });
    }
    get getDocumentationCommentOfSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDocumentationCommentOfSymbol", function (symbol) {
            return owner.client.apiRequest("getDocumentationComment", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        }, function* (symbol) {
            return yield* apiRequest("getDocumentationComment", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                symbol: symbol.id,
            });
        });
    }
    /**
     * Get the type arguments of a type reference (e.g. the `string` in `Array<string>`).
     */
    get getTypeArguments() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeArguments", function (type) {
            const data = owner.client.apiRequest("getTypeArguments", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateType(d)) : [];
        }, function* (type) {
            const data = yield* apiRequest("getTypeArguments", {
                snapshot: owner.snapshotId,
                project: owner.project.id,
                type: type.id,
            });
            return data ? data.map(d => owner.objectRegistry.getOrCreateType(d)) : [];
        });
    }
}
export class Emitter {
    client;
    constructor(client) {
        this.client = client;
    }
    get printNode() {
        const owner = this;
        return cacheGeneratorMethod(owner, "printNode", function (node, options = {}) {
            const encoded = encodeNode(node);
            const base64 = uint8ArrayToBase64(encoded);
            return owner.client.apiRequest("printNode", {
                data: base64,
                preserveSourceNewlines: options.preserveSourceNewlines,
                neverAsciiEscape: options.neverAsciiEscape,
                terminateUnterminatedLiterals: options.terminateUnterminatedLiterals,
            });
        }, function* (node, options = {}) {
            const encoded = encodeNode(node);
            const base64 = uint8ArrayToBase64(encoded);
            return yield* apiRequest("printNode", {
                data: base64,
                preserveSourceNewlines: options.preserveSourceNewlines,
                neverAsciiEscape: options.neverAsciiEscape,
                terminateUnterminatedLiterals: options.terminateUnterminatedLiterals,
            });
        });
    }
}
export class SnapshotInternalAPI {
    snapshotId;
    client;
    constructor(snapshotId, client) {
        this.snapshotId = snapshotId;
        this.client = client;
    }
    /**
     * Format a synthesized node with the correct indentation for insertion at a
     * specific position in an existing source file.
     *
     * @param node The synthesized AST node to format.
     * @param file The target file where the node will be inserted.
     * @param position The UTF-16 code-unit offset in the target file for insertion.
     * @returns The formatted text of the node, indented for the insertion position.
     */
    get formatNodeForInsertion() {
        const owner = this;
        return cacheGeneratorMethod(owner, "formatNodeForInsertion", function (node, file, position) {
            const data = owner.client.apiRequest("getDefaultProjectForFile", {
                snapshot: owner.snapshotId,
                file,
            });
            if (!data) {
                throw new Error(`No project found for file: ${typeof file === "string" ? file : file.uri}`);
            }
            const encoded = encodeNode(node);
            const base64 = uint8ArrayToBase64(encoded);
            return owner.client.apiRequest("formatNodeForInsertion", {
                snapshot: owner.snapshotId,
                project: data.id,
                file,
                position,
                data: base64,
            });
        }, function* (node, file, position) {
            const data = yield* apiRequest("getDefaultProjectForFile", {
                snapshot: owner.snapshotId,
                file,
            });
            if (!data) {
                throw new Error(`No project found for file: ${typeof file === "string" ? file : file.uri}`);
            }
            const encoded = encodeNode(node);
            const base64 = uint8ArrayToBase64(encoded);
            return yield* apiRequest("formatNodeForInsertion", {
                snapshot: owner.snapshotId,
                project: data.id,
                file,
                position,
                data: base64,
            });
        });
    }
}
export class NodeHandle {
    /**
     * The project this handle was produced in, used as the default for {@link resolve}.
     * Node handles are only meaningful within a project's program, so the producing project
     * is remembered so callers don't have to pass it explicitly.
     */
    canonicalProject;
    index;
    kind;
    path;
    constructor(handle, canonicalProject) {
        const parsed = parseNodeHandle(handle);
        this.index = parsed.index;
        this.kind = parsed.kind;
        this.path = parsed.path;
        this.canonicalProject = canonicalProject;
    }
    /**
     * Resolve this handle to the actual AST node by fetching the source file from a project
     * and looking up the node by index. If no project is passed, the project that produced
     * the handle is used.
     */
    get resolve() {
        const owner = this;
        return cacheGeneratorMethod(owner, "resolve", function (project = owner.canonicalProject) {
            const sourceFile = project.program.getSourceFile(owner.path);
            if (!sourceFile) {
                return undefined;
            }
            return sourceFile.getOrCreateNodeAtIndex(owner.index);
        }, function* (project = owner.canonicalProject) {
            const sourceFile = yield* project.program.getSourceFile.gen(owner.path);
            if (!sourceFile) {
                return undefined;
            }
            return sourceFile.getOrCreateNodeAtIndex(owner.index);
        });
    }
}
export class Symbol {
    objectRegistry;
    /**
     * The project this symbol was first observed in, used as the default project for
     * lookups that need a project context (members/exports/parent). Symbols are shared
     * snapshot-wide, so these lookups can otherwise be ambiguous about which project to use.
     */
    canonicalProject;
    id;
    /** The escaped (`__String`) name, used as the key in member/export tables. */
    escapedName;
    /** The display name (escaped underscores removed). */
    name;
    flags;
    checkFlags;
    declarations;
    valueDeclaration;
    parent;
    exportSymbol;
    membersCache;
    exportsCache;
    constructor(data, objectRegistry) {
        this.objectRegistry = objectRegistry;
        this.id = data.id;
        this.escapedName = data.name;
        this.name = unescapeLeadingUnderscores(data.name);
        this.flags = data.flags;
        this.checkFlags = data.checkFlags;
        const canonicalProject = objectRegistry.getProject(data.project);
        if (!canonicalProject) {
            throw new Error(`Symbol ${data.id} references unknown canonical project '${data.project}'`);
        }
        this.canonicalProject = canonicalProject;
        this.declarations = (data.declarations ?? []).map(d => new NodeHandle(d, canonicalProject));
        this.valueDeclaration = data.valueDeclaration ? new NodeHandle(data.valueDeclaration, canonicalProject) : undefined;
        if (data.parent !== undefined)
            this.parent = data.parent;
        if (data.exportSymbol !== undefined)
            this.exportSymbol = data.exportSymbol;
    }
    get getParent() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getParent", function () {
            return owner.objectRegistry.fetchSymbol(owner, "getParentOfSymbol", owner.parent, owner.canonicalProject.id);
        }, function* () {
            return yield* owner.objectRegistry.fetchSymbol.gen(owner, "getParentOfSymbol", owner.parent, owner.canonicalProject.id);
        });
    }
    /**
     * Get this symbol's members keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    get getMembers() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getMembers", function () {
            return owner.membersCache ??= owner.fetchSymbolTable("getMembersOfSymbol");
        }, function* () {
            return owner.membersCache ??= yield* owner.fetchSymbolTable.gen("getMembersOfSymbol");
        });
    }
    /**
     * Get this symbol's exports keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    get getExports() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExports", function () {
            return owner.exportsCache ??= owner.fetchSymbolTable("getExportsOfSymbol");
        }, function* () {
            return owner.exportsCache ??= yield* owner.fetchSymbolTable.gen("getExportsOfSymbol");
        });
    }
    get fetchSymbolTable() {
        const owner = this;
        return cacheGeneratorMethod(owner, "fetchSymbolTable", function (method) {
            const symbols = owner.objectRegistry.fetchSymbols(owner, method, undefined, owner.canonicalProject.id);
            const table = new Map();
            for (const symbol of symbols) {
                table.set(symbol.escapedName, symbol);
            }
            return table;
        }, function* (method) {
            const symbols = yield* owner.objectRegistry.fetchSymbols.gen(owner, method, undefined, owner.canonicalProject.id);
            const table = new Map();
            for (const symbol of symbols) {
                table.set(symbol.escapedName, symbol);
            }
            return table;
        });
    }
    get getExportSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExportSymbol", function () {
            if (!owner.exportSymbol)
                return owner;
            return owner.objectRegistry.fetchSymbol(owner, "getExportSymbolOfSymbol", owner.exportSymbol, owner.canonicalProject.id);
        }, function* () {
            if (!owner.exportSymbol)
                return owner;
            return yield* owner.objectRegistry.fetchSymbol.gen(owner, "getExportSymbolOfSymbol", owner.exportSymbol, owner.canonicalProject.id);
        });
    }
    get getJsDocTags() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getJsDocTags", function (checker) {
            return checker.getJsDocTagsOfSymbol(owner);
        }, function* (checker) {
            return yield* checker.getJsDocTagsOfSymbol.gen(owner);
        });
    }
    get getDocumentationComment() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDocumentationComment", function (checker) {
            return checker.getDocumentationCommentOfSymbol(owner);
        }, function* (checker) {
            return yield* checker.getDocumentationCommentOfSymbol.gen(owner);
        });
    }
}
class TypeObject {
    objectRegistry;
    // Fields included in TypeResponse. References to other objects are stored as IDs
    // and resolved lazily via the object registry.
    id;
    flags;
    objectFlags;
    symbol;
    value;
    intrinsicName;
    isThisType;
    freshType;
    regularType;
    target;
    tupleType;
    typeParameters;
    outerTypeParameters;
    localTypeParameters;
    thisType;
    aliasTypeArguments;
    aliasSymbol;
    elementFlags;
    fixedLength;
    readonly;
    labeledElementDeclarations;
    texts;
    objectType;
    indexType;
    checkType;
    extendsType;
    baseType;
    substConstraint;
    // Cached results of lazy fetches, not included in TypeResponse
    // (typically because they require some amount of computation or
    // could cause an arbitrarily large number of types to be cached
    // on the server for ID-based lookup). `false` is a sentinel value
    // indicating a fetch has not yet occurred.
    trueType;
    falseType;
    constraint;
    default;
    nonNullableType;
    apparentType;
    reducedType;
    properties;
    apparentProperties;
    callSignatures;
    constructSignatures;
    indexInfos;
    baseTypes;
    stringIndexType;
    numberIndexType;
    constructor(data, objectRegistry) {
        this.objectRegistry = objectRegistry;
        this.id = data.id;
        this.flags = data.flags;
        if (data.objectFlags !== undefined)
            this.objectFlags = data.objectFlags;
        if (data.symbol !== undefined)
            this.symbol = data.symbol;
        if (data.value != null) {
            // BigInt literal values are serialized as decimal strings (e.g. "-123") because
            // JSON cannot represent bigint. Decode them back into a real bigint here.
            const value = data.value;
            this.value = (data.flags & TypeFlags.BigIntLiteral) ? BigInt(value) : value;
        }
        if (data.intrinsicName !== undefined)
            this.intrinsicName = data.intrinsicName;
        if (data.isThisType !== undefined)
            this.isThisType = data.isThisType;
        if (data.freshType !== undefined)
            this.freshType = data.freshType;
        if (data.regularType !== undefined)
            this.regularType = data.regularType;
        if (data.target !== undefined)
            this.target = data.target;
        this.tupleType = data.isTupleType ?? false;
        this.typeParameters = data.typeParameters ?? [];
        this.outerTypeParameters = data.outerTypeParameters ?? [];
        this.localTypeParameters = data.localTypeParameters ?? [];
        if (data.thisType !== undefined)
            this.thisType = data.thisType;
        this.aliasTypeArguments = data.aliasTypeArguments ?? [];
        if (data.aliasSymbol !== undefined)
            this.aliasSymbol = data.aliasSymbol;
        if (data.fixedLength !== undefined) {
            this.elementFlags = data.elementFlags ?? [];
            this.fixedLength = data.fixedLength;
        }
        if (data.readonly !== undefined)
            this.readonly = data.readonly;
        if (data.labeledElementDeclarations !== undefined) {
            this.labeledElementDeclarations = data.labeledElementDeclarations.map(handle => handle ? objectRegistry.createNodeHandle(handle) : undefined);
        }
        if (data.texts !== undefined)
            this.texts = data.texts;
        if (data.objectType !== undefined)
            this.objectType = data.objectType;
        if (data.indexType !== undefined)
            this.indexType = data.indexType;
        if (data.checkType !== undefined)
            this.checkType = data.checkType;
        if (data.extendsType !== undefined)
            this.extendsType = data.extendsType;
        if (data.baseType !== undefined)
            this.baseType = data.baseType;
        if (data.substConstraint !== undefined)
            this.substConstraint = data.substConstraint;
        this.trueType = false;
        this.falseType = false;
        this.constraint = false;
        this.default = false;
        this.nonNullableType = false;
        this.apparentType = false;
        this.reducedType = false;
        this.properties = false;
        this.apparentProperties = false;
        this.callSignatures = false;
        this.constructSignatures = false;
        this.indexInfos = false;
        this.baseTypes = false;
        this.stringIndexType = false;
        this.numberIndexType = false;
    }
    get getSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getSymbol", function () {
            return owner.objectRegistry.fetchSymbol(owner, "getSymbolOfType", owner.symbol);
        }, function* () {
            return yield* owner.objectRegistry.fetchSymbol.gen(owner, "getSymbolOfType", owner.symbol);
        });
    }
    get getProperties() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getProperties", function () {
            if (owner.properties === false) {
                owner.properties = owner.objectRegistry.fetchPropertiesOfType(owner);
            }
            return owner.properties;
        }, function* () {
            if (owner.properties === false) {
                owner.properties = yield* owner.objectRegistry.fetchPropertiesOfType.gen(owner);
            }
            return owner.properties;
        });
    }
    get getProperty() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getProperty", function (propertyName) {
            return owner.objectRegistry.fetchPropertyOfType(owner, propertyName);
        }, function* (propertyName) {
            return yield* owner.objectRegistry.fetchPropertyOfType.gen(owner, propertyName);
        });
    }
    get getApparentProperties() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getApparentProperties", function () {
            if (owner.apparentProperties === false) {
                owner.apparentProperties = owner.objectRegistry.fetchApparentPropertiesOfType(owner);
            }
            return owner.apparentProperties;
        }, function* () {
            if (owner.apparentProperties === false) {
                owner.apparentProperties = yield* owner.objectRegistry.fetchApparentPropertiesOfType.gen(owner);
            }
            return owner.apparentProperties;
        });
    }
    get getCallSignatures() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getCallSignatures", function () {
            if (owner.callSignatures === false) {
                owner.callSignatures = owner.objectRegistry.fetchSignaturesOfType(owner, SignatureKind.Call);
            }
            return owner.callSignatures;
        }, function* () {
            if (owner.callSignatures === false) {
                owner.callSignatures = yield* owner.objectRegistry.fetchSignaturesOfType.gen(owner, SignatureKind.Call);
            }
            return owner.callSignatures;
        });
    }
    get getConstructSignatures() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConstructSignatures", function () {
            if (owner.constructSignatures === false) {
                owner.constructSignatures = owner.objectRegistry.fetchSignaturesOfType(owner, SignatureKind.Construct);
            }
            return owner.constructSignatures;
        }, function* () {
            if (owner.constructSignatures === false) {
                owner.constructSignatures = yield* owner.objectRegistry.fetchSignaturesOfType.gen(owner, SignatureKind.Construct);
            }
            return owner.constructSignatures;
        });
    }
    get getNonNullableType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNonNullableType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getNonNullableType", owner.nonNullableType);
            owner.nonNullableType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getNonNullableType", owner.nonNullableType);
            owner.nonNullableType = result.id;
            return result;
        });
    }
    get getStringIndexType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getStringIndexType", function () {
            if (owner.stringIndexType === false) {
                owner.stringIndexType = owner.getStringIndexTypeWorker();
            }
            return owner.stringIndexType;
        }, function* () {
            if (owner.stringIndexType === false) {
                owner.stringIndexType = yield* owner.getStringIndexTypeWorker.gen();
            }
            return owner.stringIndexType;
        });
    }
    get getStringIndexTypeWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getStringIndexTypeWorker", function () {
            const infos = owner.getIndexInfos();
            return infos.find(info => (info.keyType.flags & TypeFlags.String) !== 0)?.valueType;
        }, function* () {
            const infos = yield* owner.getIndexInfos.gen();
            return infos.find(info => (info.keyType.flags & TypeFlags.String) !== 0)?.valueType;
        });
    }
    get getNumberIndexType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNumberIndexType", function () {
            if (owner.numberIndexType === false) {
                owner.numberIndexType = owner.getNumberIndexTypeWorker();
            }
            return owner.numberIndexType;
        }, function* () {
            if (owner.numberIndexType === false) {
                owner.numberIndexType = yield* owner.getNumberIndexTypeWorker.gen();
            }
            return owner.numberIndexType;
        });
    }
    get getNumberIndexTypeWorker() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getNumberIndexTypeWorker", function () {
            const infos = owner.getIndexInfos();
            return infos.find(info => (info.keyType.flags & TypeFlags.Number) !== 0)?.valueType;
        }, function* () {
            const infos = yield* owner.getIndexInfos.gen();
            return infos.find(info => (info.keyType.flags & TypeFlags.Number) !== 0)?.valueType;
        });
    }
    get getApparentType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getApparentType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getApparentType", owner.apparentType);
            owner.apparentType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getApparentType", owner.apparentType);
            owner.apparentType = result.id;
            return result;
        });
    }
    get getReducedType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReducedType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getReducedType", owner.reducedType);
            owner.reducedType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getReducedType", owner.reducedType);
            owner.reducedType = result.id;
            return result;
        });
    }
    get getIndexInfos() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIndexInfos", function () {
            if (owner.indexInfos === false) {
                owner.indexInfos = owner.objectRegistry.fetchIndexInfosOfType(owner);
            }
            return owner.indexInfos;
        }, function* () {
            if (owner.indexInfos === false) {
                owner.indexInfos = yield* owner.objectRegistry.fetchIndexInfosOfType.gen(owner);
            }
            return owner.indexInfos;
        });
    }
    get getAliasSymbol() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getAliasSymbol", function () {
            return owner.objectRegistry.fetchSymbol(owner, "getAliasSymbolOfType", owner.aliasSymbol);
        }, function* () {
            return yield* owner.objectRegistry.fetchSymbol.gen(owner, "getAliasSymbolOfType", owner.aliasSymbol);
        });
    }
    get getTarget() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTarget", function () {
            return owner.objectRegistry.fetchType(owner, "getTargetOfType", owner.target);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getTargetOfType", owner.target);
        });
    }
    get getFreshType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getFreshType", function () {
            return owner.objectRegistry.fetchOptionalType(owner, "getFreshTypeOfType", owner.freshType);
        }, function* () {
            return yield* owner.objectRegistry.fetchOptionalType.gen(owner, "getFreshTypeOfType", owner.freshType);
        });
    }
    get getRegularType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getRegularType", function () {
            return owner.objectRegistry.fetchOptionalType(owner, "getRegularTypeOfType", owner.regularType);
        }, function* () {
            return yield* owner.objectRegistry.fetchOptionalType.gen(owner, "getRegularTypeOfType", owner.regularType);
        });
    }
    get getTypes() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypes", function () {
            // Only union, intersection, and template literal types have constituent
            // types; any other kind has none, so return undefined rather than sending
            // a request the server cannot satisfy.
            if (!(owner.flags & (TypeFlags.UnionOrIntersection | TypeFlags.TemplateLiteral))) {
                return undefined;
            }
            return owner.objectRegistry.fetchTypes(owner, "getTypesOfType");
        }, function* () {
            // Only union, intersection, and template literal types have constituent
            // types; any other kind has none, so return undefined rather than sending
            // a request the server cannot satisfy.
            if (!(owner.flags & (TypeFlags.UnionOrIntersection | TypeFlags.TemplateLiteral))) {
                return undefined;
            }
            return yield* owner.objectRegistry.fetchTypes.gen(owner, "getTypesOfType");
        });
    }
    get getTypeParameters() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeParameters", function () {
            return owner.objectRegistry.fetchTypes(owner, "getTypeParametersOfType", owner.typeParameters);
        }, function* () {
            return (yield* owner.objectRegistry.fetchTypes.gen(owner, "getTypeParametersOfType", owner.typeParameters));
        });
    }
    get getOuterTypeParameters() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getOuterTypeParameters", function () {
            return owner.objectRegistry.fetchTypes(owner, "getOuterTypeParametersOfType", owner.outerTypeParameters);
        }, function* () {
            return (yield* owner.objectRegistry.fetchTypes.gen(owner, "getOuterTypeParametersOfType", owner.outerTypeParameters));
        });
    }
    get getLocalTypeParameters() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getLocalTypeParameters", function () {
            return owner.objectRegistry.fetchTypes(owner, "getLocalTypeParametersOfType", owner.localTypeParameters);
        }, function* () {
            return (yield* owner.objectRegistry.fetchTypes.gen(owner, "getLocalTypeParametersOfType", owner.localTypeParameters));
        });
    }
    get getThisType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getThisType", function () {
            return owner.objectRegistry.fetchOptionalType(owner, "getThisTypeOfType", owner.thisType);
        }, function* () {
            return (yield* owner.objectRegistry.fetchOptionalType.gen(owner, "getThisTypeOfType", owner.thisType));
        });
    }
    get getAliasTypeArguments() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getAliasTypeArguments", function () {
            return owner.objectRegistry.fetchTypes(owner, "getAliasTypeArgumentsOfType", owner.aliasTypeArguments);
        }, function* () {
            return yield* owner.objectRegistry.fetchTypes.gen(owner, "getAliasTypeArgumentsOfType", owner.aliasTypeArguments);
        });
    }
    get getObjectType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getObjectType", function () {
            return owner.objectRegistry.fetchType(owner, "getObjectTypeOfType", owner.objectType);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getObjectTypeOfType", owner.objectType);
        });
    }
    get getIndexType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getIndexType", function () {
            return owner.objectRegistry.fetchType(owner, "getIndexTypeOfType", owner.indexType);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getIndexTypeOfType", owner.indexType);
        });
    }
    get getCheckType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getCheckType", function () {
            return owner.objectRegistry.fetchType(owner, "getCheckTypeOfType", owner.checkType);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getCheckTypeOfType", owner.checkType);
        });
    }
    get getExtendsType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getExtendsType", function () {
            return owner.objectRegistry.fetchType(owner, "getExtendsTypeOfType", owner.extendsType);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getExtendsTypeOfType", owner.extendsType);
        });
    }
    get getBaseType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBaseType", function () {
            return owner.objectRegistry.fetchType(owner, "getBaseTypeOfType", owner.baseType);
        }, function* () {
            return yield* owner.objectRegistry.fetchType.gen(owner, "getBaseTypeOfType", owner.baseType);
        });
    }
    get getConstraint() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getConstraint", function () {
            // Type parameters resolve their constraint lazily through the checker,
            // whereas substitution types carry a preloaded constraint handle.
            if (owner.flags & TypeFlags.TypeParameter) {
                const result = owner.objectRegistry.fetchOptionalType(owner, "getConstraintOfTypeParameter", owner.constraint);
                owner.constraint = result ? result.id : 0;
                return result;
            }
            return owner.objectRegistry.fetchType(owner, "getConstraintOfType", owner.substConstraint);
        }, function* () {
            // Type parameters resolve their constraint lazily through the checker,
            // whereas substitution types carry a preloaded constraint handle.
            if (owner.flags & TypeFlags.TypeParameter) {
                const result = yield* owner.objectRegistry.fetchOptionalType.gen(owner, "getConstraintOfTypeParameter", owner.constraint);
                owner.constraint = result ? result.id : 0;
                return result;
            }
            return yield* owner.objectRegistry.fetchType.gen(owner, "getConstraintOfType", owner.substConstraint);
        });
    }
    get getDefault() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getDefault", function () {
            const result = owner.objectRegistry.fetchOptionalType(owner, "getDefaultFromTypeParameter", owner.default);
            owner.default = result ? result.id : 0;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchOptionalType.gen(owner, "getDefaultFromTypeParameter", owner.default);
            owner.default = result ? result.id : 0;
            return result;
        });
    }
    get getTrueType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTrueType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getTrueTypeOfConditionalType", owner.trueType);
            owner.trueType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getTrueTypeOfConditionalType", owner.trueType);
            owner.trueType = result.id;
            return result;
        });
    }
    get getFalseType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getFalseType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getFalseTypeOfConditionalType", owner.falseType);
            owner.falseType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getFalseTypeOfConditionalType", owner.falseType);
            owner.falseType = result.id;
            return result;
        });
    }
    /**
     * Get the base types of this type. Returns `undefined` for any type that is
     * not a class or interface.
     */
    get getBaseTypes() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getBaseTypes", function () {
            if (!owner.isClassOrInterface()) {
                return undefined;
            }
            if (owner.baseTypes === false) {
                owner.baseTypes = owner.objectRegistry.fetchBaseTypes(owner);
            }
            return owner.baseTypes;
        }, function* () {
            if (!owner.isClassOrInterface()) {
                return undefined;
            }
            if (owner.baseTypes === false) {
                owner.baseTypes = yield* owner.objectRegistry.fetchBaseTypes.gen(owner);
            }
            return owner.baseTypes;
        });
    }
    isClassOrInterface() {
        return isClassOrInterfaceType(this);
    }
    isUnionType() {
        return isUnionType(this);
    }
    isIntersectionType() {
        return isIntersectionType(this);
    }
    isObjectType() {
        return isObjectType(this);
    }
    isIntrinsicType() {
        return isIntrinsicType(this);
    }
    isErrorType() {
        return isErrorType(this);
    }
    isLiteralType() {
        return isLiteralType(this);
    }
    isStringLiteralType() {
        return isStringLiteralType(this);
    }
    isNumberLiteralType() {
        return isNumberLiteralType(this);
    }
    isBigIntLiteralType() {
        return isBigIntLiteralType(this);
    }
    isBooleanLiteralType() {
        return isBooleanLiteralType(this);
    }
    isTypeReference() {
        return isTypeReference(this);
    }
    isTupleType() {
        return this.tupleType;
    }
    isTupleTypeTarget() {
        return this.fixedLength !== undefined;
    }
    isIndexType() {
        return isIndexType(this);
    }
    isIndexedAccessType() {
        return isIndexedAccessType(this);
    }
    isConditionalType() {
        return isConditionalType(this);
    }
    isSubstitutionType() {
        return isSubstitutionType(this);
    }
    isTemplateLiteralType() {
        return isTemplateLiteralType(this);
    }
    isStringMappingType() {
        return isStringMappingType(this);
    }
    isTypeParameter() {
        return isTypeParameter(this);
    }
}
export function isUnionType(type) {
    return (type.flags & TypeFlags.Union) !== 0;
}
export function isIntersectionType(type) {
    return (type.flags & TypeFlags.Intersection) !== 0;
}
export function isObjectType(type) {
    return (type.flags & TypeFlags.Object) !== 0;
}
export function isClassOrInterfaceType(type) {
    return isObjectType(type) && (type.objectFlags & ObjectFlags.ClassOrInterface) !== 0;
}
export function isIntrinsicType(type) {
    return (type.flags & TypeFlags.Intrinsic) !== 0;
}
/**
 * Whether this is the error type — the placeholder the checker produces when a
 * type cannot be determined (e.g. an unresolved reference). It is an intrinsic
 * type named `"error"` (this covers both the singleton error type and the
 * per-alias error types manufactured for unresolved type alias references).
 */
export function isErrorType(type) {
    return isIntrinsicType(type) && type.intrinsicName === "error";
}
export function isLiteralType(type) {
    return (type.flags & TypeFlags.Literal) !== 0;
}
export function isStringLiteralType(type) {
    return (type.flags & TypeFlags.StringLiteral) !== 0;
}
export function isNumberLiteralType(type) {
    return (type.flags & TypeFlags.NumberLiteral) !== 0;
}
export function isBigIntLiteralType(type) {
    return (type.flags & TypeFlags.BigIntLiteral) !== 0;
}
export function isBooleanLiteralType(type) {
    return (type.flags & TypeFlags.BooleanLiteral) !== 0;
}
export function isTypeReference(type) {
    return isObjectType(type) && (type.objectFlags & ObjectFlags.Reference) !== 0;
}
export function isTupleType(type) {
    return type.isTupleType();
}
export function isTupleTypeTarget(type) {
    return type.isTupleTypeTarget();
}
export function isIndexType(type) {
    return (type.flags & TypeFlags.Index) !== 0;
}
export function isIndexedAccessType(type) {
    return (type.flags & TypeFlags.IndexedAccess) !== 0;
}
export function isConditionalType(type) {
    return (type.flags & TypeFlags.Conditional) !== 0;
}
export function isSubstitutionType(type) {
    return (type.flags & TypeFlags.Substitution) !== 0;
}
export function isTemplateLiteralType(type) {
    return (type.flags & TypeFlags.TemplateLiteral) !== 0;
}
export function isStringMappingType(type) {
    return (type.flags & TypeFlags.StringMapping) !== 0;
}
export function isTypeParameter(type) {
    return (type.flags & TypeFlags.TypeParameter) !== 0;
}
export class Signature {
    flags;
    objectRegistry;
    id;
    declaration;
    typeParameters;
    parameters;
    thisParameter;
    target;
    returnType;
    constructor(data, project, objectRegistry) {
        this.id = data.id;
        this.flags = data.flags;
        this.objectRegistry = objectRegistry;
        this.declaration = data.declaration ? new NodeHandle(data.declaration, project) : undefined;
        this.typeParameters = data.typeParameters ?? [];
        this.parameters = data.parameters ?? [];
        this.thisParameter = data.thisParameter;
        this.target = data.target;
        this.returnType = false;
    }
    get getTypeParameters() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeParameters", function () {
            return owner.objectRegistry.fetchTypes(owner, "getTypeParametersOfSignature", owner.typeParameters);
        }, function* () {
            return (yield* owner.objectRegistry.fetchTypes.gen(owner, "getTypeParametersOfSignature", owner.typeParameters));
        });
    }
    get getParameters() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getParameters", function () {
            return owner.objectRegistry.fetchSymbols(owner, "getParametersOfSignature", owner.parameters);
        }, function* () {
            return yield* owner.objectRegistry.fetchSymbols.gen(owner, "getParametersOfSignature", owner.parameters);
        });
    }
    get getThisParameter() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getThisParameter", function () {
            return owner.objectRegistry.fetchSymbol(owner, "getThisParameterOfSignature", owner.thisParameter);
        }, function* () {
            return yield* owner.objectRegistry.fetchSymbol.gen(owner, "getThisParameterOfSignature", owner.thisParameter);
        });
    }
    get getTarget() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTarget", function () {
            return owner.objectRegistry.fetchSignature(owner, "getTargetOfSignature", owner.target);
        }, function* () {
            return yield* owner.objectRegistry.fetchSignature.gen(owner, "getTargetOfSignature", owner.target);
        });
    }
    get getReturnType() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getReturnType", function () {
            const result = owner.objectRegistry.fetchType(owner, "getReturnTypeOfSignature", owner.returnType);
            owner.returnType = result.id;
            return result;
        }, function* () {
            const result = yield* owner.objectRegistry.fetchType.gen(owner, "getReturnTypeOfSignature", owner.returnType);
            owner.returnType = result.id;
            return result;
        });
    }
    get getTypeParameterAtPosition() {
        const owner = this;
        return cacheGeneratorMethod(owner, "getTypeParameterAtPosition", function (pos) {
            return owner.objectRegistry.fetchTypeParameterAtPosition(owner, pos);
        }, function* (pos) {
            return yield* owner.objectRegistry.fetchTypeParameterAtPosition.gen(owner, pos);
        });
    }
    get hasRestParameter() {
        return (this.flags & SignatureFlags.HasRestParameter) !== 0;
    }
    get isConstruct() {
        return (this.flags & SignatureFlags.Construct) !== 0;
    }
    get isAbstract() {
        return (this.flags & SignatureFlags.Abstract) !== 0;
    }
}
//# sourceMappingURL=api.js.map