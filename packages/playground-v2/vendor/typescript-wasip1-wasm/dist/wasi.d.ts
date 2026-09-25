import type { WasmReactorInstance } from "./index.ts";
export interface InstantiateWasmOptions {
    stdout?: ((text: string) => void) | undefined;
    stderr?: ((text: string) => void) | undefined;
}
export interface WasmFileSystem {
    writeFile?: ((path: string, data: string) => void) | undefined;
}
export declare function setWasmFileSystem(instance: WasmReactorInstance, fs: WasmFileSystem | undefined): void;
export declare function registerWasmCallback(instance: WasmReactorInstance, name: string, callback: (name: string, payload: string) => string): void;
export declare function unregisterWasmCallback(instance: WasmReactorInstance, name: string): void;
/** Instantiate and initialize the TypeScript reactor with its minimal WASI host. */
export declare function instantiateWasm(module: WebAssembly.Module, options?: InstantiateWasmOptions): Promise<WasmReactorInstance>;
/** Synchronously instantiate and initialize the TypeScript reactor with its minimal WASI host. */
export declare function instantiateWasmSync(module: WebAssembly.Module, options?: InstantiateWasmOptions): WasmReactorInstance;
//# sourceMappingURL=wasi.d.ts.map