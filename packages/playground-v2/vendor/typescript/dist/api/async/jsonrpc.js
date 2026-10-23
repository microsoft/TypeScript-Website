// Only vscode-jsonrpc's environment-neutral core is imported here. Its Node
// entry point loads Node modules at import time, which would prevent this
// package from being loaded or bundled for other environments, so the Node
// runtime layer it would install is provided below instead.
import { AbstractMessageBuffer, createMessageConnection, Disposable, NullLogger, RAL, ReadableStreamMessageReader, WriteableStreamMessageWriter, } from "../../../vendor/vscode-jsonrpc/lib/common/api.js";
export { RequestType } from "../../../vendor/vscode-jsonrpc/lib/common/api.js";
class MessageBuffer extends AbstractMessageBuffer {
    emptyBuffer() {
        return Buffer.allocUnsafe(0);
    }
    fromString(value, encoding) {
        return Buffer.from(value, encoding);
    }
    toString(value, encoding) {
        return value instanceof Buffer ? value.toString(encoding) : new TextDecoder(encoding).decode(value);
    }
    asNative(buffer, length) {
        if (length === undefined) {
            return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        }
        return buffer instanceof Buffer ? buffer.subarray(0, length) : Buffer.from(buffer.buffer, buffer.byteOffset, length);
    }
    allocNative(length) {
        return Buffer.allocUnsafe(length);
    }
}
function listen(stream, event, listener) {
    stream.on(event, listener);
    return Disposable.create(() => stream.off(event, listener));
}
let installed = false;
function installRuntime() {
    if (installed)
        return;
    installed = true;
    RAL.install({
        messageBuffer: {
            create: encoding => new MessageBuffer(encoding),
        },
        applicationJson: {
            encoder: {
                name: "application/json",
                encode: async (message, options) => Buffer.from(JSON.stringify(message, undefined, 0), options.charset),
            },
            decoder: {
                name: "application/json",
                decode: async (buffer, options) => JSON.parse(buffer instanceof Buffer ? buffer.toString(options.charset) : new TextDecoder(options.charset).decode(buffer)),
            },
        },
        console,
        timer: {
            setTimeout(callback, ms, ...args) {
                const handle = setTimeout(callback, ms, ...args);
                return { dispose: () => clearTimeout(handle) };
            },
            setImmediate(callback, ...args) {
                const handle = setImmediate(callback, ...args);
                return { dispose: () => clearImmediate(handle) };
            },
            setInterval(callback, ms, ...args) {
                const handle = setInterval(callback, ms, ...args);
                return { dispose: () => clearInterval(handle) };
            },
        },
    });
}
/** Creates a JSON-RPC connection over Node.js streams. */
export function createStreamConnection(readable, writable) {
    installRuntime();
    const reader = new ReadableStreamMessageReader({
        onClose: listener => listen(readable, "close", listener),
        onError: listener => listen(readable, "error", listener),
        onEnd: listener => listen(readable, "end", listener),
        onData: listener => listen(readable, "data", listener),
    });
    const writer = new WriteableStreamMessageWriter({
        onClose: listener => listen(writable, "close", listener),
        onError: listener => listen(writable, "error", listener),
        onEnd: listener => listen(writable, "end", listener),
        write: (data, encoding) => new Promise((resolve, reject) => {
            const callback = (error) => error ? reject(error) : resolve();
            if (typeof data === "string") {
                writable.write(data, encoding ?? "utf-8", callback);
            }
            else {
                writable.write(data, callback);
            }
        }),
        end: () => writable.end(),
    });
    return createMessageConnection(reader, writer, NullLogger);
}
//# sourceMappingURL=jsonrpc.js.map