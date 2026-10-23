import type { FileSystemCallbacks } from "./fs.ts";
declare const useOS: unique symbol;
declare const identity: unique symbol;
declare const fakeStat: unique symbol;
declare const noop: unique symbol;
declare const error: unique symbol;
export declare const serverFS: {
    /** Delegate the configured operation, or the current callback invocation, to the server's operating-system filesystem. */
    readonly useOS: typeof useOS;
    /** Use the input path as its own real path without consulting a filesystem. Valid only for `realpath`. */
    readonly identity: typeof identity;
    /** Synthesize stat information from `directoryExists` and `fileExists`. Valid only for `stat`. */
    readonly fakeStat: typeof fakeStat;
    /** Ignore writes without invoking a callback or writing to the server's operating-system filesystem. Valid only for `writeFile`. */
    readonly noop: typeof noop;
    /** Panic if the configured operation, or current callback invocation, reaches the server filesystem. */
    readonly error: typeof error;
};
type ServerFSSentinelName = keyof typeof serverFS;
type ServerFSSentinel = typeof serverFS[ServerFSSentinelName];
type ServerFSSentinelResponse = {
    [K in ServerFSSentinelName]: {
        kind: K;
    };
}[ServerFSSentinelName];
export type FileSystemCallbackResponse = {
    kind: "value";
    value?: unknown;
} | {
    kind: "missing";
} | ServerFSSentinelResponse;
interface FileSystemCallbackDefinition {
    serverFS: readonly ServerFSSentinel[];
}
declare const fileSystemCallbackTable: Record<keyof FileSystemCallbacks, FileSystemCallbackDefinition>;
type FileSystemCallbackName = keyof typeof fileSystemCallbackTable;
export interface FileSystemCallbackConfiguration {
    callbackNames: FileSystemCallbackName[];
    arguments: string[];
}
export declare function configureFileSystemCallbacks(fs: FileSystemCallbacks | undefined): FileSystemCallbackConfiguration;
export declare function encodeFileSystemCallbackResult(name: FileSystemCallbackName, result: unknown): FileSystemCallbackResponse;
export {};
//# sourceMappingURL=fsCallbacks.d.ts.map