import { PlaygroundConfig } from ".";
declare type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions;
declare type Monaco = typeof import("monaco-editor");
/**
 * These are the defaults, but they also act as the list of all compiler options
 * which are parsed in the query params.
 */
export declare function getDefaultSandboxCompilerOptions(config: PlaygroundConfig, monaco: Monaco): import("monaco-editor").languages.typescript.CompilerOptions;
/**
 * Loop through all of the entries in the existing compiler options then compare them with the
 * query params and return an object which is the changed settings via the query params
 */
export declare const getCompilerOptionsFromParams: (options: CompilerOptions, params: URLSearchParams) => CompilerOptions;
/** Gets a query string representation (hash + queries) */
export declare const createURLQueryWithCompilerOptions: (sandbox: any, paramOverrides?: any) => string;
export {};
