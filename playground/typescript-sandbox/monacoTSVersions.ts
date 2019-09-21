/**
 * The versions of monaco-typescript which we can use
 * for backwards compatibility with older versions
 * of TS in the playground.
 */
export const monacoTSVersions = {
  "3.6.3": { monaco: "0.18.1", module: "monaco-editor" },
  "Nightly": { monaco: "nightly", module: "@typescript-deploys/monaco-editor" },
  "3.5.1": { monaco: "0.17.1", module: "monaco-editor"},
  "3.3.3": { monaco: "0.16.1", module: "monaco-editor"},
  "3.1.6": { monaco: "0.15.6", module: "monaco-editor"},
  "3.0.1": { monaco: "0.14.3", module: "monaco-editor"},
  "2.8.1": { monaco: "0.13.1", module: "monaco-editor"},
  "2.7.2": { monaco: "0.11.1", module: "monaco-editor"},
  "2.4.1": { monaco: "0.10.0", module: "monaco-editor"},

} as const;

export type SupportedTSVersions = keyof typeof monacoTSVersions
