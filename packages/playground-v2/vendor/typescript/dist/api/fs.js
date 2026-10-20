import { serverFS } from "./fsCallbacks.js";
import { getDefaultExePath, nodeProcess, } from "./nodeProcess.js";
import { normalizePath } from "./path.js";
import { resolveFileName, } from "./proto.js";
export { serverFS };
/** Creates a full request filesystem. The server derives directory listings when omitted. */
export function createFileSystem(files, options = {}) {
    return createRequestFileSystem("full", files, options);
}
/**
 * Creates a full request filesystem with the compiler's default library
 * directory mounted read-only through the host filesystem.
 */
export function createFileSystemWithLib(files, options = {}) {
    const defaultLibraryPaths = options.defaultLibraryPath
        ? [normalizePath(options.defaultLibraryPath)]
        : [normalizePath("bundled:///libs")];
    if (!options.defaultLibraryPath) {
        try {
            defaultLibraryPaths.push(normalizePath(nodeProcess().getBuiltinModule("node:path").dirname(getDefaultExePath())));
        }
        catch {
            // A socket-connected embedded server or a WebAssembly transport can
            // provide bundled libs without a locally installed compiler executable.
        }
    }
    const symlinks = { ...options.symlinks };
    for (const defaultLibraryPath of defaultLibraryPaths) {
        symlinks[defaultLibraryPath] ??= { target: defaultLibraryPath, host: true };
    }
    return createRequestFileSystem("full", files, {
        symlinks,
        directories: options.directories,
        removedPaths: options.removedPaths?.length ? options.removedPaths : undefined,
    });
}
/** Creates a request filesystem layer, merging base directory listings when omitted. */
export function createFileSystemLayer(files, options = {}) {
    return createRequestFileSystem("layer", files, options);
}
function createRequestFileSystem(kind, files, options) {
    const normalizedFiles = new Map();
    for (const [id, content] of files) {
        const fileName = normalizePath(resolveFileName(id));
        if (normalizedFiles.has(fileName)) {
            throw new Error(`Duplicate request filesystem path: ${fileName}`);
        }
        normalizedFiles.set(fileName, content);
    }
    const fileRecord = Object.fromEntries(normalizedFiles);
    return {
        kind,
        files: fileRecord,
        directories: options.directories,
        symlinks: options.symlinks,
        removedPaths: options.removedPaths?.length ? [...options.removedPaths] : undefined,
    };
}
//# sourceMappingURL=fs.js.map