/**
 * Returns `process` when running in Node.js with `process.getBuiltinModule`.
 * Node modules are loaded through it so that the API can also be loaded in
 * environments without them, where a transport must be provided instead.
 */
export declare function nodeProcess(): NodeJS.Process;
export declare function getDefaultExePath(): string;
//# sourceMappingURL=nodeProcess.d.ts.map