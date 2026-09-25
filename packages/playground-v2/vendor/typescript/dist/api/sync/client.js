import { fsCallbackNames } from "../fs.js";
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
        // Enable virtual FS callbacks for each provided FS function
        const enabledCallbacks = [];
        if (options.fs) {
            for (const name of fsCallbackNames) {
                if (options.fs[name]) {
                    enabledCallbacks.push(name);
                }
            }
        }
        if (enabledCallbacks.length > 0) {
            args.push(`--callbacks=${enabledCallbacks.join(",")}`);
        }
        const collectTiming = options.collectTiming ?? false;
        const channel = new SyncRpcChannel(resolveExePath(options), args, collectTiming);
        super(channel, collectTiming, options.maxResponseBytesPerPage);
        if (options.fs) {
            for (const name of enabledCallbacks) {
                if (name === "writeFile") {
                    if (!options.fs.writeFile)
                        continue;
                    const callback = options.fs.writeFile;
                    channel.registerCallback(name, (_, arg) => {
                        const { path, data } = JSON.parse(arg);
                        callback(path, data);
                        return "";
                    });
                    continue;
                }
                const callback = options.fs[name];
                channel.registerCallback(name, (_, arg) => {
                    const result = callback(JSON.parse(arg));
                    if (name === "readFile") {
                        // readFile has 3 returns: string (content), null (not found), undefined (fall back).
                        // Wrap in object to preserve null vs undefined distinction.
                        if (result === undefined)
                            return "";
                        return JSON.stringify({ content: result });
                    }
                    return JSON.stringify(result) ?? "";
                });
            }
        }
    }
}
//# sourceMappingURL=client.js.map