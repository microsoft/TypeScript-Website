import { combineTimingInfo, disabledTimingInfo, TimingCollector, } from "../timing.js";
/** Protocol client shared by the process and embedded synchronous transports. */
export class TransportClient {
    encoder = new TextEncoder();
    timing;
    transport;
    maxResponseBytesPerPage;
    constructor(transport, collectTiming, maxResponseBytesPerPage) {
        this.transport = transport;
        this.maxResponseBytesPerPage = maxResponseBytesPerPage;
        if (collectTiming) {
            this.timing = new TimingCollector();
        }
    }
    apiRequest(method, params) {
        const encodedPayload = JSON.stringify(params);
        const start = performance.now();
        const result = this.transport.requestSync(method, encodedPayload);
        this.recordTiming(method, start);
        if (result.length) {
            return JSON.parse(result);
        }
        return undefined;
    }
    registerCallback(name, callback) {
        const register = this.transport.registerCallback;
        const unregister = this.transport.unregisterCallback;
        if (!register || !unregister) {
            throw new Error("Callbacks are not supported by this transport");
        }
        register.call(this.transport, name, (_, payload) => JSON.stringify(callback(JSON.parse(payload))) ?? "");
        return () => unregister.call(this.transport, name);
    }
    batchRequests(requests) {
        const params = { requests };
        if (this.maxResponseBytesPerPage !== undefined) {
            params.maxResponseBytesPerPage = this.maxResponseBytesPerPage;
        }
        const response = this.apiRequest("batchRequests", params);
        let responses = response.responses;
        let continuationToken = response.continuationToken;
        while (continuationToken) {
            const pageParams = {
                requests: [],
                continuationToken,
            };
            if (this.maxResponseBytesPerPage !== undefined) {
                pageParams.maxResponseBytesPerPage = this.maxResponseBytesPerPage;
            }
            const page = this.apiRequest("batchRequests", pageParams);
            if (page.responses.length < 200) {
                responses.push(...page.responses);
            }
            else {
                responses = responses.concat(page.responses);
            }
            continuationToken = page.continuationToken;
        }
        return { responses };
    }
    echo(payload) {
        return this.transport.requestSync("echo", payload);
    }
    echoBinary(payload) {
        return this.transport.requestBinarySync("echo", payload);
    }
    apiRequestBinary(method, params) {
        const start = performance.now();
        const result = this.transport.requestBinarySync(method, this.encoder.encode(JSON.stringify(params)));
        this.recordTiming(method, start);
        return result.length === 0 ? undefined : result;
    }
    getTimingCollector() {
        return this.timing;
    }
    getTimingInfo() {
        if (!this.timing) {
            return disabledTimingInfo();
        }
        const local = this.timing.getInfo();
        const result = this.transport.requestSync("getServerTiming", "");
        return combineTimingInfo(local, JSON.parse(result));
    }
    resetTimingInfo() {
        if (!this.timing)
            return;
        this.timing.reset();
        this.transport.requestSync("resetServerTiming", "");
    }
    close() {
        this.transport.close();
    }
    recordTiming(method, start) {
        if (!this.timing)
            return;
        this.timing.record({
            method,
            roundTripMs: performance.now() - start,
            bytesSent: this.transport.lastBytesSent,
            bytesReceived: this.transport.lastBytesReceived,
        });
    }
}
//# sourceMappingURL=transportClient.js.map