/**
 * Shared utilities for the TypeScript API client.
 */
import getExePath from "#getExePath";
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
    if (options.runExternalCode)
        args.push("--runExternalCode");
    if (options.collectTiming)
        args.push("--timing");
    return args;
}
//# sourceMappingURL=options.js.map