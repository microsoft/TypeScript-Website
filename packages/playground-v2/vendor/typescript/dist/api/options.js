/**
 * Shared utilities for the TypeScript API client.
 */
import getExePath from "#getExePath";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
export function isSpawnOptions(options) {
    return !("pipe" in options);
}
export function isTransportOptions(options) {
    return "transport" in options;
}
export function isAsyncTransportOptions(options) {
    return "transport" in options;
}
export function resolveExePath(options) {
    return options.tsserverPath ?? getExePath();
}
export function getAPIProcessArgs(options, async) {
    const args = ["--api"];
    if (async)
        args.push("--async");
    args.push("--cwd", options.cwd ?? process.cwd());
    args.push(`--useCaseSensitiveFileNames=${options.useCaseSensitiveFileNames ?? inferUseCaseSensitiveFileNames()}`);
    if (options.runExternalCode)
        args.push("--runExternalCode");
    if (options.collectTiming)
        args.push("--timing");
    return args;
}
function inferUseCaseSensitiveFileNames() {
    if (process.platform === "win32") {
        return false;
    }
    const fileName = fileURLToPath(import.meta.url);
    return !existsSync(fileName.replace(/\w/g, char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()));
}
//# sourceMappingURL=options.js.map