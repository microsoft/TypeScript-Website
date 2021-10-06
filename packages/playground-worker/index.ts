type ts = typeof import("typescript")

type TwoSlashFiles = Array<{ file: string, startIndex: number, endIndex: number, content: string }>

// Returns a subclass of the worker which take Twoslash file splitting into account. The key to understanding
// how/why this works is that TypeScript does not have _direct_ access to the monaco model. The functions 
// getScriptFileNames and _getScriptText provide the input to the TSServer, so this version of the worker
// manipulates those functions in order to create an additional twoslash vfs layer on top of the existing vfs

const worker: import("./types").CustomTSWebWorkerFactory = (TypeScriptWorker, ts, libFileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {

        // This is the cache key that additionalTwoslashFiles is reasonable
        additionalTwolashFilesModelString: string = ""
        additionalTwoslashFiles: TwoSlashFiles = []

        getMainText(): string {
            // @ts-ignore - this is private, but probably never changing
            return this._ctx.getMirrorModels()[0].getValue()
        }

        getLanguageService(): import("typescript").LanguageService {
            // @ts-ignore
            return this._languageService
        }

        // Updates our in-memory twoslash file representations if needed
        updateTwoslashInfo(): void {
            const modelValue = this.getMainText()
            const files = modelValue.split("// @filename: ")
            if (files.length === 1) {
                if (this.additionalTwoslashFiles.length) this.additionalTwoslashFiles = []
                return
            }

            // OK, so we have twoslash think about, check cache to see if the input is
            // the same and so we don't need to re-run twoslash
            if (this.additionalTwolashFilesModelString === modelValue) return

            // Do the work
            const splits = splitTwoslashCodeInfoFiles(modelValue, "input.tsx", "file:///")
            const twoslashResults = splits.map(f => {
                const content = f[1].join("\n")
                return { file: f[0], startIndex: modelValue.indexOf(content), endIndex: modelValue.indexOf(content) + content.length, content }
            })

            this.additionalTwoslashFiles = twoslashResults
            this.additionalTwolashFilesModelString = modelValue
            // this.getLanguageService().
        }

        // Takes a fileName and position and shifts it to the new file/pos according to twoslash splits
        repositionInTwoslash(fileName: string, position: number) {
            this.updateTwoslashInfo()
            if (this.additionalTwoslashFiles.length === 0) return { tsFileName: fileName, tsPosition: position }
            const thisFile = this.additionalTwoslashFiles.find(r => r.startIndex < position && position < r.endIndex)
            if (!thisFile) return null

            return {
                tsPosition: position - thisFile.startIndex,
                tsFileName: thisFile.file
            }
        }

        // What TypeScript files could we get to include created by twoslash files
        override getScriptFileNames() {
            console.log("get filenames")
            const main = super.getScriptFileNames()
            return [...main, ...this.additionalTwoslashFiles.map(f => f.file)]
        }

        override _getScriptText(fileName: string): string | undefined {
            const twoslashed = this.additionalTwoslashFiles.find(f => fileName === f.file)
            if (twoslashed) return twoslashed.content
            return super._getScriptText(fileName)
        }

        override async getCompletionsAtPosition(fileName: string, position: number) {
            const newLocation = this.repositionInTwoslash(fileName, position)
            // Gaps between files skip the info, pass back a blank
            if (!newLocation) return { isGlobalCompletion: false, isMemberCompletion: false, isNewIdentifierLocation: false, entries: [] }

            const { tsFileName, tsPosition } = newLocation
            console.log(newLocation)
            return super.getCompletionsAtPosition(tsFileName, tsPosition)
        }
    };
};


// let lastResults: { modelValue: string, results: TwoSlashFiles } = { modelValue: "", results: [] }

// const positionInTwoslash = (modelValue: string, fileName: string, position: number): null | { tsFileName: string, tsPosition: number } => {
//     // Quick NOOP if we need that
//     const files = modelValue.split("// @filename: ")
//     if (files.length === 1) return { tsFileName: fileName, tsPosition: position }

//     // OK, so we have twoslash think about, check cache
//     let twoslashResults: TwoSlashFiles
//     if (lastResults.modelValue === modelValue) twoslashResults = lastResults.results
//     else {
//         const files = splitTwoslashCodeInfoFiles(modelValue, "input.tsx", "file:///")
//         twoslashResults = files.map(f => {
//             const content = f[1].join("\n")
//             return { file: f[0], startIndex: modelValue.indexOf(content), endIndex: modelValue.indexOf(content) + content.length, content }
//         })
//         lastResults = { modelValue, results: twoslashResults }
//     }

//     // debugger
//     const thisFile = twoslashResults.find(r => r.startIndex < position && position < r.endIndex)
//     if (!thisFile) return null

//     return {
//         tsPosition: position - thisFile.startIndex,
//         tsFileName: thisFile.file
//     }
// }

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
