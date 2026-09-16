import { documentURIToFileName, fileNameToDocumentURI, } from "./path.js";
export * from "./proto.generated.js";
/**
 * Resolves a DocumentIdentifier to a file name.
 * If the identifier contains a URI, it is converted to a file name.
 */
export function resolveFileName(identifier) {
    if (typeof identifier === "string") {
        return identifier;
    }
    if (typeof identifier !== "object" || identifier === null || typeof identifier.uri !== "string") {
        const received = typeof identifier === "object" && identifier !== null
            ? `an object with keys: ${Object.keys(identifier).join(", ")}`
            : String(identifier);
        throw new TypeError(`Expected a string or { uri } for the document, received ${received}`);
    }
    return documentURIToFileName(identifier.uri);
}
/**
 * Resolves a DocumentIdentifier to a document URI.
 * If the identifier contains a file name, it is converted to a URI.
 */
export function resolveDocumentURI(identifier) {
    if (typeof identifier === "string") {
        return fileNameToDocumentURI(identifier);
    }
    return identifier.uri;
}
/**
 * Builds the wire request for updateSnapshot, applying the deprecated `openProject`
 * compatibility shim: a single `openProject` is folded into `openProjects` and is
 * never sent on the wire.
 */
export function toUpdateSnapshotRequest(params, snapshot) {
    const { openProject, openProjects, ...rest } = params ?? {};
    const mergedOpenProjects = openProject !== undefined
        ? [resolveFileName(openProject), ...(openProjects ?? [])]
        : openProjects;
    return {
        ...rest,
        snapshot,
        openProjects: mergedOpenProjects,
    };
}
//# sourceMappingURL=proto.js.map