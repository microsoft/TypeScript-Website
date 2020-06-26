declare type Sandbox = import('typescript-sandbox').Sandbox;
declare type Monaco = typeof import('monaco-editor');
export declare const createConfigDropdown: (sandbox: Sandbox, monaco: Monaco) => void;
export declare const updateConfigDropdownForCompilerOptions: (sandbox: Sandbox, monaco: Monaco) => void;
export declare const setupJSONToggleForConfig: (sandbox: Sandbox) => void;
export {};
