import { SymbolOwnerKind } from "#enums/symbolOwnerKind";
import { documentURIToFileName, fileNameToDocumentURI, } from "./path.js";
export * from "./proto.generated.js";
export * from "./userPreferences.generated.js";
export function validateSymbolOwner(owner) {
    switch (owner.kind) {
        case SymbolOwnerKind.File:
            if (!owner.file || owner.snapshot !== undefined || owner.project !== undefined) {
                throw new Error("Invalid file symbol owner");
            }
            return;
        case SymbolOwnerKind.Snapshot:
            if (owner.file !== undefined || owner.snapshot === undefined || owner.project === undefined) {
                throw new Error("Invalid snapshot symbol owner");
            }
            return;
        default:
            throw new Error(`Invalid symbol owner kind '${owner.kind}'`);
    }
}
export function validateSymbolResponse(response) {
    validateSymbolOwner(response.reference);
}
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
 * Builds the wire request for createSnapshot, applying the deprecated `openProject`
 * compatibility shim: a single `openProject` is folded into `openProjects` and is
 * never sent on the wire.
 */
export function toCreateSnapshotRequest(params) {
    const { openProject, openProjects, ...rest } = params ?? {};
    const mergedOpenProjects = openProject !== undefined
        ? [resolveFileName(openProject), ...(openProjects ?? [])]
        : openProjects;
    return {
        ...rest,
        openProjects: mergedOpenProjects,
    };
}
//# sourceMappingURL=proto.js.map