declare module "*.css"
declare module "*.json" {
  const value: any
  export default value
}
declare module "monaco-editor/editor/contrib/links/browser/links.js"

declare module "monaco-editor/languages/definitions/javascript/javascript.js" {
  export const conf: import("monaco-editor-core").languages.LanguageConfiguration
  export const language: import("monaco-editor-core").languages.IMonarchLanguage
}

declare module "monaco-editor/languages/definitions/typescript/typescript.js" {
  export const conf: import("monaco-editor-core").languages.LanguageConfiguration
  export const language: import("monaco-editor-core").languages.IMonarchLanguage
}
