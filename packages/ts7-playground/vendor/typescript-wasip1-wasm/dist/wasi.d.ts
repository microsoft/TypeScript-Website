import type { WasmReactorInstance } from "./index.ts";
export interface InstantiateWasmOptions {
    stdout?: (text: string) => void;
    stderr?: (text: string) => void;
}
export interface WasmFileSystem {
    writeFile?(path: string, data: string): void;
}
export declare function setWasmFileSystem(instance: WasmReactorInstance, fs: WasmFileSystem | undefined): void;
/** Instantiate and initialize the TypeScript reactor with its minimal WASI host. */
export declare function instantiateWasm(module: WebAssembly.Module, options?: InstantiateWasmOptions): Promise<WasmReactorInstance>;
/** Synchronously instantiate and initialize the TypeScript reactor with its minimal WASI host. */
export declare function instantiateWasmSync(module: WebAssembly.Module, options?: InstantiateWasmOptions): WasmReactorInstance;
//# sourceMappingURL=wasi.d.ts.map