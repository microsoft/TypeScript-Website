import { type MessageConnection, RAL } from "../../../vendor/vscode-jsonrpc/lib/common/api.js";
export { type MessageConnection, RequestType } from "../../../vendor/vscode-jsonrpc/lib/common/api.js";
interface EventSource {
    on(event: string, listener: (...args: any[]) => void): unknown;
    off(event: string, listener: (...args: any[]) => void): unknown;
}
interface WritableStream extends EventSource {
    write(data: Uint8Array, callback: (error: Error | null | undefined) => void): unknown;
    write(data: string, encoding: RAL.MessageBufferEncoding, callback: (error: Error | null | undefined) => void): unknown;
    end(): unknown;
}
/** Creates a JSON-RPC connection over Node.js streams. */
export declare function createStreamConnection(readable: EventSource, writable: WritableStream): MessageConnection;
//# sourceMappingURL=jsonrpc.d.ts.map