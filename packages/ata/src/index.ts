export type AddLibToRuntimeFunc = (code: string, path: string) => void

interface Logger {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void
}

export interface ATABootstrapConfig {
  /** Your local copy of typescript */
  typescript: typeof import("typescript")
  /** The callback which gets called when ATA decides a file needs to be written to your VFS  */
  addLibraryToRuntime: AddLibToRuntimeFunc
  /** The callback when all ATA has finished */
  finished: () => void
  /** If you uneed a custom version of fetch */
  fetcher?: typeof fetch
  /** If you need a custom logger instead of the console global */
  logger?: Logger
}

/**
 * The function which starts up type acquisition,
 * returns a function which you then pass the initial
 * source code for the app with.
 *
 * This is effectively the main export, everything else is
 * basically exported for tests and should be considered
 * implemntation details.
 */
export const setupTypeAcquisition = (config: ATABootstrapConfig) => (initialSourceFile: string) => {}

export const getModulePackage = (config: ATABootstrapConfig) => (modeuleName: string) => {
  // Using jsdelivr, get all files for a package
  // https://github.com/jsdelivr/data.jsdelivr.com#list-package-files
  // check for any .d.ts files
  // If none, check for existence of DT using same API
  // download all .d.ts files
}

export const getReferencesForModule = (ts: typeof import("typescript"), code: string) => {
  const meta = ts.preProcessFile(code)
  const references = meta.referencedFiles.concat(meta.importedFiles).concat(meta.libReferenceDirectives)
  return references.map(r => r.fileName)
}
