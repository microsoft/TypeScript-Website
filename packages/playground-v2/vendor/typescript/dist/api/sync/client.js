import { configureFileSystemCallbacks, encodeFileSystemCallbackResult, } from "../fsCallbacks.js";
import { getAPIProcessArgs, isSpawnOptions, isTransportOptions, resolveExePath, } from "../options.js";
import { SyncRpcChannel } from "../syncChannel.js";
import { TransportClient } from "./transportClient.js";
export class Client extends TransportClient {
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
        const args = getAPIProcessArgs(options, false);
        const fsConfiguration = configureFileSystemCallbacks(options.fs);
        if (fsConfiguration.arguments.length > 0) {
            args.push(`--callbacks=${fsConfiguration.arguments.join(",")}`);
        }
        const collectTiming = options.collectTiming ?? false;
        const channel = new SyncRpcChannel(resolveExePath(options), args, collectTiming);
        super(channel, collectTiming, options.maxResponseBytesPerPage);
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
}
//# sourceMappingURL=client.js.map