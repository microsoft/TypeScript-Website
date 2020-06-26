import { UI } from "./createUI";
declare type Sandbox = import("typescript-sandbox").Sandbox;
export declare const createExporter: (sandbox: Sandbox, monaco: typeof import("monaco-editor"), ui: UI) => {
    openProjectInStackBlitz: () => void;
    openProjectInCodeSandbox: () => void;
    reportIssue: () => Promise<void>;
    copyAsMarkdownIssue: () => Promise<void>;
    copyForChat: () => void;
    copyForChatWithPreview: () => void;
    openInTSAST: () => void;
};
export {};
