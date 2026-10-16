import { SyntaxKind, } from "../../ast/index.js";
export { modifierToFlag } from "../../ast/modifiers.js";
import { HEADER_OFFSET_HASH_HI0, HEADER_OFFSET_HASH_HI1, HEADER_OFFSET_HASH_LO0, HEADER_OFFSET_HASH_LO1, HEADER_OFFSET_PARSE_OPTIONS, HEADER_OFFSET_SOURCE_FILE_ID, HEADER_OFFSET_SOURCE_FILE_LEASE, NODE_DATA_TYPE_CHILDREN, NODE_DATA_TYPE_EXTENDED, NODE_DATA_TYPE_STRING, NODE_OFFSET_DATA, NODE_OFFSET_END, NODE_OFFSET_KIND, NODE_OFFSET_NEXT, NODE_OFFSET_PARENT, NODE_OFFSET_POS, } from "./protocol.js";
// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════
export const popcount8 = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8];
export const NODE_DATA_TYPE_MASK = 0xc0_00_00_00;
export const NODE_CHILD_MASK = 0x00_00_00_ff;
export const NODE_STRING_INDEX_MASK = 0x00_ff_ff_ff;
export const NODE_EXTENDED_DATA_MASK = 0x00_ff_ff_ff;
// ═══════════════════════════════════════════════════════════════════════════
// Free functions
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Read the 128-bit content hash from a source file binary response as a hex string.
 */
export function readSourceFileHash(data) {
    const lo0 = data.getUint32(HEADER_OFFSET_HASH_LO0, true);
    const lo1 = data.getUint32(HEADER_OFFSET_HASH_LO1, true);
    const hi0 = data.getUint32(HEADER_OFFSET_HASH_HI0, true);
    const hi1 = data.getUint32(HEADER_OFFSET_HASH_HI1, true);
    return hex8(hi1) + hex8(hi0) + hex8(lo1) + hex8(lo0);
}
/**
 * Read the per-file parse options key from a source file binary response.
 * This encodes the ExternalModuleIndicatorOptions bitmask as a string,
 * allowing the client to distinguish files parsed with different options.
 */
export function readParseOptionsKey(data) {
    return data.getUint32(HEADER_OFFSET_PARSE_OPTIONS, true).toString();
}
export function readSourceFileLease(data) {
    const lease = data.getBigUint64(HEADER_OFFSET_SOURCE_FILE_LEASE, true);
    if (lease === 0n) {
        throw new Error("Source file response has no lease");
    }
    if (lease > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error(`Source file lease ${lease} exceeds the maximum safe integer`);
    }
    return Number(lease);
}
export function readSourceFileNodeId(data) {
    const nodeId = data.getBigUint64(HEADER_OFFSET_SOURCE_FILE_ID, true);
    if (nodeId === 0n) {
        throw new Error("Source file response has no node ID");
    }
    return nodeId.toString();
}
function hex8(n) {
    return (n >>> 0).toString(16).padStart(8, "0");
}
// ═══════════════════════════════════════════════════════════════════════════
// RemoteNodeBase
// ═══════════════════════════════════════════════════════════════════════════
export class RemoteNodeBase {
    parent; // RemoteNode at runtime
    view;
    index;
    _byteIndex;
    constructor(view, index, parent, byteIndex) {
        this.view = view;
        this.index = index;
        this.parent = parent;
        this._byteIndex = byteIndex;
    }
    get kind() {
        return this.view.getUint32(this._byteIndex + NODE_OFFSET_KIND, true);
    }
    get pos() {
        return this.view.getInt32(this._byteIndex + NODE_OFFSET_POS, true);
    }
    get end() {
        return this.view.getInt32(this._byteIndex + NODE_OFFSET_END, true);
    }
    get next() {
        return this.view.getUint32(this._byteIndex + NODE_OFFSET_NEXT, true);
    }
    get parentIndex() {
        return this.view.getUint32(this._byteIndex + NODE_OFFSET_PARENT, true);
    }
    get data() {
        return this.view.getUint32(this._byteIndex + NODE_OFFSET_DATA, true);
    }
    get dataType() {
        return (this.data & NODE_DATA_TYPE_MASK);
    }
    get childMask() {
        if (this.dataType !== NODE_DATA_TYPE_CHILDREN) {
            return -1;
        }
        return this.data & NODE_CHILD_MASK;
    }
    getFileText(start, end) {
        return this.sourceFile._decoder.decode(new Uint8Array(this.view.buffer, this.view.byteOffset + this.sourceFile._offsetStringTable + start, end - start));
    }
    get sourceFile() {
        // Overridden in RemoteNode; exists here for getFileText access
        throw new Error("sourceFile not available on base");
    }
}
//# sourceMappingURL=node.infrastructure.js.map