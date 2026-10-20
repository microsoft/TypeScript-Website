import { type AsyncClientOptions, type ClientOptions } from "../options.ts";
import type { APIMethodInfo, APIRequest, SourceFileResponseMethod } from "../proto.ts";
import { TimingCollector, type TimingInfo } from "../timing.ts";
import { type TransportClient } from "./transportClient.ts";
export type { AsyncClientOptions as ClientOptions, AsyncClientTransportOptions, ClientSocketOptions, ClientSpawnOptions } from "../options.ts";
export type { AsyncTransport } from "./transport.ts";
export type Client = TransportClient | RpcClient;
export declare function createClient(options: AsyncClientOptions): Client;
/**
 * Client handles communication with the TypeScript API server
 * over STDIO (spawned process) or a Unix domain socket using JSON-RPC.
 */
declare class RpcClient {
    private socket;
    private process;
    private connection;
    private jsonrpc;
    private options;
    private connected;
    private closed;
    private connecting;
    private timing;
    private timingDump;
    private closing;
    private batchedRequests;
    private nextBatch;
    constructor(options: ClientOptions);
    connect(): Promise<void>;
    private connectWorker;
    private connectViaSpawn;
    private connectViaSocket;
    private registerFSCallbacks;
    private requestType;
    private sendRequestWithTiming;
    registerCallback(name: string, callback: (params: unknown) => unknown | Promise<unknown>): () => void;
    private doBatch;
    private scheduleImmediateBatch;
    batchContext(): {
        [Symbol.dispose](): void;
    };
    apiRequest<K extends APIRequest["method"]>(method: K, params: APIMethodInfo[K]["params"]): Promise<APIMethodInfo[K]["result"]>;
    apiRequestBinary<K extends SourceFileResponseMethod>(method: K, params: APIMethodInfo[K]["params"]): Promise<Uint8Array | undefined>;
    /**
     * Returns the timing collector that per-node materialization is reported
     * into, or undefined when timing collection is disabled. The returned
     * collector is the same one folded into {@link getTimingInfo}, so
     * materialization totals surface alongside request timings.
     */
    getTimingCollector(): TimingCollector | undefined;
    /**
     * Returns a combined timing snapshot: client-measured round-trip and byte
     * counts folded together with the server's own per-request processing time
     * (fetched via a getServerTiming request) and estimated transport overhead.
     */
    getTimingInfo(): Promise<TimingInfo>;
    resetTimingInfo(): Promise<void>;
    private fetchServerTiming;
    close(): Promise<void>;
    private closeWorker;
}
//# sourceMappingURL=client.d.ts.map