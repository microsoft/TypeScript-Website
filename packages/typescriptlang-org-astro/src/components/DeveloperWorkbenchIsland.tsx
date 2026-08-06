import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    require?: any
    ts?: any
  }
}

type Mode = "bug-workbench" | "sandbox" | "twoslash" | "typescript-vfs" | "playground-plugins"
type Props = { mode: Mode }

type Example = { name: string; blurb: string; code: string }

const latestRelease = "6.0.3"
const examples: Record<Exclude<Mode, "playground-plugins">, Example[]> = {
  "bug-workbench": [
    { name: "Minimal issue", blurb: "Start from a small compiler reproduction.", code: `const value = { answer: 42 } as const\ntype Answer = typeof value.answer\nconst expected: 43 = value.answer` },
    { name: "Generic inference", blurb: "Inspect a focused generic inference case.", code: `function first<T>(values: readonly T[]): T | undefined {\n  return values[0]\n}\nconst result = first(["TypeScript", "JavaScript"] as const)` },
  ],
  sandbox: [
    { name: "DangerJS", blurb: "Edit code, then request JavaScript or declaration output from the Sandbox.", code: `import { markdown, danger } from "danger"\n\nexport default async function () {\n  const diff = await danger.git.JSONDiffForFile("package.json")\n  const added = diff.devDependencies.added\n  const types = added?.filter((name: string) => name.includes("@types")) ?? []\n  if (types.length) markdown("Added " + types.join(", "))\n}` },
  ],
  twoslash: [
    { name: "Highlights runtime types", blurb: "Use an inline query to identify a narrowed value.", code: `// @errors: 2532\ndeclare const quantumString: string | undefined\n//            ^? const quantumString: string | undefined\nif (quantumString) {\n  quantumString.length\n  // ^? const quantumString: string\n}` },
    { name: "Show errors", blurb: "The compiler output tracks expected and actual diagnostics.", code: `// @errors: 7006\nfunction fn(s) {\n  console.log(s.subtr(3))\n}\nfn(42)` },
    { name: "Show JavaScript", blurb: "Use @showEmit to inspect the emitted JavaScript.", code: `// @showEmit\nexport function getStringLength(value: string) {\n  return value.length\n}` },
  ],
  "typescript-vfs": [
    { name: "Virtual program", blurb: "Build a TypeScript Program over an in-memory file map and emit its files.", code: `interface User { name: string }\nexport const user: User = { name: "Ada" }` },
  ],
}

const formatDiagnostics = (ts: any, diagnostics: readonly any[]) => diagnostics.length
  ? diagnostics.map(diagnostic => {
      const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      const position = diagnostic.file && typeof diagnostic.start === "number" ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : undefined
      return `${diagnostic.code}${position ? ` (${position.line + 1},${position.character + 1})` : ""}: ${text}`
    }).join("\n")
  : "No compiler errors."

export default function DeveloperWorkbenchIsland({ mode }: Props) {
  const initialized = useRef(false)
  const sandboxRef = useRef<any>()
  const tsRef = useRef<any>()
  const [status, setStatus] = useState(mode === "playground-plugins" ? "Ready" : "Downloading the TypeScript compiler and editor…")
  const [result, setResult] = useState("")
  const [pluginName, setPluginName] = useState("Compiler Insights")
  const [pluginId, setPluginId] = useState("compiler-insights")
  const modeExamples = mode === "playground-plugins" ? [] : examples[mode]

  useEffect(() => {
    if (mode === "playground-plugins" || initialized.current) return
    initialized.current = true
    let disposed = false
    const fail = (message: string, error?: unknown) => { console.error(message, error || ""); if (!disposed) setStatus(message) }
    const boot = () => {
      const amd = window.require
      if (!amd) return fail("The Monaco module loader did not initialize.")
      const monacoRoot = `https://playgroundcdn.typescriptlang.org/cdn/${latestRelease}/monaco/min/vs`
      amd.config({ paths: { vs: monacoRoot, "typescript-sandbox": "/js/sandbox" }, ignoreDuplicateModules: ["vs/editor/editor.main"], catchError: true })
      amd(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index"], async (monaco: any, worker: any, sandboxPackage: any) => {
        const ts = window.ts || worker?.typescript
        if (!monaco || !ts || !sandboxPackage) return fail("A required workbench module could not be loaded.")
        const sandbox = await sandboxPackage.createTypeScriptSandbox({ text: modeExamples[0].code, suppressAutomaticallyGettingDefaultText: true, compilerOptions: { strict: true, declaration: true }, domID: `developer-editor-${mode}`, filetype: "ts", acquireTypes: mode === "sandbox", supportTwoslashCompilerOptions: true, monacoSettings: { fontFamily: "var(--code-font)", fontLigatures: true } }, monaco, ts)
        if (disposed) return sandbox.editor.dispose()
        sandboxRef.current = sandbox; tsRef.current = ts
        if (document.documentElement.classList.contains("dark-theme")) monaco.editor.setTheme("sandbox-dark")
        setStatus(`Ready — TypeScript ${ts.version}`)
        sandbox.editor.focus(); sandbox.editor.layout()
        const compile = () => {
          const output = ts.transpileModule(sandbox.getText(), { compilerOptions: { strict: true, declaration: true }, reportDiagnostics: true })
          setResult(formatDiagnostics(ts, output.diagnostics || []))
        }
        sandbox.editor.onDidChangeModelContent(compile); compile()
      }, (error: unknown) => fail("The workbench modules could not be downloaded.", error))
    }
    const loader = document.querySelector<HTMLScriptElement>("script[data-developer-loader]") || document.createElement("script")
    if (window.require) boot()
    else {
      if (!loader.dataset.developerLoader) { loader.src = `https://playgroundcdn.typescriptlang.org/cdn/${latestRelease}/monaco/min/vs/loader.js`; loader.dataset.developerLoader = "true"; document.head.appendChild(loader) }
      loader.addEventListener("load", boot, { once: true }); loader.addEventListener("error", () => fail("The Monaco module loader could not be downloaded."), { once: true })
    }
    return () => { disposed = true; sandboxRef.current?.editor?.dispose?.() }
  }, [mode])

  const selectExample = (example: Example) => { sandboxRef.current?.setText(example.code); setResult(example.blurb) }
  const compile = async () => {
    const sandbox = sandboxRef.current, ts = tsRef.current
    if (!sandbox || !ts) return
    const worker = await sandbox.getWorkerProcess()
    const fileName = sandbox.getModel().uri.toString()
    const diagnostics = [...await worker.getSyntacticDiagnostics(fileName), ...await worker.getSemanticDiagnostics(fileName)]
    const javascript = await sandbox.getRunnableJS()
    setResult(`${formatDiagnostics(ts, diagnostics)}\n\nJavaScript\n${javascript}`)
  }
  const declaration = async () => setResult(await sandboxRef.current?.getDTSForCode?.() || "No declaration output was produced.")
  const virtualEmit = () => {
    const ts = tsRef.current, source = sandboxRef.current?.getText()
    if (!ts || source == null) return
    const minimalLib = `interface Array<T> { readonly length: number }\ninterface Boolean {}\ninterface CallableFunction extends Function {}\ninterface Function {}\ninterface IArguments {}\ninterface NewableFunction extends Function {}\ninterface Number {}\ninterface Object {}\ninterface RegExp {}\ninterface String {}`
    const files = new Map([["/index.ts", source], ["/lib.d.ts", minimalLib]])
    const emitted: string[] = []
    const options = { strict: true, declaration: true, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
    const host = {
      fileExists: (name: string) => files.has(name), readFile: (name: string) => files.get(name),
      getSourceFile: (name: string, languageVersion: any) => files.has(name) ? ts.createSourceFile(name, files.get(name), languageVersion) : undefined,
      getDefaultLibFileName: () => "/lib.d.ts", writeFile: (name: string, text: string) => emitted.push(`${name}\n${text}`),
      getCurrentDirectory: () => "/", getCanonicalFileName: (name: string) => name, useCaseSensitiveFileNames: () => true, getNewLine: () => "\n",
    }
    const program = ts.createProgram(["/lib.d.ts", "/index.ts"], options, host)
    const emit = program.emit()
    setResult(`${formatDiagnostics(ts, [...ts.getPreEmitDiagnostics(program), ...emit.diagnostics])}\n\n${emitted.join("\n\n")}`)
  }
  const pluginSource = `export const activate = (utils) => ({\n  id: "${pluginId}",\n  displayName: "${pluginName}",\n  didMount(sandbox, container) {\n    container.textContent = "${pluginName} is connected to TypeScript " + sandbox.ts.version\n  }\n})`

  if (mode === "playground-plugins") return <section className="developer-workbench" data-workbench-ready="true" aria-labelledby="plugin-builder-title">
    <h2 id="plugin-builder-title">Plugin manifest builder</h2><p>Configure a small Playground plugin and copy the generated activation module into the plugin template.</p>
    <div className="plugin-fields"><label>Display name<input value={pluginName} onChange={event => setPluginName(event.target.value)} /></label><label>Plugin id<input value={pluginId} onChange={event => setPluginId(event.target.value.replace(/[^a-z0-9-]/gi, "-"))} /></label></div>
    <pre aria-live="polite"><code>{pluginSource}</code></pre><a className="button" href="/play/">Test a plugin in the Playground</a>
  </section>

  return <section className="developer-workbench" aria-label={`${mode} interactive workbench`}>
    <div className="workbench-toolbar">{modeExamples.map(example => <button type="button" key={example.name} onClick={() => selectExample(example)}>{example.name}</button>)}<button type="button" onClick={compile}>Compile</button>{mode === "sandbox" && <button type="button" onClick={declaration}>Get .d.ts</button>}{mode === "typescript-vfs" && <button type="button" onClick={virtualEmit}>Emit virtual files</button>}</div>
    <p role="status" data-workbench-ready={status.startsWith("Ready") ? "true" : "false"}>{status}</p>
    <div className="workbench-grid"><div id={`developer-editor-${mode}`} className="developer-editor" /><pre className="workbench-output" tabIndex={0} aria-label="Compiler output"><code>{result}</code></pre></div>
  </section>
}
