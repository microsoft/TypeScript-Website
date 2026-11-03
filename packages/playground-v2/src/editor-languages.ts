export const sourceLanguages = ["typescript", "typescriptreact", "javascript", "javascriptreact"] as const

export function isSourceLanguage(language: string) {
  return sourceLanguages.some(candidate => candidate === language)
}

export function languageForFile(fileName: string) {
  if (/\.json$/i.test(fileName)) return "json"
  if (/\.tsx$/i.test(fileName)) return "typescriptreact"
  if (/\.jsx$/i.test(fileName)) return "javascriptreact"
  if (/\.[cm]?js$/i.test(fileName)) return "javascript"
  return "typescript"
}
