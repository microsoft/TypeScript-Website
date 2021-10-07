import type {Diagnostic, QuickInfo} from "typescript"

type TwoSlashFiles = Array<{ file: string, startIndex: number, endIndex: number, content: string, updatedAt: string }>

// Returns a subclass of the worker which take Twoslash file splitting into account. The key to understanding
// how/why this works is that TypeScript does not have _direct_ access to the monaco model. The functions 
// getScriptFileNames and _getScriptText provide the input to the TSServer, so this version of the worker
// manipulates those functions in order to create an additional twoslash vfs layer on top of the existing vfs

const worker: import("./types").CustomTSWebWorkerFactory = (TypeScriptWorker, ts, libFileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {

        // TODO: this needs to be set by the playground
        mainFile = "input.tsx"

        // This is the cache key that additionalTwoslashFiles is reasonable
        twolashFilesModelString: string = ""
        twoslashFiles: TwoSlashFiles = []
        additionalTwoslashFilenames: string[] = []

        // These two are basically using the internals of the TypeScriptWorker
        // but I don't think it's likely they're ever going to change

        getMainText(): string {
            // @ts-ignore
            return this._ctx.getMirrorModels()[0].getValue()
        }

        getLanguageService(): import("typescript").LanguageService {
            // @ts-ignore
            return this._languageService
        }

        // Updates our in-memory twoslash file representations if needed
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

            console.log("updated to have twoslash: ", this.additionalTwoslashFilenames)
        }

        getCurrentDirectory(): string {
            return "/"
        }


        readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
            const giving = this.twoslashFiles.map(f => f.file)
            console.log("readDir", path, extensions)
            console.log(giving)
            debugger
            
            if (this.twoslashFiles.length === 0) return []
            return giving
        }

        // Takes a fileName and position and shifts it to the new file/pos according to twoslash splits
        repositionInTwoslash(fileName: string, position: number) {
            this.updateTwoslashInfoIfNeeded()

            if (this.twoslashFiles.length === 0) return { tsFileName: fileName, tsPosition: position }
            const thisFile = this.twoslashFiles.find(r => r.startIndex < position && position <= r.endIndex)
            if (!thisFile) return null

            return {
                tsPosition: position - thisFile.startIndex,
                tsFileName: thisFile.file
            }
        }

        // What TypeScript files could we get to include created by twoslash files
        override getScriptFileNames() {
            const main = super.getScriptFileNames()
            const files = [...main, ...this.additionalTwoslashFilenames]
            return files
        }

        override _getScriptText(fileName: string): string | undefined {
            const twoslashed = this.twoslashFiles.find(f => fileName === f.file)
            if (twoslashed) { 
                return twoslashed.content
            }
            return super._getScriptText(fileName)
        }

        override getScriptVersion(fileName: string) {
            this.updateTwoslashInfoIfNeeded()

            const thisFile = this.twoslashFiles.find(f => f.file)
            if (thisFile) return thisFile.updatedAt
            return super.getScriptVersion(fileName)
        }

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

        override async getQuickInfoAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve({ kind: "" as any, kindModifiers:"" , textSpan: { start: 0, length: 0} })
            return this._overrideFileNamePos(super.getQuickInfoAtPosition.bind(this), fileName, position, undefined, empty)
        }

        override async getCompletionsAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve({ isGlobalCompletion: false, isMemberCompletion: false, isNewIdentifierLocation: false, entries: [] })
            return this._overrideFileNamePos(super.getCompletionsAtPosition.bind(this), fileName, position, undefined, empty)
        }

        override async getCompletionEntryDetails(fileName: string, position: number, entry: string) {
            const empty = Promise.resolve({ name: "", kind: "" as any, kindModifiers: "", displayParts: [] })
            return this._overrideFileNamePos(super.getCompletionEntryDetails.bind(this), fileName, position, entry, empty)
        }

        override async getOccurrencesAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getOccurrencesAtPosition.bind(this), fileName, position, undefined, empty)
        }

        override async getDefinitionAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getDefinitionAtPosition.bind(this), fileName, position, undefined, empty)
        }

        override async getReferencesAtPosition(fileName: string, position: number) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getReferencesAtPosition.bind(this), fileName, position, undefined, empty)
        }

        override async getNavigationBarItems(fileName: string) {
            const empty = Promise.resolve([])
            return this._overrideFileNamePos(super.getNavigationBarItems.bind(this), fileName, undefined, undefined, empty)
        }

        // Can handle any file, pos function
        async _overrideFileNamePos<T extends (fileName: string, position: number, other: any) => any>(fnc: T, fileName: string, position: number, other: any, empty: ReturnType<T>) {
            const newLocation = this.repositionInTwoslash(fileName, position)
            // Gaps between files skip the info, pass back a blank
            if (!newLocation) return empty

            const { tsFileName, tsPosition } = newLocation
            return fnc.bind(this)(tsFileName, tsPosition, other)
        }

        // Can handle any anything to promise
        async _getDiagsWrapper(getDiagnostics: (string) => Promise<Diagnostic[]>, fileName: string) {
            if (!this.getLanguageService()) return []

            this.updateTwoslashInfoIfNeeded()
            
            if (fileName === this.mainFile && this.twoslashFiles.length === 0) return getDiagnostics(fileName)

            let diags = []
            for (const f of this.twoslashFiles) {
                const d = await getDiagnostics(f.file)
                d.forEach(diag => { diag.start += f.startIndex })
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
