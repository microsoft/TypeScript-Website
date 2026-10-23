import { CaseSensitivity } from "../../enums/caseSensitivity.js";
import type { PathKey, RootedDirectoryPath, RootedFilePath, RootedPath } from "../ast/index.ts";
export { CaseSensitivity } from "../../enums/caseSensitivity.js";
export declare function getPathComponents(path: string): string[];
/**
 * Determines whether a path has a trailing separator (`/` or `\\`).
 */
export declare function hasTrailingDirectorySeparator(path: string): boolean;
/**
 * Removes a trailing directory separator from a path, if it does not already have one.
 */
export declare function removeTrailingDirectorySeparator(path: string): string;
/**
 * Adds a trailing directory separator to a path, if it does not already have one.
 */
export declare function ensureTrailingDirectorySeparator(path: string): string;
/**
 * Normalize path separators, converting `\\` into `/`.
 */
export declare function normalizeSlashes(path: string): string;
/**
 * Combines paths. If a path is absolute, it replaces any previous path. Relative paths are not simplified.
 */
export declare function combinePaths(path: string, ...paths: (string | undefined)[]): string;
/**
 * Returns the normalized absolute path, resolving `.` and `..` segments.
 */
export declare function getNormalizedAbsolutePath(path: string, currentDirectory: string | undefined): string;
/**
 * Normalizes a path, resolving `.` and `..` segments and converting backslashes to forward slashes.
 */
export declare function normalizePath(path: string): string;
/**
 * Determines whether a path is an absolute disk path (e.g. starts with `/`, or a DOS path
 * like `c:`, `c:\\` or `c:/`).
 */
export declare function isRootedDiskPath(path: string): boolean;
export declare function convertToRelativePath(absoluteOrRelativePath: string, basePath: string, getCanonicalFileName: (path: string) => string): string;
/**
 * Returns the canonical key for an already rooted, normalized path under
 * caseSensitivity.
 */
export declare function pathKey(path: RootedPath, caseSensitivity: CaseSensitivity): PathKey;
/**
 * Validates a canonical path key received from a trusted producer without
 * applying case sensitivity again.
 */
export declare function tryPathKeyFromCanonical(path: string): PathKey | undefined;
/**
 * Resolves path against currentDirectory and normalizes it.
 */
export declare function toRootedPath(path: string, currentDirectory: RootedDirectoryPath | undefined): RootedPath;
/**
 * Validates a path that is already rooted and normalized without changing it.
 */
export declare function rootedPathFromNormalized(path: string): RootedPath;
/**
 * Attempts to validate a path that is already rooted and normalized without
 * changing it.
 */
export declare function tryRootedPathFromNormalized(path: string): RootedPath | undefined;
/**
 * Resolves fileName against currentDirectory, normalizes it, and gives it file
 * intent.
 */
export declare function toRootedFilePath(fileName: string, currentDirectory: RootedDirectoryPath | undefined): RootedFilePath;
/**
 * Resolves directory against currentDirectory, normalizes it, and gives it
 * directory intent.
 */
export declare function toRootedDirectoryPath(directory: string, currentDirectory: RootedDirectoryPath | undefined): RootedDirectoryPath;
/**
 * Gives a RootedPath file intent without changing it.
 */
export declare function rootedFilePathFromPath(path: RootedPath): RootedFilePath;
/**
 * Gives a RootedPath directory intent without changing it.
 */
export declare function rootedDirectoryPathFromPath(path: RootedPath): RootedDirectoryPath;
/**
 * Applies caseSensitivity to text used for path comparison or keys.
 */
export declare function canonicalize(text: string, caseSensitivity: CaseSensitivity): string;
export declare function isCaseSensitive(caseSensitivity: CaseSensitivity): boolean;
export declare function isCaseInsensitive(caseSensitivity: CaseSensitivity): boolean;
/**
 * Returns true if the path refers to a bundled library file.
 */
export declare function isBundled(path: string): boolean;
/**
 * Returns true if the file name represents a dynamic/virtual file
 * that doesn't exist on disk (e.g., untitled files with paths like "^/untitled/...").
 */
export declare function isDynamicFileName(fileName: string): boolean;
/**
 * Splits a Windows volume (e.g., "c:") from the rest of the path.
 * Returns [volume, rest, ok] where ok is true if a volume was found.
 */
export declare function splitVolumePath(path: string): [volume: string, rest: string, ok: boolean];
/**
 * Converts a file name to a document URI.
 *
 * @example
 * fileNameToDocumentURI("/path/to/file.ts") === "file:///path/to/file.ts"
 * fileNameToDocumentURI("c:/path/to/file.ts") === "file:///c%3A/path/to/file.ts"
 * fileNameToDocumentURI("^/untitled/ts-nul-authority/Untitled-1") === "untitled:Untitled-1"
 * fileNameToDocumentURI("^/vscode-vfs/github/microsoft/TypeScript/file.ts") === "vscode-vfs://github/microsoft/TypeScript/file.ts"
 */
export declare function fileNameToDocumentURI(fileName: string): string;
/**
 * Converts a document URI to a file name.
 *
 * @example
 * documentURIToFileName("file:///path/to/file.ts") === "/path/to/file.ts"
 * documentURIToFileName("file:///c%3A/path/to/file.ts") === "c:/path/to/file.ts"
 * documentURIToFileName("untitled:Untitled-1") === "^/untitled/ts-nul-authority/Untitled-1"
 * documentURIToFileName("vscode-vfs://github/microsoft/TypeScript/file.ts") === "^/vscode-vfs/github/microsoft/TypeScript/file.ts"
 */
export declare function documentURIToFileName(uri: string): string;
//# sourceMappingURL=path.d.ts.map