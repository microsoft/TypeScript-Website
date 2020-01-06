// A single file version from
// https://stackoverflow.com/questions/53733138/how-do-i-type-check-a-snippet-of-typescript-code-in-memory

export function createCompilerHost(code: string, path: string) {
  const host: import('typescript').CompilerHost = {
    fileExists: filePath => filePath === path,
    directoryExists: dirPath => dirPath === '/',
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    getCanonicalFileName: fileName => fileName,
    getNewLine: () => '\n',
    getDefaultLibFileName: () => '',
    getSourceFile: _ => undefined,
    readFile: filePath => (filePath === path ? code : undefined),
    useCaseSensitiveFileNames: () => true,
    writeFile: () => {},
  }

  return host
}
