import { type ClientSocketOptions, type ClientSpawnOptions, type SyncClientOptions } from "../options.ts";
import { TransportClient } from "./transportClient.ts";
export type { ClientSocketOptions, ClientSpawnOptions };
export type { ClientTransportOptions, SyncClientOptions as ClientOptions } from "../options.ts";
export type { SyncTransport } from "./transport.ts";
export declare class Client extends TransportClient {
    constructor(options: SyncClientOptions);
}
//# sourceMappingURL=client.d.ts.map