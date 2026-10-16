import { type FileSystemCallbacks, serverFS } from "./fs.ts";
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