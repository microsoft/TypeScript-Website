import { combineTimingInfo, disabledTimingInfo, TimingCollector, } from "../timing.js";
export function createTransportClient(options) {
    if (options.fs !== undefined) {
        options.transport.setFileSystem?.(options.fs);
    }
    return new TransportClient(options.transport, options.collectTiming ?? false, options.maxResponseBytesPerPage);
}
/** Protocol client for an injected asynchronous transport. */
export class TransportClient {
    encoder = new TextEncoder();
    timing;
    transport;
    maxResponseBytesPerPage;
    closed = false;
    closing;
    nextBatch = false;
    batchGeneration = 0;
    batchedRequests = [];
    pendingOperations = new Set();
    constructor(transport, collectTiming, maxResponseBytesPerPage) {
        this.transport = transport;
        this.maxResponseBytesPerPage = maxResponseBytesPerPage;
        if (collectTiming) {
            this.timing = new TimingCollector();
        }
    }
    batchContext() {
        if (this.nextBatch === "manual") {
            throw new Error("Already in a manual batch context");
        }
        if (this.nextBatch) {
            this.batchGeneration++;
            this.nextBatch = false;
            void this.doBatch();
        }
        this.nextBatch = "manual";
        return {
            [Symbol.dispose]: () => {
                this.nextBatch = false;
                this.scheduleBatch();
            },
        };
    }
    async apiRequest(method, params) {
        if (this.closed)
            throw new Error("Client is closed");
        if (method === "initialize") {
            return this.sendRequest(method, params);
        }
        const result = new Promise((resolve, reject) => {
            this.batchedRequests.push({ kind: "text", method, params, resolve, reject });
            this.scheduleBatch();
        });
        return result;
    }
    async apiRequestBinary(method, params) {
        if (this.closed)
            throw new Error("Client is closed");
        return new Promise((resolve, reject) => {
            this.batchedRequests.push({
                kind: "binary",
                method,
                payload: this.encoder.encode(JSON.stringify(params)),
                resolve,
                reject,
            });
            this.scheduleBatch();
        });
    }
    registerCallback(name, callback) {
        const register = this.transport.registerCallback;
        const unregister = this.transport.unregisterCallback;
        if (!register || !unregister) {
            throw new Error("Callbacks are not supported by this transport");
        }
        register.call(this.transport, name, (_, payload) => {
            const result = callback(JSON.parse(payload));
            if (isPromiseLike(result)) {
                return result.then(value => JSON.stringify(value) ?? "");
            }
            return JSON.stringify(result) ?? "";
        });
        return () => unregister.call(this.transport, name);
    }
    getTimingCollector() {
        return this.timing;
    }
    async getTimingInfo() {
        if (!this.timing) {
            return disabledTimingInfo();
        }
        const local = this.timing.getInfo();
        if (this.closed) {
            return local;
        }
        const response = await this.invokeTransport(() => this.transport.request("getServerTiming", ""));
        return combineTimingInfo(local, JSON.parse(response.value));
    }
    async resetTimingInfo() {
        if (!this.timing)
            return;
        this.timing.reset();
        if (!this.closed) {
            await this.invokeTransport(() => this.transport.request("resetServerTiming", ""));
        }
    }
    close() {
        return this.closing ??= this.closeWorker();
    }
    async closeWorker() {
        this.closed = true;
        for (const reject of this.pendingOperations) {
            reject(new Error("Client is closed"));
        }
        this.pendingOperations.clear();
        this.batchGeneration++;
        this.nextBatch = false;
        const requests = this.batchedRequests;
        this.batchedRequests = [];
        for (const { reject } of requests) {
            reject(new Error("Client is closed"));
        }
        await this.transport.close();
    }
    scheduleBatch() {
        if (this.closed || this.nextBatch)
            return;
        this.nextBatch = true;
        const generation = ++this.batchGeneration;
        queueMicrotask(() => {
            if (this.batchGeneration !== generation || this.nextBatch !== true)
                return;
            this.nextBatch = false;
            void this.doBatch();
        });
    }
    async doBatch() {
        if (!this.batchedRequests.length)
            return;
        const requests = this.batchedRequests;
        this.batchedRequests = [];
        if (this.closed) {
            for (const { reject } of requests) {
                reject(new Error("Client is closed"));
            }
            return;
        }
        try {
            if (requests.length === 1 && requests[0].kind === "text") {
                const request = requests[0];
                request.resolve(await this.sendRequest(request.method, request.params));
                return;
            }
            if (requests.every((request) => request.kind === "text")) {
                const params = {
                    requests: requests.map(request => ({ method: request.method, params: request.params })),
                };
                if (this.maxResponseBytesPerPage !== undefined) {
                    params.maxResponseBytesPerPage = this.maxResponseBytesPerPage;
                }
                const response = await this.sendRequest("batchRequests", params);
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
                    const page = await this.sendRequest("batchRequests", pageParams);
                    responses = responses.concat(page.responses);
                    continuationToken = page.continuationToken;
                }
                for (let i = 0; i < requests.length; i++) {
                    const { resolve, reject } = requests[i];
                    const item = responses[i];
                    if (item.error !== undefined) {
                        reject(new Error(item.error));
                    }
                    else {
                        resolve(item.result);
                    }
                }
                return;
            }
            for (const request of requests) {
                try {
                    if (request.kind === "text") {
                        request.resolve(await this.sendRequest(request.method, request.params));
                    }
                    else {
                        request.resolve(await this.sendBinaryRequest(request.method, request.payload));
                    }
                }
                catch (error) {
                    request.reject(error);
                }
            }
        }
        catch (error) {
            for (const { reject } of requests)
                reject(error);
        }
    }
    async sendRequest(method, params) {
        const payload = JSON.stringify(params) ?? "";
        const start = performance.now();
        const response = await this.invokeTransport(() => this.transport.request(method, payload));
        this.recordTiming(method, start, response.bytesSent, response.bytesReceived);
        return response.value.length
            ? JSON.parse(response.value)
            : undefined;
    }
    async sendBinaryRequest(method, payload) {
        const start = performance.now();
        const response = await this.invokeTransport(() => this.transport.requestBinary(method, payload));
        this.recordTiming(method, start, response.bytesSent, response.bytesReceived);
        return response.value.length === 0 ? undefined : response.value;
    }
    invokeTransport(operation) {
        if (this.closed)
            return Promise.reject(new Error("Client is closed"));
        return new Promise((resolve, reject) => {
            this.pendingOperations.add(reject);
            Promise.resolve().then(() => {
                if (this.closed)
                    throw new Error("Client is closed");
                return operation();
            }).then(value => {
                this.pendingOperations.delete(reject);
                resolve(value);
            }, error => {
                this.pendingOperations.delete(reject);
                reject(error);
            });
        });
    }
    recordTiming(method, start, bytesSent, bytesReceived) {
        if (!this.timing)
            return;
        this.timing.record({
            method,
            roundTripMs: performance.now() - start,
            bytesSent,
            bytesReceived,
        });
    }
}
function isPromiseLike(value) {
    return ((typeof value === "object" && value !== null || typeof value === "function")
        && "then" in value
        && typeof value.then === "function");
}
//# sourceMappingURL=transportClient.js.map