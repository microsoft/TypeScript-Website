import type { APIMethodInfo, APIRequest, SourceFileResponseMethod } from "../proto.ts";
import { TimingCollector, type TimingInfo } from "../timing.ts";
import type { AsyncTransport } from "./transport.ts";
/** Protocol client for an injected asynchronous transport. */
export declare class TransportClient {
    private readonly encoder;
    private readonly timing;
    private readonly transport;
    private readonly maxResponseBytesPerPage;
    private connected;
    private closed;
    private nextBatch;
    private batchGeneration;
    private batchedRequests;
    private readonly closedPromise;
    private rejectClosed;
    constructor(transport: AsyncTransport, collectTiming: boolean, maxResponseBytesPerPage?: number);
    connect(): Promise<void>;
    batchContext(): {
        [Symbol.dispose](): void;
    };
    apiRequest<K extends APIRequest["method"]>(method: K, params: APIMethodInfo[K]["params"]): Promise<APIMethodInfo[K]["result"]>;
    apiRequestBinary<K extends SourceFileResponseMethod>(method: K, params: APIMethodInfo[K]["params"]): Promise<Uint8Array | undefined>;
    getTimingCollector(): TimingCollector | undefined;
    getTimingInfo(): Promise<TimingInfo>;
    resetTimingInfo(): Promise<void>;
    close(): Promise<void>;
    private scheduleBatch;
    private doBatch;
    private sendRequest;
    private sendBinaryRequest;
    private invokeTransport;
    private recordTiming;
}
//# sourceMappingURL=transportClient.d.ts.map