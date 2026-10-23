import type { APIModules } from "./extensionApi.ts";
export interface TypeScriptModuleLoader {
    /**
     * Imports a module from the selected API package using the full package specifier.
     */
    importModule<K extends string>(exportPath: K): Promise<APIModules[K]>;
}
/**
 * Loads the selected installation's API modules in this process.
 * Pass the SDK's packageJsonPath through your server's initialization options.
 * Restart this process after an in-place package upgrade to clear its module cache.
 */
export declare function createTypeScriptModuleLoader(packageJsonPath: string): TypeScriptModuleLoader;
//# sourceMappingURL=moduleLoader.d.ts.map