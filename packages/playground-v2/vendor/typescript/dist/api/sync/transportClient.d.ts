import type { APIMethodInfo, APIRequest, BatchRequestsResponse, SourceFileResponseMethod } from "../proto.ts";
import { TimingCollector, type TimingInfo } from "../timing.ts";
import type { SyncTransport } from "./transport.ts";
/** Protocol client shared by the process and embedded synchronous transports. */
export declare class TransportClient {
    private readonly encoder;
    private readonly timing;
    private readonly transport;
    private readonly maxResponseBytesPerPage;
    constructor(transport: SyncTransport, collectTiming: boolean, maxResponseBytesPerPage?: number);
    apiRequest<K extends keyof APIMethodInfo>(method: K, params?: APIMethodInfo[K]["params"]): APIMethodInfo[K]["result"];
    registerCallback(name: string, callback: (params: unknown) => unknown): () => void;
    batchRequests(requests: readonly APIRequest[]): BatchRequestsResponse;
    echo(payload: string): string;
    echoBinary(payload: Uint8Array): Uint8Array;
    apiRequestBinary<K extends SourceFileResponseMethod>(method: K, params?: APIMethodInfo[K]["params"]): Uint8Array | undefined;
    getTimingCollector(): TimingCollector | undefined;
    getTimingInfo(): TimingInfo;
    resetTimingInfo(): void;
    close(): void;
    private recordTiming;
}
//# sourceMappingURL=transportClient.d.ts.map