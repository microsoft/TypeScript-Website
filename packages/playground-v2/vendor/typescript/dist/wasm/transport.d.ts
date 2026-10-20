export { instantiateWasm, type InstantiateWasmOptions, instantiateWasmSync } from "./wasi.ts";
import { type WasmFileSystem } from "./wasi.ts";
export interface WasmReactorExports {
    memory: {
        readonly buffer: ArrayBufferLike;
    };
    create_session(optionsLength: number): number;
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
     * An initialized reactor, normally created by `instantiateWasm` or
     * `instantiateWasmSync`. Other WASI hosts must call the module's
     * `typescript_initialize` export instead of `_start`, which runs the
     * command line compiler, and cannot use the `fs` option or host
     * callbacks such as custom file systems passed to the API.
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
    private closed;
    private inCallback;
    private readonly callbackNames;
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
    private ensureCanEnterWasm;
    private configureFileSystem;
    private invokeCallback;
}
//# sourceMappingURL=transport.d.ts.map