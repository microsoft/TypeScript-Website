import type { Node, SourceFile } from "../../ast/index.ts";
/**
 * Encode a SourceFile AST node into the binary format.
 */
export declare function encodeSourceFile(sourceFile: SourceFile): Uint8Array;
/**
 * Encode an arbitrary AST node into the binary format.
 * When encoding a non-SourceFile node, the header hash and parse options fields will be zero.
 */
export declare function encodeNode(node: Node): Uint8Array;
/**
 * Encode a Uint8Array to a base64 string.
 */
export declare function uint8ArrayToBase64(data: Uint8Array): string;
export declare function sourceFileResponseToUint8Array(response: {
    readonly data: string;
} | null | undefined): Uint8Array | undefined;
//# sourceMappingURL=encoder.d.ts.map