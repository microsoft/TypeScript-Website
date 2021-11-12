## Compiler Settings

There isn't a `tsconfig.json` file in a Playground, but you need to be able to set the compiler flags in order to accurately re-create a particular environment. Even for the simplest code, the difference in how TypeScript acts between `strict: true` and `strict: false` is pretty drastic and not being able to set that to match would suck.

Above this prose there are two toolbars, one is the site navigation in bright blue - under that is the Playground's toolbar. This toolbar has a button "TS Config", clicking that will show you the main interface for setting compiler options in the Playground. You can do it now by the way, then click "Close" to get back to this text.

### TS Config Panel

The TS Config panel contains a focused list of the TypeScript compiler options available inside a `tsconfig.json`. It starts off with some dropdowns for some of the most important compiler options and then it moves down to categories with boolean check boxes. This list has grown organically over time and generally represents the settings which people use most. If you need to set a value which isn't in that list, there is a way to set any option via [twoslash annotations](/play?#handbook-13) which we'll get to later in the handbook.

Changing a compiler flag will update the URL in your browser (unless you have that disabled in the settings.) The URL structure works by comparing the current compiler options versus the default settings (covered below) and only showing compiler options which differ from the defaults. For example, the default for a Playground is to have `esModuleInterop: true` enabled, thus turning `esModuleInterop` to `false` would append `?esModuleInterop=false` to the URL:

```diff
# Before
- https://www.typescriptlang.org/play

# After turning esModuleInterop off
+ https://www.typescriptlang.org/play?esModuleInterop=false
```

This helps keep Playground URLs on the short side, or at least doesn't add to their size needlessly. You might notice that sometimes the compiler flags aren't the exact same in the URL as the user interface, for example `?target=6` is `target: ES2019` this is us saving characters by using the enum's numerical value rather than the string representation.

<details>
<summary>The defaults for the compiler in a Playground</summary>

_In rough_, the Playground has settings which can be summed up as this:

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "esnext",
    "moduleResolution": "node",
    "target": "es2017",
    "jsx": "react",

    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

The reality is (of course) a tad more complex, we detect if a compiler setting is in the following list as a cue for showing the compiler setting in the TS Config panel user interface and only add a setting to the URL if it differs from this list.

So, the full specification for the default compiler settings (as of TypeScript 4.5) looks like this:

```ts
export function getDefaultSandboxCompilerOptions(config: SandboxConfig, monaco: Monaco) {
  const useJavaScript = config.filetype === "js"
  const settings: CompilerOptions = {
    strict: true,

    noImplicitAny: true,
    strictNullChecks: !useJavaScript,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictBindCallApply: true,
    noImplicitThis: true,
    noImplicitReturns: true,
    noUncheckedIndexedAccess: false,

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

    checkJs: useJavaScript,
    allowJs: useJavaScript,
    declaration: true,

    importHelpers: false,

    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,

    target: monaco.languages.typescript.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.React,
    module: monaco.languages.typescript.ModuleKind.ESNext,
  }

  return { ...settings, ...config.compilerOptions }
}
```

This includes a lot of values which are set to their default value too. Which actually can make setting up a _perfect_ environment tricky because 'no value set' can differ from 'false' for some settings, but breaking this system would break backwards compatibility (URLs would change) and make URLs longer, thus it stays the way it is.

</details>

That's that for the compiler settings. Next up, [Examples](/play#handbook-2).
