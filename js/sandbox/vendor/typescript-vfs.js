define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createVirtualLanguageServiceHost = exports.createVirtualCompilerHost = exports.createSystem = exports.createDefaultMapFromCDN = exports.createDefaultMapFromNodeModules = exports.knownLibFilesForCompilerOptions = exports.createVirtualTypeScriptEnvironment = void 0;
    const hasLocalStorage = typeof localStorage !== `undefined`;
    const hasProcess = typeof process !== `undefined`;
    const shouldDebug = (hasLocalStorage && localStorage.getItem('DEBUG')) || (hasProcess && process.env.DEBUG);
    const debugLog = shouldDebug ? console.log : (_message, ..._optionalParams) => '';
    /**
     * Makes a virtual copy of the TypeScript environment. This is the main API you want to be using with
     * @typescript/vfs. A lot of the other exposed functions are used by this function to get set up.
     *
     * @param sys an object which conforms to the TS Sys (a shim over read/write access to the fs)
     * @param rootFiles a list of files which are considered inside the project
     * @param ts a copy pf the TypeScript module
     * @param compilerOptions the options for this compiler run
     */
    function createVirtualTypeScriptEnvironment(sys, rootFiles, ts, compilerOptions = {}) {
        const mergedCompilerOpts = Object.assign(Object.assign({}, defaultCompilerOptions(ts)), compilerOptions);
        const { languageServiceHost, updateFile } = createVirtualLanguageServiceHost(sys, rootFiles, mergedCompilerOpts, ts);
        const languageService = ts.createLanguageService(languageServiceHost);
        const diagnostics = languageService.getCompilerOptionsDiagnostics();
        if (diagnostics.length) {
            const compilerHost = createVirtualCompilerHost(sys, compilerOptions, ts);
            throw new Error(ts.formatDiagnostics(diagnostics, compilerHost.compilerHost));
        }
        return {
            sys,
            languageService,
            getSourceFile: (fileName) => { var _a; return (_a = languageService.getProgram()) === null || _a === void 0 ? void 0 : _a.getSourceFile(fileName); },
            createFile: (fileName, content) => {
                updateFile(ts.createSourceFile(fileName, content, mergedCompilerOpts.target, false));
            },
            updateFile: (fileName, content, optPrevTextSpan) => {
                const prevSourceFile = languageService.getProgram().getSourceFile(fileName);
                const prevFullContents = prevSourceFile.text;
                // TODO: Validate if the default text span has a fencepost error?
                const prevTextSpan = optPrevTextSpan !== null && optPrevTextSpan !== void 0 ? optPrevTextSpan : ts.createTextSpan(0, prevFullContents.length);
                const newText = prevFullContents.slice(0, prevTextSpan.start) +
                    content +
                    prevFullContents.slice(prevTextSpan.start + prevTextSpan.length);
                const newSourceFile = ts.updateSourceFile(prevSourceFile, newText, {
                    span: prevTextSpan,
                    newLength: content.length,
                });
                updateFile(newSourceFile);
            },
        };
    }
    exports.createVirtualTypeScriptEnvironment = createVirtualTypeScriptEnvironment;
    /**
     * Grab the list of lib files for a particular target, will return a bit more than necessary (by including
     * the dom) but that's OK
     *
     * @param target The compiler settings target baseline
     * @param ts A copy of the TypeScript module
     */
    exports.knownLibFilesForCompilerOptions = (compilerOptions, ts) => {
        const target = compilerOptions.target || ts.ScriptTarget.ES5;
        const lib = compilerOptions.lib || [];
        const files = [
            'lib.d.ts',
            'lib.dom.d.ts',
            'lib.dom.iterable.d.ts',
            'lib.webworker.d.ts',
            'lib.webworker.importscripts.d.ts',
            'lib.scripthost.d.ts',
            'lib.es5.d.ts',
            'lib.es6.d.ts',
            'lib.es2015.collection.d.ts',
            'lib.es2015.core.d.ts',
            'lib.es2015.d.ts',
            'lib.es2015.generator.d.ts',
            'lib.es2015.iterable.d.ts',
            'lib.es2015.promise.d.ts',
            'lib.es2015.proxy.d.ts',
            'lib.es2015.reflect.d.ts',
            'lib.es2015.symbol.d.ts',
            'lib.es2015.symbol.wellknown.d.ts',
            'lib.es2016.array.include.d.ts',
            'lib.es2016.d.ts',
            'lib.es2016.full.d.ts',
            'lib.es2017.d.ts',
            'lib.es2017.full.d.ts',
            'lib.es2017.intl.d.ts',
            'lib.es2017.object.d.ts',
            'lib.es2017.sharedmemory.d.ts',
            'lib.es2017.string.d.ts',
            'lib.es2017.typedarrays.d.ts',
            'lib.es2018.asyncgenerator.d.ts',
            'lib.es2018.asynciterable.d.ts',
            'lib.es2018.d.ts',
            'lib.es2018.full.d.ts',
            'lib.es2018.intl.d.ts',
            'lib.es2018.promise.d.ts',
            'lib.es2018.regexp.d.ts',
            'lib.es2019.array.d.ts',
            'lib.es2019.d.ts',
            'lib.es2019.full.d.ts',
            'lib.es2019.object.d.ts',
            'lib.es2019.string.d.ts',
            'lib.es2019.symbol.d.ts',
            'lib.es2020.d.ts',
            'lib.es2020.full.d.ts',
            'lib.es2020.string.d.ts',
            'lib.es2020.symbol.wellknown.d.ts',
            'lib.esnext.array.d.ts',
            'lib.esnext.asynciterable.d.ts',
            'lib.esnext.bigint.d.ts',
            'lib.esnext.d.ts',
            'lib.esnext.full.d.ts',
            'lib.esnext.intl.d.ts',
            'lib.esnext.symbol.d.ts',
        ];
        const targetToCut = ts.ScriptTarget[target];
        const matches = files.filter((f) => f.startsWith(`lib.${targetToCut.toLowerCase()}`));
        const targetCutIndex = files.indexOf(matches.pop());
        const getMax = (array) => array && array.length ? array.reduce((max, current) => (current > max ? current : max)) : undefined;
        // Find the index for everything in
        const indexesForCutting = lib.map((lib) => {
            const matches = files.filter((f) => f.startsWith(`lib.${lib.toLowerCase()}`));
            if (matches.length === 0)
                return 0;
            const cutIndex = files.indexOf(matches.pop());
            return cutIndex;
        });
        const libCutIndex = getMax(indexesForCutting) || 0;
        const finalCutIndex = Math.max(targetCutIndex, libCutIndex);
        return files.slice(0, finalCutIndex + 1);
    };
    /**
     * Sets up a Map with lib contents by grabbing the necessary files from
     * the local copy of typescript via the file system.
     */
    exports.createDefaultMapFromNodeModules = (compilerOptions) => {
        const ts = require('typescript');
        const path = require('path');
        const fs = require('fs');
        const getLib = (name) => {
            const lib = path.dirname(require.resolve('typescript'));
            return fs.readFileSync(path.join(lib, name), 'utf8');
        };
        const libs = exports.knownLibFilesForCompilerOptions(compilerOptions, ts);
        const fsMap = new Map();
        libs.forEach((lib) => {
            fsMap.set('/' + lib, getLib(lib));
        });
        return fsMap;
    };
    /**
     * Create a virtual FS Map with the lib files from a particular TypeScript
     * version based on the target, Always includes dom ATM.
     *
     * @param options The compiler target, which dictates the libs to set up
     * @param version the versions of TypeScript which are supported
     * @param cache should the values be stored in local storage
     * @param ts a copy of the typescript import
     * @param lzstring an optional copy of the lz-string import
     * @param fetcher an optional replacement for the global fetch function (tests mainly)
     * @param storer an optional replacement for the localStorage global (tests mainly)
     */
    exports.createDefaultMapFromCDN = (options, version, cache, ts, lzstring, fetcher, storer) => {
        const fetchlike = fetcher || fetch;
        const storelike = storer || localStorage;
        const fsMap = new Map();
        const files = exports.knownLibFilesForCompilerOptions(options, ts);
        const prefix = `https://typescript.azureedge.net/cdn/${version}/typescript/lib/`;
        function zip(str) {
            return lzstring ? lzstring.compressToUTF16(str) : str;
        }
        function unzip(str) {
            return lzstring ? lzstring.decompressFromUTF16(str) : str;
        }
        // Map the known libs to a node fetch promise, then return the contents
        function uncached() {
            return Promise.all(files.map((lib) => fetchlike(prefix + lib).then((resp) => resp.text()))).then((contents) => {
                contents.forEach((text, index) => fsMap.set('/' + files[index], text));
            });
        }
        // A localstorage and lzzip aware version of the lib files
        function cached() {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                // Remove anything which isn't from this version
                if (key.startsWith('ts-lib-') && !key.startsWith('ts-lib-' + version)) {
                    storelike.removeItem(key);
                }
            });
            return Promise.all(files.map((lib) => {
                const cacheKey = `ts-lib-${version}-${lib}`;
                const content = storelike.getItem(cacheKey);
                if (!content) {
                    // Make the API call and store the text concent in the cache
                    return fetchlike(prefix + lib)
                        .then((resp) => resp.text())
                        .then((t) => {
                        storelike.setItem(cacheKey, zip(t));
                        return t;
                    });
                }
                else {
                    return Promise.resolve(unzip(content));
                }
            })).then((contents) => {
                contents.forEach((text, index) => {
                    const name = '/' + files[index];
                    fsMap.set(name, text);
                });
            });
        }
        const func = cache ? cached : uncached;
        return func().then(() => fsMap);
    };
    // TODO: Add some kind of debug logger (needs to be compat with sandbox's deployment, not just via npm)
    function notImplemented(methodName) {
        throw new Error(`Method '${methodName}' is not implemented.`);
    }
    function audit(name, fn) {
        return (...args) => {
            const res = fn(...args);
            const smallres = typeof res === 'string' ? res.slice(0, 80) + '...' : res;
            debugLog('> ' + name, ...args);
            debugLog('< ' + smallres);
            return res;
        };
    }
    /** The default compiler options if TypeScript could ever change the compiler options */
    const defaultCompilerOptions = (ts) => {
        return Object.assign(Object.assign({}, ts.getDefaultCompilerOptions()), { jsx: ts.JsxEmit.React, strict: true, esModuleInterop: true, module: ts.ModuleKind.ESNext, suppressOutputPathCheck: true, skipLibCheck: true, skipDefaultLibCheck: true, moduleResolution: ts.ModuleResolutionKind.NodeJs });
    };
    // "/DOM.d.ts" => "/lib.dom.d.ts"
    const libize = (path) => path.replace('/', '/lib.').toLowerCase();
    /**
     * Creates an in-memory System object which can be used in a TypeScript program, this
     * is what provides read/write aspects of the virtual fs
     */
    function createSystem(files) {
        files = new Map(files);
        return {
            args: [],
            createDirectory: () => notImplemented('createDirectory'),
            // TODO: could make a real file tree
            directoryExists: audit('directoryExists', (directory) => {
                return Array.from(files.keys()).some((path) => path.startsWith(directory));
            }),
            exit: () => notImplemented('exit'),
            fileExists: audit('fileExists', (fileName) => files.has(fileName) || files.has(libize(fileName))),
            getCurrentDirectory: () => '/',
            getDirectories: () => [],
            getExecutingFilePath: () => notImplemented('getExecutingFilePath'),
            readDirectory: audit('readDirectory', (directory) => (directory === '/' ? Array.from(files.keys()) : [])),
            readFile: audit('readFile', (fileName) => files.get(fileName) || files.get(libize(fileName))),
            resolvePath: (path) => path,
            newLine: '\n',
            useCaseSensitiveFileNames: true,
            write: () => notImplemented('write'),
            writeFile: (fileName, contents) => {
                files.set(fileName, contents);
            },
        };
    }
    exports.createSystem = createSystem;
    /**
     * Creates an in-memory CompilerHost -which is essentially an extra wrapper to System
     * which works with TypeScript objects - returns both a compiler host, and a way to add new SourceFile
     * instances to the in-memory file system.
     */
    function createVirtualCompilerHost(sys, compilerOptions, ts) {
        const sourceFiles = new Map();
        const save = (sourceFile) => {
            sourceFiles.set(sourceFile.fileName, sourceFile);
            return sourceFile;
        };
        const vHost = {
            compilerHost: Object.assign(Object.assign({}, sys), { getCanonicalFileName: (fileName) => fileName, getDefaultLibFileName: () => '/' + ts.getDefaultLibFileName(compilerOptions), 
                // getDefaultLibLocation: () => '/',
                getDirectories: () => [], getNewLine: () => sys.newLine, getSourceFile: (fileName) => {
                    return (sourceFiles.get(fileName) ||
                        save(ts.createSourceFile(fileName, sys.readFile(fileName), compilerOptions.target || defaultCompilerOptions(ts).target, false)));
                }, useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames }),
            updateFile: (sourceFile) => {
                const alreadyExists = sourceFiles.has(sourceFile.fileName);
                sys.writeFile(sourceFile.fileName, sourceFile.text);
                sourceFiles.set(sourceFile.fileName, sourceFile);
                return alreadyExists;
            },
        };
        return vHost;
    }
    exports.createVirtualCompilerHost = createVirtualCompilerHost;
    /**
     * Creates an object which can host a language service against the virtual file-system
     */
    function createVirtualLanguageServiceHost(sys, rootFiles, compilerOptions, ts) {
        const fileNames = [...rootFiles];
        const { compilerHost, updateFile } = createVirtualCompilerHost(sys, compilerOptions, ts);
        const fileVersions = new Map();
        let projectVersion = 0;
        const languageServiceHost = Object.assign(Object.assign({}, compilerHost), { getProjectVersion: () => projectVersion.toString(), getCompilationSettings: () => compilerOptions, getScriptFileNames: () => fileNames, getScriptSnapshot: (fileName) => {
                const contents = sys.readFile(fileName);
                if (contents) {
                    return ts.ScriptSnapshot.fromString(contents);
                }
                return;
            }, getScriptVersion: (fileName) => {
                return fileVersions.get(fileName) || '0';
            }, writeFile: sys.writeFile });
        const lsHost = {
            languageServiceHost,
            updateFile: (sourceFile) => {
                projectVersion++;
                fileVersions.set(sourceFile.fileName, projectVersion.toString());
                if (!fileNames.includes(sourceFile.fileName)) {
                    fileNames.push(sourceFile.fileName);
                }
                updateFile(sourceFile);
            },
        };
        return lsHost;
    }
    exports.createVirtualLanguageServiceHost = createVirtualLanguageServiceHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC12ZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zYW5kYm94L3NyYy92ZW5kb3IvdHlwZXNjcmlwdC12ZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQU9BLE1BQU0sZUFBZSxHQUFHLE9BQU8sWUFBWSxLQUFLLFdBQVcsQ0FBQTtJQUMzRCxNQUFNLFVBQVUsR0FBRyxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUE7SUFDakQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxlQUFlLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDM0csTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQWMsRUFBRSxHQUFHLGVBQXNCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQTtJQVU5Rjs7Ozs7Ozs7T0FRRztJQUVILFNBQWdCLGtDQUFrQyxDQUNoRCxHQUFXLEVBQ1gsU0FBbUIsRUFDbkIsRUFBTSxFQUNOLGtCQUFtQyxFQUFFO1FBRXJDLE1BQU0sa0JBQWtCLG1DQUFRLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxHQUFLLGVBQWUsQ0FBRSxDQUFBO1FBRWhGLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsR0FBRyxnQ0FBZ0MsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3BILE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3JFLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFBO1FBRW5FLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUN0QixNQUFNLFlBQVksR0FB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Q0FBQyxTQUFTLEVBQ25DLGlCQUFpQixFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzlCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQ3ZDLElBQUksUUFBUSxFQUFFO29CQUNaLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQzlDO2dCQUNELE9BQU07WUFDUixDQUFDLEVBQ0QsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDN0IsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQTtZQUMxQyxDQUFDLEVBQ0QsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQ3pCLENBQUE7UUFPRCxNQUFNLE1BQU0sR0FBVztZQUNyQixtQkFBbUI7WUFDbkIsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3pCLGNBQWMsRUFBRSxDQUFBO2dCQUNoQixZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ2hFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDNUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3BDO2dCQUNELFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN4QixDQUFDO1NBQ0YsQ0FBQTtRQUNELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQTdDRCw0RUE2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFN5c3RlbSA9IGltcG9ydCgndHlwZXNjcmlwdCcpLlN5c3RlbVxudHlwZSBDb21waWxlck9wdGlvbnMgPSBpbXBvcnQoJ3R5cGVzY3JpcHQnKS5Db21waWxlck9wdGlvbnNcbnR5cGUgTGFuZ3VhZ2VTZXJ2aWNlSG9zdCA9IGltcG9ydCgndHlwZXNjcmlwdCcpLkxhbmd1YWdlU2VydmljZUhvc3RcbnR5cGUgQ29tcGlsZXJIb3N0ID0gaW1wb3J0KCd0eXBlc2NyaXB0JykuQ29tcGlsZXJIb3N0XG50eXBlIFNvdXJjZUZpbGUgPSBpbXBvcnQoJ3R5cGVzY3JpcHQnKS5Tb3VyY2VGaWxlXG50eXBlIFRTID0gdHlwZW9mIGltcG9ydCgndHlwZXNjcmlwdCcpXG5cbmNvbnN0IGhhc0xvY2FsU3RvcmFnZSA9IHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IGB1bmRlZmluZWRgXG5jb25zdCBoYXNQcm9jZXNzID0gdHlwZW9mIHByb2Nlc3MgIT09IGB1bmRlZmluZWRgXG5jb25zdCBzaG91bGREZWJ1ZyA9IChoYXNMb2NhbFN0b3JhZ2UgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0RFQlVHJykpIHx8IChoYXNQcm9jZXNzICYmIHByb2Nlc3MuZW52LkRFQlVHKVxuY29uc3QgZGVidWdMb2cgPSBzaG91bGREZWJ1ZyA/IGNvbnNvbGUubG9nIDogKF9tZXNzYWdlPzogYW55LCAuLi5fb3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiAnJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFZpcnR1YWxUeXBlU2NyaXB0RW52aXJvbm1lbnQge1xuICBzeXM6IFN5c3RlbVxuICBsYW5ndWFnZVNlcnZpY2U6IGltcG9ydCgndHlwZXNjcmlwdCcpLkxhbmd1YWdlU2VydmljZVxuICBnZXRTb3VyY2VGaWxlOiAoZmlsZU5hbWU6IHN0cmluZykgPT4gaW1wb3J0KCd0eXBlc2NyaXB0JykuU291cmNlRmlsZSB8IHVuZGVmaW5lZFxuICBjcmVhdGVGaWxlOiAoZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nKSA9PiB2b2lkXG4gIHVwZGF0ZUZpbGU6IChmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIHJlcGxhY2VUZXh0U3Bhbj86IGltcG9ydCgndHlwZXNjcmlwdCcpLlRleHRTcGFuKSA9PiB2b2lkXG59XG5cbi8qKlxuICogTWFrZXMgYSB2aXJ0dWFsIGNvcHkgb2YgdGhlIFR5cGVTY3JpcHQgZW52aXJvbm1lbnQuIFRoaXMgaXMgdGhlIG1haW4gQVBJIHlvdSB3YW50IHRvIGJlIHVzaW5nIHdpdGhcbiAqIEB0eXBlc2NyaXB0L3Zmcy4gQSBsb3Qgb2YgdGhlIG90aGVyIGV4cG9zZWQgZnVuY3Rpb25zIGFyZSB1c2VkIGJ5IHRoaXMgZnVuY3Rpb24gdG8gZ2V0IHNldCB1cC5cbiAqXG4gKiBAcGFyYW0gc3lzIGFuIG9iamVjdCB3aGljaCBjb25mb3JtcyB0byB0aGUgVFMgU3lzIChhIHNoaW0gb3ZlciByZWFkL3dyaXRlIGFjY2VzcyB0byB0aGUgZnMpXG4gKiBAcGFyYW0gcm9vdEZpbGVzIGEgbGlzdCBvZiBmaWxlcyB3aGljaCBhcmUgY29uc2lkZXJlZCBpbnNpZGUgdGhlIHByb2plY3RcbiAqIEBwYXJhbSB0cyBhIGNvcHkgcGYgdGhlIFR5cGVTY3JpcHQgbW9kdWxlXG4gKiBAcGFyYW0gY29tcGlsZXJPcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGlzIGNvbXBpbGVyIHJ1blxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsVHlwZVNjcmlwdEVudmlyb25tZW50KFxuICBzeXM6IFN5c3RlbSxcbiAgcm9vdEZpbGVzOiBzdHJpbmdbXSxcbiAgdHM6IFRTLFxuICBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyA9IHt9XG4pOiBWaXJ0dWFsVHlwZVNjcmlwdEVudmlyb25tZW50IHtcbiAgY29uc3QgbWVyZ2VkQ29tcGlsZXJPcHRzID0geyAuLi5kZWZhdWx0Q29tcGlsZXJPcHRpb25zKHRzKSwgLi4uY29tcGlsZXJPcHRpb25zIH1cblxuICBjb25zdCB7IGxhbmd1YWdlU2VydmljZUhvc3QsIHVwZGF0ZUZpbGUgfSA9IGNyZWF0ZVZpcnR1YWxMYW5ndWFnZVNlcnZpY2VIb3N0KHN5cywgcm9vdEZpbGVzLCBtZXJnZWRDb21waWxlck9wdHMsIHRzKVxuICBjb25zdCBsYW5ndWFnZVNlcnZpY2UgPSB0cy5jcmVhdGVMYW5ndWFnZVNlcnZpY2UobGFuZ3VhZ2VTZXJ2aWNlSG9zdClcbiAgY29uc3QgZGlhZ25vc3RpY3MgPSBsYW5ndWFnZVNlcnZpY2UuZ2V0Q29tcGlsZXJPcHRpb25zRGlhZ25vc3RpY3MoKVxuXG4gIGlmIChkaWFnbm9zdGljcy5sZW5ndGgpIHtcbiAgICBjb25zdCBjb21waWxlckhvc3QgPSBjcmVhdGVWaXJ0dWFsQ29tcGlsZXJIb3N0KHN5cywgY29tcGlsZXJPcHRpb25zLCB0cylcbiAgICB0aHJvdyBuZXcgRXJyb3IodHMuZm9ybWF0RGlhZ25vc3RpY3MoZGlhZ25vc3RpY3MsIGNvbXBpbGVySG9zdC5jb21waWxlckhvc3QpKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzeXMsXG4gICAgbGFuZ3VhZ2VTZXJ2aWNlLFxuICAgIGdldFNvdXJjZUZpbGU6IChmaWxlTmFtZSkgPT4gbGFuZ3VhZ2VTZXJ2aWNlLmdldFByb2dyYW0oKT8uZ2V0U291cmNlRmlsZShmaWxlTmFtZSksXG5cbiAgICBjcmVhdGVGaWxlOiAoZmlsZU5hbWUsIGNvbnRlbnQpID0+IHtcbiAgICAgIHVwZGF0ZUZpbGUodHMuY3JlYXRlU291cmNlRmlsZShmaWxlTmFtZSwgY29udGVudCwgbWVyZ2VkQ29tcGlsZXJPcHRzLnRhcmdldCEsIGZhbHNlKSlcbiAgICB9LFxuICAgIHVwZGF0ZUZpbGU6IChmaWxlTmFtZSwgY29udGVudCwgb3B0UHJldlRleHRTcGFuKSA9PiB7XG4gICAgICBjb25zdCBwcmV2U291cmNlRmlsZSA9IGxhbmd1YWdlU2VydmljZS5nZXRQcm9ncmFtKCkhLmdldFNvdXJjZUZpbGUoZmlsZU5hbWUpIVxuICAgICAgY29uc3QgcHJldkZ1bGxDb250ZW50cyA9IHByZXZTb3VyY2VGaWxlLnRleHRcblxuICAgICAgLy8gVE9ETzogVmFsaWRhdGUgaWYgdGhlIGRlZmF1bHQgdGV4dCBzcGFuIGhhcyBhIGZlbmNlcG9zdCBlcnJvcj9cbiAgICAgIGNvbnN0IHByZXZUZXh0U3BhbiA9IG9wdFByZXZUZXh0U3BhbiA/PyB0cy5jcmVhdGVUZXh0U3BhbigwLCBwcmV2RnVsbENvbnRlbnRzLmxlbmd0aClcbiAgICAgIGNvbnN0IG5ld1RleHQgPVxuICAgICAgICBwcmV2RnVsbENvbnRlbnRzLnNsaWNlKDAsIHByZXZUZXh0U3Bhbi5zdGFydCkgK1xuICAgICAgICBjb250ZW50ICtcbiAgICAgICAgcHJldkZ1bGxDb250ZW50cy5zbGljZShwcmV2VGV4dFNwYW4uc3RhcnQgKyBwcmV2VGV4dFNwYW4ubGVuZ3RoKVxuICAgICAgY29uc3QgbmV3U291cmNlRmlsZSA9IHRzLnVwZGF0ZVNvdXJjZUZpbGUocHJldlNvdXJjZUZpbGUsIG5ld1RleHQsIHtcbiAgICAgICAgc3BhbjogcHJldlRleHRTcGFuLFxuICAgICAgICBuZXdMZW5ndGg6IGNvbnRlbnQubGVuZ3RoLFxuICAgICAgfSlcblxuICAgICAgdXBkYXRlRmlsZShuZXdTb3VyY2VGaWxlKVxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBHcmFiIHRoZSBsaXN0IG9mIGxpYiBmaWxlcyBmb3IgYSBwYXJ0aWN1bGFyIHRhcmdldCwgd2lsbCByZXR1cm4gYSBiaXQgbW9yZSB0aGFuIG5lY2Vzc2FyeSAoYnkgaW5jbHVkaW5nXG4gKiB0aGUgZG9tKSBidXQgdGhhdCdzIE9LXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgY29tcGlsZXIgc2V0dGluZ3MgdGFyZ2V0IGJhc2VsaW5lXG4gKiBAcGFyYW0gdHMgQSBjb3B5IG9mIHRoZSBUeXBlU2NyaXB0IG1vZHVsZVxuICovXG5leHBvcnQgY29uc3Qga25vd25MaWJGaWxlc0ZvckNvbXBpbGVyT3B0aW9ucyA9IChjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucywgdHM6IFRTKSA9PiB7XG4gIGNvbnN0IHRhcmdldCA9IGNvbXBpbGVyT3B0aW9ucy50YXJnZXQgfHwgdHMuU2NyaXB0VGFyZ2V0LkVTNVxuICBjb25zdCBsaWIgPSBjb21waWxlck9wdGlvbnMubGliIHx8IFtdXG5cbiAgY29uc3QgZmlsZXMgPSBbXG4gICAgJ2xpYi5kLnRzJyxcbiAgICAnbGliLmRvbS5kLnRzJyxcbiAgICAnbGliLmRvbS5pdGVyYWJsZS5kLnRzJyxcbiAgICAnbGliLndlYndvcmtlci5kLnRzJyxcbiAgICAnbGliLndlYndvcmtlci5pbXBvcnRzY3JpcHRzLmQudHMnLFxuICAgICdsaWIuc2NyaXB0aG9zdC5kLnRzJyxcbiAgICAnbGliLmVzNS5kLnRzJyxcbiAgICAnbGliLmVzNi5kLnRzJyxcbiAgICAnbGliLmVzMjAxNS5jb2xsZWN0aW9uLmQudHMnLFxuICAgICdsaWIuZXMyMDE1LmNvcmUuZC50cycsXG4gICAgJ2xpYi5lczIwMTUuZC50cycsXG4gICAgJ2xpYi5lczIwMTUuZ2VuZXJhdG9yLmQudHMnLFxuICAgICdsaWIuZXMyMDE1Lml0ZXJhYmxlLmQudHMnLFxuICAgICdsaWIuZXMyMDE1LnByb21pc2UuZC50cycsXG4gICAgJ2xpYi5lczIwMTUucHJveHkuZC50cycsXG4gICAgJ2xpYi5lczIwMTUucmVmbGVjdC5kLnRzJyxcbiAgICAnbGliLmVzMjAxNS5zeW1ib2wuZC50cycsXG4gICAgJ2xpYi5lczIwMTUuc3ltYm9sLndlbGxrbm93bi5kLnRzJyxcbiAgICAnbGliLmVzMjAxNi5hcnJheS5pbmNsdWRlLmQudHMnLFxuICAgICdsaWIuZXMyMDE2LmQudHMnLFxuICAgICdsaWIuZXMyMDE2LmZ1bGwuZC50cycsXG4gICAgJ2xpYi5lczIwMTcuZC50cycsXG4gICAgJ2xpYi5lczIwMTcuZnVsbC5kLnRzJyxcbiAgICAnbGliLmVzMjAxNy5pbnRsLmQudHMnLFxuICAgICdsaWIuZXMyMDE3Lm9iamVjdC5kLnRzJyxcbiAgICAnbGliLmVzMjAxNy5zaGFyZWRtZW1vcnkuZC50cycsXG4gICAgJ2xpYi5lczIwMTcuc3RyaW5nLmQudHMnLFxuICAgICdsaWIuZXMyMDE3LnR5cGVkYXJyYXlzLmQudHMnLFxuICAgICdsaWIuZXMyMDE4LmFzeW5jZ2VuZXJhdG9yLmQudHMnLFxuICAgICdsaWIuZXMyMDE4LmFzeW5jaXRlcmFibGUuZC50cycsXG4gICAgJ2xpYi5lczIwMTguZC50cycsXG4gICAgJ2xpYi5lczIwMTguZnVsbC5kLnRzJyxcbiAgICAnbGliLmVzMjAxOC5pbnRsLmQudHMnLFxuICAgICdsaWIuZXMyMDE4LnByb21pc2UuZC50cycsXG4gICAgJ2xpYi5lczIwMTgucmVnZXhwLmQudHMnLFxuICAgICdsaWIuZXMyMDE5LmFycmF5LmQudHMnLFxuICAgICdsaWIuZXMyMDE5LmQudHMnLFxuICAgICdsaWIuZXMyMDE5LmZ1bGwuZC50cycsXG4gICAgJ2xpYi5lczIwMTkub2JqZWN0LmQudHMnLFxuICAgICdsaWIuZXMyMDE5LnN0cmluZy5kLnRzJyxcbiAgICAnbGliLmVzMjAxOS5zeW1ib2wuZC50cycsXG4gICAgJ2xpYi5lczIwMjAuZC50cycsXG4gICAgJ2xpYi5lczIwMjAuZnVsbC5kLnRzJyxcbiAgICAnbGliLmVzMjAyMC5zdHJpbmcuZC50cycsXG4gICAgJ2xpYi5lczIwMjAuc3ltYm9sLndlbGxrbm93bi5kLnRzJyxcbiAgICAnbGliLmVzbmV4dC5hcnJheS5kLnRzJyxcbiAgICAnbGliLmVzbmV4dC5hc3luY2l0ZXJhYmxlLmQudHMnLFxuICAgICdsaWIuZXNuZXh0LmJpZ2ludC5kLnRzJyxcbiAgICAnbGliLmVzbmV4dC5kLnRzJyxcbiAgICAnbGliLmVzbmV4dC5mdWxsLmQudHMnLFxuICAgICdsaWIuZXNuZXh0LmludGwuZC50cycsXG4gICAgJ2xpYi5lc25leHQuc3ltYm9sLmQudHMnLFxuICBdXG5cbiAgY29uc3QgdGFyZ2V0VG9DdXQgPSB0cy5TY3JpcHRUYXJnZXRbdGFyZ2V0XVxuICBjb25zdCBtYXRjaGVzID0gZmlsZXMuZmlsdGVyKChmKSA9PiBmLnN0YXJ0c1dpdGgoYGxpYi4ke3RhcmdldFRvQ3V0LnRvTG93ZXJDYXNlKCl9YCkpXG4gIGNvbnN0IHRhcmdldEN1dEluZGV4ID0gZmlsZXMuaW5kZXhPZihtYXRjaGVzLnBvcCgpISlcblxuICBjb25zdCBnZXRNYXggPSAoYXJyYXk6IG51bWJlcltdKSA9PlxuICAgIGFycmF5ICYmIGFycmF5Lmxlbmd0aCA/IGFycmF5LnJlZHVjZSgobWF4LCBjdXJyZW50KSA9PiAoY3VycmVudCA+IG1heCA/IGN1cnJlbnQgOiBtYXgpKSA6IHVuZGVmaW5lZFxuXG4gIC8vIEZpbmQgdGhlIGluZGV4IGZvciBldmVyeXRoaW5nIGluXG4gIGNvbnN0IGluZGV4ZXNGb3JDdXR0aW5nID0gbGliLm1hcCgobGliKSA9PiB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGZpbGVzLmZpbHRlcigoZikgPT4gZi5zdGFydHNXaXRoKGBsaWIuJHtsaWIudG9Mb3dlckNhc2UoKX1gKSlcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgICBjb25zdCBjdXRJbmRleCA9IGZpbGVzLmluZGV4T2YobWF0Y2hlcy5wb3AoKSEpXG4gICAgcmV0dXJuIGN1dEluZGV4XG4gIH0pXG5cbiAgY29uc3QgbGliQ3V0SW5kZXggPSBnZXRNYXgoaW5kZXhlc0ZvckN1dHRpbmcpIHx8IDBcblxuICBjb25zdCBmaW5hbEN1dEluZGV4ID0gTWF0aC5tYXgodGFyZ2V0Q3V0SW5kZXgsIGxpYkN1dEluZGV4KVxuICByZXR1cm4gZmlsZXMuc2xpY2UoMCwgZmluYWxDdXRJbmRleCArIDEpXG59XG5cbi8qKlxuICogU2V0cyB1cCBhIE1hcCB3aXRoIGxpYiBjb250ZW50cyBieSBncmFiYmluZyB0aGUgbmVjZXNzYXJ5IGZpbGVzIGZyb21cbiAqIHRoZSBsb2NhbCBjb3B5IG9mIHR5cGVzY3JpcHQgdmlhIHRoZSBmaWxlIHN5c3RlbS5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZURlZmF1bHRNYXBGcm9tTm9kZU1vZHVsZXMgPSAoY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnMpID0+IHtcbiAgY29uc3QgdHMgPSByZXF1aXJlKCd0eXBlc2NyaXB0JylcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuICBjb25zdCBnZXRMaWIgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbGliID0gcGF0aC5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZSgndHlwZXNjcmlwdCcpKVxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGxpYiwgbmFtZSksICd1dGY4JylcbiAgfVxuXG4gIGNvbnN0IGxpYnMgPSBrbm93bkxpYkZpbGVzRm9yQ29tcGlsZXJPcHRpb25zKGNvbXBpbGVyT3B0aW9ucywgdHMpXG4gIGNvbnN0IGZzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKVxuICBsaWJzLmZvckVhY2goKGxpYikgPT4ge1xuICAgIGZzTWFwLnNldCgnLycgKyBsaWIsIGdldExpYihsaWIpKVxuICB9KVxuICByZXR1cm4gZnNNYXBcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSB2aXJ0dWFsIEZTIE1hcCB3aXRoIHRoZSBsaWIgZmlsZXMgZnJvbSBhIHBhcnRpY3VsYXIgVHlwZVNjcmlwdFxuICogdmVyc2lvbiBiYXNlZCBvbiB0aGUgdGFyZ2V0LCBBbHdheXMgaW5jbHVkZXMgZG9tIEFUTS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgY29tcGlsZXIgdGFyZ2V0LCB3aGljaCBkaWN0YXRlcyB0aGUgbGlicyB0byBzZXQgdXBcbiAqIEBwYXJhbSB2ZXJzaW9uIHRoZSB2ZXJzaW9ucyBvZiBUeXBlU2NyaXB0IHdoaWNoIGFyZSBzdXBwb3J0ZWRcbiAqIEBwYXJhbSBjYWNoZSBzaG91bGQgdGhlIHZhbHVlcyBiZSBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZVxuICogQHBhcmFtIHRzIGEgY29weSBvZiB0aGUgdHlwZXNjcmlwdCBpbXBvcnRcbiAqIEBwYXJhbSBsenN0cmluZyBhbiBvcHRpb25hbCBjb3B5IG9mIHRoZSBsei1zdHJpbmcgaW1wb3J0XG4gKiBAcGFyYW0gZmV0Y2hlciBhbiBvcHRpb25hbCByZXBsYWNlbWVudCBmb3IgdGhlIGdsb2JhbCBmZXRjaCBmdW5jdGlvbiAodGVzdHMgbWFpbmx5KVxuICogQHBhcmFtIHN0b3JlciBhbiBvcHRpb25hbCByZXBsYWNlbWVudCBmb3IgdGhlIGxvY2FsU3RvcmFnZSBnbG9iYWwgKHRlc3RzIG1haW5seSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZURlZmF1bHRNYXBGcm9tQ0ROID0gKFxuICBvcHRpb25zOiBDb21waWxlck9wdGlvbnMsXG4gIHZlcnNpb246IHN0cmluZyxcbiAgY2FjaGU6IGJvb2xlYW4sXG4gIHRzOiBUUyxcbiAgbHpzdHJpbmc/OiB0eXBlb2YgaW1wb3J0KCdsei1zdHJpbmcnKSxcbiAgZmV0Y2hlcj86IHR5cGVvZiBmZXRjaCxcbiAgc3RvcmVyPzogdHlwZW9mIGxvY2FsU3RvcmFnZVxuKSA9PiB7XG4gIGNvbnN0IGZldGNobGlrZSA9IGZldGNoZXIgfHwgZmV0Y2hcbiAgY29uc3Qgc3RvcmVsaWtlID0gc3RvcmVyIHx8IGxvY2FsU3RvcmFnZVxuICBjb25zdCBmc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KClcbiAgY29uc3QgZmlsZXMgPSBrbm93bkxpYkZpbGVzRm9yQ29tcGlsZXJPcHRpb25zKG9wdGlvbnMsIHRzKVxuICBjb25zdCBwcmVmaXggPSBgaHR0cHM6Ly90eXBlc2NyaXB0LmF6dXJlZWRnZS5uZXQvY2RuLyR7dmVyc2lvbn0vdHlwZXNjcmlwdC9saWIvYFxuXG4gIGZ1bmN0aW9uIHppcChzdHI6IHN0cmluZykge1xuICAgIHJldHVybiBsenN0cmluZyA/IGx6c3RyaW5nLmNvbXByZXNzVG9VVEYxNihzdHIpIDogc3RyXG4gIH1cblxuICBmdW5jdGlvbiB1bnppcChzdHI6IHN0cmluZykge1xuICAgIHJldHVybiBsenN0cmluZyA/IGx6c3RyaW5nLmRlY29tcHJlc3NGcm9tVVRGMTYoc3RyKSA6IHN0clxuICB9XG5cbiAgLy8gTWFwIHRoZSBrbm93biBsaWJzIHRvIGEgbm9kZSBmZXRjaCBwcm9taXNlLCB0aGVuIHJldHVybiB0aGUgY29udGVudHNcbiAgZnVuY3Rpb24gdW5jYWNoZWQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGZpbGVzLm1hcCgobGliKSA9PiBmZXRjaGxpa2UocHJlZml4ICsgbGliKS50aGVuKChyZXNwKSA9PiByZXNwLnRleHQoKSkpKS50aGVuKChjb250ZW50cykgPT4ge1xuICAgICAgY29udGVudHMuZm9yRWFjaCgodGV4dCwgaW5kZXgpID0+IGZzTWFwLnNldCgnLycgKyBmaWxlc1tpbmRleF0sIHRleHQpKVxuICAgIH0pXG4gIH1cblxuICAvLyBBIGxvY2Fsc3RvcmFnZSBhbmQgbHp6aXAgYXdhcmUgdmVyc2lvbiBvZiB0aGUgbGliIGZpbGVzXG4gIGZ1bmN0aW9uIGNhY2hlZCgpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKVxuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAvLyBSZW1vdmUgYW55dGhpbmcgd2hpY2ggaXNuJ3QgZnJvbSB0aGlzIHZlcnNpb25cbiAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgndHMtbGliLScpICYmICFrZXkuc3RhcnRzV2l0aCgndHMtbGliLScgKyB2ZXJzaW9uKSkge1xuICAgICAgICBzdG9yZWxpa2UucmVtb3ZlSXRlbShrZXkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIGZpbGVzLm1hcCgobGliKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gYHRzLWxpYi0ke3ZlcnNpb259LSR7bGlifWBcbiAgICAgICAgY29uc3QgY29udGVudCA9IHN0b3JlbGlrZS5nZXRJdGVtKGNhY2hlS2V5KVxuXG4gICAgICAgIGlmICghY29udGVudCkge1xuICAgICAgICAgIC8vIE1ha2UgdGhlIEFQSSBjYWxsIGFuZCBzdG9yZSB0aGUgdGV4dCBjb25jZW50IGluIHRoZSBjYWNoZVxuICAgICAgICAgIHJldHVybiBmZXRjaGxpa2UocHJlZml4ICsgbGliKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3ApID0+IHJlc3AudGV4dCgpKVxuICAgICAgICAgICAgLnRoZW4oKHQpID0+IHtcbiAgICAgICAgICAgICAgc3RvcmVsaWtlLnNldEl0ZW0oY2FjaGVLZXksIHppcCh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bnppcChjb250ZW50KSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApLnRoZW4oKGNvbnRlbnRzKSA9PiB7XG4gICAgICBjb250ZW50cy5mb3JFYWNoKCh0ZXh0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gJy8nICsgZmlsZXNbaW5kZXhdXG4gICAgICAgIGZzTWFwLnNldChuYW1lLCB0ZXh0KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgZnVuYyA9IGNhY2hlID8gY2FjaGVkIDogdW5jYWNoZWRcbiAgcmV0dXJuIGZ1bmMoKS50aGVuKCgpID0+IGZzTWFwKVxufVxuXG4vLyBUT0RPOiBBZGQgc29tZSBraW5kIG9mIGRlYnVnIGxvZ2dlciAobmVlZHMgdG8gYmUgY29tcGF0IHdpdGggc2FuZGJveCdzIGRlcGxveW1lbnQsIG5vdCBqdXN0IHZpYSBucG0pXG5cbmZ1bmN0aW9uIG5vdEltcGxlbWVudGVkKG1ldGhvZE5hbWU6IHN0cmluZyk6IGFueSB7XG4gIHRocm93IG5ldyBFcnJvcihgTWV0aG9kICcke21ldGhvZE5hbWV9JyBpcyBub3QgaW1wbGVtZW50ZWQuYClcbn1cblxuZnVuY3Rpb24gYXVkaXQ8QXJnc1QgZXh0ZW5kcyBhbnlbXSwgUmV0dXJuVD4oXG4gIG5hbWU6IHN0cmluZyxcbiAgZm46ICguLi5hcmdzOiBBcmdzVCkgPT4gUmV0dXJuVFxuKTogKC4uLmFyZ3M6IEFyZ3NUKSA9PiBSZXR1cm5UIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3QgcmVzID0gZm4oLi4uYXJncylcblxuICAgIGNvbnN0IHNtYWxscmVzID0gdHlwZW9mIHJlcyA9PT0gJ3N0cmluZycgPyByZXMuc2xpY2UoMCwgODApICsgJy4uLicgOiByZXNcbiAgICBkZWJ1Z0xvZygnPiAnICsgbmFtZSwgLi4uYXJncylcbiAgICBkZWJ1Z0xvZygnPCAnICsgc21hbGxyZXMpXG5cbiAgICByZXR1cm4gcmVzXG4gIH1cbn1cblxuLyoqIFRoZSBkZWZhdWx0IGNvbXBpbGVyIG9wdGlvbnMgaWYgVHlwZVNjcmlwdCBjb3VsZCBldmVyIGNoYW5nZSB0aGUgY29tcGlsZXIgb3B0aW9ucyAqL1xuY29uc3QgZGVmYXVsdENvbXBpbGVyT3B0aW9ucyA9ICh0czogdHlwZW9mIGltcG9ydCgndHlwZXNjcmlwdCcpKTogQ29tcGlsZXJPcHRpb25zID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi50cy5nZXREZWZhdWx0Q29tcGlsZXJPcHRpb25zKCksXG4gICAganN4OiB0cy5Kc3hFbWl0LlJlYWN0LFxuICAgIHN0cmljdDogdHJ1ZSxcbiAgICBlc01vZHVsZUludGVyb3A6IHRydWUsXG4gICAgbW9kdWxlOiB0cy5Nb2R1bGVLaW5kLkVTTmV4dCxcbiAgICBzdXBwcmVzc091dHB1dFBhdGhDaGVjazogdHJ1ZSxcbiAgICBza2lwTGliQ2hlY2s6IHRydWUsXG4gICAgc2tpcERlZmF1bHRMaWJDaGVjazogdHJ1ZSxcbiAgICBtb2R1bGVSZXNvbHV0aW9uOiB0cy5Nb2R1bGVSZXNvbHV0aW9uS2luZC5Ob2RlSnMsXG4gIH1cbn1cblxuLy8gXCIvRE9NLmQudHNcIiA9PiBcIi9saWIuZG9tLmQudHNcIlxuY29uc3QgbGliaXplID0gKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKCcvJywgJy9saWIuJykudG9Mb3dlckNhc2UoKVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gaW4tbWVtb3J5IFN5c3RlbSBvYmplY3Qgd2hpY2ggY2FuIGJlIHVzZWQgaW4gYSBUeXBlU2NyaXB0IHByb2dyYW0sIHRoaXNcbiAqIGlzIHdoYXQgcHJvdmlkZXMgcmVhZC93cml0ZSBhc3BlY3RzIG9mIHRoZSB2aXJ0dWFsIGZzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTeXN0ZW0oZmlsZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBTeXN0ZW0ge1xuICBmaWxlcyA9IG5ldyBNYXAoZmlsZXMpXG4gIHJldHVybiB7XG4gICAgYXJnczogW10sXG4gICAgY3JlYXRlRGlyZWN0b3J5OiAoKSA9PiBub3RJbXBsZW1lbnRlZCgnY3JlYXRlRGlyZWN0b3J5JyksXG4gICAgLy8gVE9ETzogY291bGQgbWFrZSBhIHJlYWwgZmlsZSB0cmVlXG4gICAgZGlyZWN0b3J5RXhpc3RzOiBhdWRpdCgnZGlyZWN0b3J5RXhpc3RzJywgKGRpcmVjdG9yeSkgPT4ge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZXMua2V5cygpKS5zb21lKChwYXRoKSA9PiBwYXRoLnN0YXJ0c1dpdGgoZGlyZWN0b3J5KSlcbiAgICB9KSxcbiAgICBleGl0OiAoKSA9PiBub3RJbXBsZW1lbnRlZCgnZXhpdCcpLFxuICAgIGZpbGVFeGlzdHM6IGF1ZGl0KCdmaWxlRXhpc3RzJywgKGZpbGVOYW1lKSA9PiBmaWxlcy5oYXMoZmlsZU5hbWUpIHx8IGZpbGVzLmhhcyhsaWJpemUoZmlsZU5hbWUpKSksXG4gICAgZ2V0Q3VycmVudERpcmVjdG9yeTogKCkgPT4gJy8nLFxuICAgIGdldERpcmVjdG9yaWVzOiAoKSA9PiBbXSxcbiAgICBnZXRFeGVjdXRpbmdGaWxlUGF0aDogKCkgPT4gbm90SW1wbGVtZW50ZWQoJ2dldEV4ZWN1dGluZ0ZpbGVQYXRoJyksXG4gICAgcmVhZERpcmVjdG9yeTogYXVkaXQoJ3JlYWREaXJlY3RvcnknLCAoZGlyZWN0b3J5KSA9PiAoZGlyZWN0b3J5ID09PSAnLycgPyBBcnJheS5mcm9tKGZpbGVzLmtleXMoKSkgOiBbXSkpLFxuICAgIHJlYWRGaWxlOiBhdWRpdCgncmVhZEZpbGUnLCAoZmlsZU5hbWUpID0+IGZpbGVzLmdldChmaWxlTmFtZSkgfHwgZmlsZXMuZ2V0KGxpYml6ZShmaWxlTmFtZSkpKSxcbiAgICByZXNvbHZlUGF0aDogKHBhdGgpID0+IHBhdGgsXG4gICAgbmV3TGluZTogJ1xcbicsXG4gICAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lczogdHJ1ZSxcbiAgICB3cml0ZTogKCkgPT4gbm90SW1wbGVtZW50ZWQoJ3dyaXRlJyksXG4gICAgd3JpdGVGaWxlOiAoZmlsZU5hbWUsIGNvbnRlbnRzKSA9PiB7XG4gICAgICBmaWxlcy5zZXQoZmlsZU5hbWUsIGNvbnRlbnRzKVxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGluLW1lbW9yeSBDb21waWxlckhvc3QgLXdoaWNoIGlzIGVzc2VudGlhbGx5IGFuIGV4dHJhIHdyYXBwZXIgdG8gU3lzdGVtXG4gKiB3aGljaCB3b3JrcyB3aXRoIFR5cGVTY3JpcHQgb2JqZWN0cyAtIHJldHVybnMgYm90aCBhIGNvbXBpbGVyIGhvc3QsIGFuZCBhIHdheSB0byBhZGQgbmV3IFNvdXJjZUZpbGVcbiAqIGluc3RhbmNlcyB0byB0aGUgaW4tbWVtb3J5IGZpbGUgc3lzdGVtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVmlydHVhbENvbXBpbGVySG9zdChzeXM6IFN5c3RlbSwgY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnMsIHRzOiBUUykge1xuICBjb25zdCBzb3VyY2VGaWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBTb3VyY2VGaWxlPigpXG4gIGNvbnN0IHNhdmUgPSAoc291cmNlRmlsZTogU291cmNlRmlsZSkgPT4ge1xuICAgIHNvdXJjZUZpbGVzLnNldChzb3VyY2VGaWxlLmZpbGVOYW1lLCBzb3VyY2VGaWxlKVxuICAgIHJldHVybiBzb3VyY2VGaWxlXG4gIH1cblxuICB0eXBlIFJldHVybiA9IHtcbiAgICBjb21waWxlckhvc3Q6IENvbXBpbGVySG9zdFxuICAgIHVwZGF0ZUZpbGU6IChzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKSA9PiBib29sZWFuXG4gIH1cblxuICBjb25zdCB2SG9zdDogUmV0dXJuID0ge1xuICAgIGNvbXBpbGVySG9zdDoge1xuICAgICAgLi4uc3lzLFxuICAgICAgZ2V0Q2Fub25pY2FsRmlsZU5hbWU6IChmaWxlTmFtZSkgPT4gZmlsZU5hbWUsXG4gICAgICBnZXREZWZhdWx0TGliRmlsZU5hbWU6ICgpID0+ICcvJyArIHRzLmdldERlZmF1bHRMaWJGaWxlTmFtZShjb21waWxlck9wdGlvbnMpLCAvLyAnL2xpYi5kLnRzJyxcbiAgICAgIC8vIGdldERlZmF1bHRMaWJMb2NhdGlvbjogKCkgPT4gJy8nLFxuICAgICAgZ2V0RGlyZWN0b3JpZXM6ICgpID0+IFtdLFxuICAgICAgZ2V0TmV3TGluZTogKCkgPT4gc3lzLm5ld0xpbmUsXG4gICAgICBnZXRTb3VyY2VGaWxlOiAoZmlsZU5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBzb3VyY2VGaWxlcy5nZXQoZmlsZU5hbWUpIHx8XG4gICAgICAgICAgc2F2ZShcbiAgICAgICAgICAgIHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgICAgICBzeXMucmVhZEZpbGUoZmlsZU5hbWUpISxcbiAgICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zLnRhcmdldCB8fCBkZWZhdWx0Q29tcGlsZXJPcHRpb25zKHRzKS50YXJnZXQhLFxuICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXM6ICgpID0+IHN5cy51c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzLFxuICAgIH0sXG4gICAgdXBkYXRlRmlsZTogKHNvdXJjZUZpbGUpID0+IHtcbiAgICAgIGNvbnN0IGFscmVhZHlFeGlzdHMgPSBzb3VyY2VGaWxlcy5oYXMoc291cmNlRmlsZS5maWxlTmFtZSlcbiAgICAgIHN5cy53cml0ZUZpbGUoc291cmNlRmlsZS5maWxlTmFtZSwgc291cmNlRmlsZS50ZXh0KVxuICAgICAgc291cmNlRmlsZXMuc2V0KHNvdXJjZUZpbGUuZmlsZU5hbWUsIHNvdXJjZUZpbGUpXG4gICAgICByZXR1cm4gYWxyZWFkeUV4aXN0c1xuICAgIH0sXG4gIH1cbiAgcmV0dXJuIHZIb3N0XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3Qgd2hpY2ggY2FuIGhvc3QgYSBsYW5ndWFnZSBzZXJ2aWNlIGFnYWluc3QgdGhlIHZpcnR1YWwgZmlsZS1zeXN0ZW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZpcnR1YWxMYW5ndWFnZVNlcnZpY2VIb3N0KFxuICBzeXM6IFN5c3RlbSxcbiAgcm9vdEZpbGVzOiBzdHJpbmdbXSxcbiAgY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnMsXG4gIHRzOiBUU1xuKSB7XG4gIGNvbnN0IGZpbGVOYW1lcyA9IFsuLi5yb290RmlsZXNdXG4gIGNvbnN0IHsgY29tcGlsZXJIb3N0LCB1cGRhdGVGaWxlIH0gPSBjcmVhdGVWaXJ0dWFsQ29tcGlsZXJIb3N0KHN5cywgY29tcGlsZXJPcHRpb25zLCB0cylcbiAgY29uc3QgZmlsZVZlcnNpb25zID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKVxuICBsZXQgcHJvamVjdFZlcnNpb24gPSAwXG4gIGNvbnN0IGxhbmd1YWdlU2VydmljZUhvc3Q6IExhbmd1YWdlU2VydmljZUhvc3QgPSB7XG4gICAgLi4uY29tcGlsZXJIb3N0LFxuICAgIGdldFByb2plY3RWZXJzaW9uOiAoKSA9PiBwcm9qZWN0VmVyc2lvbi50b1N0cmluZygpLFxuICAgIGdldENvbXBpbGF0aW9uU2V0dGluZ3M6ICgpID0+IGNvbXBpbGVyT3B0aW9ucyxcbiAgICBnZXRTY3JpcHRGaWxlTmFtZXM6ICgpID0+IGZpbGVOYW1lcyxcbiAgICBnZXRTY3JpcHRTbmFwc2hvdDogKGZpbGVOYW1lKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IHN5cy5yZWFkRmlsZShmaWxlTmFtZSlcbiAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICByZXR1cm4gdHMuU2NyaXB0U25hcHNob3QuZnJvbVN0cmluZyhjb250ZW50cylcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH0sXG4gICAgZ2V0U2NyaXB0VmVyc2lvbjogKGZpbGVOYW1lKSA9PiB7XG4gICAgICByZXR1cm4gZmlsZVZlcnNpb25zLmdldChmaWxlTmFtZSkgfHwgJzAnXG4gICAgfSxcbiAgICB3cml0ZUZpbGU6IHN5cy53cml0ZUZpbGUsXG4gIH1cblxuICB0eXBlIFJldHVybiA9IHtcbiAgICBsYW5ndWFnZVNlcnZpY2VIb3N0OiBMYW5ndWFnZVNlcnZpY2VIb3N0XG4gICAgdXBkYXRlRmlsZTogKHNvdXJjZUZpbGU6IGltcG9ydCgndHlwZXNjcmlwdCcpLlNvdXJjZUZpbGUpID0+IHZvaWRcbiAgfVxuXG4gIGNvbnN0IGxzSG9zdDogUmV0dXJuID0ge1xuICAgIGxhbmd1YWdlU2VydmljZUhvc3QsXG4gICAgdXBkYXRlRmlsZTogKHNvdXJjZUZpbGUpID0+IHtcbiAgICAgIHByb2plY3RWZXJzaW9uKytcbiAgICAgIGZpbGVWZXJzaW9ucy5zZXQoc291cmNlRmlsZS5maWxlTmFtZSwgcHJvamVjdFZlcnNpb24udG9TdHJpbmcoKSlcbiAgICAgIGlmICghZmlsZU5hbWVzLmluY2x1ZGVzKHNvdXJjZUZpbGUuZmlsZU5hbWUpKSB7XG4gICAgICAgIGZpbGVOYW1lcy5wdXNoKHNvdXJjZUZpbGUuZmlsZU5hbWUpXG4gICAgICB9XG4gICAgICB1cGRhdGVGaWxlKHNvdXJjZUZpbGUpXG4gICAgfSxcbiAgfVxuICByZXR1cm4gbHNIb3N0XG59XG4iXX0=