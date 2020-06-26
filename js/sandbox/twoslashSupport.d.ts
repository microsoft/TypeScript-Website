declare type TS = typeof import('typescript');
/**
 * This is a port of the twoslash bit which grabs compiler options
 * from the source code
 */
export declare const extractTwoSlashComplierOptions: (ts: TS) => (code: string) => any;
export declare function parsePrimitive(value: string, type: string): any;
export {};
