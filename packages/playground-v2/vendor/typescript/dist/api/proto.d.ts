import { SymbolOwnerKind } from "#enums/symbolOwnerKind";
import type { APIMethodInfo, CreateSnapshotParams as CoreCreateSnapshotParams, DocumentIdentifier, ProjectId, SignatureResponse, SourceFileDescriptor, SourceFileResponse, SymbolOwner as ProtocolSymbolOwner, SymbolResponse as ProtocolSymbolResponse, TypeResponse } from "./proto.generated.ts";
export type { ConfigFileResponse as ParsedCommandLine, DiagnosticResponse as Diagnostic } from "./proto.generated.ts";
export type { ProtocolSymbolResponse };
export * from "./proto.generated.ts";
export * from "./userPreferences.generated.ts";
export interface FileSymbolOwner {
    readonly kind: typeof SymbolOwnerKind.File;
    readonly file: SourceFileDescriptor;
    readonly snapshot?: never;
    readonly project?: never;
}
export interface SnapshotSymbolOwner {
    readonly kind: typeof SymbolOwnerKind.Snapshot;
    readonly file?: never;
    readonly snapshot: number;
    readonly project: ProjectId;
}
export type SymbolOwner = FileSymbolOwner | SnapshotSymbolOwner;
export type SymbolReference = SymbolOwner & {
    readonly id: number;
};
export type SymbolResponse = Omit<ProtocolSymbolResponse, "reference"> & {
    readonly reference: SymbolReference;
};
export declare function validateSymbolOwner(owner: ProtocolSymbolOwner): asserts owner is SymbolOwner;
export declare function validateSymbolResponse(response: ProtocolSymbolResponse): asserts response is SymbolResponse;
export type APIMethodsReturning<T> = {
    [K in keyof APIMethodInfo]: [T] extends [NonNullable<APIMethodInfo[K]["result"]>] ? [NonNullable<APIMethodInfo[K]["result"]>] extends [T] ? K : never : never;
}[keyof APIMethodInfo];
export type SourceFileResponseMethod = APIMethodsReturning<SourceFileResponse>;
export type SymbolPropertyMethod = APIMethodsReturning<ProtocolSymbolResponse>;
export type SymbolsPropertyMethod = APIMethodsReturning<ProtocolSymbolResponse[]>;
export type SignaturePropertyMethod = APIMethodsReturning<SignatureResponse>;
export type TypePropertyMethod = Exclude<APIMethodsReturning<TypeResponse>, IntrinsicTypeMethod>;
export type TypesPropertyMethod = APIMethodsReturning<TypeResponse[]>;
export type IntrinsicTypeMethod = "getAnyType" | "getBigIntType" | "getBooleanType" | "getESSymbolType" | "getNeverType" | "getNonPrimitiveType" | "getNullType" | "getNumberType" | "getStringType" | "getUndefinedType" | "getUnknownType" | "getVoidType";
type BatchableAPIMethod = Exclude<keyof APIMethodInfo, "batchRequests">;
export type APIRequest = {
    [K in BatchableAPIMethod]: {
        method: K;
        params: APIMethodInfo[K]["params"];
    };
}[BatchableAPIMethod];
export type APIResponse<Request extends APIRequest = APIRequest> = Request extends APIRequest ? {
    method: Request["method"];
} & ({
    result: APIMethodInfo[Request["method"]]["result"];
    error?: undefined;
} | {
    result: null;
    error: string;
}) : never;
export type APIResponseTuple<Requests extends readonly APIRequest[]> = {
    [Index in keyof Requests]: APIResponse<Requests[Index]>;
};
/**
 * A position within a document, combining a document identifier with an offset.
 */
export interface DocumentPosition {
    /** The document containing the position */
    document: DocumentIdentifier;
    /** The character offset within the document */
    position: number;
}
/**
 * Resolves a DocumentIdentifier to a file name.
 * If the identifier contains a URI, it is converted to a file name.
 */
export declare function resolveFileName(identifier: DocumentIdentifier): string;
/**
 * Resolves a DocumentIdentifier to a document URI.
 * If the identifier contains a file name, it is converted to a URI.
 */
export declare function resolveDocumentURI(identifier: DocumentIdentifier): string;
/**
 * Parameters for createSnapshot, including deprecated members handled by `toCreateSnapshotRequest`
 */
export interface CreateSnapshotParams extends CoreCreateSnapshotParams {
    /**
     * @deprecated Use {@link openProjects} instead.
     * Path to a tsconfig.json file to open in the new snapshot.
     */
    openProject?: string | undefined;
}
export interface CreateBuildOrchestratorParams {
    rootNames: readonly string[] | null;
}
/**
 * Builds the wire request for createSnapshot, applying the deprecated `openProject`
 * compatibility shim: a single `openProject` is folded into `openProjects` and is
 * never sent on the wire.
 */
export declare function toCreateSnapshotRequest(params?: CreateSnapshotParams): CreateSnapshotParams;
//# sourceMappingURL=proto.d.ts.map