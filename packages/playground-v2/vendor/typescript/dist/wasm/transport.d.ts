export { instantiateWasm, type InstantiateWasmOptions, instantiateWasmSync } from "./wasi.ts";
import type { FileSystemCallbacks } from "../api/fs.ts";
export interface WasmReactorExports {
    memory: {
        readonly buffer: ArrayBufferLike;
    };
    create_session(optionsLength: number): number;
    start_session(callbacksLength: number): number;
    close_session(): void;
    get_request_buffer(size: number): number;
    send_message(type: number, methodLength: number, payloadLength: number): number;
    receive_message(): number;
    set_file(pathLength: number, contentLength: number): number;
    read_file(pathLength: number): number;
    remove_file(pathLength: number): number;
    response_ptr(): number;
    response_len(): number;
    response_method_len(): number;
}
export interface WasmReactorInstance {
    readonly exports: object;
}
export interface WasmTransportOptions {
    /**
     * An initialized reactor, normally created by `instantiateWasm` or
     * `instantiateWasmSync`. Other WASI hosts must call the module's
     * `typescript_initialize` export instead of `_start`, which runs the
     * command line compiler.
     */
    instance: WasmReactorInstance;
    cwd?: string | undefined;
    useCaseSensitiveFileNames?: boolean | undefined;
    collectTiming?: boolean | undefined;
    /**
     * Callbacks that replace operations on the reactor's in-memory file
     * system, which `serverFS.useOS` refers to.
     */
    fs?: FileSystemCallbacks | undefined;
}
type TransportCallback = (name: string, payload: string) => string | PromiseLike<string>;
/**
 * API transport backed by an in-process TypeScript WebAssembly reactor.
 *
 * The reactor runs the same server as a separate process would, so callbacks
 * may return promises and may make nested requests through this transport.
 * Requests made while callbacks are outstanding are nested within the
 * innermost one, which must complete before outer callbacks can reply.
 */
export declare class WasmTransport {
    lastBytesSent: number;
    lastBytesReceived: number;
    private readonly exports;
    private readonly callbacks;
    private readonly fileSystemCallbacks;
    private fs;
    private readonly stack;
    private started;
    private closed;
    constructor(options: WasmTransportOptions);
    /**
     * Configures file system callbacks. They are validated immediately and
     * read again when the first request starts the session.
     */
    setFileSystem(fs: FileSystemCallbacks | undefined): void;
    requestSync(method: string, payload: string): string;
    requestBinarySync(method: string, payload: Uint8Array): Uint8Array;
    request(method: string, payload: string): {
        value: string;
        bytesSent: number;
        bytesReceived: number;
    } | Promise<{
        value: string;
        bytesSent: number;
        bytesReceived: number;
    }>;
    requestBinary(method: string, payload: Uint8Array): {
        value: Uint8Array;
        bytesSent: number;
        bytesReceived: number;
    } | Promise<{
        value: Uint8Array;
        bytesSent: number;
        bytesReceived: number;
    }>;
    registerCallback(name: string, callback: TransportCallback): void;
    unregisterCallback(name: string): void;
    setFile(path: string, content: string): void;
    /** Read a file from the reactor's in-memory filesystem. */
    readFile(path: string): string | undefined;
    removeFile(path: string): void;
    close(): void;
    private startRequest;
    private unwrap;
    /**
     * Exchanges messages with the server until the innermost frame is a
     * callback that has not yet produced its reply, or no frames remain.
     */
    private pump;
    private settle;
    private invokeCallback;
    private abort;
    private ensureStarted;
    private send;
    private writeRequest;
    private readResponseText;
    private readResponseMethod;
    private readResponsePayloadText;
    private readResponsePayload;
    private readResponseBytes;
    private ensureOpen;
}
//# sourceMappingURL=transport.d.ts.map