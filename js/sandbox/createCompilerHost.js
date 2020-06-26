// A single file version from
// https://stackoverflow.com/questions/53733138/how-do-i-type-check-a-snippet-of-typescript-code-in-memory
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCompilerHost = void 0;
    function createCompilerHost(code, path) {
        const host = {
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
            writeFile: () => { },
        };
        return host;
    }
    exports.createCompilerHost = createCompilerHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29tcGlsZXJIb3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvY3JlYXRlQ29tcGlsZXJIb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZCQUE2QjtBQUM3QiwwR0FBMEc7Ozs7O0lBRTFHLFNBQWdCLGtCQUFrQixDQUFDLElBQVksRUFBRSxJQUFZO1FBQzNELE1BQU0sSUFBSSxHQUFzQztZQUM5QyxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSTtZQUN6QyxlQUFlLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEtBQUssR0FBRztZQUMzQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHO1lBQzlCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ3hCLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUTtZQUMxQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtZQUN0QixxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVM7WUFDN0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUM1RCx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1lBQ3JDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO1NBQ3BCLENBQUE7UUFFRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFoQkQsZ0RBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQSBzaW5nbGUgZmlsZSB2ZXJzaW9uIGZyb21cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUzNzMzMTM4L2hvdy1kby1pLXR5cGUtY2hlY2stYS1zbmlwcGV0LW9mLXR5cGVzY3JpcHQtY29kZS1pbi1tZW1vcnlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVySG9zdChjb2RlOiBzdHJpbmcsIHBhdGg6IHN0cmluZykge1xuICBjb25zdCBob3N0OiBpbXBvcnQoJ3R5cGVzY3JpcHQnKS5Db21waWxlckhvc3QgPSB7XG4gICAgZmlsZUV4aXN0czogZmlsZVBhdGggPT4gZmlsZVBhdGggPT09IHBhdGgsXG4gICAgZGlyZWN0b3J5RXhpc3RzOiBkaXJQYXRoID0+IGRpclBhdGggPT09ICcvJyxcbiAgICBnZXRDdXJyZW50RGlyZWN0b3J5OiAoKSA9PiAnLycsXG4gICAgZ2V0RGlyZWN0b3JpZXM6ICgpID0+IFtdLFxuICAgIGdldENhbm9uaWNhbEZpbGVOYW1lOiBmaWxlTmFtZSA9PiBmaWxlTmFtZSxcbiAgICBnZXROZXdMaW5lOiAoKSA9PiAnXFxuJyxcbiAgICBnZXREZWZhdWx0TGliRmlsZU5hbWU6ICgpID0+ICcnLFxuICAgIGdldFNvdXJjZUZpbGU6IF8gPT4gdW5kZWZpbmVkLFxuICAgIHJlYWRGaWxlOiBmaWxlUGF0aCA9PiAoZmlsZVBhdGggPT09IHBhdGggPyBjb2RlIDogdW5kZWZpbmVkKSxcbiAgICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzOiAoKSA9PiB0cnVlLFxuICAgIHdyaXRlRmlsZTogKCkgPT4ge30sXG4gIH1cblxuICByZXR1cm4gaG9zdFxufVxuIl19