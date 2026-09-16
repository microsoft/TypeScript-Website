import getExePath from "#getExePath";
import { dirname } from "node:path";
import { getPathComponents, normalizePath, } from "./path.js";
import { resolveFileName, } from "./proto.js";
/** The callback names supported by the Go server for virtual FS delegation. */
export const fsCallbackNames = ["readFile", "fileExists", "directoryExists", "getAccessibleEntries", "realpath", "writeFile"];
/** Creates a full request filesystem, deriving directory listings when omitted. */
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
            defaultLibraryPaths.push(normalizePath(dirname(getExePath())));
        }
        catch {
            // A socket-connected embedded server can provide bundled libs without
            // a locally installed compiler executable.
        }
    }
    const symlinks = { ...options.symlinks };
    for (const defaultLibraryPath of defaultLibraryPaths) {
        symlinks[defaultLibraryPath] ??= { target: defaultLibraryPath, host: true };
    }
    return createRequestFileSystem("full", files, {
        symlinks,
        ...(options.directories ? { directories: options.directories } : {}),
        ...(options.removedPaths?.length ? { removedPaths: options.removedPaths } : {}),
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
    const directories = options.directories ?? (kind === "full" ? deriveDirectoryListings(fileRecord) : undefined);
    return {
        kind,
        files: fileRecord,
        ...(directories ? { directories } : {}),
        ...(options.symlinks ? { symlinks: options.symlinks } : {}),
        ...(options.removedPaths?.length ? { removedPaths: [...options.removedPaths] } : {}),
    };
}
function deriveDirectoryListings(files) {
    const listings = new Map();
    const getListing = (directory) => {
        let listing = listings.get(directory);
        if (!listing) {
            listing = { files: new Set(), directories: new Set() };
            listings.set(directory, listing);
        }
        return listing;
    };
    for (const inputPath of Object.keys(files)) {
        const filePath = normalizePath(inputPath);
        const fileName = getBaseName(filePath);
        let directory = getDirectory(filePath);
        getListing(directory).files.add(fileName);
        let parent = getDirectory(directory);
        while (parent !== directory) {
            getListing(parent).directories.add(getBaseName(directory));
            directory = parent;
            parent = getDirectory(directory);
        }
    }
    return Object.fromEntries([...listings].map(([directory, listing]) => [directory, {
            files: [...listing.files],
            directories: [...listing.directories],
        }]));
}
function getDirectory(path) {
    const components = getPathComponents(path);
    if (components.length <= 1)
        return components[0] ?? "";
    components.pop();
    const root = components.shift();
    return root + components.join("/");
}
function getBaseName(path) {
    const components = getPathComponents(path);
    return components.at(-1) ?? "";
}
export function createVirtualFileSystem(files) {
    const root = {
        type: "directory",
        children: {},
    };
    const content = {};
    for (const filePath of Object.keys(files)) {
        content[filePath] = files[filePath];
        addToTree(filePath);
    }
    return {
        directoryExists,
        fileExists,
        getAccessibleEntries,
        readFile,
        realpath: path => path,
        writeFile,
        removeFile,
    };
    function getNodeFromPath(path) {
        if (!path || path === "/") {
            return root;
        }
        const segments = getPathComponents(path).slice(1);
        let current = root;
        for (const segment of segments) {
            if (current.type !== "directory") {
                return undefined;
            }
            const child = current.children[segment];
            if (!child) {
                return undefined;
            }
            current = child;
        }
        return current;
    }
    function ensureDirectory(segments) {
        let current = root;
        for (const segment of segments) {
            if (!current.children[segment]) {
                current.children[segment] = { type: "directory", children: {} };
            }
            else if (current.children[segment].type !== "directory") {
                throw new Error(`Cannot create directory: a file already exists at "/${segments.join("/")}"`);
            }
            current = current.children[segment];
        }
        return current;
    }
    function addToTree(path) {
        const segments = getPathComponents(path).slice(1);
        if (segments.length === 0) {
            throw new Error(`Invalid file path: "${path}"`);
        }
        const filename = segments.pop();
        const dirNode = ensureDirectory(segments);
        dirNode.children[filename] = { type: "file" };
    }
    function writeFile(path, data) {
        content[path] = data;
        addToTree(path);
    }
    function removeFile(path) {
        delete content[path];
        const segments = getPathComponents(path).slice(1);
        if (segments.length === 0)
            return;
        const filename = segments.pop();
        const dirNode = getNodeFromPath("/" + segments.join("/"));
        if (dirNode && dirNode.type === "directory") {
            delete dirNode.children[filename];
        }
    }
    function directoryExists(directoryName) {
        const node = getNodeFromPath(directoryName);
        return !!node && node.type === "directory";
    }
    function fileExists(fileName) {
        return fileName in content;
    }
    function getAccessibleEntries(directoryName) {
        const node = getNodeFromPath(directoryName);
        if (!node || node.type !== "directory") {
            return undefined;
        }
        const fileEntries = [];
        const directories = [];
        for (const [name, child] of Object.entries(node.children)) {
            if (child.type === "file") {
                fileEntries.push(name);
            }
            else {
                directories.push(name);
            }
        }
        return { files: fileEntries, directories };
    }
    function readFile(fileName) {
        if (fileName in content) {
            return content[fileName];
        }
        return undefined;
    }
}
//# sourceMappingURL=fs.js.map