define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createURLQueryWithCompilerOptions = exports.getCompilerOptionsFromParams = exports.getDefaultSandboxCompilerOptions = void 0;
    /**
     * These are the defaults, but they also act as the list of all compiler options
     * which are parsed in the query params.
     */
    function getDefaultSandboxCompilerOptions(config, monaco) {
        const settings = {
            noImplicitAny: true,
            strictNullChecks: !config.useJavaScript,
            strictFunctionTypes: true,
            strictPropertyInitialization: true,
            strictBindCallApply: true,
            noImplicitThis: true,
            noImplicitReturns: true,
            // 3.7 off, 3.8 on I think
            useDefineForClassFields: false,
            alwaysStrict: true,
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            downlevelIteration: false,
            noEmitHelpers: false,
            noLib: false,
            noStrictGenericChecks: false,
            noUnusedLocals: false,
            noUnusedParameters: false,
            esModuleInterop: true,
            preserveConstEnums: false,
            removeComments: false,
            skipLibCheck: false,
            checkJs: config.useJavaScript,
            allowJs: config.useJavaScript,
            declaration: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            target: monaco.languages.typescript.ScriptTarget.ES2017,
            jsx: monaco.languages.typescript.JsxEmit.React,
            module: monaco.languages.typescript.ModuleKind.ESNext,
        };
        return settings;
    }
    exports.getDefaultSandboxCompilerOptions = getDefaultSandboxCompilerOptions;
    /**
     * Loop through all of the entries in the existing compiler options then compare them with the
     * query params and return an object which is the changed settings via the query params
     */
    exports.getCompilerOptionsFromParams = (options, params) => {
        const urlDefaults = Object.entries(options).reduce((acc, [key, value]) => {
            if (params.has(key)) {
                const urlValue = params.get(key);
                if (urlValue === "true") {
                    acc[key] = true;
                }
                else if (urlValue === "false") {
                    acc[key] = false;
                }
                else if (!isNaN(parseInt(urlValue, 10))) {
                    acc[key] = parseInt(urlValue, 10);
                }
            }
            return acc;
        }, {});
        return urlDefaults;
    };
    // Can't set sandbox to be the right type because the param would contain this function
    /** Gets a query string representation (hash + queries) */
    exports.createURLQueryWithCompilerOptions = (sandbox, paramOverrides) => {
        const compilerOptions = sandbox.getCompilerOptions();
        const compilerDefaults = sandbox.compilerDefaults;
        const diff = Object.entries(compilerOptions).reduce((acc, [key, value]) => {
            if (value !== compilerDefaults[key]) {
                // @ts-ignore
                acc[key] = compilerOptions[key];
            }
            return acc;
        }, {});
        // The text of the TS/JS as the hash
        const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`;
        let urlParams = Object.assign({}, diff);
        for (const param of ["lib", "ts"]) {
            const params = new URLSearchParams(location.search);
            if (params.has(param)) {
                // Special case the nightly where it uses the TS version to hardcode
                // the nightly build
                if (param === "ts" && (params.get(param) === "Nightly" || params.get(param) === "next")) {
                    urlParams["ts"] = sandbox.ts.version;
                }
                else {
                    urlParams["ts"] = params.get(param);
                }
            }
        }
        // Support sending the selection
        const s = sandbox.editor.getSelection();
        // TODO: when it's full
        if ((s && s.selectionStartLineNumber !== s.positionLineNumber) ||
            (s && s.selectionStartColumn !== s.positionColumn)) {
            urlParams["ssl"] = s.selectionStartLineNumber;
            urlParams["ssc"] = s.selectionStartColumn;
            urlParams["pln"] = s.positionLineNumber;
            urlParams["pc"] = s.positionColumn;
        }
        else {
            urlParams["ssl"] = undefined;
            urlParams["ssc"] = undefined;
            urlParams["pln"] = undefined;
            urlParams["pc"] = undefined;
        }
        if (sandbox.config.useJavaScript)
            urlParams["useJavaScript"] = true;
        if (paramOverrides) {
            urlParams = Object.assign(Object.assign({}, urlParams), paramOverrides);
        }
        if (Object.keys(urlParams).length > 0) {
            const queryString = Object.entries(urlParams)
                .filter(([_k, v]) => v !== undefined)
                .filter(([_k, v]) => v !== null)
                .map(([key, value]) => {
                return `${key}=${encodeURIComponent(value)}`;
            })
                .join("&");
            return `?${queryString}#${hash}`;
        }
        else {
            return `#${hash}`;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvY29tcGlsZXJPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQTs7O09BR0c7SUFDSCxTQUFnQixnQ0FBZ0MsQ0FBQyxNQUF3QixFQUFFLE1BQWM7UUFDdkYsTUFBTSxRQUFRLEdBQW9CO1lBQ2hDLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGdCQUFnQixFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDdkMsbUJBQW1CLEVBQUUsSUFBSTtZQUN6Qiw0QkFBNEIsRUFBRSxJQUFJO1lBQ2xDLG1CQUFtQixFQUFFLElBQUk7WUFDekIsY0FBYyxFQUFFLElBQUk7WUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtZQUV2QiwwQkFBMEI7WUFDMUIsdUJBQXVCLEVBQUUsS0FBSztZQUU5QixZQUFZLEVBQUUsSUFBSTtZQUNsQixvQkFBb0IsRUFBRSxLQUFLO1lBQzNCLGlCQUFpQixFQUFFLEtBQUs7WUFFeEIsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixhQUFhLEVBQUUsS0FBSztZQUNwQixLQUFLLEVBQUUsS0FBSztZQUNaLHFCQUFxQixFQUFFLEtBQUs7WUFDNUIsY0FBYyxFQUFFLEtBQUs7WUFDckIsa0JBQWtCLEVBQUUsS0FBSztZQUV6QixlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLFlBQVksRUFBRSxLQUFLO1lBRW5CLE9BQU8sRUFBRSxNQUFNLENBQUMsYUFBYTtZQUM3QixPQUFPLEVBQUUsTUFBTSxDQUFDLGFBQWE7WUFDN0IsV0FBVyxFQUFFLElBQUk7WUFFakIsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixxQkFBcUIsRUFBRSxJQUFJO1lBQzNCLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLE1BQU07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RyxJQUFJLENBQUE7UUFFbkUsSUFBSSxjQUFjLEVBQUU7WUFDbEIsU0FBUyxtQ0FBUSxTQUFTLEdBQUssY0FBYyxDQUFFLENBQUE7U0FDaEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztpQkFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUM7aUJBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO2lCQUMvQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUNwQixPQUFPLEdBQUcsR0FBRyxJQUFJLGtCQUFrQixDQUFDLEtBQWUsQ0FBQyxFQUFFLENBQUE7WUFDeEQsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUVaLE9BQU8sSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLENBQUE7U0FDakM7YUFBTTtZQUNMLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQTtTQUNsQjtJQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRDb25maWcgfSBmcm9tIFwiLlwiXG5cbnR5cGUgQ29tcGlsZXJPcHRpb25zID0gaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5sYW5ndWFnZXMudHlwZXNjcmlwdC5Db21waWxlck9wdGlvbnNcbnR5cGUgTW9uYWNvID0gdHlwZW9mIGltcG9ydChcIm1vbmFjby1lZGl0b3JcIilcblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIGRlZmF1bHRzLCBidXQgdGhleSBhbHNvIGFjdCBhcyB0aGUgbGlzdCBvZiBhbGwgY29tcGlsZXIgb3B0aW9uc1xuICogd2hpY2ggYXJlIHBhcnNlZCBpbiB0aGUgcXVlcnkgcGFyYW1zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFNhbmRib3hDb21waWxlck9wdGlvbnMoY29uZmlnOiBQbGF5Z3JvdW5kQ29uZmlnLCBtb25hY286IE1vbmFjbykge1xuICBjb25zdCBzZXR0aW5nczogQ29tcGlsZXJPcHRpb25zID0ge1xuICAgIG5vSW1wbGljaXRBbnk6IHRydWUsXG4gICAgc3RyaWN0TnVsbENoZWNrczogIWNvbmZpZy51c2VKYXZhU2NyaXB0LFxuICAgIHN0cmljdEZ1bmN0aW9uVHlwZXM6IHRydWUsXG4gICAgc3RyaWN0UHJvcGVydHlJbml0aWFsaXphdGlvbjogdHJ1ZSxcbiAgICBzdHJpY3RCaW5kQ2FsbEFwcGx5OiB0cnVlLFxuICAgIG5vSW1wbGljaXRUaGlzOiB0cnVlLFxuICAgIG5vSW1wbGljaXRSZXR1cm5zOiB0cnVlLFxuXG4gICAgLy8gMy43IG9mZiwgMy44IG9uIEkgdGhpbmtcbiAgICB1c2VEZWZpbmVGb3JDbGFzc0ZpZWxkczogZmFsc2UsXG5cbiAgICBhbHdheXNTdHJpY3Q6IHRydWUsXG4gICAgYWxsb3dVbnJlYWNoYWJsZUNvZGU6IGZhbHNlLFxuICAgIGFsbG93VW51c2VkTGFiZWxzOiBmYWxzZSxcblxuICAgIGRvd25sZXZlbEl0ZXJhdGlvbjogZmFsc2UsXG4gICAgbm9FbWl0SGVscGVyczogZmFsc2UsXG4gICAgbm9MaWI6IGZhbHNlLFxuICAgIG5vU3RyaWN0R2VuZXJpY0NoZWNrczogZmFsc2UsXG4gICAgbm9VbnVzZWRMb2NhbHM6IGZhbHNlLFxuICAgIG5vVW51c2VkUGFyYW1ldGVyczogZmFsc2UsXG5cbiAgICBlc01vZHVsZUludGVyb3A6IHRydWUsXG4gICAgcHJlc2VydmVDb25zdEVudW1zOiBmYWxzZSxcbiAgICByZW1vdmVDb21tZW50czogZmFsc2UsXG4gICAgc2tpcExpYkNoZWNrOiBmYWxzZSxcblxuICAgIGNoZWNrSnM6IGNvbmZpZy51c2VKYXZhU2NyaXB0LFxuICAgIGFsbG93SnM6IGNvbmZpZy51c2VKYXZhU2NyaXB0LFxuICAgIGRlY2xhcmF0aW9uOiB0cnVlLFxuXG4gICAgZXhwZXJpbWVudGFsRGVjb3JhdG9yczogdHJ1ZSxcbiAgICBlbWl0RGVjb3JhdG9yTWV0YWRhdGE6IHRydWUsXG4gICAgbW9kdWxlUmVzb2x1dGlvbjogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0Lk1vZHVsZVJlc29sdXRpb25LaW5kLk5vZGVKcyxcblxuICAgIHRhcmdldDogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LlNjcmlwdFRhcmdldC5FUzIwMTcsXG4gICAganN4OiBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuSnN4RW1pdC5SZWFjdCxcbiAgICBtb2R1bGU6IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Nb2R1bGVLaW5kLkVTTmV4dCxcbiAgfVxuXG4gIHJldHVybiBzZXR0aW5nc1xufVxuXG4vKipcbiAqIExvb3AgdGhyb3VnaCBhbGwgb2YgdGhlIGVudHJpZXMgaW4gdGhlIGV4aXN0aW5nIGNvbXBpbGVyIG9wdGlvbnMgdGhlbiBjb21wYXJlIHRoZW0gd2l0aCB0aGVcbiAqIHF1ZXJ5IHBhcmFtcyBhbmQgcmV0dXJuIGFuIG9iamVjdCB3aGljaCBpcyB0aGUgY2hhbmdlZCBzZXR0aW5ncyB2aWEgdGhlIHF1ZXJ5IHBhcmFtc1xuICovXG5leHBvcnQgY29uc3QgZ2V0Q29tcGlsZXJPcHRpb25zRnJvbVBhcmFtcyA9IChvcHRpb25zOiBDb21waWxlck9wdGlvbnMsIHBhcmFtczogVVJMU2VhcmNoUGFyYW1zKTogQ29tcGlsZXJPcHRpb25zID0+IHtcbiAgY29uc3QgdXJsRGVmYXVsdHMgPSBPYmplY3QuZW50cmllcyhvcHRpb25zKS5yZWR1Y2UoKGFjYzogYW55LCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAocGFyYW1zLmhhcyhrZXkpKSB7XG4gICAgICBjb25zdCB1cmxWYWx1ZSA9IHBhcmFtcy5nZXQoa2V5KSFcblxuICAgICAgaWYgKHVybFZhbHVlID09PSBcInRydWVcIikge1xuICAgICAgICBhY2Nba2V5XSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAodXJsVmFsdWUgPT09IFwiZmFsc2VcIikge1xuICAgICAgICBhY2Nba2V5XSA9IGZhbHNlXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihwYXJzZUludCh1cmxWYWx1ZSwgMTApKSkge1xuICAgICAgICBhY2Nba2V5XSA9IHBhcnNlSW50KHVybFZhbHVlLCAxMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxuXG4gIHJldHVybiB1cmxEZWZhdWx0c1xufVxuXG4vLyBDYW4ndCBzZXQgc2FuZGJveCB0byBiZSB0aGUgcmlnaHQgdHlwZSBiZWNhdXNlIHRoZSBwYXJhbSB3b3VsZCBjb250YWluIHRoaXMgZnVuY3Rpb25cblxuLyoqIEdldHMgYSBxdWVyeSBzdHJpbmcgcmVwcmVzZW50YXRpb24gKGhhc2ggKyBxdWVyaWVzKSAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyA9IChzYW5kYm94OiBhbnksIHBhcmFtT3ZlcnJpZGVzPzogYW55KTogc3RyaW5nID0+IHtcbiAgY29uc3QgY29tcGlsZXJPcHRpb25zID0gc2FuZGJveC5nZXRDb21waWxlck9wdGlvbnMoKVxuICBjb25zdCBjb21waWxlckRlZmF1bHRzID0gc2FuZGJveC5jb21waWxlckRlZmF1bHRzXG4gIGNvbnN0IGRpZmYgPSBPYmplY3QuZW50cmllcyhjb21waWxlck9wdGlvbnMpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAodmFsdWUgIT09IGNvbXBpbGVyRGVmYXVsdHNba2V5XSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgYWNjW2tleV0gPSBjb21waWxlck9wdGlvbnNba2V5XVxuICAgIH1cblxuICAgIHJldHVybiBhY2NcbiAgfSwge30pXG5cbiAgLy8gVGhlIHRleHQgb2YgdGhlIFRTL0pTIGFzIHRoZSBoYXNoXG4gIGNvbnN0IGhhc2ggPSBgY29kZS8ke3NhbmRib3gubHpzdHJpbmcuY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQoc2FuZGJveC5nZXRUZXh0KCkpfWBcblxuICBsZXQgdXJsUGFyYW1zOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBkaWZmKVxuICBmb3IgKGNvbnN0IHBhcmFtIG9mIFtcImxpYlwiLCBcInRzXCJdKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpXG4gICAgaWYgKHBhcmFtcy5oYXMocGFyYW0pKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2UgdGhlIG5pZ2h0bHkgd2hlcmUgaXQgdXNlcyB0aGUgVFMgdmVyc2lvbiB0byBoYXJkY29kZVxuICAgICAgLy8gdGhlIG5pZ2h0bHkgYnVpbGRcbiAgICAgIGlmIChwYXJhbSA9PT0gXCJ0c1wiICYmIChwYXJhbXMuZ2V0KHBhcmFtKSA9PT0gXCJOaWdodGx5XCIgfHwgcGFyYW1zLmdldChwYXJhbSkgPT09IFwibmV4dFwiKSkge1xuICAgICAgICB1cmxQYXJhbXNbXCJ0c1wiXSA9IHNhbmRib3gudHMudmVyc2lvblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsUGFyYW1zW1widHNcIl0gPSBwYXJhbXMuZ2V0KHBhcmFtKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN1cHBvcnQgc2VuZGluZyB0aGUgc2VsZWN0aW9uXG4gIGNvbnN0IHMgPSBzYW5kYm94LmVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAvLyBUT0RPOiB3aGVuIGl0J3MgZnVsbFxuICBpZiAoXG4gICAgKHMgJiYgcy5zZWxlY3Rpb25TdGFydExpbmVOdW1iZXIgIT09IHMucG9zaXRpb25MaW5lTnVtYmVyKSB8fFxuICAgIChzICYmIHMuc2VsZWN0aW9uU3RhcnRDb2x1bW4gIT09IHMucG9zaXRpb25Db2x1bW4pXG4gICkge1xuICAgIHVybFBhcmFtc1tcInNzbFwiXSA9IHMuc2VsZWN0aW9uU3RhcnRMaW5lTnVtYmVyXG4gICAgdXJsUGFyYW1zW1wic3NjXCJdID0gcy5zZWxlY3Rpb25TdGFydENvbHVtblxuICAgIHVybFBhcmFtc1tcInBsblwiXSA9IHMucG9zaXRpb25MaW5lTnVtYmVyXG4gICAgdXJsUGFyYW1zW1wicGNcIl0gPSBzLnBvc2l0aW9uQ29sdW1uXG4gIH0gZWxzZSB7XG4gICAgdXJsUGFyYW1zW1wic3NsXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wic3NjXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wicGxuXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wicGNcIl0gPSB1bmRlZmluZWRcbiAgfVxuXG4gIGlmIChzYW5kYm94LmNvbmZpZy51c2VKYXZhU2NyaXB0KSB1cmxQYXJhbXNbXCJ1c2VKYXZhU2NyaXB0XCJdID0gdHJ1ZVxuXG4gIGlmIChwYXJhbU92ZXJyaWRlcykge1xuICAgIHVybFBhcmFtcyA9IHsgLi4udXJsUGFyYW1zLCAuLi5wYXJhbU92ZXJyaWRlcyB9XG4gIH1cblxuICBpZiAoT2JqZWN0LmtleXModXJsUGFyYW1zKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBPYmplY3QuZW50cmllcyh1cmxQYXJhbXMpXG4gICAgICAuZmlsdGVyKChbX2ssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpXG4gICAgICAuZmlsdGVyKChbX2ssIHZdKSA9PiB2ICE9PSBudWxsKVxuICAgICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHtrZXl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlIGFzIHN0cmluZyl9YFxuICAgICAgfSlcbiAgICAgIC5qb2luKFwiJlwiKVxuXG4gICAgcmV0dXJuIGA/JHtxdWVyeVN0cmluZ30jJHtoYXNofWBcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCMke2hhc2h9YFxuICB9XG59XG4iXX0=