import type { AsyncClientOptions, ClientSocketOptions, ClientSpawnOptions } from "../options.ts";
import { TransportClient } from "./transportClient.ts";
export type { ClientSocketOptions, ClientSpawnOptions };
export type { AsyncClientOptions as ClientOptions, AsyncClientTransportOptions } from "../options.ts";
export type { AsyncTransport } from "./transport.ts";
export declare class Client extends TransportClient {
    constructor(options: AsyncClientOptions);
}
//# sourceMappingURL=browserClient.d.ts.map