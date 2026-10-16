import { serverFS, } from "./fs.js";
const fileSystemCallbackTable = {
    readFile: { serverFS: [serverFS.useOS, serverFS.error] },
    fileExists: { serverFS: [serverFS.useOS, serverFS.error] },
    directoryExists: { serverFS: [serverFS.useOS, serverFS.error] },
    getAccessibleEntries: { serverFS: [serverFS.useOS, serverFS.error] },
    realpath: {
        serverFS: [serverFS.useOS, serverFS.identity, serverFS.error],
    },
    stat: {
        serverFS: [serverFS.useOS, serverFS.fakeStat, serverFS.error],
    },
    writeFile: {
        serverFS: [serverFS.useOS, serverFS.noop, serverFS.error],
    },
    removeFile: {
        serverFS: [serverFS.useOS, serverFS.noop, serverFS.error],
    },
};
const fsCallbackNames = Object.keys(fileSystemCallbackTable);
const serverFSSentinelNames = Object.keys(serverFS);
export function configureFileSystemCallbacks(fs) {
    if (!fs) {
        return { callbackNames: [], arguments: [] };
    }
    const callbackNames = [];
    const args = [];
    for (const name of fsCallbackNames) {
        const value = fs[name];
        if (typeof value === "function") {
            callbackNames.push(name);
            continue;
        }
        const sentinel = fileSystemCallbackTable[name].serverFS.find(sentinel => sentinel === value);
        if (sentinel) {
            const sentinelName = getServerFSSentinelName(sentinel);
            if (sentinelName !== "useOS") {
                args.push(`${name}:${sentinelName}`);
            }
            continue;
        }
        throw new TypeError(`Invalid filesystem callback '${name}': expected a function or a supported serverFS sentinel`);
    }
    args.push(...callbackNames);
    return { callbackNames, arguments: args };
}
export function encodeFileSystemCallbackResult(name, result) {
    const sentinel = fileSystemCallbackTable[name].serverFS.find(sentinel => sentinel === result);
    if (sentinel) {
        return { kind: getServerFSSentinelName(sentinel) };
    }
    let valid;
    switch (name) {
        case "directoryExists":
        case "fileExists":
            valid = typeof result === "boolean";
            break;
        case "getAccessibleEntries": {
            const entries = result;
            valid = !!entries
                && isStringArray(entries.files)
                && isStringArray(entries.directories)
                && (entries.symlinks === undefined || isStringArray(entries.symlinks));
            break;
        }
        case "readFile":
            if (result === undefined)
                return { kind: "missing" };
            valid = typeof result === "string";
            break;
        case "realpath":
            valid = typeof result === "string";
            break;
        case "stat": {
            if (result === undefined)
                return { kind: "missing" };
            const stat = result;
            valid = !!stat
                && typeof stat.mode === "number"
                && Number.isSafeInteger(stat.mode)
                && stat.mode >= 0
                && stat.mode <= 0xffff_ffff
                && typeof stat.size === "number"
                && Number.isSafeInteger(stat.size)
                && stat.size >= 0
                && stat.mtime instanceof Date
                && !Number.isNaN(stat.mtime.getTime());
            break;
        }
        case "writeFile":
        case "removeFile":
            valid = result === undefined;
            break;
    }
    if (!valid) {
        throw new TypeError(`Invalid result from filesystem callback '${name}'`);
    }
    return name === "writeFile" || name === "removeFile" ? { kind: "value" } : { kind: "value", value: result };
}
function isStringArray(value) {
    return Array.isArray(value) && value.every(element => typeof element === "string");
}
function getServerFSSentinelName(sentinel) {
    for (const name of serverFSSentinelNames) {
        if (serverFS[name] === sentinel) {
            return name;
        }
    }
    throw new TypeError("Unknown serverFS sentinel");
}
//# sourceMappingURL=fsCallbacks.js.map