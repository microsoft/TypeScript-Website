var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./vendor/lzstring.min"], function (require, exports, lzstring_min_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.detectNewImportsToAcquireTypeFor = exports.acquiredTypeDefs = void 0;
    lzstring_min_1 = __importDefault(lzstring_min_1);
    const globalishObj = typeof globalThis !== "undefined" ? globalThis : window || {};
    globalishObj.typeDefinitions = {};
    /**
     * Type Defs we've already got, and nulls when something has failed.
     * This is to make sure that it doesn't infinite loop.
     */
    exports.acquiredTypeDefs = globalishObj.typeDefinitions;
    const moduleJSONURL = (name) => 
    // prettier-ignore
    `https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/${encodeURIComponent(name)}?attributes=types&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.1&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e`;
    const unpkgURL = (name, path) => `https://www.unpkg.com/${encodeURIComponent(name)}/${encodeURIComponent(path)}`;
    const packageJSONURL = (name) => unpkgURL(name, "package.json");
    const errorMsg = (msg, response, config) => {
        config.logger.error(`${msg} - will not try again in this session`, response.status, response.statusText, response);
        debugger;
    };
    /**
     * Grab any import/requires from inside the code and make a list of
     * its dependencies
     */
    const parseFileForModuleReferences = (sourceCode) => {
        // https://regex101.com/r/Jxa3KX/4
        const requirePattern = /(const|let|var)(.|\n)*? require\(('|")(.*)('|")\);?$/gm;
        // this handle ths 'from' imports  https://regex101.com/r/hdEpzO/4
        const es6Pattern = /(import|export)((?!from)(?!require)(.|\n))*?(from|require\()\s?('|")(.*)('|")\)?;?$/gm;
        // https://regex101.com/r/hdEpzO/6
        const es6ImportOnly = /import\s?('|")(.*)('|")\)?;?/gm;
        const foundModules = new Set();
        var match;
        while ((match = es6Pattern.exec(sourceCode)) !== null) {
            if (match[6])
                foundModules.add(match[6]);
        }
        while ((match = requirePattern.exec(sourceCode)) !== null) {
            if (match[5])
                foundModules.add(match[5]);
        }
        while ((match = es6ImportOnly.exec(sourceCode)) !== null) {
            if (match[2])
                foundModules.add(match[2]);
        }
        return Array.from(foundModules);
    };
    /** Converts some of the known global imports to node so that we grab the right info */
    const mapModuleNameToModule = (name) => {
        // in node repl:
        // > require("module").builtinModules
        const builtInNodeMods = [
            "assert",
            "async_hooks",
            "base",
            "buffer",
            "child_process",
            "cluster",
            "console",
            "constants",
            "crypto",
            "dgram",
            "dns",
            "domain",
            "events",
            "fs",
            "globals",
            "http",
            "http2",
            "https",
            "index",
            "inspector",
            "module",
            "net",
            "os",
            "path",
            "perf_hooks",
            "process",
            "punycode",
            "querystring",
            "readline",
            "repl",
            "stream",
            "string_decoder",
            "timers",
            "tls",
            "trace_events",
            "tty",
            "url",
            "util",
            "v8",
            "vm",
            "worker_threads",
            "zlib",
        ];
        if (builtInNodeMods.includes(name)) {
            return "node";
        }
        return name;
    };
    //** A really dumb version of path.resolve */
    const mapRelativePath = (moduleDeclaration, currentPath) => {
        // https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        function absolute(base, relative) {
            if (!base)
                return relative;
            const stack = base.split("/");
            const parts = relative.split("/");
            stack.pop(); // remove current file name (or empty string)
            for (var i = 0; i < parts.length; i++) {
                if (parts[i] == ".")
                    continue;
                if (parts[i] == "..")
                    stack.pop();
                else
                    stack.push(parts[i]);
            }
            return stack.join("/");
        }
        return absolute(currentPath, moduleDeclaration);
    };
    const convertToModuleReferenceID = (outerModule, moduleDeclaration, currentPath) => {
        const modIsScopedPackageOnly = moduleDeclaration.indexOf("@") === 0 && moduleDeclaration.split("/").length === 2;
        const modIsPackageOnly = moduleDeclaration.indexOf("@") === -1 && moduleDeclaration.split("/").length === 1;
        const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly;
        if (isPackageRootImport) {
            return moduleDeclaration;
        }
        else {
            return `${outerModule}-${mapRelativePath(moduleDeclaration, currentPath)}`;
        }
    };
    /**
     * Takes an initial module and the path for the root of the typings and grab it and start grabbing its
     * dependencies then add those the to runtime.
     */
    const addModuleToRuntime = (mod, path, config) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeno = path && path.indexOf("https://") === 0;
        const dtsFileURL = isDeno ? path : unpkgURL(mod, path);
        const content = yield getCachedDTSString(config, dtsFileURL);
        if (!content) {
            return errorMsg(`Could not get root d.ts file for the module '${mod}' at ${path}`, {}, config);
        }
        // Now look and grab dependent modules where you need the
        yield getDependenciesForModule(content, mod, path, config);
        if (isDeno) {
            const wrapped = `declare module "${path}" { ${content} }`;
            config.addLibraryToRuntime(wrapped, path);
        }
        else {
            const typelessModule = mod.split("@types/").slice(-1);
            const wrapped = `declare module "${typelessModule}" { ${content} }`;
            config.addLibraryToRuntime(wrapped, `node_modules/${mod}/${path}`);
        }
    });
    /**
     * Takes a module import, then uses both the algolia API and the the package.json to derive
     * the root type def path.
     *
     * @param {string} packageName
     * @returns {Promise<{ mod: string, path: string, packageJSON: any }>}
     */
    const getModuleAndRootDefTypePath = (packageName, config) => __awaiter(void 0, void 0, void 0, function* () {
        const url = moduleJSONURL(packageName);
        const response = yield config.fetcher(url);
        if (!response.ok) {
            return errorMsg(`Could not get Algolia JSON for the module '${packageName}'`, response, config);
        }
        const responseJSON = yield response.json();
        if (!responseJSON) {
            return errorMsg(`Could the Algolia JSON was un-parsable for the module '${packageName}'`, response, config);
        }
        if (!responseJSON.types) {
            return config.logger.log(`There were no types for '${packageName}' - will not try again in this session`);
        }
        if (!responseJSON.types.ts) {
            return config.logger.log(`There were no types for '${packageName}' - will not try again in this session`);
        }
        exports.acquiredTypeDefs[packageName] = responseJSON;
        if (responseJSON.types.ts === "included") {
            const modPackageURL = packageJSONURL(packageName);
            const response = yield config.fetcher(modPackageURL);
            if (!response.ok) {
                return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response, config);
            }
            const responseJSON = yield response.json();
            if (!responseJSON) {
                return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response, config);
            }
            config.addLibraryToRuntime(JSON.stringify(responseJSON, null, "  "), `node_modules/${packageName}/package.json`);
            // Get the path of the root d.ts file
            // non-inferred route
            let rootTypePath = responseJSON.typing || responseJSON.typings || responseJSON.types;
            // package main is custom
            if (!rootTypePath && typeof responseJSON.main === "string" && responseJSON.main.indexOf(".js") > 0) {
                rootTypePath = responseJSON.main.replace(/js$/, "d.ts");
            }
            // Final fallback, to have got here it must have passed in algolia
            if (!rootTypePath) {
                rootTypePath = "index.d.ts";
            }
            return { mod: packageName, path: rootTypePath, packageJSON: responseJSON };
        }
        else if (responseJSON.types.ts === "definitely-typed") {
            return { mod: responseJSON.types.definitelyTyped, path: "index.d.ts", packageJSON: responseJSON };
        }
        else {
            throw "This shouldn't happen";
        }
    });
    const getCachedDTSString = (config, url) => __awaiter(void 0, void 0, void 0, function* () {
        const cached = localStorage.getItem(url);
        if (cached) {
            const [dateString, text] = cached.split("-=-^-=-");
            const cachedDate = new Date(dateString);
            const now = new Date();
            const cacheTimeout = 604800000; // 1 week
            // const cacheTimeout = 60000 // 1 min
            if (now.getTime() - cachedDate.getTime() < cacheTimeout) {
                return lzstring_min_1.default.decompressFromUTF16(text);
            }
            else {
                config.logger.log("Skipping cache for ", url);
            }
        }
        const response = yield config.fetcher(url);
        if (!response.ok) {
            return errorMsg(`Could not get DTS response for the module at ${url}`, response, config);
        }
        // TODO: handle checking for a resolve to index.d.ts whens someone imports the folder
        let content = yield response.text();
        if (!content) {
            return errorMsg(`Could not get text for DTS response at ${url}`, response, config);
        }
        const now = new Date();
        const cacheContent = `${now.toISOString()}-=-^-=-${lzstring_min_1.default.compressToUTF16(content)}`;
        localStorage.setItem(url, cacheContent);
        return content;
    });
    const getReferenceDependencies = (sourceCode, mod, path, config) => __awaiter(void 0, void 0, void 0, function* () {
        var match;
        if (sourceCode.indexOf("reference path") > 0) {
            // https://regex101.com/r/DaOegw/1
            const referencePathExtractionPattern = /<reference path="(.*)" \/>/gm;
            while ((match = referencePathExtractionPattern.exec(sourceCode)) !== null) {
                const relativePath = match[1];
                if (relativePath) {
                    let newPath = mapRelativePath(relativePath, path);
                    if (newPath) {
                        const dtsRefURL = unpkgURL(mod, newPath);
                        const dtsReferenceResponseText = yield getCachedDTSString(config, dtsRefURL);
                        if (!dtsReferenceResponseText) {
                            return errorMsg(`Could not get root d.ts file for the module '${mod}' at ${path}`, {}, config);
                        }
                        yield getDependenciesForModule(dtsReferenceResponseText, mod, newPath, config);
                        const representationalPath = `node_modules/${mod}/${newPath}`;
                        config.addLibraryToRuntime(dtsReferenceResponseText, representationalPath);
                    }
                }
            }
        }
    });
    /**
     * Pseudo in-browser type acquisition tool, uses a
     */
    exports.detectNewImportsToAcquireTypeFor = (sourceCode, userAddLibraryToRuntime, fetcher = fetch, playgroundConfig) => __awaiter(void 0, void 0, void 0, function* () {
        // Wrap the runtime func with our own side-effect for visibility
        const addLibraryToRuntime = (code, path) => {
            globalishObj.typeDefinitions[path] = code;
            userAddLibraryToRuntime(code, path);
        };
        // Basically start the recursion with an undefined module
        const config = { sourceCode, addLibraryToRuntime, fetcher, logger: playgroundConfig.logger };
        const results = getDependenciesForModule(sourceCode, undefined, "playground.ts", config);
        return results;
    });
    /**
     * Looks at a JS/DTS file and recurses through all the dependencies.
     * It avoids
     */
    const getDependenciesForModule = (sourceCode, moduleName, path, config) => {
        // Get all the import/requires for the file
        const filteredModulesToLookAt = parseFileForModuleReferences(sourceCode);
        filteredModulesToLookAt.forEach((name) => __awaiter(void 0, void 0, void 0, function* () {
            // Support grabbing the hard-coded node modules if needed
            const moduleToDownload = mapModuleNameToModule(name);
            if (!moduleName && moduleToDownload.startsWith(".")) {
                return config.logger.log("[ATA] Can't resolve relative dependencies from the playground root");
            }
            const moduleID = convertToModuleReferenceID(moduleName, moduleToDownload, moduleName);
            if (exports.acquiredTypeDefs[moduleID] || exports.acquiredTypeDefs[moduleID] === null) {
                return;
            }
            config.logger.log(`[ATA] Looking at ${moduleToDownload}`);
            const modIsScopedPackageOnly = moduleToDownload.indexOf("@") === 0 && moduleToDownload.split("/").length === 2;
            const modIsPackageOnly = moduleToDownload.indexOf("@") === -1 && moduleToDownload.split("/").length === 1;
            const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly;
            const isDenoModule = moduleToDownload.indexOf("https://") === 0;
            if (isPackageRootImport) {
                // So it doesn't run twice for a package
                exports.acquiredTypeDefs[moduleID] = null;
                // E.g. import danger from "danger"
                const packageDef = yield getModuleAndRootDefTypePath(moduleToDownload, config);
                if (packageDef) {
                    exports.acquiredTypeDefs[moduleID] = packageDef.packageJSON;
                    yield addModuleToRuntime(packageDef.mod, packageDef.path, config);
                }
            }
            else if (isDenoModule) {
                // E.g. import { serve } from "https://deno.land/std@v0.12/http/server.ts";
                yield addModuleToRuntime(moduleToDownload, moduleToDownload, config);
            }
            else {
                // E.g. import {Component} from "./MyThing"
                if (!moduleToDownload || !path)
                    throw `No outer module or path for a relative import: ${moduleToDownload}`;
                const absolutePathForModule = mapRelativePath(moduleToDownload, path);
                // So it doesn't run twice for a package
                exports.acquiredTypeDefs[moduleID] = null;
                const resolvedFilepath = absolutePathForModule.endsWith(".ts")
                    ? absolutePathForModule
                    : absolutePathForModule + ".d.ts";
                yield addModuleToRuntime(moduleName, resolvedFilepath, config);
            }
        }));
        // Also support the
        getReferenceDependencies(sourceCode, moduleName, path, config);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZUFjcXVpc2l0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvdHlwZUFjcXVpc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR0EsTUFBTSxZQUFZLEdBQVEsT0FBTyxVQUFVLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUE7SUFDdkYsWUFBWSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUE7SUFFakM7OztPQUdHO0lBQ1UsUUFBQSxnQkFBZ0IsR0FBc0MsWUFBWSxDQUFDLGVBQWUsQ0FBQTtJQUkvRixNQUFNLGFBQWEsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ3JDLGtCQUFrQjtJQUNsQiwyREFBMkQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGlMQUFpTCxDQUFBO0lBRXRRLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFLENBQzlDLHlCQUF5QixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBRWpGLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBRXZFLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLFFBQWEsRUFBRSxNQUFpQixFQUFFLEVBQUU7UUFDakUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLHVDQUF1QyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNsSCxRQUFRLENBQUE7SUFDVixDQUFDLENBQUE7SUFFRDs7O09BR0c7SUFDSCxNQUFNLDRCQUE0QixHQUFHLENBQUMsVUFBa0IsRUFBRSxFQUFFO1FBQzFELGtDQUFrQztRQUNsQyxNQUFNLGNBQWMsR0FBRyx3REFBd0QsQ0FBQTtRQUMvRSxrRUFBa0U7UUFDbEUsTUFBTSxVQUFVLEdBQUcsdUZBQXVGLENBQUE7UUFDMUcsa0NBQWtDO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLGdDQUFnQyxDQUFBO1FBRXRELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7UUFDdEMsSUFBSSxLQUFLLENBQUE7UUFFVCxPQUFPLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDekM7UUFFRCxPQUFPLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDekQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDekM7UUFFRCxPQUFPLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDeEQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDekM7UUFFRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFBO0lBRUQsdUZBQXVGO0lBQ3ZGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtRQUM3QyxnQkFBZ0I7UUFDaEIscUNBQXFDO1FBQ3JDLE1BQU0sZUFBZSxHQUFHO1lBQ3RCLFFBQVE7WUFDUixhQUFhO1lBQ2IsTUFBTTtZQUNOLFFBQVE7WUFDUixlQUFlO1lBQ2YsU0FBUztZQUNULFNBQVM7WUFDVCxXQUFXO1lBQ1gsUUFBUTtZQUNSLE9BQU87WUFDUCxLQUFLO1lBQ0wsUUFBUTtZQUNSLFFBQVE7WUFDUixJQUFJO1lBQ0osU0FBUztZQUNULE1BQU07WUFDTixPQUFPO1lBQ1AsT0FBTztZQUNQLE9BQU87WUFDUCxXQUFXO1lBQ1gsUUFBUTtZQUNSLEtBQUs7WUFDTCxJQUFJO1lBQ0osTUFBTTtZQUNOLFlBQVk7WUFDWixTQUFTO1lBQ1QsVUFBVTtZQUNWLGFBQWE7WUFDYixVQUFVO1lBQ1YsTUFBTTtZQUNOLFFBQVE7WUFDUixnQkFBZ0I7WUFDaEIsUUFBUTtZQUNSLEtBQUs7WUFDTCxjQUFjO1lBQ2QsS0FBSztZQUNMLEtBQUs7WUFDTCxNQUFNO1lBQ04sSUFBSTtZQUNKLElBQUk7WUFDSixnQkFBZ0I7WUFDaEIsTUFBTTtTQUNQLENBQUE7UUFFRCxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEMsT0FBTyxNQUFNLENBQUE7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQyxDQUFBO0lBRUQsNkNBQTZDO0lBQzdDLE1BQU0sZUFBZSxHQUFHLENBQUMsaUJBQXlCLEVBQUUsV0FBbUIsRUFBRSxFQUFFO1FBQ3pFLGtHQUFrRztRQUNsRyxTQUFTLFFBQVEsQ0FBQyxJQUFZLEVBQUUsUUFBZ0I7WUFDOUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTyxRQUFRLENBQUE7WUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2pDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQSxDQUFDLDZDQUE2QztZQUV6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztvQkFBRSxTQUFRO2dCQUM3QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJO29CQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTs7b0JBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDMUI7WUFDRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDeEIsQ0FBQztRQUVELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO0lBQ2pELENBQUMsQ0FBQTtJQUVELE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxXQUFtQixFQUFFLGlCQUF5QixFQUFFLFdBQW1CLEVBQUUsRUFBRTtRQUN6RyxNQUFNLHNCQUFzQixHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7UUFDaEgsTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7UUFDM0csTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsSUFBSSxzQkFBc0IsQ0FBQTtRQUV0RSxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLE9BQU8saUJBQWlCLENBQUE7U0FDekI7YUFBTTtZQUNMLE9BQU8sR0FBRyxXQUFXLElBQUksZUFBZSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUE7U0FDM0U7SUFDSCxDQUFDLENBQUE7SUFFRDs7O09BR0c7SUFDSCxNQUFNLGtCQUFrQixHQUFHLENBQU8sR0FBVyxFQUFFLElBQVksRUFBRSxNQUFpQixFQUFFLEVBQUU7UUFDaEYsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRXJELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXRELE1BQU0sT0FBTyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQzVELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLFFBQVEsQ0FBQyxnREFBZ0QsR0FBRyxRQUFRLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUMvRjtRQUVELHlEQUF5RDtRQUN6RCxNQUFNLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRTFELElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLElBQUksT0FBTyxPQUFPLElBQUksQ0FBQTtZQUN6RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQzFDO2FBQU07WUFDTCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sT0FBTyxHQUFHLG1CQUFtQixjQUFjLE9BQU8sT0FBTyxJQUFJLENBQUE7WUFDbkUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUE7U0FDbkU7SUFDSCxDQUFDLENBQUEsQ0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sMkJBQTJCLEdBQUcsQ0FBTyxXQUFtQixFQUFFLE1BQWlCLEVBQUUsRUFBRTtRQUNuRixNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2hCLE9BQU8sUUFBUSxDQUFDLDhDQUE4QyxXQUFXLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDaEc7UUFFRCxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMxQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sUUFBUSxDQUFDLDBEQUEwRCxXQUFXLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDNUc7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUN2QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixXQUFXLHdDQUF3QyxDQUFDLENBQUE7U0FDMUc7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDMUIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsV0FBVyx3Q0FBd0MsQ0FBQyxDQUFBO1NBQzFHO1FBRUQsd0JBQWdCLENBQUMsV0FBVyxDQUFDLEdBQUcsWUFBWSxDQUFBO1FBRTVDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssVUFBVSxFQUFFO1lBQ3hDLE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUVqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sUUFBUSxDQUFDLDhDQUE4QyxXQUFXLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDaEc7WUFFRCxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUMxQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNqQixPQUFPLFFBQVEsQ0FBQyw4Q0FBOEMsV0FBVyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2FBQ2hHO1lBRUQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxnQkFBZ0IsV0FBVyxlQUFlLENBQUMsQ0FBQTtZQUVoSCxxQ0FBcUM7WUFFckMscUJBQXFCO1lBQ3JCLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLElBQUksWUFBWSxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFBO1lBRXBGLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sWUFBWSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsRyxZQUFZLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO2FBQ3hEO1lBRUQsa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pCLFlBQVksR0FBRyxZQUFZLENBQUE7YUFDNUI7WUFFRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsQ0FBQTtTQUMzRTthQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssa0JBQWtCLEVBQUU7WUFDdkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsQ0FBQTtTQUNsRzthQUFNO1lBQ0wsTUFBTSx1QkFBdUIsQ0FBQTtTQUM5QjtJQUNILENBQUMsQ0FBQSxDQUFBO0lBRUQsTUFBTSxrQkFBa0IsR0FBRyxDQUFPLE1BQWlCLEVBQUUsR0FBVyxFQUFFLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN4QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1lBRXRCLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQSxDQUFDLFNBQVM7WUFDeEMsc0NBQXNDO1lBRXRDLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLEVBQUU7Z0JBQ3ZELE9BQU8sc0JBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUMxQztpQkFBTTtnQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUM5QztTQUNGO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2hCLE9BQU8sUUFBUSxDQUFDLGdEQUFnRCxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDekY7UUFFRCxxRkFBcUY7UUFDckYsSUFBSSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sUUFBUSxDQUFDLDBDQUEwQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDbkY7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ3RCLE1BQU0sWUFBWSxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLHNCQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7UUFDdEYsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDdkMsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQyxDQUFBLENBQUE7SUFFRCxNQUFNLHdCQUF3QixHQUFHLENBQU8sVUFBa0IsRUFBRSxHQUFXLEVBQUUsSUFBWSxFQUFFLE1BQWlCLEVBQUUsRUFBRTtRQUMxRyxJQUFJLEtBQUssQ0FBQTtRQUNULElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM1QyxrQ0FBa0M7WUFDbEMsTUFBTSw4QkFBOEIsR0FBRyw4QkFBOEIsQ0FBQTtZQUNyRSxPQUFPLENBQUMsS0FBSyxHQUFHLDhCQUE4QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDekUsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUM3QixJQUFJLFlBQVksRUFBRTtvQkFDaEIsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQTtvQkFDakQsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTt3QkFFeEMsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTt3QkFDNUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFOzRCQUM3QixPQUFPLFFBQVEsQ0FBQyxnREFBZ0QsR0FBRyxRQUFRLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTt5QkFDL0Y7d0JBRUQsTUFBTSx3QkFBd0IsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO3dCQUM5RSxNQUFNLG9CQUFvQixHQUFHLGdCQUFnQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUE7d0JBQzdELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO3FCQUMzRTtpQkFDRjthQUNGO1NBQ0Y7SUFDSCxDQUFDLENBQUEsQ0FBQTtJQVNEOztPQUVHO0lBQ1UsUUFBQSxnQ0FBZ0MsR0FBRyxDQUM5QyxVQUFrQixFQUNsQix1QkFBNEMsRUFDNUMsT0FBTyxHQUFHLEtBQUssRUFDZixnQkFBa0MsRUFDbEMsRUFBRTtRQUNGLGdFQUFnRTtRQUNoRSxNQUFNLG1CQUFtQixHQUFHLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFO1lBQ3pELFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFBO1lBQ3pDLHVCQUF1QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNyQyxDQUFDLENBQUE7UUFFRCx5REFBeUQ7UUFDekQsTUFBTSxNQUFNLEdBQWMsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUN2RyxNQUFNLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN4RixPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDLENBQUEsQ0FBQTtJQUVEOzs7T0FHRztJQUNILE1BQU0sd0JBQXdCLEdBQUcsQ0FDL0IsVUFBa0IsRUFDbEIsVUFBOEIsRUFDOUIsSUFBWSxFQUNaLE1BQWlCLEVBQ2pCLEVBQUU7UUFDRiwyQ0FBMkM7UUFDM0MsTUFBTSx1QkFBdUIsR0FBRyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN4RSx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBTSxJQUFJLEVBQUMsRUFBRTtZQUMzQyx5REFBeUQ7WUFDekQsTUFBTSxnQkFBZ0IsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVwRCxJQUFJLENBQUMsVUFBVSxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvRUFBb0UsQ0FBQyxDQUFBO2FBQy9GO1lBRUQsTUFBTSxRQUFRLEdBQUcsMEJBQTBCLENBQUMsVUFBVyxFQUFFLGdCQUFnQixFQUFFLFVBQVcsQ0FBQyxDQUFBO1lBQ3ZGLElBQUksd0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksd0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNyRSxPQUFNO2FBQ1A7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFBO1lBRXpELE1BQU0sc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtZQUM5RyxNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtZQUN6RyxNQUFNLG1CQUFtQixHQUFHLGdCQUFnQixJQUFJLHNCQUFzQixDQUFBO1lBQ3RFLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7WUFFL0QsSUFBSSxtQkFBbUIsRUFBRTtnQkFDdkIsd0NBQXdDO2dCQUN4Qyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUE7Z0JBRWpDLG1DQUFtQztnQkFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSwyQkFBMkIsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtnQkFFOUUsSUFBSSxVQUFVLEVBQUU7b0JBQ2Qsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQTtvQkFDbkQsTUFBTSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7aUJBQ2xFO2FBQ0Y7aUJBQU0sSUFBSSxZQUFZLEVBQUU7Z0JBQ3ZCLDJFQUEyRTtnQkFDM0UsTUFBTSxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQTthQUNyRTtpQkFBTTtnQkFDTCwyQ0FBMkM7Z0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUk7b0JBQUUsTUFBTSxrREFBa0QsZ0JBQWdCLEVBQUUsQ0FBQTtnQkFFMUcsTUFBTSxxQkFBcUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBRXJFLHdDQUF3QztnQkFDeEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFBO2dCQUVqQyxNQUFNLGdCQUFnQixHQUFHLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQzVELENBQUMsQ0FBQyxxQkFBcUI7b0JBQ3ZCLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUE7Z0JBRW5DLE1BQU0sa0JBQWtCLENBQUMsVUFBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFBO2FBQ2hFO1FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUVGLG1CQUFtQjtRQUNuQix3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsVUFBVyxFQUFFLElBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNsRSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kQ29uZmlnIH0gZnJvbSBcIi4vXCJcbmltcG9ydCBsenN0cmluZyBmcm9tIFwiLi92ZW5kb3IvbHpzdHJpbmcubWluXCJcblxuY29uc3QgZ2xvYmFsaXNoT2JqOiBhbnkgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB3aW5kb3cgfHwge31cbmdsb2JhbGlzaE9iai50eXBlRGVmaW5pdGlvbnMgPSB7fVxuXG4vKipcbiAqIFR5cGUgRGVmcyB3ZSd2ZSBhbHJlYWR5IGdvdCwgYW5kIG51bGxzIHdoZW4gc29tZXRoaW5nIGhhcyBmYWlsZWQuXG4gKiBUaGlzIGlzIHRvIG1ha2Ugc3VyZSB0aGF0IGl0IGRvZXNuJ3QgaW5maW5pdGUgbG9vcC5cbiAqL1xuZXhwb3J0IGNvbnN0IGFjcXVpcmVkVHlwZURlZnM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB8IG51bGwgfSA9IGdsb2JhbGlzaE9iai50eXBlRGVmaW5pdGlvbnNcblxuZXhwb3J0IHR5cGUgQWRkTGliVG9SdW50aW1lRnVuYyA9IChjb2RlOiBzdHJpbmcsIHBhdGg6IHN0cmluZykgPT4gdm9pZFxuXG5jb25zdCBtb2R1bGVKU09OVVJMID0gKG5hbWU6IHN0cmluZykgPT5cbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIGBodHRwczovL29mY25jb2cyY3UtZHNuLmFsZ29saWEubmV0LzEvaW5kZXhlcy9ucG0tc2VhcmNoLyR7ZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpfT9hdHRyaWJ1dGVzPXR5cGVzJngtYWxnb2xpYS1hZ2VudD1BbGdvbGlhJTIwZm9yJTIwdmFuaWxsYSUyMEphdmFTY3JpcHQlMjAobGl0ZSklMjAzLjI3LjEmeC1hbGdvbGlhLWFwcGxpY2F0aW9uLWlkPU9GQ05DT0cyQ1UmeC1hbGdvbGlhLWFwaS1rZXk9ZjU0ZTIxZmEzYTJhMDE2MDU5NWJiMDU4MTc5YmZiMWVgXG5cbmNvbnN0IHVucGtnVVJMID0gKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nKSA9PlxuICBgaHR0cHM6Ly93d3cudW5wa2cuY29tLyR7ZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpfS8ke2VuY29kZVVSSUNvbXBvbmVudChwYXRoKX1gXG5cbmNvbnN0IHBhY2thZ2VKU09OVVJMID0gKG5hbWU6IHN0cmluZykgPT4gdW5wa2dVUkwobmFtZSwgXCJwYWNrYWdlLmpzb25cIilcblxuY29uc3QgZXJyb3JNc2cgPSAobXNnOiBzdHJpbmcsIHJlc3BvbnNlOiBhbnksIGNvbmZpZzogQVRBQ29uZmlnKSA9PiB7XG4gIGNvbmZpZy5sb2dnZXIuZXJyb3IoYCR7bXNnfSAtIHdpbGwgbm90IHRyeSBhZ2FpbiBpbiB0aGlzIHNlc3Npb25gLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsIHJlc3BvbnNlKVxuICBkZWJ1Z2dlclxufVxuXG4vKipcbiAqIEdyYWIgYW55IGltcG9ydC9yZXF1aXJlcyBmcm9tIGluc2lkZSB0aGUgY29kZSBhbmQgbWFrZSBhIGxpc3Qgb2ZcbiAqIGl0cyBkZXBlbmRlbmNpZXNcbiAqL1xuY29uc3QgcGFyc2VGaWxlRm9yTW9kdWxlUmVmZXJlbmNlcyA9IChzb3VyY2VDb2RlOiBzdHJpbmcpID0+IHtcbiAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9KeGEzS1gvNFxuICBjb25zdCByZXF1aXJlUGF0dGVybiA9IC8oY29uc3R8bGV0fHZhcikoLnxcXG4pKj8gcmVxdWlyZVxcKCgnfFwiKSguKikoJ3xcIilcXCk7PyQvZ21cbiAgLy8gdGhpcyBoYW5kbGUgdGhzICdmcm9tJyBpbXBvcnRzICBodHRwczovL3JlZ2V4MTAxLmNvbS9yL2hkRXB6Ty80XG4gIGNvbnN0IGVzNlBhdHRlcm4gPSAvKGltcG9ydHxleHBvcnQpKCg/IWZyb20pKD8hcmVxdWlyZSkoLnxcXG4pKSo/KGZyb218cmVxdWlyZVxcKClcXHM/KCd8XCIpKC4qKSgnfFwiKVxcKT87PyQvZ21cbiAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9oZEVwek8vNlxuICBjb25zdCBlczZJbXBvcnRPbmx5ID0gL2ltcG9ydFxccz8oJ3xcIikoLiopKCd8XCIpXFwpPzs/L2dtXG5cbiAgY29uc3QgZm91bmRNb2R1bGVzID0gbmV3IFNldDxzdHJpbmc+KClcbiAgdmFyIG1hdGNoXG5cbiAgd2hpbGUgKChtYXRjaCA9IGVzNlBhdHRlcm4uZXhlYyhzb3VyY2VDb2RlKSkgIT09IG51bGwpIHtcbiAgICBpZiAobWF0Y2hbNl0pIGZvdW5kTW9kdWxlcy5hZGQobWF0Y2hbNl0pXG4gIH1cblxuICB3aGlsZSAoKG1hdGNoID0gcmVxdWlyZVBhdHRlcm4uZXhlYyhzb3VyY2VDb2RlKSkgIT09IG51bGwpIHtcbiAgICBpZiAobWF0Y2hbNV0pIGZvdW5kTW9kdWxlcy5hZGQobWF0Y2hbNV0pXG4gIH1cblxuICB3aGlsZSAoKG1hdGNoID0gZXM2SW1wb3J0T25seS5leGVjKHNvdXJjZUNvZGUpKSAhPT0gbnVsbCkge1xuICAgIGlmIChtYXRjaFsyXSkgZm91bmRNb2R1bGVzLmFkZChtYXRjaFsyXSlcbiAgfVxuXG4gIHJldHVybiBBcnJheS5mcm9tKGZvdW5kTW9kdWxlcylcbn1cblxuLyoqIENvbnZlcnRzIHNvbWUgb2YgdGhlIGtub3duIGdsb2JhbCBpbXBvcnRzIHRvIG5vZGUgc28gdGhhdCB3ZSBncmFiIHRoZSByaWdodCBpbmZvICovXG5jb25zdCBtYXBNb2R1bGVOYW1lVG9Nb2R1bGUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gIC8vIGluIG5vZGUgcmVwbDpcbiAgLy8gPiByZXF1aXJlKFwibW9kdWxlXCIpLmJ1aWx0aW5Nb2R1bGVzXG4gIGNvbnN0IGJ1aWx0SW5Ob2RlTW9kcyA9IFtcbiAgICBcImFzc2VydFwiLFxuICAgIFwiYXN5bmNfaG9va3NcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJ1ZmZlclwiLFxuICAgIFwiY2hpbGRfcHJvY2Vzc1wiLFxuICAgIFwiY2x1c3RlclwiLFxuICAgIFwiY29uc29sZVwiLFxuICAgIFwiY29uc3RhbnRzXCIsXG4gICAgXCJjcnlwdG9cIixcbiAgICBcImRncmFtXCIsXG4gICAgXCJkbnNcIixcbiAgICBcImRvbWFpblwiLFxuICAgIFwiZXZlbnRzXCIsXG4gICAgXCJmc1wiLFxuICAgIFwiZ2xvYmFsc1wiLFxuICAgIFwiaHR0cFwiLFxuICAgIFwiaHR0cDJcIixcbiAgICBcImh0dHBzXCIsXG4gICAgXCJpbmRleFwiLFxuICAgIFwiaW5zcGVjdG9yXCIsXG4gICAgXCJtb2R1bGVcIixcbiAgICBcIm5ldFwiLFxuICAgIFwib3NcIixcbiAgICBcInBhdGhcIixcbiAgICBcInBlcmZfaG9va3NcIixcbiAgICBcInByb2Nlc3NcIixcbiAgICBcInB1bnljb2RlXCIsXG4gICAgXCJxdWVyeXN0cmluZ1wiLFxuICAgIFwicmVhZGxpbmVcIixcbiAgICBcInJlcGxcIixcbiAgICBcInN0cmVhbVwiLFxuICAgIFwic3RyaW5nX2RlY29kZXJcIixcbiAgICBcInRpbWVyc1wiLFxuICAgIFwidGxzXCIsXG4gICAgXCJ0cmFjZV9ldmVudHNcIixcbiAgICBcInR0eVwiLFxuICAgIFwidXJsXCIsXG4gICAgXCJ1dGlsXCIsXG4gICAgXCJ2OFwiLFxuICAgIFwidm1cIixcbiAgICBcIndvcmtlcl90aHJlYWRzXCIsXG4gICAgXCJ6bGliXCIsXG4gIF1cblxuICBpZiAoYnVpbHRJbk5vZGVNb2RzLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgcmV0dXJuIFwibm9kZVwiXG4gIH1cbiAgcmV0dXJuIG5hbWVcbn1cblxuLy8qKiBBIHJlYWxseSBkdW1iIHZlcnNpb24gb2YgcGF0aC5yZXNvbHZlICovXG5jb25zdCBtYXBSZWxhdGl2ZVBhdGggPSAobW9kdWxlRGVjbGFyYXRpb246IHN0cmluZywgY3VycmVudFBhdGg6IHN0cmluZykgPT4ge1xuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDc4MDM1MC9jb252ZXJ0LXJlbGF0aXZlLXBhdGgtdG8tYWJzb2x1dGUtdXNpbmctamF2YXNjcmlwdFxuICBmdW5jdGlvbiBhYnNvbHV0ZShiYXNlOiBzdHJpbmcsIHJlbGF0aXZlOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJhc2UpIHJldHVybiByZWxhdGl2ZVxuXG4gICAgY29uc3Qgc3RhY2sgPSBiYXNlLnNwbGl0KFwiL1wiKVxuICAgIGNvbnN0IHBhcnRzID0gcmVsYXRpdmUuc3BsaXQoXCIvXCIpXG4gICAgc3RhY2sucG9wKCkgLy8gcmVtb3ZlIGN1cnJlbnQgZmlsZSBuYW1lIChvciBlbXB0eSBzdHJpbmcpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFydHNbaV0gPT0gXCIuXCIpIGNvbnRpbnVlXG4gICAgICBpZiAocGFydHNbaV0gPT0gXCIuLlwiKSBzdGFjay5wb3AoKVxuICAgICAgZWxzZSBzdGFjay5wdXNoKHBhcnRzW2ldKVxuICAgIH1cbiAgICByZXR1cm4gc3RhY2suam9pbihcIi9cIilcbiAgfVxuXG4gIHJldHVybiBhYnNvbHV0ZShjdXJyZW50UGF0aCwgbW9kdWxlRGVjbGFyYXRpb24pXG59XG5cbmNvbnN0IGNvbnZlcnRUb01vZHVsZVJlZmVyZW5jZUlEID0gKG91dGVyTW9kdWxlOiBzdHJpbmcsIG1vZHVsZURlY2xhcmF0aW9uOiBzdHJpbmcsIGN1cnJlbnRQYXRoOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgbW9kSXNTY29wZWRQYWNrYWdlT25seSA9IG1vZHVsZURlY2xhcmF0aW9uLmluZGV4T2YoXCJAXCIpID09PSAwICYmIG1vZHVsZURlY2xhcmF0aW9uLnNwbGl0KFwiL1wiKS5sZW5ndGggPT09IDJcbiAgY29uc3QgbW9kSXNQYWNrYWdlT25seSA9IG1vZHVsZURlY2xhcmF0aW9uLmluZGV4T2YoXCJAXCIpID09PSAtMSAmJiBtb2R1bGVEZWNsYXJhdGlvbi5zcGxpdChcIi9cIikubGVuZ3RoID09PSAxXG4gIGNvbnN0IGlzUGFja2FnZVJvb3RJbXBvcnQgPSBtb2RJc1BhY2thZ2VPbmx5IHx8IG1vZElzU2NvcGVkUGFja2FnZU9ubHlcblxuICBpZiAoaXNQYWNrYWdlUm9vdEltcG9ydCkge1xuICAgIHJldHVybiBtb2R1bGVEZWNsYXJhdGlvblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHtvdXRlck1vZHVsZX0tJHttYXBSZWxhdGl2ZVBhdGgobW9kdWxlRGVjbGFyYXRpb24sIGN1cnJlbnRQYXRoKX1gXG4gIH1cbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBpbml0aWFsIG1vZHVsZSBhbmQgdGhlIHBhdGggZm9yIHRoZSByb290IG9mIHRoZSB0eXBpbmdzIGFuZCBncmFiIGl0IGFuZCBzdGFydCBncmFiYmluZyBpdHNcbiAqIGRlcGVuZGVuY2llcyB0aGVuIGFkZCB0aG9zZSB0aGUgdG8gcnVudGltZS5cbiAqL1xuY29uc3QgYWRkTW9kdWxlVG9SdW50aW1lID0gYXN5bmMgKG1vZDogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIGNvbmZpZzogQVRBQ29uZmlnKSA9PiB7XG4gIGNvbnN0IGlzRGVubyA9IHBhdGggJiYgcGF0aC5pbmRleE9mKFwiaHR0cHM6Ly9cIikgPT09IDBcblxuICBjb25zdCBkdHNGaWxlVVJMID0gaXNEZW5vID8gcGF0aCA6IHVucGtnVVJMKG1vZCwgcGF0aClcblxuICBjb25zdCBjb250ZW50ID0gYXdhaXQgZ2V0Q2FjaGVkRFRTU3RyaW5nKGNvbmZpZywgZHRzRmlsZVVSTClcbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIGVycm9yTXNnKGBDb3VsZCBub3QgZ2V0IHJvb3QgZC50cyBmaWxlIGZvciB0aGUgbW9kdWxlICcke21vZH0nIGF0ICR7cGF0aH1gLCB7fSwgY29uZmlnKVxuICB9XG5cbiAgLy8gTm93IGxvb2sgYW5kIGdyYWIgZGVwZW5kZW50IG1vZHVsZXMgd2hlcmUgeW91IG5lZWQgdGhlXG4gIGF3YWl0IGdldERlcGVuZGVuY2llc0Zvck1vZHVsZShjb250ZW50LCBtb2QsIHBhdGgsIGNvbmZpZylcblxuICBpZiAoaXNEZW5vKSB7XG4gICAgY29uc3Qgd3JhcHBlZCA9IGBkZWNsYXJlIG1vZHVsZSBcIiR7cGF0aH1cIiB7ICR7Y29udGVudH0gfWBcbiAgICBjb25maWcuYWRkTGlicmFyeVRvUnVudGltZSh3cmFwcGVkLCBwYXRoKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHR5cGVsZXNzTW9kdWxlID0gbW9kLnNwbGl0KFwiQHR5cGVzL1wiKS5zbGljZSgtMSlcbiAgICBjb25zdCB3cmFwcGVkID0gYGRlY2xhcmUgbW9kdWxlIFwiJHt0eXBlbGVzc01vZHVsZX1cIiB7ICR7Y29udGVudH0gfWBcbiAgICBjb25maWcuYWRkTGlicmFyeVRvUnVudGltZSh3cmFwcGVkLCBgbm9kZV9tb2R1bGVzLyR7bW9kfS8ke3BhdGh9YClcbiAgfVxufVxuXG4vKipcbiAqIFRha2VzIGEgbW9kdWxlIGltcG9ydCwgdGhlbiB1c2VzIGJvdGggdGhlIGFsZ29saWEgQVBJIGFuZCB0aGUgdGhlIHBhY2thZ2UuanNvbiB0byBkZXJpdmVcbiAqIHRoZSByb290IHR5cGUgZGVmIHBhdGguXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhY2thZ2VOYW1lXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7IG1vZDogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHBhY2thZ2VKU09OOiBhbnkgfT59XG4gKi9cbmNvbnN0IGdldE1vZHVsZUFuZFJvb3REZWZUeXBlUGF0aCA9IGFzeW5jIChwYWNrYWdlTmFtZTogc3RyaW5nLCBjb25maWc6IEFUQUNvbmZpZykgPT4ge1xuICBjb25zdCB1cmwgPSBtb2R1bGVKU09OVVJMKHBhY2thZ2VOYW1lKVxuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY29uZmlnLmZldGNoZXIodXJsKVxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgcmV0dXJuIGVycm9yTXNnKGBDb3VsZCBub3QgZ2V0IEFsZ29saWEgSlNPTiBmb3IgdGhlIG1vZHVsZSAnJHtwYWNrYWdlTmFtZX0nYCwgcmVzcG9uc2UsIGNvbmZpZylcbiAgfVxuXG4gIGNvbnN0IHJlc3BvbnNlSlNPTiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICBpZiAoIXJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBlcnJvck1zZyhgQ291bGQgdGhlIEFsZ29saWEgSlNPTiB3YXMgdW4tcGFyc2FibGUgZm9yIHRoZSBtb2R1bGUgJyR7cGFja2FnZU5hbWV9J2AsIHJlc3BvbnNlLCBjb25maWcpXG4gIH1cblxuICBpZiAoIXJlc3BvbnNlSlNPTi50eXBlcykge1xuICAgIHJldHVybiBjb25maWcubG9nZ2VyLmxvZyhgVGhlcmUgd2VyZSBubyB0eXBlcyBmb3IgJyR7cGFja2FnZU5hbWV9JyAtIHdpbGwgbm90IHRyeSBhZ2FpbiBpbiB0aGlzIHNlc3Npb25gKVxuICB9XG4gIGlmICghcmVzcG9uc2VKU09OLnR5cGVzLnRzKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5sb2dnZXIubG9nKGBUaGVyZSB3ZXJlIG5vIHR5cGVzIGZvciAnJHtwYWNrYWdlTmFtZX0nIC0gd2lsbCBub3QgdHJ5IGFnYWluIGluIHRoaXMgc2Vzc2lvbmApXG4gIH1cblxuICBhY3F1aXJlZFR5cGVEZWZzW3BhY2thZ2VOYW1lXSA9IHJlc3BvbnNlSlNPTlxuXG4gIGlmIChyZXNwb25zZUpTT04udHlwZXMudHMgPT09IFwiaW5jbHVkZWRcIikge1xuICAgIGNvbnN0IG1vZFBhY2thZ2VVUkwgPSBwYWNrYWdlSlNPTlVSTChwYWNrYWdlTmFtZSlcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY29uZmlnLmZldGNoZXIobW9kUGFja2FnZVVSTClcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4gZXJyb3JNc2coYENvdWxkIG5vdCBnZXQgUGFja2FnZSBKU09OIGZvciB0aGUgbW9kdWxlICcke3BhY2thZ2VOYW1lfSdgLCByZXNwb25zZSwgY29uZmlnKVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlSlNPTiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgIGlmICghcmVzcG9uc2VKU09OKSB7XG4gICAgICByZXR1cm4gZXJyb3JNc2coYENvdWxkIG5vdCBnZXQgUGFja2FnZSBKU09OIGZvciB0aGUgbW9kdWxlICcke3BhY2thZ2VOYW1lfSdgLCByZXNwb25zZSwgY29uZmlnKVxuICAgIH1cblxuICAgIGNvbmZpZy5hZGRMaWJyYXJ5VG9SdW50aW1lKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlSlNPTiwgbnVsbCwgXCIgIFwiKSwgYG5vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfS9wYWNrYWdlLmpzb25gKVxuXG4gICAgLy8gR2V0IHRoZSBwYXRoIG9mIHRoZSByb290IGQudHMgZmlsZVxuXG4gICAgLy8gbm9uLWluZmVycmVkIHJvdXRlXG4gICAgbGV0IHJvb3RUeXBlUGF0aCA9IHJlc3BvbnNlSlNPTi50eXBpbmcgfHwgcmVzcG9uc2VKU09OLnR5cGluZ3MgfHwgcmVzcG9uc2VKU09OLnR5cGVzXG5cbiAgICAvLyBwYWNrYWdlIG1haW4gaXMgY3VzdG9tXG4gICAgaWYgKCFyb290VHlwZVBhdGggJiYgdHlwZW9mIHJlc3BvbnNlSlNPTi5tYWluID09PSBcInN0cmluZ1wiICYmIHJlc3BvbnNlSlNPTi5tYWluLmluZGV4T2YoXCIuanNcIikgPiAwKSB7XG4gICAgICByb290VHlwZVBhdGggPSByZXNwb25zZUpTT04ubWFpbi5yZXBsYWNlKC9qcyQvLCBcImQudHNcIilcbiAgICB9XG5cbiAgICAvLyBGaW5hbCBmYWxsYmFjaywgdG8gaGF2ZSBnb3QgaGVyZSBpdCBtdXN0IGhhdmUgcGFzc2VkIGluIGFsZ29saWFcbiAgICBpZiAoIXJvb3RUeXBlUGF0aCkge1xuICAgICAgcm9vdFR5cGVQYXRoID0gXCJpbmRleC5kLnRzXCJcbiAgICB9XG5cbiAgICByZXR1cm4geyBtb2Q6IHBhY2thZ2VOYW1lLCBwYXRoOiByb290VHlwZVBhdGgsIHBhY2thZ2VKU09OOiByZXNwb25zZUpTT04gfVxuICB9IGVsc2UgaWYgKHJlc3BvbnNlSlNPTi50eXBlcy50cyA9PT0gXCJkZWZpbml0ZWx5LXR5cGVkXCIpIHtcbiAgICByZXR1cm4geyBtb2Q6IHJlc3BvbnNlSlNPTi50eXBlcy5kZWZpbml0ZWx5VHlwZWQsIHBhdGg6IFwiaW5kZXguZC50c1wiLCBwYWNrYWdlSlNPTjogcmVzcG9uc2VKU09OIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBcIlRoaXMgc2hvdWxkbid0IGhhcHBlblwiXG4gIH1cbn1cblxuY29uc3QgZ2V0Q2FjaGVkRFRTU3RyaW5nID0gYXN5bmMgKGNvbmZpZzogQVRBQ29uZmlnLCB1cmw6IHN0cmluZykgPT4ge1xuICBjb25zdCBjYWNoZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1cmwpXG4gIGlmIChjYWNoZWQpIHtcbiAgICBjb25zdCBbZGF0ZVN0cmluZywgdGV4dF0gPSBjYWNoZWQuc3BsaXQoXCItPS1eLT0tXCIpXG4gICAgY29uc3QgY2FjaGVkRGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcpXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuXG4gICAgY29uc3QgY2FjaGVUaW1lb3V0ID0gNjA0ODAwMDAwIC8vIDEgd2Vla1xuICAgIC8vIGNvbnN0IGNhY2hlVGltZW91dCA9IDYwMDAwIC8vIDEgbWluXG5cbiAgICBpZiAobm93LmdldFRpbWUoKSAtIGNhY2hlZERhdGUuZ2V0VGltZSgpIDwgY2FjaGVUaW1lb3V0KSB7XG4gICAgICByZXR1cm4gbHpzdHJpbmcuZGVjb21wcmVzc0Zyb21VVEYxNih0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25maWcubG9nZ2VyLmxvZyhcIlNraXBwaW5nIGNhY2hlIGZvciBcIiwgdXJsKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY29uZmlnLmZldGNoZXIodXJsKVxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgcmV0dXJuIGVycm9yTXNnKGBDb3VsZCBub3QgZ2V0IERUUyByZXNwb25zZSBmb3IgdGhlIG1vZHVsZSBhdCAke3VybH1gLCByZXNwb25zZSwgY29uZmlnKVxuICB9XG5cbiAgLy8gVE9ETzogaGFuZGxlIGNoZWNraW5nIGZvciBhIHJlc29sdmUgdG8gaW5kZXguZC50cyB3aGVucyBzb21lb25lIGltcG9ydHMgdGhlIGZvbGRlclxuICBsZXQgY29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxuICBpZiAoIWNvbnRlbnQpIHtcbiAgICByZXR1cm4gZXJyb3JNc2coYENvdWxkIG5vdCBnZXQgdGV4dCBmb3IgRFRTIHJlc3BvbnNlIGF0ICR7dXJsfWAsIHJlc3BvbnNlLCBjb25maWcpXG4gIH1cblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IGNhY2hlQ29udGVudCA9IGAke25vdy50b0lTT1N0cmluZygpfS09LV4tPS0ke2x6c3RyaW5nLmNvbXByZXNzVG9VVEYxNihjb250ZW50KX1gXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVybCwgY2FjaGVDb250ZW50KVxuICByZXR1cm4gY29udGVudFxufVxuXG5jb25zdCBnZXRSZWZlcmVuY2VEZXBlbmRlbmNpZXMgPSBhc3luYyAoc291cmNlQ29kZTogc3RyaW5nLCBtb2Q6IHN0cmluZywgcGF0aDogc3RyaW5nLCBjb25maWc6IEFUQUNvbmZpZykgPT4ge1xuICB2YXIgbWF0Y2hcbiAgaWYgKHNvdXJjZUNvZGUuaW5kZXhPZihcInJlZmVyZW5jZSBwYXRoXCIpID4gMCkge1xuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvRGFPZWd3LzFcbiAgICBjb25zdCByZWZlcmVuY2VQYXRoRXh0cmFjdGlvblBhdHRlcm4gPSAvPHJlZmVyZW5jZSBwYXRoPVwiKC4qKVwiIFxcLz4vZ21cbiAgICB3aGlsZSAoKG1hdGNoID0gcmVmZXJlbmNlUGF0aEV4dHJhY3Rpb25QYXR0ZXJuLmV4ZWMoc291cmNlQ29kZSkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBtYXRjaFsxXVxuICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICBsZXQgbmV3UGF0aCA9IG1hcFJlbGF0aXZlUGF0aChyZWxhdGl2ZVBhdGgsIHBhdGgpXG4gICAgICAgIGlmIChuZXdQYXRoKSB7XG4gICAgICAgICAgY29uc3QgZHRzUmVmVVJMID0gdW5wa2dVUkwobW9kLCBuZXdQYXRoKVxuXG4gICAgICAgICAgY29uc3QgZHRzUmVmZXJlbmNlUmVzcG9uc2VUZXh0ID0gYXdhaXQgZ2V0Q2FjaGVkRFRTU3RyaW5nKGNvbmZpZywgZHRzUmVmVVJMKVxuICAgICAgICAgIGlmICghZHRzUmVmZXJlbmNlUmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2coYENvdWxkIG5vdCBnZXQgcm9vdCBkLnRzIGZpbGUgZm9yIHRoZSBtb2R1bGUgJyR7bW9kfScgYXQgJHtwYXRofWAsIHt9LCBjb25maWcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXdhaXQgZ2V0RGVwZW5kZW5jaWVzRm9yTW9kdWxlKGR0c1JlZmVyZW5jZVJlc3BvbnNlVGV4dCwgbW9kLCBuZXdQYXRoLCBjb25maWcpXG4gICAgICAgICAgY29uc3QgcmVwcmVzZW50YXRpb25hbFBhdGggPSBgbm9kZV9tb2R1bGVzLyR7bW9kfS8ke25ld1BhdGh9YFxuICAgICAgICAgIGNvbmZpZy5hZGRMaWJyYXJ5VG9SdW50aW1lKGR0c1JlZmVyZW5jZVJlc3BvbnNlVGV4dCwgcmVwcmVzZW50YXRpb25hbFBhdGgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuaW50ZXJmYWNlIEFUQUNvbmZpZyB7XG4gIHNvdXJjZUNvZGU6IHN0cmluZ1xuICBhZGRMaWJyYXJ5VG9SdW50aW1lOiBBZGRMaWJUb1J1bnRpbWVGdW5jXG4gIGZldGNoZXI6IHR5cGVvZiBmZXRjaFxuICBsb2dnZXI6IFBsYXlncm91bmRDb25maWdbXCJsb2dnZXJcIl1cbn1cblxuLyoqXG4gKiBQc2V1ZG8gaW4tYnJvd3NlciB0eXBlIGFjcXVpc2l0aW9uIHRvb2wsIHVzZXMgYVxuICovXG5leHBvcnQgY29uc3QgZGV0ZWN0TmV3SW1wb3J0c1RvQWNxdWlyZVR5cGVGb3IgPSBhc3luYyAoXG4gIHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgdXNlckFkZExpYnJhcnlUb1J1bnRpbWU6IEFkZExpYlRvUnVudGltZUZ1bmMsXG4gIGZldGNoZXIgPSBmZXRjaCxcbiAgcGxheWdyb3VuZENvbmZpZzogUGxheWdyb3VuZENvbmZpZ1xuKSA9PiB7XG4gIC8vIFdyYXAgdGhlIHJ1bnRpbWUgZnVuYyB3aXRoIG91ciBvd24gc2lkZS1lZmZlY3QgZm9yIHZpc2liaWxpdHlcbiAgY29uc3QgYWRkTGlicmFyeVRvUnVudGltZSA9IChjb2RlOiBzdHJpbmcsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgIGdsb2JhbGlzaE9iai50eXBlRGVmaW5pdGlvbnNbcGF0aF0gPSBjb2RlXG4gICAgdXNlckFkZExpYnJhcnlUb1J1bnRpbWUoY29kZSwgcGF0aClcbiAgfVxuXG4gIC8vIEJhc2ljYWxseSBzdGFydCB0aGUgcmVjdXJzaW9uIHdpdGggYW4gdW5kZWZpbmVkIG1vZHVsZVxuICBjb25zdCBjb25maWc6IEFUQUNvbmZpZyA9IHsgc291cmNlQ29kZSwgYWRkTGlicmFyeVRvUnVudGltZSwgZmV0Y2hlciwgbG9nZ2VyOiBwbGF5Z3JvdW5kQ29uZmlnLmxvZ2dlciB9XG4gIGNvbnN0IHJlc3VsdHMgPSBnZXREZXBlbmRlbmNpZXNGb3JNb2R1bGUoc291cmNlQ29kZSwgdW5kZWZpbmVkLCBcInBsYXlncm91bmQudHNcIiwgY29uZmlnKVxuICByZXR1cm4gcmVzdWx0c1xufVxuXG4vKipcbiAqIExvb2tzIGF0IGEgSlMvRFRTIGZpbGUgYW5kIHJlY3Vyc2VzIHRocm91Z2ggYWxsIHRoZSBkZXBlbmRlbmNpZXMuXG4gKiBJdCBhdm9pZHNcbiAqL1xuY29uc3QgZ2V0RGVwZW5kZW5jaWVzRm9yTW9kdWxlID0gKFxuICBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gIG1vZHVsZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgcGF0aDogc3RyaW5nLFxuICBjb25maWc6IEFUQUNvbmZpZ1xuKSA9PiB7XG4gIC8vIEdldCBhbGwgdGhlIGltcG9ydC9yZXF1aXJlcyBmb3IgdGhlIGZpbGVcbiAgY29uc3QgZmlsdGVyZWRNb2R1bGVzVG9Mb29rQXQgPSBwYXJzZUZpbGVGb3JNb2R1bGVSZWZlcmVuY2VzKHNvdXJjZUNvZGUpXG4gIGZpbHRlcmVkTW9kdWxlc1RvTG9va0F0LmZvckVhY2goYXN5bmMgbmFtZSA9PiB7XG4gICAgLy8gU3VwcG9ydCBncmFiYmluZyB0aGUgaGFyZC1jb2RlZCBub2RlIG1vZHVsZXMgaWYgbmVlZGVkXG4gICAgY29uc3QgbW9kdWxlVG9Eb3dubG9hZCA9IG1hcE1vZHVsZU5hbWVUb01vZHVsZShuYW1lKVxuXG4gICAgaWYgKCFtb2R1bGVOYW1lICYmIG1vZHVsZVRvRG93bmxvYWQuc3RhcnRzV2l0aChcIi5cIikpIHtcbiAgICAgIHJldHVybiBjb25maWcubG9nZ2VyLmxvZyhcIltBVEFdIENhbid0IHJlc29sdmUgcmVsYXRpdmUgZGVwZW5kZW5jaWVzIGZyb20gdGhlIHBsYXlncm91bmQgcm9vdFwiKVxuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZUlEID0gY29udmVydFRvTW9kdWxlUmVmZXJlbmNlSUQobW9kdWxlTmFtZSEsIG1vZHVsZVRvRG93bmxvYWQsIG1vZHVsZU5hbWUhKVxuICAgIGlmIChhY3F1aXJlZFR5cGVEZWZzW21vZHVsZUlEXSB8fCBhY3F1aXJlZFR5cGVEZWZzW21vZHVsZUlEXSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uZmlnLmxvZ2dlci5sb2coYFtBVEFdIExvb2tpbmcgYXQgJHttb2R1bGVUb0Rvd25sb2FkfWApXG5cbiAgICBjb25zdCBtb2RJc1Njb3BlZFBhY2thZ2VPbmx5ID0gbW9kdWxlVG9Eb3dubG9hZC5pbmRleE9mKFwiQFwiKSA9PT0gMCAmJiBtb2R1bGVUb0Rvd25sb2FkLnNwbGl0KFwiL1wiKS5sZW5ndGggPT09IDJcbiAgICBjb25zdCBtb2RJc1BhY2thZ2VPbmx5ID0gbW9kdWxlVG9Eb3dubG9hZC5pbmRleE9mKFwiQFwiKSA9PT0gLTEgJiYgbW9kdWxlVG9Eb3dubG9hZC5zcGxpdChcIi9cIikubGVuZ3RoID09PSAxXG4gICAgY29uc3QgaXNQYWNrYWdlUm9vdEltcG9ydCA9IG1vZElzUGFja2FnZU9ubHkgfHwgbW9kSXNTY29wZWRQYWNrYWdlT25seVxuICAgIGNvbnN0IGlzRGVub01vZHVsZSA9IG1vZHVsZVRvRG93bmxvYWQuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwXG5cbiAgICBpZiAoaXNQYWNrYWdlUm9vdEltcG9ydCkge1xuICAgICAgLy8gU28gaXQgZG9lc24ndCBydW4gdHdpY2UgZm9yIGEgcGFja2FnZVxuICAgICAgYWNxdWlyZWRUeXBlRGVmc1ttb2R1bGVJRF0gPSBudWxsXG5cbiAgICAgIC8vIEUuZy4gaW1wb3J0IGRhbmdlciBmcm9tIFwiZGFuZ2VyXCJcbiAgICAgIGNvbnN0IHBhY2thZ2VEZWYgPSBhd2FpdCBnZXRNb2R1bGVBbmRSb290RGVmVHlwZVBhdGgobW9kdWxlVG9Eb3dubG9hZCwgY29uZmlnKVxuXG4gICAgICBpZiAocGFja2FnZURlZikge1xuICAgICAgICBhY3F1aXJlZFR5cGVEZWZzW21vZHVsZUlEXSA9IHBhY2thZ2VEZWYucGFja2FnZUpTT05cbiAgICAgICAgYXdhaXQgYWRkTW9kdWxlVG9SdW50aW1lKHBhY2thZ2VEZWYubW9kLCBwYWNrYWdlRGVmLnBhdGgsIGNvbmZpZylcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzRGVub01vZHVsZSkge1xuICAgICAgLy8gRS5nLiBpbXBvcnQgeyBzZXJ2ZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAdjAuMTIvaHR0cC9zZXJ2ZXIudHNcIjtcbiAgICAgIGF3YWl0IGFkZE1vZHVsZVRvUnVudGltZShtb2R1bGVUb0Rvd25sb2FkLCBtb2R1bGVUb0Rvd25sb2FkLCBjb25maWcpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEUuZy4gaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL015VGhpbmdcIlxuICAgICAgaWYgKCFtb2R1bGVUb0Rvd25sb2FkIHx8ICFwYXRoKSB0aHJvdyBgTm8gb3V0ZXIgbW9kdWxlIG9yIHBhdGggZm9yIGEgcmVsYXRpdmUgaW1wb3J0OiAke21vZHVsZVRvRG93bmxvYWR9YFxuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGhGb3JNb2R1bGUgPSBtYXBSZWxhdGl2ZVBhdGgobW9kdWxlVG9Eb3dubG9hZCwgcGF0aClcblxuICAgICAgLy8gU28gaXQgZG9lc24ndCBydW4gdHdpY2UgZm9yIGEgcGFja2FnZVxuICAgICAgYWNxdWlyZWRUeXBlRGVmc1ttb2R1bGVJRF0gPSBudWxsXG5cbiAgICAgIGNvbnN0IHJlc29sdmVkRmlsZXBhdGggPSBhYnNvbHV0ZVBhdGhGb3JNb2R1bGUuZW5kc1dpdGgoXCIudHNcIilcbiAgICAgICAgPyBhYnNvbHV0ZVBhdGhGb3JNb2R1bGVcbiAgICAgICAgOiBhYnNvbHV0ZVBhdGhGb3JNb2R1bGUgKyBcIi5kLnRzXCJcblxuICAgICAgYXdhaXQgYWRkTW9kdWxlVG9SdW50aW1lKG1vZHVsZU5hbWUhLCByZXNvbHZlZEZpbGVwYXRoLCBjb25maWcpXG4gICAgfVxuICB9KVxuXG4gIC8vIEFsc28gc3VwcG9ydCB0aGVcbiAgZ2V0UmVmZXJlbmNlRGVwZW5kZW5jaWVzKHNvdXJjZUNvZGUsIG1vZHVsZU5hbWUhLCBwYXRoISwgY29uZmlnKVxufVxuIl19