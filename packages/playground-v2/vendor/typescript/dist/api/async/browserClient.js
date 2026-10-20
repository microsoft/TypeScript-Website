import { createTransportClient, } from "./transportClient.js";
export function createClient(options) {
    if (!("transport" in options)) {
        throw new Error("The browser async API requires an injected transport");
    }
    return createTransportClient(options);
}
//# sourceMappingURL=browserClient.js.map