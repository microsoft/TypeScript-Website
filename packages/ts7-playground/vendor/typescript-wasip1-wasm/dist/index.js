export { wasmURL } from "#wasmURL";
export { instantiateWasm, instantiateWasmSync } from "./wasi.js";
import { setWasmFileSystem, } from "./wasi.js";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
/** Synchronous API transport backed by an in-process TypeScript WebAssembly reactor. */
export class WasmTransport {
    lastBytesSent = 0;
    lastBytesReceived = 0;
    exports;
    instance;
    requestPointer = 0;
    closed = false;
    constructor(options) {
        this.instance = options.instance;
        this.exports = getReactorExports(options.instance);
        const sessionOptions = encoder.encode(JSON.stringify({
            cwd: options.cwd ?? "/",
            useCaseSensitiveFileNames: options.useCaseSensitiveFileNames,
            collectTiming: options.collectTiming,
        }));
        this.writeRequest(sessionOptions);
        if (this.exports.create_session(this.requestPointer, sessionOptions.length) !== 0) {
            throw new Error(`Failed to create TypeScript WASM session: ${this.readResponseText()}`);
        }
        try {
            setWasmFileSystem(options.instance, options.fs);
        }
        catch (error) {
            try {
                this.exports.close_session();
            }
            catch (closeError) {
                throw new AggregateError([error, closeError], "Failed to configure the TypeScript WASM filesystem and close its session");
            }
            throw error;
        }
    }
    setFileSystem(fs) {
        this.ensureOpen();
        setWasmFileSystem(this.instance, fs);
    }
    requestSync(method, payload) {
        return decoder.decode(this.call(method, encoder.encode(payload)));
    }
    request(method, payload) {
        const value = this.requestSync(method, payload);
        return {
            value,
            bytesSent: this.lastBytesSent,
            bytesReceived: this.lastBytesReceived,
        };
    }
    requestBinarySync(method, payload) {
        return this.call(method, payload);
    }
    requestBinary(method, payload) {
        const value = this.requestBinarySync(method, payload);
        return {
            value,
            bytesSent: this.lastBytesSent,
            bytesReceived: this.lastBytesReceived,
        };
    }
    setFile(path, content) {
        this.ensureOpen();
        const pathBytes = encoder.encode(path);
        const contentBytes = encoder.encode(content);
        this.writeRequest(pathBytes, contentBytes);
        if (this.exports.set_file(pathBytes.length, contentBytes.length) !== 0) {
            throw new Error(`Failed to write ${path}: ${this.readResponseText()}`);
        }
    }
    /** Read a file from the reactor's in-memory filesystem. */
    readFile(path) {
        this.ensureOpen();
        const pathBytes = encoder.encode(path);
        this.writeRequest(pathBytes);
        const status = this.exports.read_file(pathBytes.length);
        if (status === 2)
            return undefined;
        if (status !== 0) {
            throw new Error(`Failed to read ${path}: ${this.readResponseText()}`);
        }
        return this.readResponseText();
    }
    removeFile(path) {
        this.ensureOpen();
        const pathBytes = encoder.encode(path);
        this.writeRequest(pathBytes);
        if (this.exports.remove_file(pathBytes.length) !== 0) {
            throw new Error(`Failed to remove ${path}: ${this.readResponseText()}`);
        }
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        try {
            this.exports.close_session();
        }
        finally {
            setWasmFileSystem(this.instance, undefined);
        }
    }
    call(method, payload) {
        this.ensureOpen();
        const methodBytes = encoder.encode(method);
        this.writeRequest(methodBytes, payload);
        this.lastBytesSent = payload.length;
        if (this.exports.handle_request(methodBytes.length, payload.length) !== 0) {
            throw new Error(`TypeScript WASM request "${method}" failed: ${this.readResponseText()}`);
        }
        this.lastBytesReceived = this.exports.response_len();
        return this.readResponseBytes();
    }
    writeRequest(first, second) {
        const total = first.length + (second?.length ?? 0);
        this.requestPointer = this.exports.get_request_buffer(total) >>> 0;
        const memory = new Uint8Array(this.exports.memory.buffer);
        memory.set(first, this.requestPointer);
        if (second) {
            memory.set(second, this.requestPointer + first.length);
        }
    }
    readResponseText() {
        return decoder.decode(this.readResponseBytes());
    }
    readResponseBytes() {
        const length = this.exports.response_len();
        if (length === 0)
            return new Uint8Array();
        return new Uint8Array(this.exports.memory.buffer, this.exports.response_ptr() >>> 0, length).slice();
    }
    ensureOpen() {
        if (this.closed) {
            throw new Error("The TypeScript WASM transport is closed");
        }
    }
}
function getReactorExports(instance) {
    const exports = instance.exports;
    const required = [
        "create_session",
        "close_session",
        "get_request_buffer",
        "handle_request",
        "set_file",
        "read_file",
        "remove_file",
        "response_ptr",
        "response_len",
    ];
    const missing = required.filter(name => typeof exports[name] !== "function");
    if (exports.memory == null || typeof exports.memory !== "object" || !("buffer" in exports.memory)) {
        missing.push("memory");
    }
    if (missing.length > 0) {
        throw new Error(`Invalid TypeScript WASM reactor: missing ${missing.join(", ")}`);
    }
    return exports;
}
//# sourceMappingURL=index.js.map