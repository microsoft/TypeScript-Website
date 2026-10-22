import { configureFileSystemCallbacks, encodeFileSystemCallbackResult, } from "../fsCallbacks.js";
import { nodeProcess } from "../nodeProcess.js";
import { getAPIProcessArgs, isSpawnOptions, isTransportOptions, resolveExePath, } from "../options.js";
import { combineTimingInfo, disabledServerTimingInfo, disabledTimingInfo, TimingCollector, } from "../timing.js";
import { TimingDump } from "../timingDump.js";
import { createTransportClient, } from "./transportClient.js";
export function createClient(options) {
    return isTransportOptions(options) ? createTransportClient(options) : new RpcClient(options);
}
/**
 * Client handles communication with the TypeScript API server
 * over STDIO (spawned process) or a Unix domain socket using JSON-RPC.
 */
class RpcClient {
    socket;
    process;
    connection;
    // Loaded on connection so that injected-transport clients never load it.
    jsonrpc;
    options;
    connected = false;
    closed = false;
    connecting;
    timing;
    timingDump;
    closing;
    batchedRequests = [];
    nextBatch;
    constructor(options) {
        this.timingDump = TimingDump.fromEnvironment("async", isSpawnOptions(options) ? "spawn" : "socket");
        if (this.timingDump || isSpawnOptions(options) && options.collectTiming) {
            this.timing = new TimingCollector();
        }
        if (this.timingDump && isSpawnOptions(options)) {
            options = { ...options, collectTiming: true };
        }
        this.options = options;
        if (isSpawnOptions(options)) {
            configureFileSystemCallbacks(options.fs);
        }
    }
    connect() {
        if (this.closed)
            return Promise.reject(new Error("Client is closed"));
        if (this.connected)
            return Promise.resolve();
        return this.connecting ??= this.connectWorker().finally(() => {
            this.connecting = undefined;
        });
    }
    async connectWorker() {
        this.jsonrpc ??= await import("./jsonrpc.js");
        if (isSpawnOptions(this.options)) {
            await this.connectViaSpawn(this.options);
        }
        else {
            await this.connectViaSocket(this.options);
        }
    }
    async connectViaSpawn(options) {
        const { spawn } = nodeProcess().getBuiltinModule("node:child_process");
        return new Promise((resolve, reject) => {
            const args = getAPIProcessArgs(options, true);
            const fsConfiguration = configureFileSystemCallbacks(options.fs);
            if (fsConfiguration.arguments.length > 0) {
                args.push(`--callbacks=${fsConfiguration.arguments.join(",")}`);
            }
            this.process = spawn(resolveExePath(options), args, {
                stdio: ["pipe", "pipe", "inherit"],
            });
            this.process.once("error", error => {
                reject(new Error(`Failed to start tsgo process: ${error.message}`));
            });
            this.process.once("spawn", () => {
                this.connected = true;
                resolve();
            });
            this.connection = this.jsonrpc.createStreamConnection(this.process.stdout, this.process.stdin);
            this.registerFSCallbacks(this.connection, options.fs, fsConfiguration);
            this.connection.listen();
        });
    }
    async connectViaSocket(options) {
        const { createConnection } = nodeProcess().getBuiltinModule("node:net");
        return new Promise((resolve, reject) => {
            this.socket = createConnection(options.pipe, () => {
                this.connection = this.jsonrpc.createStreamConnection(this.socket, this.socket);
                this.connection.listen();
                this.connected = true;
                resolve();
            });
            this.socket.once("error", error => {
                reject(new Error(`Socket error: ${error.message}`));
            });
        });
    }
    registerFSCallbacks(connection, fs, configuration) {
        if (!fs)
            return;
        for (const name of configuration.callbackNames) {
            switch (name) {
                case "readFile": {
                    const callback = fs.readFile;
                    if (typeof callback !== "function")
                        throw new Error("Invalid readFile callback configuration");
                    connection.onRequest(this.requestType(name), fileName => {
                        return encodeFileSystemCallbackResult(name, callback(fileName));
                    });
                    break;
                }
                case "fileExists": {
                    const callback = fs.fileExists;
                    if (typeof callback !== "function")
                        throw new Error("Invalid fileExists callback configuration");
                    connection.onRequest(this.requestType(name), fileName => {
                        return encodeFileSystemCallbackResult(name, callback(fileName));
                    });
                    break;
                }
                case "directoryExists": {
                    const callback = fs.directoryExists;
                    if (typeof callback !== "function")
                        throw new Error("Invalid directoryExists callback configuration");
                    connection.onRequest(this.requestType(name), directoryName => {
                        return encodeFileSystemCallbackResult(name, callback(directoryName));
                    });
                    break;
                }
                case "getAccessibleEntries": {
                    const callback = fs.getAccessibleEntries;
                    if (typeof callback !== "function")
                        throw new Error("Invalid getAccessibleEntries callback configuration");
                    connection.onRequest(this.requestType(name), directoryName => {
                        return encodeFileSystemCallbackResult(name, callback(directoryName));
                    });
                    break;
                }
                case "realpath": {
                    const callback = fs.realpath;
                    if (typeof callback !== "function")
                        throw new Error("Invalid realpath callback configuration");
                    connection.onRequest(this.requestType(name), path => {
                        return encodeFileSystemCallbackResult(name, callback(path));
                    });
                    break;
                }
                case "stat": {
                    const callback = fs.stat;
                    if (typeof callback !== "function")
                        throw new Error("Invalid stat callback configuration");
                    connection.onRequest(this.requestType(name), path => {
                        return encodeFileSystemCallbackResult(name, callback(path));
                    });
                    break;
                }
                case "writeFile": {
                    const callback = fs.writeFile;
                    if (typeof callback !== "function")
                        throw new Error("Invalid writeFile callback configuration");
                    connection.onRequest(this.requestType(name), arg => {
                        return encodeFileSystemCallbackResult(name, callback(arg.path, arg.data));
                    });
                    break;
                }
                case "removeFile": {
                    const callback = fs.removeFile;
                    if (typeof callback !== "function")
                        throw new Error("Invalid removeFile callback configuration");
                    connection.onRequest(this.requestType(name), path => {
                        return encodeFileSystemCallbackResult(name, callback(path));
                    });
                    break;
                }
            }
        }
    }
    requestType(method) {
        if (!this.jsonrpc)
            throw new Error("Connection not established");
        return new this.jsonrpc.RequestType(method);
    }
    async sendRequestWithTiming(requestType, params) {
        if (!this.connection) {
            throw new Error("Connection not established");
        }
        if (!this.timing) {
            return this.connection.sendRequest(requestType, params);
        }
        // Round-trip latency is measured here; byte counts approximate the wire
        // payload via the serialized JSON. Server-side processing time is not
        // carried on the response; it is retrieved separately (via a
        // getServerTiming request) and folded in by getTimingInfo().
        const bytesSent = params === undefined ? 0 : Buffer.byteLength(JSON.stringify(params), "utf-8");
        const start = performance.now();
        const result = await this.connection.sendRequest(requestType, params);
        const roundTripMs = performance.now() - start;
        this.timing.record({
            method: requestType.method,
            roundTripMs,
            bytesSent,
            bytesReceived: result === undefined || result === null
                ? 0
                : Buffer.byteLength(JSON.stringify(result), "utf-8"),
        });
        return result;
    }
    registerCallback(name, callback) {
        if (!this.connection) {
            throw new Error("Connection not established");
        }
        const disposable = this.connection.onRequest(this.requestType(name), callback);
        return () => disposable.dispose();
    }
    async doBatch() {
        this.nextBatch = undefined;
        if (!this.batchedRequests.length)
            return;
        const requests = this.batchedRequests;
        this.batchedRequests = [];
        try {
            if (!this.connected) {
                await this.connect();
            }
            if (!this.connection) {
                throw new Error("Connection not established");
            }
            if (requests.length === 1) {
                // send single queued requests directly instead of as a batched request
                const requestType = this.requestType(requests[0].method);
                const response = await this.sendRequestWithTiming(requestType, requests[0].params);
                requests[0].resolve(response);
                return;
            }
            const requestType = this.requestType("batchRequests");
            const params = { requests: requests.map(request => ({ method: request.method, params: request.params })) };
            if (this.options.maxResponseBytesPerPage !== undefined) {
                params.maxResponseBytesPerPage = this.options.maxResponseBytesPerPage;
            }
            const response = await this.sendRequestWithTiming(requestType, params);
            let responses = response.responses;
            let continuationToken = response.continuationToken;
            while (continuationToken) {
                const pageParams = {
                    requests: [],
                    continuationToken,
                };
                if (this.options.maxResponseBytesPerPage !== undefined) {
                    pageParams.maxResponseBytesPerPage = this.options.maxResponseBytesPerPage;
                }
                const page = await this.sendRequestWithTiming(requestType, pageParams);
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
        }
        catch (error) {
            for (const { reject } of requests)
                reject(error);
        }
    }
    scheduleImmediateBatch() {
        if (this.closed || this.nextBatch)
            return;
        this.nextBatch = setImmediate(this.doBatch.bind(this));
    }
    batchContext() {
        if (this.nextBatch === "manual") {
            throw new Error("Already in a manual batch context");
        }
        if (this.nextBatch) {
            clearImmediate(this.nextBatch);
            this.doBatch(); // empty the queue before entering a manual batch context
        }
        this.nextBatch = "manual";
        return {
            [Symbol.dispose]: () => {
                this.nextBatch = undefined;
                this.scheduleImmediateBatch();
            },
        };
    }
    async apiRequest(method, params) {
        if (this.closed)
            throw new Error("Client is closed");
        if (!this.connected) {
            await this.connect();
        }
        if (this.closed)
            throw new Error("Client is closed");
        if (!this.connection) {
            throw new Error("Connection not established");
        }
        const resultPromise = new Promise((resolve, reject) => {
            this.batchedRequests.push({ method, params, resolve, reject });
            this.scheduleImmediateBatch();
        });
        return resultPromise;
    }
    async apiRequestBinary(method, params) {
        const response = await this.apiRequest(method, params);
        if (!response)
            return undefined;
        const buffer = Buffer.from(response.data, "base64");
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    /**
     * Returns the timing collector that per-node materialization is reported
     * into, or undefined when timing collection is disabled. The returned
     * collector is the same one folded into {@link getTimingInfo}, so
     * materialization totals surface alongside request timings.
     */
    getTimingCollector() {
        return this.timing;
    }
    /**
     * Returns a combined timing snapshot: client-measured round-trip and byte
     * counts folded together with the server's own per-request processing time
     * (fetched via a getServerTiming request) and estimated transport overhead.
     */
    async getTimingInfo() {
        if (!this.timing) {
            return disabledTimingInfo();
        }
        const local = this.timing.getInfo();
        // No requests have been sent yet: nothing to fetch from the server.
        if (!this.connected || !this.connection) {
            return local;
        }
        return combineTimingInfo(local, await this.fetchServerTiming());
    }
    async resetTimingInfo() {
        if (!this.timing)
            return;
        this.timing.reset();
        if (this.connected && this.connection) {
            // Keep the server's collection in sync so combined totals stay meaningful.
            const requestType = this.requestType("resetServerTiming");
            await this.connection.sendRequest(requestType, undefined);
        }
    }
    async fetchServerTiming() {
        if (!this.connection) {
            return disabledServerTimingInfo();
        }
        // Fetch the server's own timing collection via a dedicated request. This
        // bypasses the client-side collector so the query does not pollute it.
        const requestType = this.requestType("getServerTiming");
        return this.connection.sendRequest(requestType, undefined);
    }
    close() {
        return this.closing ??= this.closeWorker();
    }
    async closeWorker() {
        this.closed = true;
        if (this.nextBatch && this.nextBatch !== "manual") {
            clearImmediate(this.nextBatch);
        }
        this.nextBatch = undefined;
        const requests = this.batchedRequests;
        this.batchedRequests = [];
        for (const { reject } of requests) {
            reject(new Error("Client is closed"));
        }
        await this.connecting?.catch(() => { }); // if connection is still in-progress, wait for it to finish before closing the connection
        try {
            if (this.timingDump && this.timing) {
                const local = this.timing.getInfo();
                let server;
                let serverTimingError;
                const connection = this.connection;
                // Closing alone does not reject pending JSON-RPC requests.
                const onClose = connection?.onClose(() => connection.dispose());
                try {
                    if (this.connected)
                        server = await this.fetchServerTiming();
                }
                catch (error) {
                    serverTimingError = String(error);
                }
                finally {
                    onClose?.dispose();
                }
                this.timingDump.write(local, server, serverTimingError);
            }
        }
        finally {
            if (this.connection) {
                this.connection.dispose();
                this.connection = undefined;
            }
            if (this.socket) {
                this.socket.destroy();
                this.socket = undefined;
            }
            if (this.process) {
                // Close stdin to unblock the server's read loop, allowing it to exit cleanly.
                // The server is blocked on stdin.Read(), so just sending SIGTERM would deadlock:
                // - Node won't exit while child is alive
                // - Child can't process SIGTERM while blocked on read
                // - Read won't error until stdin is closed
                this.process.stdin?.end();
                this.process = undefined;
            }
            this.connected = false;
        }
    }
}
//# sourceMappingURL=client.js.map