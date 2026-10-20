import { configureFileSystemCallbacks, encodeFileSystemCallbackResult, } from "../fsCallbacks.js";
import { getAPIProcessArgs, isSpawnOptions, isTransportOptions, resolveExePath, } from "../options.js";
import { SyncRpcChannel } from "../syncChannel.js";
import { TimingDump } from "../timingDump.js";
import { TransportClient } from "./transportClient.js";
export class Client extends TransportClient {
    channel;
    timingDump;
    closed = false;
    constructor(options) {
        if (isTransportOptions(options)) {
            if (options.fs !== undefined) {
                options.transport.setFileSystem?.(options.fs);
            }
            super(options.transport, options.collectTiming ?? false, options.maxResponseBytesPerPage);
            return;
        }
        if (!isSpawnOptions(options)) {
            throw new Error("Socket connections are not yet supported in the sync client");
        }
        const timingDump = TimingDump.fromEnvironment("sync", "spawn");
        if (timingDump) {
            options = { ...options, collectTiming: true };
        }
        const args = getAPIProcessArgs(options, false);
        const fsConfiguration = configureFileSystemCallbacks(options.fs);
        if (fsConfiguration.arguments.length > 0) {
            args.push(`--callbacks=${fsConfiguration.arguments.join(",")}`);
        }
        const collectTiming = options.collectTiming ?? false;
        const channel = new SyncRpcChannel(resolveExePath(options), args, collectTiming);
        super(channel, collectTiming, options.maxResponseBytesPerPage);
        this.channel = channel;
        this.timingDump = timingDump;
        if (options.fs) {
            for (const name of fsConfiguration.callbackNames) {
                if (name === "writeFile") {
                    const callback = options.fs.writeFile;
                    if (typeof callback !== "function")
                        throw new Error("Invalid writeFile callback configuration");
                    channel.registerCallback(name, (_, arg) => {
                        const { path, data } = JSON.parse(arg);
                        return JSON.stringify(encodeFileSystemCallbackResult(name, callback(path, data)));
                    });
                    continue;
                }
                const callback = options.fs[name];
                if (typeof callback !== "function")
                    throw new Error(`Invalid ${name} callback configuration`);
                channel.registerCallback(name, (_, arg) => {
                    return JSON.stringify(encodeFileSystemCallbackResult(name, callback(JSON.parse(arg))));
                });
            }
        }
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        try {
            const timing = this.getTimingCollector();
            if (this.timingDump && timing && this.channel) {
                const local = timing.getInfo();
                let server;
                let serverTimingError;
                try {
                    server = JSON.parse(this.channel.requestSync("getServerTiming", ""));
                }
                catch (error) {
                    serverTimingError = String(error);
                }
                this.timingDump.write(local, server, serverTimingError);
            }
        }
        finally {
            super.close();
        }
    }
}
//# sourceMappingURL=client.js.map