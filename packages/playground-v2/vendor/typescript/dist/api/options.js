/**
 * Shared utilities for the TypeScript API client.
 */
import { getDefaultExePath, nodeProcess, } from "./nodeProcess.js";
export function isSpawnOptions(options) {
    return !("pipe" in options);
}
export function isTransportOptions(options) {
    return "transport" in options;
}
export function resolveExePath(options) {
    return options.tsserverPath ?? getDefaultExePath();
}
export function getAPIProcessArgs(options, async) {
    const args = ["--api"];
    if (async)
        args.push("--async");
    args.push("--cwd", options.cwd ?? nodeProcess().cwd());
    args.push(`--useCaseSensitiveFileNames=${options.useCaseSensitiveFileNames ?? inferUseCaseSensitiveFileNames()}`);
    if (options.runExternalCode)
        args.push("--runExternalCode");
    if (options.collectTiming)
        args.push("--timing");
    return args;
}
function inferUseCaseSensitiveFileNames() {
    const process = nodeProcess();
    if (process.platform === "win32") {
        return false;
    }
    const fileName = process.getBuiltinModule("node:url").fileURLToPath(import.meta.url);
    return !process.getBuiltinModule("node:fs").existsSync(fileName.replace(/\w/g, char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()));
}
//# sourceMappingURL=options.js.map