import type { AsyncClientOptions, ClientSocketOptions, ClientSpawnOptions } from "../options.ts";
import { type TransportClient } from "./transportClient.ts";
export type { ClientSocketOptions, ClientSpawnOptions };
export type { AsyncClientOptions as ClientOptions, AsyncClientTransportOptions } from "../options.ts";
export type { AsyncTransport } from "./transport.ts";
export type Client = TransportClient;
export declare function createClient(options: AsyncClientOptions): Client;
//# sourceMappingURL=browserClient.d.ts.map