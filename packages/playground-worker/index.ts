import { DefinitionInfo, Diagnostic, ModuleResolutionKind, QuickInfo, ReferenceEntry } from "typescript"

type TwoSlashFiles = Array<{ file: string, startIndex: number, endIndex: number, content: string, updatedAt: string }>

// Returns a subclass of the worker which take Twoslash file splitting into account. The key to understanding
// how/why this works is that TypeScript does not have _direct_ access to the monaco model. The functions 
// getScriptFileNames and _getScriptText provide the input to the TSServer, so this version of the worker
// manipulates those functions in order to create an additional twoslash vfs layer on top of the existing vfs.

const worker: import("./types").CustomTSWebWorkerFactory = (TypeScriptWorker, ts, libFileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {

        // TODO:  when migrating to the TS playground, this needs to be set by the playground somehow
        mainFile = "input.tsx"

        // This is the cache key that additionalTwoslashFiles is reasonable
        twolashFilesModelString: string = ""
        twoslashFiles: TwoSlashFiles = []
        additionalTwoslashFilenames: string[] = []

        // These two are basically using the internals of the TypeScriptWorker
        // but I don't think it's likely they're ever going to change

        // We need a way to get access to the main text of the monaco editor, which is currently only
        // grabbable via these mirrored models. There's only one in a Playground.
        getMainText(): string {
            // @ts-ignore
            return this._ctx.getMirrorModels()[0].getValue()
        }

        // Useful for grabbing a TypeScript program or 
        getLanguageService(): import("typescript").LanguageService {
            // @ts-ignore
            return this._languageService
        }

        // Updates our in-memory twoslash file representations if needed, because this gets called
        // a lot, it caches the results according to the main text in the monaco editor.
        updateTwoslashInfoIfNeeded(): void {
            const modelValue = this.getMainText()
            const files = modelValue.split("// @filename: ")
            if (files.length === 1) {
                if (this.twoslashFiles.length) {
                    this.twoslashFiles = []
                    this.additionalTwoslashFilenames = []
                }
                return
            }

            // OK, so we have twoslash think about, check cache to see if the input is
            // the same and so we don't need to re-run twoslash
            if (this.twolashFilesModelString === modelValue) return
            const convertedToMultiFile = this.twoslashFiles.length === 0

            // Do the work
            const splits = splitTwoslashCodeInfoFiles(modelValue, this.mainFile, "file:///")
            const twoslashResults = splits.map(f => {
                const content = f[1].join("\n")
                const updatedAt = (new Date()).toUTCString()
                return {
                    file: f[0],
                    content,
                    startIndex: modelValue.indexOf(content),
                    endIndex: modelValue.indexOf(content) + content.length,
                    updatedAt
                }
            })

            this.twoslashFiles = twoslashResults
            this.additionalTwoslashFilenames = twoslashResults.map(f => f.file).filter(f => f !== this.mainFile)
            this.twolashFilesModelString = modelValue

            if (convertedToMultiFile) {
                console.log("Switched playground to use multiple files: ", this.additionalTwoslashFilenames)
            }
        }

        getCurrentDirectory(): string {
            return "/"
        }

        readDirectory(_path: string, _extensions?: readonly string[], _exclude?: readonly string[], _include?: readonly string[], _depth?: number): string[] {
            const giving = this.twoslashFiles.map(f => f.file)
            return giving.map(f => f.replace("file://", ""))
        }

        // Takes a fileName and position and shifts it to the new file/pos according to twoslash splits
        repositionInTwoslash(fileName: string, position: number) {
            this.updateTwoslashInfoIfNeeded()

            if (this.twoslashFiles.length === 0) return { tsFileName: fileName, tsPosition: position, twoslash: undefined }
            const thisFile = this.twoslashFiles.find(r => r.startIndex < position && position <= r.endIndex)
            if (!thisFile) return null

            return {
                tsPosition: position - thisFile.startIndex,
                tsFileName: thisFile.file
            }
        }

        // What TypeScript files are available, include created by twoslash files
        // this is asked a lot, so I created a specific variable for this which
        // doesn't include a copy of the default file in the super call
        override getScriptFileNames() {
            const main = super.getScriptFileNames()
            const files = [...main, ...this.additionalTwoslashFilenames]
            return files
        }

        // This is TypeScript asking 'whats the content of this file' - we want
        // to override the underlaying TS vfs model with our twoslash multi-file 
        // files when possible, otherwise pass it back to super
        override _getScriptText(fileName: string): string | undefined {
            const twoslashed = this.twoslashFiles.find(f => fileName === f.file)
            if (twoslashed) {
                return twoslashed.content
            }
            return super._getScriptText(fileName)
        }

        // TypeScript uses a versioning system on a file to know whether it needs
        // to re-look over the file. What we do is set the date time when re-parsing 
        // with twoslash and always pass that number, so that any changes are reflected
        // in the tsserver
        override getScriptVersion(fileName: string) {
            this.updateTwoslashInfoIfNeeded()

            const thisFile = this.twoslashFiles.find(f => f.file)
            if (thisFile) return thisFile.updatedAt
            return super.getScriptVersion(fileName)
        }

        // The APIs which we override that provide the tooling experience, rebound to 
        // handle the potential multi-file mode. 

        // Perhaps theres a way to make all these `bind(this)` gone away?

        // Bunch of promise -> diag[] functions
        override async getSemanticDiagnostics(fileName: string) {
            return this._getDiagsWrapper(super.getSemanticDiagnostics.bind(this), fileName)
        }

        override async getSyntacticDiagnostics(fileName: string) {
            return this._getDiagsWrapper(super.getSyntacticDiagnostics.bind(this), fileName)
        }

        override async getCompilerOptionsDiagnostics(fileName: string) {
            return this._getDiagsWrapper(super.getCompilerOptionsDiagnostics.bind(this), fileName)
        }

        override async getSuggestionDiagnostics(fileName: string) {
            return this._getDiagsWrapper(super.getSuggestionDiagnostics.bind(this), fileName)
        }

        // Funcs under here include an empty response when someone is interacting inside the gaps
        // between files (e.g. the // @filename: xyz.ts bit)

        override async getQuickInfoAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve({ kind: "" as any, kindModifiers: "", textSpan: { start: 0, length: 0 } })
            const pos = await this._overrideFileNamePos(super.getQuickInfoAtPosition.bind(this), fileName, position, undefined, empty, (result: QuickInfo, twoslashFile) => {
                if (twoslashFile && result && result.textSpan)
                    result.textSpan.start += twoslashFile.startIndex

                return result
            })
            return pos
        }

        override async getCompletionsAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve({ isGlobalCompletion: false, isMemberCompletion: false, isNewIdentifierLocation: false, entries: [] })
            const complet = await this._overrideFileNamePos(super.getCompletionsAtPosition.bind(this), fileName, position, undefined, empty, (result) => result)
            return complet
        }

        override async getCompletionEntryDetails(fileName: string, position: number, entry: string) {
            const empty = Promise.resolve({ name: "", kind: "" as any, kindModifiers: "", displayParts: [] })
            return this._overrideFileNamePos(super.getCompletionEntryDetails.bind(this), fileName, position, entry, empty, (result) => result)
        }

        override async getOccurrencesAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getOccurrencesAtPosition.bind(this), fileName, position, undefined, empty, (result) => {
                if (result) {
                    result.forEach(re => {
                        const twoslash = this.twoslashFiles.find(f => f.file === re.fileName)
                        if (twoslash) re.textSpan.start += twoslash.startIndex
                    })
                }
                return result
            })
        }

        override async getDefinitionAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getDefinitionAtPosition.bind(this), fileName, position, undefined, empty, (result) => {
                if (result) {
                    result.forEach(re => {
                        const twoslash = this.twoslashFiles.find(f => f.file === re.fileName)
                        if (twoslash) {
                            re.textSpan.start += twoslash.startIndex
                        }
                        re.fileName = fileName
                    })
                }
                return result
            })
        }

        override async getReferencesAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getReferencesAtPosition.bind(this), fileName, position, undefined, empty, (result) => {
                if (result) {
                    result.forEach(re => {
                        const twoslash = this.twoslashFiles.find(f => f.file === re.fileName)
                        if (twoslash) {
                            re.textSpan.start += twoslash.startIndex
                        }
                        re.fileName = fileName
                    })
                }
                return result
            })
        }

        override async getNavigationBarItems(fileName: string) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getNavigationBarItems.bind(this), fileName, -1, undefined, empty, (result) => result)
        }

        // Helper functions which make the rebindings easier to manage

        // Can handle any file, pos function being re-bound
        async _overrideFileNamePos<T extends (fileName: string, position: number, other: any) => any>(
            fnc: T,
            fileName: string,
            position: number,
            other: any,
            empty: ReturnType<T>,
            editFunc: (res: Awaited<ReturnType<T>>) => any): Promise<ReturnType<T>> {
            const newLocation = this.repositionInTwoslash(fileName, position)
            // Gaps between files skip the info, pass back a blank
            if (!newLocation) return empty

            const { tsFileName, tsPosition } = newLocation
            const result = await fnc.bind(this)(tsFileName, tsPosition, other)
            editFunc(result)
            return result
        }

        // Can handle a func which is multi-cast to all possible files and then rebound with their
        // positions back to the original file mapping
        async _getDiagsWrapper(getDiagnostics: (a: string) => Promise<Diagnostic[]>, fileName: string) {
            if (!this.getLanguageService()) return []

            this.updateTwoslashInfoIfNeeded()

            if (fileName === this.mainFile && this.twoslashFiles.length === 0) return getDiagnostics(fileName)

            let diags: Diagnostic[] = []
            for (const f of this.twoslashFiles) {
                const d = await getDiagnostics(f.file)
                d.forEach(diag => { if (diag && diag.start) diag.start += f.startIndex })
                diags = diags.concat(d)
            }

            return diags
        }
    };
};


// Taken directly from Twoslash's source code
const splitTwoslashCodeInfoFiles = (code: string, defaultFileName: string, root: string) => {
    const lines = code.split(/\r\n?|\n/g)

    let nameForFile = code.includes(`@filename: ${defaultFileName}`) ? "global.ts" : defaultFileName
    let currentFileContent: string[] = []
    const fileMap: Array<[string, string[]]> = []

    for (const line of lines) {
        if (line.includes("// @filename: ")) {
            fileMap.push([root + nameForFile, currentFileContent])
            nameForFile = line.split("// @filename: ")[1].trim()
            currentFileContent = []
        } else {
            currentFileContent.push(line)
        }
    }
    fileMap.push([root + nameForFile, currentFileContent])

    // Basically, strip these:
    // ["index.ts", []]
    // ["index.ts", [""]]
    const nameContent = fileMap.filter(n => n[1].length > 0 && (n[1].length > 1 || n[1][0] !== ""))
    return nameContent
}


self.customTSWorkerFactory = worker;
