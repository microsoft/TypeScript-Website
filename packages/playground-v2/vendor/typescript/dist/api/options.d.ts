/**
 * Shared utilities for the TypeScript API client.
 */
import type { AsyncTransport } from "./async/transport.ts";
import type { FileSystem } from "./fs.ts";
import type { SyncTransport } from "./sync/transport.ts";
export interface ClientSocketOptions {
    /** Path to the Unix domain socket or Windows named pipe for API communication */
    pipe: string;
    /** Maximum encoded byte size of each batch response page. Defaults to 300 million bytes. Individual responses can be larger than this size, but this controls where batch pages are cutoff. */
    maxResponseBytesPerPage?: number | undefined;
}
export interface ClientSpawnOptions {
    /** Path to the tsc executable. Defaults to the bundled tsc binary. */
    tsserverPath?: string | undefined;
    /** Current working directory */
    cwd?: string | undefined;
    /** Virtual filesystem callbacks */
    fs?: FileSystem | undefined;
    /** Allow trusted projects to execute configured external content mapper processes. */
    runExternalCode?: boolean | undefined;
    /** Maximum encoded byte size of each batch response page. Defaults to 300 million bytes. Individual responses can be larger than this size, but this controls where batch pages are cutoff. */
    maxResponseBytesPerPage?: number | undefined;
    /**
     * When true, collect timing information for each request. The client
     * measures round-trip latency and bytes sent/received, and the server
     * measures its own per-request processing time; both are combined (along
     * with an estimated transport overhead) in the snapshot returned by
     * {@link API.getTimingInfo}.
     */
    collectTiming?: boolean | undefined;
}
export type ClientOptions = ClientSocketOptions | ClientSpawnOptions;
export declare function isSpawnOptions(options: ClientOptions): options is ClientSpawnOptions;
export interface ClientTransportOptions {
    /**
     * An existing synchronous transport connected to an API session.
     * Custom module resolution callbacks must obey the transport's reentrancy
     * constraints.
     */
    transport: SyncTransport;
    /** Maximum encoded byte size of each batch response page. Defaults to 300 million bytes. Individual responses can be larger than this size, but this controls where batch pages are cutoff. */
    maxResponseBytesPerPage?: number | undefined;
    /** Virtual filesystem callbacks used by transports that support them. */
    fs?: FileSystem | undefined;
    /** Collect timing information for requests made through the transport. */
    collectTiming?: boolean | undefined;
}
export type SyncClientOptions = ClientSocketOptions | ClientSpawnOptions | ClientTransportOptions;
export declare function isTransportOptions(options: SyncClientOptions): options is ClientTransportOptions;
export interface AsyncClientTransportOptions {
    /**
     * An existing asynchronous transport connected to an API session.
     * Host callbacks are synchronous even when requests are asynchronous, so
     * custom module resolution callbacks cannot return Promises and must obey
     * the transport's reentrancy constraints.
     */
    transport: AsyncTransport;
    /** Maximum encoded byte size of each batch response page. Defaults to 300 million bytes. Individual responses can be larger than this size, but this controls where batch pages are cutoff. */
    maxResponseBytesPerPage?: number | undefined;
    /** Virtual filesystem callbacks used by transports that support them. */
    fs?: FileSystem | undefined;
    /** Collect timing information for requests made through the transport. */
    collectTiming?: boolean | undefined;
}
export type AsyncClientOptions = ClientOptions | AsyncClientTransportOptions;
export declare function isAsyncTransportOptions(options: AsyncClientOptions): options is AsyncClientTransportOptions;
export declare function resolveExePath(options: ClientSpawnOptions): string;
export declare function getAPIProcessArgs(options: ClientSpawnOptions, async: boolean): string[];
export interface LSPConnectionOptions extends ClientSocketOptions {
}
export type APIOptions = ClientSpawnOptions | AsyncClientTransportOptions;
export type SyncAPIOptions = ClientSpawnOptions | ClientTransportOptions;
//# sourceMappingURL=options.d.ts.map