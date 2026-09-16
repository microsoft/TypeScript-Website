import type { RequestDirectoryEntries, RequestFileSystem, RequestSymlink } from "./proto.generated.ts";
import { type DocumentIdentifier } from "./proto.ts";
export interface FileSystemEntries {
    files: string[];
    directories: string[];
}
export interface FileSystem {
    directoryExists?: (directoryName: string) => boolean | undefined;
    fileExists?: (fileName: string) => boolean | undefined;
    getAccessibleEntries?: (directoryName: string) => FileSystemEntries | undefined;
    /**
     * Read a file's content.
     * - Return the file content as a `string` (including `""` for empty files).
     * - Return `null` to indicate the file does not exist (without falling back to the real FS).
     * - Return `undefined` to fall back to the real filesystem.
     */
    readFile?: (fileName: string) => string | null | undefined;
    realpath?: (path: string) => string | undefined;
    writeFile?: (path: string, content: string) => void;
    removeFile?: (path: string) => void;
}
/** The callback names supported by the Go server for virtual FS delegation. */
export declare const fsCallbackNames: readonly ["readFile", "fileExists", "directoryExists", "getAccessibleEntries", "realpath", "writeFile"];
export interface CreateFileSystemOptions {
    /** Complete directory listings. Full filesystems derive these from `files` when omitted. */
    directories?: Record<string, RequestDirectoryEntries>;
    symlinks?: Record<string, RequestSymlink>;
    /** Files or directory trees hidden from an underlying snapshot or host filesystem. */
    removedPaths?: readonly string[];
}
export interface CreateFileSystemWithLibOptions extends CreateFileSystemOptions {
    /** Default library directory used by a custom or non-embedded compiler executable. */
    defaultLibraryPath?: string;
}
/**
 * Files supplied to a request filesystem. String identifiers are file names;
 * use `{ uri }` when supplying a document URI so it can be decoded correctly.
 */
export type RequestFileEntries = readonly (readonly [id: DocumentIdentifier, content: string])[];
/** Creates a full request filesystem, deriving directory listings when omitted. */
export declare function createFileSystem(files: RequestFileEntries, options?: CreateFileSystemOptions): RequestFileSystem;
/**
 * Creates a full request filesystem with the compiler's default library
 * directory mounted read-only through the host filesystem.
 */
export declare function createFileSystemWithLib(files: RequestFileEntries, options?: CreateFileSystemWithLibOptions): RequestFileSystem;
/** Creates a request filesystem layer, merging base directory listings when omitted. */
export declare function createFileSystemLayer(files: RequestFileEntries, options?: CreateFileSystemOptions): RequestFileSystem;
export declare function createVirtualFileSystem(files: Record<string, string>): FileSystem;
//# sourceMappingURL=fs.d.ts.map