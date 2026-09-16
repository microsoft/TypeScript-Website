import { Client, } from "#asyncClient"; // @sync: } from "#syncClient";
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
// @sync-only-start
// export { all, defer, type APIRequestGenerator, type AnyAPIRequestGenerator, type AllAPIRequestGenerator, type DeferredAPIRequestGenerator, type ExecutedGeneratorsResults } from "./generatorSupport.ts";
// import {executeRequestGenerators, type ExecutedGeneratorsResults, type AnyAPIRequestGenerator} from "./generatorSupport.ts";
// @sync-only-end
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
        this.internal = new InternalAPI(this.client, () => this.ensureInitialized()); // @sync: this.internal = new InternalAPI(this.client, this.ensureInitialized);
    }
    /**
     * Create an API instance from an existing LSP connection's API session.
     * Use this when connecting to an API pipe provided by an LSP server via custom/initializeAPISession.
     */
    static async fromLSPConnection(options) {
        const api = new API(options);
        await api.ensureInitialized();
        return api;
    }
    // @sync-skip-block-start
    batchContext() {
        return this.client.batchContext();
    }
    // @sync-skip-block-end
    // @sync-only-start
    // batch<T extends readonly AnyAPIRequestGenerator[]>(...requestGenerators: T): ExecutedGeneratorsResults<T> {
    //     return executeRequestGenerators(requestGenerators, requests => this.client.batchRequests(requests).responses);
    // }
    // @sync-only-end
    async ensureInitialized() {
        if (this.initialized)
            return;
        return this.initializing ??= this.initializeWorker();
    }
    async initializeWorker() {
        try {
            const response = await this.client.apiRequest("initialize", null);
            const getCanonicalFileName = createGetCanonicalFileName(response.useCaseSensitiveFileNames);
            const currentDirectory = response.currentDirectory;
            this.getCanonicalFileNameWorker = getCanonicalFileName;
            this.currentDirectory = currentDirectory;
            this.toPath = (fileName) => toPath(fileName, currentDirectory, getCanonicalFileName);
            this.initialized = true;
        }
        catch (error) {
            this.initializing = undefined;
            throw error;
        }
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
    async parseConfigFile(file) {
        await this.ensureInitialized();
        return this.client.apiRequest("parseConfigFile", { file });
    }
    async parseCommandLine(commandLine) {
        await this.ensureInitialized();
        return this.client.apiRequest("parseCommandLine", { commandLine });
    }
    async readConfigFile(file) {
        await this.ensureInitialized();
        return this.client.apiRequest("readConfigFile", { file });
    }
    async parseJsonConfigFileContent(json, options) {
        await this.ensureInitialized();
        return this.client.apiRequest("parseJsonConfigFileContent", { json, ...options });
    }
    async transpileModule(input, options = {}) {
        await this.ensureInitialized();
        return this.client.apiRequest("transpileModule", { input, options });
    }
    async transpileModuleFromFile(file, options = {}) {
        await this.ensureInitialized();
        return this.client.apiRequest("transpileModuleFromFile", { fileName: resolveFileName(file), options });
    }
    async transpileDeclaration(input, options = {}) {
        await this.ensureInitialized();
        return this.client.apiRequest("transpileDeclaration", { input, options });
    }
    async transpileDeclarationFromFile(file, options = {}) {
        await this.ensureInitialized();
        return this.client.apiRequest("transpileDeclarationFromFile", { fileName: resolveFileName(file), options });
    }
    async updateSnapshot(params) {
        return this.updateSnapshotWorker(params);
    }
    /** @internal */
    async updateSnapshotFrom(baseSnapshot, params) {
        if (!this.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
            throw new Error("Cannot update an inactive snapshot");
        }
        if (baseSnapshot !== this.latestSnapshot) {
            // TODO: Support forking active memory/cache snapshots once the server-side
            // ownership, project state, and cache semantics have been worked out.
            throw new Error("Snapshot.update can only update the latest snapshot");
        }
        return this.updateSnapshotWorker(params, baseSnapshot);
    }
    async updateSnapshotWorker(params, baseSnapshot) {
        await this.ensureInitialized();
        const requestParams = toUpdateSnapshotRequest(params, baseSnapshot?.id);
        const data = await this.client.apiRequest("updateSnapshot", requestParams);
        // Retain cached source files from previous snapshot for unchanged files
        if (this.latestSnapshot) {
            this.sourceFileCache.retainForSnapshot(data.snapshot, this.latestSnapshot.id, data.changes);
            if (this.latestSnapshot.isDisposed()) {
                this.sourceFileCache.releaseSnapshot(this.latestSnapshot.id);
            }
        }
        const snapshot = new Snapshot(data, this.client, this.sourceFileCache, this.toPath, this, () => {
            this.activeSnapshots.delete(snapshot);
            if (snapshot !== this.latestSnapshot) {
                this.sourceFileCache.releaseSnapshot(snapshot.id);
            }
        });
        this.latestSnapshot = snapshot;
        this.activeSnapshots.add(snapshot);
        return snapshot;
    }
    async [globalThis.Symbol.asyncDispose]() {
        await this.close(); // @sync: this.close();
    }
    async close() {
        // @sync-skip-block-start
        if (this.initializing && !this.initialized) {
            const initializing = this.initializing;
            await this.client.close();
            await initializing.catch(() => { });
            this.sourceFileCache.clear();
            return;
        }
        // @sync-skip-block-end
        await this.initializing?.catch(() => { }); // @sync-skip
        // Dispose all active snapshots
        try {
            for (const snapshot of [...this.activeSnapshots]) {
                await snapshot.dispose();
            }
            // Release the latest snapshot's cache refs if still held
            if (this.latestSnapshot) {
                this.sourceFileCache.releaseSnapshot(this.latestSnapshot.id);
                this.latestSnapshot = undefined;
            }
            this.sourceFileCache.clear();
        }
        finally {
            await this.client.close(); // always close the underlying connection
        }
    }
    clearSourceFileCache() {
        this.sourceFileCache.clear();
    }
    async runWithTemporaryFileUpdate(baseSnapshot, file, newText, cb) {
        await this.ensureInitialized();
        if (!this.activeSnapshots.has(baseSnapshot) || baseSnapshot.isDisposed()) {
            throw new Error("Cannot run a temporary file update on an inactive snapshot");
        }
        const data = await this.client.apiRequest("updateTemporarySnapshot", { snapshot: baseSnapshot.id, file, newText });
        // Retain cached source files from the base snapshot for files unchanged by
        // the temporary update. The temporary snapshot is not the latest snapshot, so
        // we never release the latest snapshot's cache here.
        this.sourceFileCache.retainForSnapshot(data.snapshot, baseSnapshot.id, data.changes);
        const snapshot = new Snapshot(data, this.client, this.sourceFileCache, this.toPath, this, () => {
            this.activeSnapshots.delete(snapshot);
            this.sourceFileCache.releaseSnapshot(snapshot.id);
        });
        this.activeSnapshots.add(snapshot);
        try {
            await cb(snapshot);
        }
        finally {
            await snapshot.dispose();
        }
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
    getTimingInfo() {
        return this.client.getTimingInfo();
    }
    /** Clears all accumulated timing totals and recent-request history, on both the client and the server. */
    resetTimingInfo() {
        return this.client.resetTimingInfo();
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
    async createProgram(rootFiles, createProgramOptions, oldProgram, fileChanges) {
        await this.ensureInitialized();
        if (fileChanges && !oldProgram) {
            throw new Error("fileChanges requires an oldProgram");
        }
        if (oldProgram && !this.isProgramActive(oldProgram)) {
            throw new Error("oldProgram must belong to this API instance and reference an active snapshot");
        }
        const data = await this.client.apiRequest("createProgram", {
            rootFiles,
            createProgramOptions,
            oldProgram: oldProgram ? { snapshot: oldProgram.snapshotId, project: oldProgram.getProject().id } : undefined,
            fileChanges,
        });
        if (!data.project) {
            throw new Error("createProgram did not return a project");
        }
        const snapshot = new Snapshot({ snapshot: data.snapshot, projects: [data.project] }, this.client, this.sourceFileCache, this.toPath, this, () => {
            this.activeSnapshots.delete(snapshot);
            this.sourceFileCache.releaseSnapshot(snapshot.id);
        });
        const program = snapshot.getProjects()[0].program;
        program.setOwnedSnapshot(snapshot);
        this.activeSnapshots.add(snapshot);
        return program;
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
    async startCPUProfile(dir) {
        await this.ensureInitialized();
        await this.client.apiRequest("startCPUProfile", { dir });
    }
    async stopCPUProfile() {
        await this.ensureInitialized();
        const result = await this.client.apiRequest("stopCPUProfile", null);
        return result.file;
    }
    async saveHeapProfile(dir) {
        await this.ensureInitialized();
        const result = await this.client.apiRequest("saveHeapProfile", { dir });
        return result.file;
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
    async getDefaultProjectForFile(file) {
        this.ensureNotDisposed();
        const data = await this.client.apiRequest("getDefaultProjectForFile", {
            snapshot: this.id,
            file,
        });
        if (!data)
            return undefined;
        return this.projectMap.get(this.toPath(data.configFileName));
    }
    /**
     * Creates the next snapshot, layering its filesystem over this snapshot's
     * filesystem. This snapshot must still be active and be the latest snapshot.
     */
    async update(params) {
        this.ensureNotDisposed();
        return this.api.updateSnapshotFrom(this, params);
    }
    [globalThis.Symbol.dispose]() {
        void this.dispose();
    }
    dispose() {
        return this.disposePromise ??= this.disposeWorker();
    }
    async disposeWorker() {
        if (this.disposed)
            return;
        this.disposed = true;
        for (const project of this.projectMap.values()) {
            project.dispose();
        }
        this.projectMap.clear();
        this.snapshotRegistry.clear();
        try {
            await this.client.apiRequest("release", { snapshot: this.id });
        }
        finally {
            this.onDispose();
        }
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
    async fetchSymbol(source, method, handle, projectId) {
        if (!handle)
            return undefined;
        const cached = this.getSymbol(handle);
        if (cached)
            return cached;
        const data = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: projectId,
            objectId: source.id,
        });
        if (!data)
            throw new Error(`${method} returned null symbol for ${source.constructor.name} ${source.id}`);
        return this.getOrCreateSymbol(data);
    }
    async fetchSymbols(source, method, handles, projectId) {
        if (handles) {
            const result = new Array(handles.length);
            let allCached = true;
            for (let i = 0; i < handles.length; i++) {
                const cached = this.getSymbol(handles[i]);
                if (!cached) {
                    allCached = false;
                    break;
                }
                result[i] = cached;
            }
            if (allCached)
                return result;
        }
        const symbolData = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: projectId,
            objectId: source.id,
        });
        if (symbolData == null)
            return [];
        else
            return symbolData.map(data => this.getOrCreateSymbol(data));
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
    async fetchOptionalType(source, method, handle) {
        if (handle !== false) {
            if (!handle)
                return undefined;
            const cached = this.getType(handle);
            if (cached)
                return cached;
        }
        const data = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: this.project.id,
            objectId: source.id,
        });
        if (!data)
            return undefined;
        return this.getOrCreateType(data);
    }
    async fetchType(source, method, handle) {
        const result = await this.fetchOptionalType(source, method, handle);
        if (result === undefined)
            throw new Error(`${method} returned no type for ${source.constructor.name} ${source.id}`);
        return result;
    }
    async fetchSymbol(source, method, handle) {
        return this.snapshotRegistry.fetchSymbol(source, method, handle, this.project.id);
    }
    async fetchSignature(source, method, handle) {
        if (!handle)
            return undefined;
        const cached = this.getSignature(handle);
        if (cached)
            return cached;
        const data = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: this.project.id,
            objectId: source.id,
        });
        if (!data)
            throw new Error(`${method} returned null signature for ${source.constructor.name} ${source.id}`);
        return this.getOrCreateSignature(data);
    }
    async fetchTypes(source, method, handles) {
        if (handles) {
            const result = new Array(handles.length);
            let allCached = true;
            for (let i = 0; i < handles.length; i++) {
                const cached = this.getType(handles[i]);
                if (!cached) {
                    allCached = false;
                    break;
                }
                result[i] = cached;
            }
            if (allCached)
                return result;
        }
        const typesData = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: this.project.id,
            objectId: source.id,
        });
        if (typesData == null)
            return [];
        else
            return typesData.map(data => this.getOrCreateType(data));
    }
    async fetchSymbols(source, method, handles) {
        return this.snapshotRegistry.fetchSymbols(source, method, handles, this.project.id);
    }
    // getBaseTypes is a checker-level endpoint keyed by `type` (not `objectId`),
    // so it cannot go through fetchTypes. This helper reuses that server method.
    async fetchBaseTypes(source) {
        const typesData = await this.client.apiRequest("getBaseTypes", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: source.id,
        });
        if (typesData == null)
            return [];
        return typesData.map(data => this.getOrCreateType(data));
    }
    async fetchPropertiesOfType(source) {
        const data = await this.client.apiRequest("getPropertiesOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: source.id,
        });
        return data ? data.map(symbol => this.getOrCreateSymbol(symbol)) : [];
    }
    async fetchApparentPropertiesOfType(source) {
        const data = await this.client.apiRequest("getApparentPropertiesOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            objectId: source.id,
        });
        return data ? data.map(symbol => this.getOrCreateSymbol(symbol)) : [];
    }
    async fetchPropertyOfType(source, name) {
        const data = await this.client.apiRequest("getPropertyOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: source.id,
            name,
        });
        return data ? this.getOrCreateSymbol(data) : undefined;
    }
    async fetchSignaturesOfType(source, kind) {
        const data = await this.client.apiRequest("getSignaturesOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: source.id,
            kind,
        });
        return data.map(signature => this.getOrCreateSignature(signature));
    }
    async fetchIndexInfosOfType(source) {
        const data = await this.client.apiRequest("getIndexInfosOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: source.id,
        });
        if (!data)
            return [];
        return data.map(info => ({
            keyType: this.getOrCreateType(info.keyType),
            valueType: this.getOrCreateType(info.valueType),
            isReadonly: info.isReadonly ?? false,
            declaration: info.declaration ? new NodeHandle(info.declaration, this.project) : undefined,
        }));
    }
    async fetchTypeParameterAtPosition(source, pos) {
        const data = await this.client.apiRequest("getTypeParameterAtPosition", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signature: source.id,
            index: pos,
        });
        return this.getOrCreateType(data);
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
    getImportAdderEdits(file, actions) {
        return this.languageService.getImportAdderEdits(file, actions);
    }
    /** @deprecated Use `languageService.getImportEditsForSymbols`. */
    getImportEditsForSymbols(file, symbols, options = {}) {
        return this.languageService.getImportEditsForSymbols(file, symbols, options);
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
    async getImportAdderEdits(file, actions) {
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
        const data = await this.client.apiRequest("getImportAdderEdits", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            actions: requestActions,
        });
        return data ?? [];
    }
    async getImportEditsForSymbols(file, symbols, options = {}) {
        return this.getImportAdderEdits(file, symbols.map((symbol) => {
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
    }
    async getReferencedSymbolsForNode(node, position) {
        const data = await this.client.apiRequest("getReferencedSymbolsForNode", {
            snapshot: this.snapshotId,
            project: this.project.id,
            node: getNodeId(node),
            position,
        });
        return (data ?? []).map(entry => ({
            definition: new NodeHandle(entry.definition, this.project),
            symbol: entry.symbol ? this.objectRegistry.getOrCreateSymbol(entry.symbol) : undefined,
            references: (entry.references ?? []).map(h => new NodeHandle(h, this.project)),
        }));
    }
    async getSignatureUsage(signatureDecl) {
        const data = await this.client.apiRequest("getSignatureUsages", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signatureDecl: getNodeId(signatureDecl),
        });
        return (data ?? []).map(entry => ({
            name: new NodeHandle(entry.name, this.project),
            call: entry.call ? new NodeHandle(entry.call, this.project) : undefined,
        }));
    }
    async getCompletionsAtPosition(document, position, options) {
        const data = await this.client.apiRequest("getCompletionsAtPosition", {
            snapshot: this.snapshotId,
            project: this.project.id,
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
                symbol: e.symbol ? this.objectRegistry.getOrCreateSymbol(e.symbol) : undefined,
            })),
        };
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
    dispose() {
        return this.disposePromise ??= this.disposeWorker();
    }
    async disposeWorker() {
        const snapshot = this.ownedSnapshot;
        this.ownedSnapshot = undefined;
        if (snapshot)
            await snapshot.dispose();
    }
    getCompilerOptions() {
        return this.project.compilerOptions;
    }
    async getSourceFile(file) {
        const fileName = resolveFileName(file);
        const path = this.toPath(fileName);
        // Check if we already have a retained cache entry for this (snapshot, project) pair
        const retained = this.sourceFileCache.getRetained(path, this.snapshotId, this.project.id);
        if (retained) {
            return retained;
        }
        // Fetch from server
        const binaryData = await this.client.apiRequestBinary("getSourceFile", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
        });
        if (!binaryData) {
            return undefined;
        }
        const view = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
        const contentHash = readSourceFileHash(view);
        const parseOptionsKey = readParseOptionsKey(view);
        // Create a new RemoteSourceFile and cache it (set returns existing if hash matches)
        const sourceFile = new RemoteSourceFile(binaryData, this.decoder, this.client.getTimingCollector());
        return this.sourceFileCache.set(path, sourceFile, parseOptionsKey, contentHash, this.snapshotId, this.project.id);
    }
    async getResolvedModule(file, moduleName, mode) {
        const result = await this.client.apiRequest("getResolvedModule", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            moduleName,
            mode,
        });
        return result ?? undefined;
    }
    async getResolvedModuleFromModuleSpecifier(moduleSpecifier, sourceFile) {
        const result = await this.client.apiRequest("getResolvedModuleFromModuleSpecifier", {
            snapshot: this.snapshotId,
            project: this.project.id,
            moduleSpecifier: getNodeId(moduleSpecifier),
            sourceFile,
        });
        return result ?? undefined;
    }
    async getResolvedTypeReferenceDirective(file, typeDirectiveName, mode) {
        const result = await this.client.apiRequest("getResolvedTypeReferenceDirective", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            typeDirectiveName,
            mode,
        });
        return result ?? undefined;
    }
    async getResolvedTypeReferenceDirectiveFromTypeReferenceDirective(typeReferenceDirective, sourceFile) {
        const result = await this.client.apiRequest("getResolvedTypeReferenceDirectiveFromTypeReferenceDirective", {
            snapshot: this.snapshotId,
            project: this.project.id,
            sourceFile,
            typeDirectiveName: typeReferenceDirective.fileName,
            resolutionMode: typeReferenceDirective.resolutionMode,
        });
        return result ?? undefined;
    }
    async getSourceFileNames() {
        const data = await this.client.apiRequest("getSourceFileNames", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return data ?? [];
    }
    /**
     * Returns program-stored metadata for the given source file, or `undefined` if the file
     * is not part of the program. Metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    getSourceFileMetadata(file) {
        return this.getSourceFileMetadataByPath(this.toPath(resolveFileName(file)));
    }
    /**
     * Returns program-stored metadata for the source file at the given path, or `undefined`
     * if the file is not part of the program. Like {@link getSourceFileMetadata}, but skips
     * the file name to path conversion. Metadata is fetched lazily per file and cached on
     * this `Program` instance.
     */
    getSourceFileMetadataByPath(path) {
        let metadata = this.sourceFileMetadataCache.get(path);
        if (metadata === undefined) {
            metadata = this.fetchSourceFileMetadata(path);
            this.sourceFileMetadataCache.set(path, metadata);
        }
        return metadata;
    }
    async fetchSourceFileMetadata(path) {
        const data = await this.client.apiRequest("getSourceFileMetadata", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file: path,
        });
        return data ?? undefined;
    }
    /**
     * Returns whether the given source file was loaded as part of an external library
     * (e.g. a dependency resolved from `node_modules`). The underlying program metadata is
     * fetched lazily per file and cached on this `Program` instance.
     */
    async isSourceFileFromExternalLibrary(file) {
        const metadata = await this.getSourceFileMetadataByPath(file.path);
        return metadata?.isFromExternalLibrary ?? false;
    }
    /**
     * Returns whether the given source file is a default library file (e.g. `lib.d.ts`).
     * The underlying program metadata is fetched lazily per file and cached on this
     * `Program` instance.
     */
    async isSourceFileDefaultLibrary(file) {
        const metadata = await this.getSourceFileMetadataByPath(file.path);
        return metadata?.isDefaultLibrary ?? false;
    }
    /**
     * Get all config source file names associated with this program's project config.
     * Includes the root config file and any extended config files.
     */
    async getConfigFileNames() {
        const data = await this.client.apiRequest("getConfigFileNames", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return data ?? [];
    }
    /**
     * Get a config source file by file name/URI.
     * This can return the project's root tsconfig file or one of its extended config files.
     */
    async getConfigSourceFile(file) {
        const binaryData = await this.client.apiRequestBinary("getConfigSourceFile", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
        });
        if (!binaryData) {
            return undefined;
        }
        return new RemoteSourceFile(binaryData, this.decoder);
    }
    /**
     * Get syntactic (parse) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    async getSyntacticDiagnostics(file) {
        const files = file === undefined ? undefined
            : Array.isArray(file) ? file
                : [file];
        const data = await this.client.apiRequest("getSyntacticDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return data ?? [];
    }
    /**
     * Get binder diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    async getBindDiagnostics(file) {
        const files = file === undefined ? undefined
            : Array.isArray(file) ? file
                : [file];
        const data = await this.client.apiRequest("getBindDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return data ?? [];
    }
    /**
     * Get semantic (type-check) diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    async getSemanticDiagnostics(file) {
        const files = file === undefined ? undefined
            : Array.isArray(file) ? file
                : [file];
        const data = await this.client.apiRequest("getSemanticDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return data ?? [];
    }
    /**
     * Get suggestion diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    async getSuggestionDiagnostics(file) {
        const files = file === undefined ? undefined
            : Array.isArray(file) ? file
                : [file];
        const data = await this.client.apiRequest("getSuggestionDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return data ?? [];
    }
    /**
     * Get declaration emit diagnostics for specific files or all files.
     * @param file - Optional file(s) to get diagnostics for. If omitted, returns diagnostics for all files.
     */
    async getDeclarationDiagnostics(file) {
        const files = file === undefined ? undefined
            : Array.isArray(file) ? file
                : [file];
        const data = await this.client.apiRequest("getDeclarationDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return data ?? [];
    }
    /**
     * Get program-wide diagnostics for the project, including compiler options diagnostics.
     */
    async getProgramDiagnostics() {
        const data = await this.client.apiRequest("getProgramDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return data ?? [];
    }
    /**
     * Get global (non-file-specific) semantic diagnostics for the project.
     */
    async getGlobalDiagnostics() {
        const data = await this.client.apiRequest("getGlobalDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return data ?? [];
    }
    /**
     * Get config file parsing diagnostics for the project.
     */
    async getConfigFileParsingDiagnostics() {
        const data = await this.client.apiRequest("getConfigFileParsingDiagnostics", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return data ?? [];
    }
    /**
     * Emits files to the configured filesystem. Layer and host filesystems are
     * written through; full filesystems remain immutable and return emitted
     * files in {@link EmitResult.fileSystem}.
     */
    async emit(emitOnly) {
        const response = await this.client.apiRequest("emit", {
            snapshot: this.snapshotId,
            project: this.project.id,
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
    }
    /**
     * Emits files and returns their contents without writing to the filesystem.
     */
    async emitToString(emitOnly) {
        const response = await this.client.apiRequest("emitToString", {
            snapshot: this.snapshotId,
            project: this.project.id,
            emitOnly,
        });
        return toEmitOutput(response);
    }
    /**
     * Gets JavaScript output for selected files regardless of project `noEmit`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    async getJavaScriptEmit(files) {
        const response = await this.client.apiRequest("getJavaScriptEmit", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return toEmitOutput(response);
    }
    /**
     * Gets declaration output for selected files regardless of project `noEmit`, `declaration`, `emitDeclarationOnly`, and `noEmitOnError` settings.
     */
    async getDeclarationEmit(files) {
        const response = await this.client.apiRequest("getDeclarationEmit", {
            snapshot: this.snapshotId,
            project: this.project.id,
            files,
        });
        return toEmitOutput(response);
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
    async getSymbolAtLocation(nodeOrNodes) {
        if (Array.isArray(nodeOrNodes)) {
            const data = await this.client.apiRequest("getSymbolsAtLocations", {
                snapshot: this.snapshotId,
                project: this.project.id,
                locations: nodeOrNodes.map(node => getNodeId(node)),
            });
            return data.map(d => d ? this.objectRegistry.getOrCreateSymbol(d) : undefined);
        }
        const data = await this.client.apiRequest("getSymbolAtLocation", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(nodeOrNodes),
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    async getSymbolAtPosition(file, positionOrPositions) {
        if (typeof positionOrPositions === "number") {
            const data = await this.client.apiRequest("getSymbolAtPosition", {
                snapshot: this.snapshotId,
                project: this.project.id,
                file,
                position: positionOrPositions,
            });
            return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
        }
        const data = await this.client.apiRequest("getSymbolsAtPositions", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            positions: positionOrPositions,
        });
        return data.map(d => d ? this.objectRegistry.getOrCreateSymbol(d) : undefined);
    }
    async getSymbolOfSourceFile(fileOrFiles) {
        if (Array.isArray(fileOrFiles)) {
            const data = await this.client.apiRequest("getSymbolsOfSourceFiles", {
                snapshot: this.snapshotId,
                project: this.project.id,
                files: fileOrFiles,
            });
            return data.map(d => d ? this.objectRegistry.getOrCreateSymbol(d) : undefined);
        }
        const data = await this.client.apiRequest("getSymbolOfSourceFile", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file: fileOrFiles,
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    async getTypeOfSymbol(symbolOrSymbols) {
        if (Array.isArray(symbolOrSymbols)) {
            const data = await this.client.apiRequest("getTypesOfSymbols", {
                snapshot: this.snapshotId,
                project: this.project.id,
                symbols: symbolOrSymbols.map(s => s.id),
            });
            return data.map(d => this.objectRegistry.getOrCreateType(d));
        }
        const data = await this.client.apiRequest("getTypeOfSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbolOrSymbols.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    /**
     * Get the declared type of a symbol. Always returns a type; for symbols whose
     * declared type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    async getDeclaredTypeOfSymbol(symbol) {
        const data = await this.client.apiRequest("getDeclaredTypeOfSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    /**
     * Get the type of a symbol, excluding the missing type when
     * `exactOptionalPropertyTypes: true` is set; for symbols whose
     * type cannot be determined the checker yields the error type
     * (use {@link Type.isErrorType} to detect it).
     */
    async getNonMissingTypeOfSymbol(symbol) {
        const data = await this.client.apiRequest("getNonMissingTypeOfSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async getReferencesToSymbolInFile(file, symbol) {
        const data = await this.client.apiRequest("getReferencesToSymbolInFile", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            symbol: symbol.id,
        });
        return (data ?? []).map(h => new NodeHandle(h, this.project));
    }
    /** @deprecated Use `project.languageService.getReferencedSymbolsForNode`. */
    getReferencedSymbolsForNode(node, position) {
        return this.project.languageService.getReferencedSymbolsForNode(node, position);
    }
    /** @deprecated Use `project.languageService.getSignatureUsage`. */
    getSignatureUsage(signatureDecl) {
        return this.project.languageService.getSignatureUsage(signatureDecl);
    }
    /** @deprecated Use `project.languageService.getCompletionsAtPosition`. */
    getCompletionsAtPosition(document, position, options) {
        return this.project.languageService.getCompletionsAtPosition(document, position, options);
    }
    async getTypeAtLocation(nodeOrNodes) {
        if (Array.isArray(nodeOrNodes)) {
            const data = await this.client.apiRequest("getTypeAtLocations", {
                snapshot: this.snapshotId,
                project: this.project.id,
                locations: nodeOrNodes.map(node => getNodeId(node)),
            });
            return data.map(d => this.objectRegistry.getOrCreateType(d));
        }
        const data = await this.client.apiRequest("getTypeAtLocation", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(nodeOrNodes),
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async getSignaturesOfType(type, kind) {
        return kind === SignatureKind.Call ? type.getCallSignatures() : type.getConstructSignatures();
    }
    /**
     * Get the resolved signature of a call-like expression. Always returns a
     * signature; when a call cannot be resolved the checker yields the unknown
     * signature (use {@link Checker.isUnknownSignature} to detect it).
     */
    async getResolvedSignature(node) {
        const data = await this.client.apiRequest("getResolvedSignature", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return this.objectRegistry.getOrCreateSignature(data);
    }
    async getTypeAtPosition(file, positionOrPositions) {
        if (typeof positionOrPositions === "number") {
            const data = await this.client.apiRequest("getTypeAtPosition", {
                snapshot: this.snapshotId,
                project: this.project.id,
                file,
                position: positionOrPositions,
            });
            return data ? this.objectRegistry.getOrCreateType(data) : undefined;
        }
        const data = await this.client.apiRequest("getTypesAtPositions", {
            snapshot: this.snapshotId,
            project: this.project.id,
            file,
            positions: positionOrPositions,
        });
        return data.map(d => d ? this.objectRegistry.getOrCreateType(d) : undefined);
    }
    async resolveName(name, meaning, location, excludeGlobals) {
        // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
        const isNode = location && "kind" in location;
        const data = await this.client.apiRequest("resolveName", {
            snapshot: this.snapshotId,
            project: this.project.id,
            name,
            meaning,
            location: isNode ? getNodeId(location) : undefined,
            file: !isNode && location ? location.document : undefined,
            position: !isNode && location ? location.position : undefined,
            excludeGlobals,
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    /**
     * Returns all symbols with the given meaning that are visible at `location`.
     */
    async getSymbolsInScope(location, meaning) {
        // Distinguish Node (has `kind`) from DocumentPosition (has `document` and `position`)
        const isNode = "kind" in location;
        const data = await this.client.apiRequest("getSymbolsInScope", {
            snapshot: this.snapshotId,
            project: this.project.id,
            meaning,
            location: isNode ? getNodeId(location) : undefined,
            file: isNode ? undefined : location.document,
            position: isNode ? undefined : location.position,
        });
        return data ? data.map(d => this.objectRegistry.getOrCreateSymbol(d)) : [];
    }
    async getResolvedSymbol(node) {
        const text = node.text;
        if (!text)
            return undefined;
        return this.resolveName(text, SymbolFlags.Value | SymbolFlags.ExportValue, node);
    }
    async getContextualType(node) {
        const data = await this.client.apiRequest("getContextualType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    async getContextualTypeForArgumentAtIndex(node, argIndex) {
        const data = await this.client.apiRequest("getContextualTypeForArgument", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
            index: argIndex,
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    async getAwaitedType(type) {
        const data = await this.client.apiRequest("getAwaitedType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    /** Get the base type of a literal type (e.g. `number` for `42`). Always returns a type. */
    async getBaseTypeOfLiteralType(type) {
        const data = await this.client.apiRequest("getBaseTypeOfLiteralType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    /** Get the type with `null` and `undefined` removed. Always returns a type. */
    async getNonNullableType(type) {
        return type.getNonNullableType();
    }
    /**
     * Get the type for a type node. Always returns a type; for type nodes whose
     * type cannot be determined the checker yields the error type (use
     * {@link Type.isErrorType} to detect it).
     */
    async getTypeFromTypeNode(node) {
        const data = await this.client.apiRequest("getTypeFromTypeNode", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    /** Get the widened type. Always returns a type. */
    async getWidenedType(type) {
        const data = await this.client.apiRequest("getWidenedType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    /**
     * Get the type of the parameter at the given index in a signature. Always
     * returns a type; an out-of-range index yields the `any` type.
     */
    async getParameterType(signature, index) {
        const data = await this.client.apiRequest("getParameterType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signature: signature.id,
            index,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async isArrayLikeType(type) {
        return this.client.apiRequest("isArrayLikeType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
    }
    async isTypeAssignableTo(source, target) {
        return this.client.apiRequest("isTypeAssignableTo", {
            snapshot: this.snapshotId,
            project: this.project.id,
            source: source.id,
            target: target.id,
        });
    }
    async getShorthandAssignmentValueSymbol(node) {
        const data = await this.client.apiRequest("getShorthandAssignmentValueSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    /**
     * Get the type of a symbol as narrowed at a specific location. Always returns
     * a type; for symbols whose type cannot be determined the checker yields the
     * error type (use {@link Type.isErrorType} to detect it).
     */
    async getTypeOfSymbolAtLocation(symbol, location) {
        const data = await this.client.apiRequest("getTypeOfSymbolAtLocation", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
            location: getNodeId(location),
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async getIntrinsicType(method) {
        const data = await this.client.apiRequest(method, {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async getAnyType() {
        return this.getIntrinsicType("getAnyType");
    }
    async getStringType() {
        return this.getIntrinsicType("getStringType");
    }
    async getNumberType() {
        return this.getIntrinsicType("getNumberType");
    }
    async getBooleanType() {
        return this.getIntrinsicType("getBooleanType");
    }
    async getVoidType() {
        return this.getIntrinsicType("getVoidType");
    }
    async getUndefinedType() {
        return this.getIntrinsicType("getUndefinedType");
    }
    async getNullType() {
        return this.getIntrinsicType("getNullType");
    }
    async getNeverType() {
        return this.getIntrinsicType("getNeverType");
    }
    async getUnknownType() {
        return this.getIntrinsicType("getUnknownType");
    }
    async getBigIntType() {
        return this.getIntrinsicType("getBigIntType");
    }
    async getESSymbolType() {
        return this.getIntrinsicType("getESSymbolType");
    }
    async getNonPrimitiveType() {
        return this.getIntrinsicType("getNonPrimitiveType");
    }
    async typeToTypeNode(type, enclosingDeclaration, flags) {
        const binaryData = await this.client.apiRequestBinary("typeToTypeNode", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
            flags,
        });
        if (!binaryData)
            return undefined;
        return decodeNode(binaryData);
    }
    async signatureToSignatureDeclaration(signature, kind, enclosingDeclaration, flags) {
        const binaryData = await this.client.apiRequestBinary("signatureToSignatureDeclaration", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signature: signature.id,
            kind,
            location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
            flags,
        });
        if (!binaryData)
            return undefined;
        return decodeNode(binaryData);
    }
    async typeToString(type, enclosingDeclaration, flags) {
        const result = await this.client.apiRequest("typeToString", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            location: enclosingDeclaration ? getNodeId(enclosingDeclaration) : undefined,
            flags,
        });
        if (typeof result !== "string")
            throw new TypeError("typeToString returned a non-string result");
        return result;
    }
    async isContextSensitive(node) {
        return this.client.apiRequest("isContextSensitive", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
    }
    async isArrayType(type) {
        return this.client.apiRequest("isArrayType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
    }
    async isTupleType(type) {
        return type.isTupleType();
    }
    async isTupleTypeTarget(type) {
        return type.isTupleTypeTarget();
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
    async isReadonlySymbol(symbol) {
        return this.client.apiRequest("isReadonlySymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
    }
    /** Get the return type of a signature. Always returns a type. */
    async getReturnTypeOfSignature(signature) {
        return signature.getReturnType();
    }
    /**
     * Get the rest type of a signature. Always returns a type; a signature with
     * no rest parameter yields the `any` type.
     */
    async getRestTypeOfSignature(signature) {
        const data = await this.client.apiRequest("getRestTypeOfSignature", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signature: signature.id,
        });
        return this.objectRegistry.getOrCreateType(data);
    }
    async getTypePredicateOfSignature(signature) {
        const data = await this.client.apiRequest("getTypePredicateOfSignature", {
            snapshot: this.snapshotId,
            project: this.project.id,
            signature: signature.id,
        });
        if (!data)
            return undefined;
        return {
            kind: data.kind,
            parameterIndex: data.parameterIndex,
            parameterName: data.parameterName,
            type: data.type ? this.objectRegistry.getOrCreateType(data.type) : undefined,
        };
    }
    /**
     * Get the base types of a class or interface type. A type with no base types
     * yields an empty array.
     */
    async getBaseTypes(type) {
        return await type.getBaseTypes() ?? [];
    }
    /** Get the apparent type of a type. Always returns a type. */
    async getApparentType(type) {
        return type.getApparentType();
    }
    /** Get the reduced type of a type. Always returns a type. */
    async getReducedType(type) {
        return type.getReducedType();
    }
    async getPropertiesOfType(type) {
        return type.getProperties();
    }
    async getIndexInfosOfType(type) {
        return type.getIndexInfos();
    }
    async getIndexInfoOfType(type, kind) {
        const data = await this.client.apiRequest("getIndexInfoOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            kind,
        });
        return data ? {
            keyType: this.objectRegistry.getOrCreateType(data.keyType),
            valueType: this.objectRegistry.getOrCreateType(data.valueType),
            isReadonly: data.isReadonly ?? false,
            declaration: data.declaration ? new NodeHandle(data.declaration, this.project) : undefined,
        } : undefined;
    }
    async getIndexTypeOfType(type, kind) {
        const data = await this.client.apiRequest("getIndexTypeOfTypeByKind", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            kind,
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    async getTypeOfPropertyOfType(type, propertyName) {
        const data = await this.client.apiRequest("getTypeOfPropertyOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            name: propertyName,
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    /**
     * Get the constraint of a type parameter (the `T` in `<U extends T>`), or
     * undefined if it has none.
     */
    async getConstraintOfTypeParameter(type) {
        return type.getConstraint();
    }
    async getDefaultFromTypeParameter(type) {
        return type.getDefault();
    }
    async getBaseConstraintOfType(type) {
        const data = await this.client.apiRequest("getBaseConstraintOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
        return data ? this.objectRegistry.getOrCreateType(data) : undefined;
    }
    async getPropertyOfType(type, name) {
        const data = await this.client.apiRequest("getPropertyOfType", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
            name,
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    async getConstantValue(node) {
        const data = await this.client.apiRequest("getConstantValue", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return typeof data === "string" || typeof data === "number" ? data : undefined;
    }
    /** Get the signature of a function-like declaration. Always returns a signature. */
    async getSignatureFromDeclaration(node) {
        const data = await this.client.apiRequest("getSignatureFromDeclaration", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return this.objectRegistry.getOrCreateSignature(data);
    }
    async getExportSpecifierLocalTargetSymbol(node) {
        const data = await this.client.apiRequest("getExportSpecifierLocalTargetSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            location: getNodeId(node),
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    /**
     * Follow all aliases to get the original symbol. Always returns a symbol; for
     * an unresolved alias the checker yields the unknown symbol (use
     * {@link Checker.isUnknownSymbol} to detect it).
     */
    async getAliasedSymbol(symbol) {
        const data = await this.client.apiRequest("getAliasedSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return this.objectRegistry.getOrCreateSymbol(data);
    }
    /**
     * Get the fully qualified name of a symbol, walking up its parent chain
     * (e.g. `"/path/to/module".Namespace.Name`).
     */
    async getFullyQualifiedName(symbol) {
        return this.client.apiRequest("getFullyQualifiedName", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
    }
    async getImmediateAliasedSymbol(symbol) {
        const data = await this.client.apiRequest("getImmediateAliasedSymbol", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    /**
     * Get the target symbol if instantiated, or the provided symbol otherwise.
     */
    async getTargetSymbol(symbol) {
        if (symbol.checkFlags & CheckFlags.Instantiated) {
            const data = await this.client.apiRequest("getTargetSymbol", {
                snapshot: this.snapshotId,
                project: this.project.id,
                symbol: symbol.id,
            });
            return this.objectRegistry.getOrCreateSymbol(data);
        }
        return symbol;
    }
    async getExportSymbolOfSymbol(symbol) {
        const data = await this.client.apiRequest("getExportSymbolOfSymbolForChecker", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return this.objectRegistry.getOrCreateSymbol(data);
    }
    /**
     * Fetch (once, then cache) the handle ids of the per-checker singleton
     * symbols (unknown, undefined, arguments). These ids are stable for the life
     * of the project's checker, so identity checks against them are local after
     * the first call.
     */
    getWellKnownSymbols() {
        return this.wellKnownSymbols ??= this.client.apiRequest("getWellKnownSymbols", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
    }
    /**
     * Returns `true` if the symbol is the checker's "unknown" symbol (e.g. the
     * result of {@link Checker.getAliasedSymbol} on an unresolved alias).
     */
    async isUnknownSymbol(symbol) {
        return symbol.id === (await this.getWellKnownSymbols()).unknown;
    }
    /**
     * Returns `true` if the symbol is the checker's "undefined" symbol.
     */
    async isUndefinedSymbol(symbol) {
        return symbol.id === (await this.getWellKnownSymbols()).undefined;
    }
    /**
     * Returns `true` if the symbol is the checker's "arguments" symbol.
     */
    async isArgumentsSymbol(symbol) {
        return symbol.id === (await this.getWellKnownSymbols()).arguments;
    }
    /**
     * Fetch (once, then cache) the handle id of the per-checker unknown
     * signature. This id is stable for the life of the project's checker, so
     * identity checks against it are local after the first call.
     */
    getWellKnownSignatures() {
        return this.wellKnownSignatures ??= this.client.apiRequest("getWellKnownSignatures", {
            snapshot: this.snapshotId,
            project: this.project.id,
        });
    }
    /**
     * Returns `true` if the signature is the checker's "unknown" signature (e.g.
     * the result of {@link Checker.getResolvedSignature} on a call that cannot be
     * resolved).
     */
    async isUnknownSignature(signature) {
        return signature.id === (await this.getWellKnownSignatures()).unknown;
    }
    async getExportsOfModule(symbol) {
        const data = await this.client.apiRequest("getExportsOfModule", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return data ? data.map(d => this.objectRegistry.getOrCreateSymbol(d)) : [];
    }
    async getMemberInModuleExports(symbol, name) {
        const data = await this.client.apiRequest("getMemberInModuleExports", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
            name,
        });
        return data ? this.objectRegistry.getOrCreateSymbol(data) : undefined;
    }
    async getJsDocTagsOfSymbol(symbol) {
        const data = await this.client.apiRequest("getJsDocTags", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
        return data ?? [];
    }
    async getDocumentationCommentOfSymbol(symbol) {
        return this.client.apiRequest("getDocumentationComment", {
            snapshot: this.snapshotId,
            project: this.project.id,
            symbol: symbol.id,
        });
    }
    /**
     * Get the type arguments of a type reference (e.g. the `string` in `Array<string>`).
     */
    async getTypeArguments(type) {
        const data = await this.client.apiRequest("getTypeArguments", {
            snapshot: this.snapshotId,
            project: this.project.id,
            type: type.id,
        });
        return data ? data.map(d => this.objectRegistry.getOrCreateType(d)) : [];
    }
}
export class Emitter {
    client;
    constructor(client) {
        this.client = client;
    }
    async printNode(node, options = {}) {
        const encoded = encodeNode(node);
        const base64 = uint8ArrayToBase64(encoded);
        return this.client.apiRequest("printNode", {
            data: base64,
            preserveSourceNewlines: options.preserveSourceNewlines,
            neverAsciiEscape: options.neverAsciiEscape,
            terminateUnterminatedLiterals: options.terminateUnterminatedLiterals,
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
    async formatNodeForInsertion(node, file, position) {
        const data = await this.client.apiRequest("getDefaultProjectForFile", {
            snapshot: this.snapshotId,
            file,
        });
        if (!data) {
            throw new Error(`No project found for file: ${typeof file === "string" ? file : file.uri}`);
        }
        const encoded = encodeNode(node);
        const base64 = uint8ArrayToBase64(encoded);
        return this.client.apiRequest("formatNodeForInsertion", {
            snapshot: this.snapshotId,
            project: data.id,
            file,
            position,
            data: base64,
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
    async resolve(project = this.canonicalProject) {
        const sourceFile = await project.program.getSourceFile(this.path);
        if (!sourceFile) {
            return undefined;
        }
        return sourceFile.getOrCreateNodeAtIndex(this.index);
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
    async getParent() {
        return this.objectRegistry.fetchSymbol(this, "getParentOfSymbol", this.parent, this.canonicalProject.id);
    }
    /**
     * Get this symbol's members keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    getMembers() {
        return this.membersCache ??= this.fetchSymbolTable("getMembersOfSymbol");
    }
    /**
     * Get this symbol's exports keyed by escaped name. The result is cached on
     * the symbol, so repeated calls do not round-trip to the server.
     */
    getExports() {
        return this.exportsCache ??= this.fetchSymbolTable("getExportsOfSymbol");
    }
    async fetchSymbolTable(method) {
        const symbols = await this.objectRegistry.fetchSymbols(this, method, undefined, this.canonicalProject.id);
        const table = new Map();
        for (const symbol of symbols) {
            table.set(symbol.escapedName, symbol);
        }
        return table;
    }
    async getExportSymbol() {
        if (!this.exportSymbol)
            return this;
        return this.objectRegistry.fetchSymbol(this, "getExportSymbolOfSymbol", this.exportSymbol, this.canonicalProject.id);
    }
    async getJsDocTags(checker) {
        return checker.getJsDocTagsOfSymbol(this);
    }
    async getDocumentationComment(checker) {
        return checker.getDocumentationCommentOfSymbol(this);
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
    async getSymbol() {
        return this.objectRegistry.fetchSymbol(this, "getSymbolOfType", this.symbol);
    }
    async getProperties() {
        if (this.properties === false) {
            this.properties = await this.objectRegistry.fetchPropertiesOfType(this);
        }
        return this.properties;
    }
    getProperty(propertyName) {
        return this.objectRegistry.fetchPropertyOfType(this, propertyName);
    }
    async getApparentProperties() {
        if (this.apparentProperties === false) {
            this.apparentProperties = await this.objectRegistry.fetchApparentPropertiesOfType(this);
        }
        return this.apparentProperties;
    }
    async getCallSignatures() {
        if (this.callSignatures === false) {
            this.callSignatures = await this.objectRegistry.fetchSignaturesOfType(this, SignatureKind.Call);
        }
        return this.callSignatures;
    }
    async getConstructSignatures() {
        if (this.constructSignatures === false) {
            this.constructSignatures = await this.objectRegistry.fetchSignaturesOfType(this, SignatureKind.Construct);
        }
        return this.constructSignatures;
    }
    async getNonNullableType() {
        const result = await this.objectRegistry.fetchType(this, "getNonNullableType", this.nonNullableType);
        this.nonNullableType = result.id;
        return result;
    }
    async getStringIndexType() {
        if (this.stringIndexType === false) {
            this.stringIndexType = await this.getStringIndexTypeWorker();
        }
        return this.stringIndexType;
    }
    async getStringIndexTypeWorker() {
        const infos = await this.getIndexInfos();
        return infos.find(info => (info.keyType.flags & TypeFlags.String) !== 0)?.valueType;
    }
    async getNumberIndexType() {
        if (this.numberIndexType === false) {
            this.numberIndexType = await this.getNumberIndexTypeWorker();
        }
        return this.numberIndexType;
    }
    async getNumberIndexTypeWorker() {
        const infos = await this.getIndexInfos();
        return infos.find(info => (info.keyType.flags & TypeFlags.Number) !== 0)?.valueType;
    }
    async getApparentType() {
        const result = await this.objectRegistry.fetchType(this, "getApparentType", this.apparentType);
        this.apparentType = result.id;
        return result;
    }
    async getReducedType() {
        const result = await this.objectRegistry.fetchType(this, "getReducedType", this.reducedType);
        this.reducedType = result.id;
        return result;
    }
    async getIndexInfos() {
        if (this.indexInfos === false) {
            this.indexInfos = await this.objectRegistry.fetchIndexInfosOfType(this);
        }
        return this.indexInfos;
    }
    async getAliasSymbol() {
        return this.objectRegistry.fetchSymbol(this, "getAliasSymbolOfType", this.aliasSymbol);
    }
    async getTarget() {
        return this.objectRegistry.fetchType(this, "getTargetOfType", this.target);
    }
    async getFreshType() {
        return this.objectRegistry.fetchOptionalType(this, "getFreshTypeOfType", this.freshType);
    }
    async getRegularType() {
        return this.objectRegistry.fetchOptionalType(this, "getRegularTypeOfType", this.regularType);
    }
    async getTypes() {
        // Only union, intersection, and template literal types have constituent
        // types; any other kind has none, so return undefined rather than sending
        // a request the server cannot satisfy.
        if (!(this.flags & (TypeFlags.UnionOrIntersection | TypeFlags.TemplateLiteral))) {
            return undefined;
        }
        return this.objectRegistry.fetchTypes(this, "getTypesOfType");
    }
    async getTypeParameters() {
        return this.objectRegistry.fetchTypes(this, "getTypeParametersOfType", this.typeParameters);
    }
    async getOuterTypeParameters() {
        return this.objectRegistry.fetchTypes(this, "getOuterTypeParametersOfType", this.outerTypeParameters);
    }
    async getLocalTypeParameters() {
        return this.objectRegistry.fetchTypes(this, "getLocalTypeParametersOfType", this.localTypeParameters);
    }
    async getThisType() {
        return this.objectRegistry.fetchOptionalType(this, "getThisTypeOfType", this.thisType);
    }
    async getAliasTypeArguments() {
        return this.objectRegistry.fetchTypes(this, "getAliasTypeArgumentsOfType", this.aliasTypeArguments);
    }
    async getObjectType() {
        return this.objectRegistry.fetchType(this, "getObjectTypeOfType", this.objectType);
    }
    async getIndexType() {
        return this.objectRegistry.fetchType(this, "getIndexTypeOfType", this.indexType);
    }
    async getCheckType() {
        return this.objectRegistry.fetchType(this, "getCheckTypeOfType", this.checkType);
    }
    async getExtendsType() {
        return this.objectRegistry.fetchType(this, "getExtendsTypeOfType", this.extendsType);
    }
    async getBaseType() {
        return this.objectRegistry.fetchType(this, "getBaseTypeOfType", this.baseType);
    }
    async getConstraint() {
        // Type parameters resolve their constraint lazily through the checker,
        // whereas substitution types carry a preloaded constraint handle.
        if (this.flags & TypeFlags.TypeParameter) {
            const result = await this.objectRegistry.fetchOptionalType(this, "getConstraintOfTypeParameter", this.constraint);
            this.constraint = result ? result.id : 0;
            return result;
        }
        return this.objectRegistry.fetchType(this, "getConstraintOfType", this.substConstraint);
    }
    async getDefault() {
        const result = await this.objectRegistry.fetchOptionalType(this, "getDefaultFromTypeParameter", this.default);
        this.default = result ? result.id : 0;
        return result;
    }
    async getTrueType() {
        const result = await this.objectRegistry.fetchType(this, "getTrueTypeOfConditionalType", this.trueType);
        this.trueType = result.id;
        return result;
    }
    async getFalseType() {
        const result = await this.objectRegistry.fetchType(this, "getFalseTypeOfConditionalType", this.falseType);
        this.falseType = result.id;
        return result;
    }
    /**
     * Get the base types of this type. Returns `undefined` for any type that is
     * not a class or interface.
     */
    async getBaseTypes() {
        if (!this.isClassOrInterface()) {
            return undefined;
        }
        if (this.baseTypes === false) {
            this.baseTypes = await this.objectRegistry.fetchBaseTypes(this);
        }
        return this.baseTypes;
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
    async getTypeParameters() {
        return this.objectRegistry.fetchTypes(this, "getTypeParametersOfSignature", this.typeParameters);
    }
    async getParameters() {
        return this.objectRegistry.fetchSymbols(this, "getParametersOfSignature", this.parameters);
    }
    async getThisParameter() {
        return this.objectRegistry.fetchSymbol(this, "getThisParameterOfSignature", this.thisParameter);
    }
    async getTarget() {
        return this.objectRegistry.fetchSignature(this, "getTargetOfSignature", this.target);
    }
    async getReturnType() {
        const result = await this.objectRegistry.fetchType(this, "getReturnTypeOfSignature", this.returnType);
        this.returnType = result.id;
        return result;
    }
    getTypeParameterAtPosition(pos) {
        return this.objectRegistry.fetchTypeParameterAtPosition(this, pos);
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