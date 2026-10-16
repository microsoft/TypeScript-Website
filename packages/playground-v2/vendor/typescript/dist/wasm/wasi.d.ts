import type { WasmReactorInstance } from "./transport.ts";
declare namespace WebAssembly {
    interface Module {
    }
    type Imports = Record<string, Record<string, object | Function | number | bigint>>;
    interface Instance {
        readonly exports: Record<string, unknown>;
    }
    const Instance: {
        new (module: Module, imports?: Imports): Instance;
    };
    interface Memory {
        readonly buffer: ArrayBufferLike;
    }
    const Memory: {
        readonly prototype: Memory;
        new (descriptor: object): Memory;
    };
    function instantiate(module: Module, imports?: Imports): Promise<Instance>;
}
export interface InstantiateWasmOptions {
    stdout?: ((text: string) => void) | undefined;
    stderr?: ((text: string) => void) | undefined;
}
export interface WasmFileSystem {
    writeFile?: ((path: string, data: string) => unknown) | symbol | undefined;
}
export declare function setWasmFileSystem(instance: WasmReactorInstance, fs: WasmFileSystem | undefined): void;
export declare function registerWasmCallback(instance: WasmReactorInstance, name: string, callback: (name: string, payload: string) => string): void;
export declare function unregisterWasmCallback(instance: WasmReactorInstance, name: string): void;
/** Instantiate and initialize the TypeScript reactor with its minimal WASI host. */
export declare function instantiateWasm(module: WebAssembly.Module, options?: InstantiateWasmOptions): Promise<WasmReactorInstance>;
/**
 * Synchronously instantiate and initialize the TypeScript reactor with its minimal WASI host.
 *
 * Prefer `instantiateWasm` on browser main threads, where synchronous
 * instantiation of large WebAssembly modules may be rejected.
 */
export declare function instantiateWasmSync(module: WebAssembly.Module, options?: InstantiateWasmOptions): WasmReactorInstance;
export {};
//# sourceMappingURL=wasi.d.ts.map