import { PlaygroundConfig } from "./";
/**
 * Type Defs we've already got, and nulls when something has failed.
 * This is to make sure that it doesn't infinite loop.
 */
export declare const acquiredTypeDefs: {
    [name: string]: string | null;
};
export declare type AddLibToRuntimeFunc = (code: string, path: string) => void;
/**
 * Pseudo in-browser type acquisition tool, uses a
 */
export declare const detectNewImportsToAcquireTypeFor: (sourceCode: string, userAddLibraryToRuntime: AddLibToRuntimeFunc, fetcher: typeof fetch | undefined, playgroundConfig: PlaygroundConfig) => Promise<void>;
