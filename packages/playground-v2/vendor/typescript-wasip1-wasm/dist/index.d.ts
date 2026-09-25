export { wasmURL } from "#wasmURL";
export { instantiateWasm, type InstantiateWasmOptions, instantiateWasmSync } from "./wasi.ts";
import { type WasmFileSystem } from "./wasi.ts";
export interface WasmReactorExports {
    memory: {
        readonly buffer: ArrayBufferLike;
    };
    create_session(optionsPointer: number, optionsLength: number): number;
    close_session(): void;
    get_request_buffer(size: number): number;
    handle_request(methodLength: number, payloadLength: number): number;
    set_file(pathLength: number, contentLength: number): number;
    read_file(pathLength: number): number;
    remove_file(pathLength: number): number;
    response_ptr(): number;
    response_len(): number;
}
export interface WasmReactorInstance {
    readonly exports: object;
}
export interface WasmTransportOptions {
    /**
     * An instantiated reactor whose WASI host has already initialized it.
     * For example, call `wasi.initialize(instance)` before constructing the transport.
     */
    instance: WasmReactorInstance;
    cwd?: string | undefined;
    useCaseSensitiveFileNames?: boolean | undefined;
    collectTiming?: boolean | undefined;
    fs?: WasmFileSystem | undefined;
}
/**
 * Synchronous API transport backed by an in-process TypeScript WebAssembly reactor.
 *
 * Host callbacks must complete synchronously and cannot call this transport while
 * an outer request is in progress.
 */
export declare class WasmTransport {
    lastBytesSent: number;
    lastBytesReceived: number;
    private readonly instance;
    private readonly exports;
    private requestPointer;
    private closed;
    private inCallback;
    constructor(options: WasmTransportOptions);
    setFileSystem(fs: WasmFileSystem | undefined): void;
    requestSync(method: string, payload: string): string;
    request(method: string, payload: string): {
        value: string;
        bytesSent: number;
        bytesReceived: number;
    };
    requestBinarySync(method: string, payload: Uint8Array): Uint8Array;
    requestBinary(method: string, payload: Uint8Array): {
        value: Uint8Array;
        bytesSent: number;
        bytesReceived: number;
    };
    registerCallback(name: string, callback: (name: string, payload: string) => string): void;
    unregisterCallback(name: string): void;
    setFile(path: string, content: string): void;
    /** Read a file from the reactor's in-memory filesystem. */
    readFile(path: string): string | undefined;
    removeFile(path: string): void;
    close(): void;
    private call;
    private writeRequest;
    private readResponseText;
    private readResponseBytes;
    private ensureOpen;
}
//# sourceMappingURL=index.d.ts.map