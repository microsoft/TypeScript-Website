type DecodeInput = ArrayBufferView | ArrayBufferLike | null;
interface DecodeOptions {
    stream?: boolean;
}
export declare class Wtf8Decoder extends TextDecoder {
    decode(input?: DecodeInput, options?: DecodeOptions): string;
}
export {};
//# sourceMappingURL=wtf8.d.ts.map