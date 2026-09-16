import { type AsyncClientOptions } from "../options.ts";
import type { APIMethodInfo, APIRequest, SourceFileResponseMethod } from "../proto.ts";
import { TimingCollector, type TimingInfo } from "../timing.ts";
export type { AsyncClientOptions as ClientOptions, AsyncClientTransportOptions, ClientSocketOptions, ClientSpawnOptions } from "../options.ts";
export type { AsyncTransport } from "./transport.ts";
/**
 * Client handles communication with the TypeScript API server
 * over STDIO (spawned process) or a Unix domain socket using JSON-RPC.
 */
export declare class Client {
    private socket;
    private process;
    private connection;
    private options;
    private transportClient;
    private connected;
    private closed;
    private connecting;
    private timing;
    private batchedRequests;
    private nextBatch;
    constructor(options: AsyncClientOptions);
    connect(): Promise<void>;
    private connectWorker;
    private connectViaSpawn;
    private connectViaSocket;
    private registerFSCallbacks;
    private sendRequestWithTiming;
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
}
//# sourceMappingURL=client.d.ts.map