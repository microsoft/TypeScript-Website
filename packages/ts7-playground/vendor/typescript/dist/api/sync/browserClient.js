import { TransportClient } from "./transportClient.js";
export class Client extends TransportClient {
    constructor(options) {
        if (!("transport" in options)) {
            throw new Error("The browser sync API requires an injected transport");
        }
        if (options.fs !== undefined) {
            options.transport.setFileSystem?.(options.fs);
        }
        super(options.transport, options.collectTiming ?? false, options.maxResponseBytesPerPage);
    }
}
//# sourceMappingURL=browserClient.js.map