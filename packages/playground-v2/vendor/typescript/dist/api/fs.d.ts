import type { RequestDirectoryEntries, RequestFileSystem, RequestSymlink } from "./proto.generated.ts";
import { type DocumentIdentifier } from "./proto.ts";
export interface FileSystemEntries {
    files: string[];
    directories: string[];
    /** Names from `files` or `directories` that are symbolic links. */
    symlinks: string[] | undefined;
}
export interface FileSystemStat {
    /** POSIX-style file mode, matching Node.js `fs.Stats.mode`. */
    mode: number;
    /** File size in bytes, matching Node.js `fs.Stats.size`. */
    size: number;
    /** Last modification time, matching Node.js `fs.Stats.mtime`. */
    mtime: Date;
}
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
export interface FileSystemCallbacks {
    directoryExists: ((directoryName: string) => boolean | typeof serverFS.useOS | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.error;
    fileExists: ((fileName: string) => boolean | typeof serverFS.useOS | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.error;
    getAccessibleEntries: ((directoryName: string) => FileSystemEntries | typeof serverFS.useOS | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.error;
    /**
     * Read a file's content.
     * - Return the file content as a `string` (including `""` for empty files).
     * - Return `undefined` to indicate the file does not exist.
     * - Return {@link serverFS.useOS} to fall back to the server's operating-system filesystem.
     */
    readFile: ((fileName: string) => string | undefined | typeof serverFS.useOS | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.error;
    realpath: ((path: string) => string | typeof serverFS.useOS | typeof serverFS.identity | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.identity | typeof serverFS.error;
    stat: ((path: string) => FileSystemStat | undefined | typeof serverFS.useOS | typeof serverFS.fakeStat | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.fakeStat | typeof serverFS.error;
    writeFile: ((path: string, content: string) => void | typeof serverFS.useOS | typeof serverFS.noop | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.noop | typeof serverFS.error;
    removeFile: ((path: string) => void | typeof serverFS.useOS | typeof serverFS.noop | typeof serverFS.error) | typeof serverFS.useOS | typeof serverFS.noop | typeof serverFS.error;
}
export interface CreateFileSystemOptions {
    /** Complete directory listings. Full filesystems derive these from `files` when omitted. */
    directories?: Record<string, RequestDirectoryEntries> | undefined;
    symlinks?: Record<string, RequestSymlink> | undefined;
    /** Files or directory trees hidden from an underlying snapshot or host filesystem. */
    removedPaths?: readonly string[] | undefined;
}
export interface CreateFileSystemWithLibOptions extends CreateFileSystemOptions {
    /** Default library directory used by a custom or non-embedded compiler executable. */
    defaultLibraryPath?: string | undefined;
}
/**
 * Files supplied to a request filesystem. String identifiers are file names;
 * use `{ uri }` when supplying a document URI so it can be decoded correctly.
 */
export type RequestFileEntries = readonly (readonly [id: DocumentIdentifier, content: string])[];
/** Creates a full request filesystem. The server derives directory listings when omitted. */
export declare function createFileSystem(files: RequestFileEntries, options?: CreateFileSystemOptions): RequestFileSystem;
/**
 * Creates a full request filesystem with the compiler's default library
 * directory mounted read-only through the host filesystem.
 */
export declare function createFileSystemWithLib(files: RequestFileEntries, options?: CreateFileSystemWithLibOptions): RequestFileSystem;
/** Creates a request filesystem layer, merging base directory listings when omitted. */
export declare function createFileSystemLayer(files: RequestFileEntries, options?: CreateFileSystemOptions): RequestFileSystem;
export {};
//# sourceMappingURL=fs.d.ts.map