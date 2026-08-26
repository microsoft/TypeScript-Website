import React, { useEffect, useRef, useState } from "react"
import * as ReactDOM from "react-dom"

declare global {
  interface Window {
    require?: any
    ts?: any
    sandbox?: any
    playground?: any
    react?: typeof React
    reactDOM?: typeof ReactDOM
    i?: (key: string) => string
    __tsLocalize?: (key: string) => string
    optionsSummary?: unknown[]
    playgroundHandbookTOC?: { docs: unknown[] }
  }
}

type Example = { id: string; name: string; title: string; path: string[]; lang: string; sortIndex: number; hash: string; compilerSettings?: Record<string, unknown> }
type ExampleTOC = { sections: Array<{ id: string; name: string; subtitle: string }>; sortedSubSections: string[]; examples: Example[] }
type PlaygroundCopy = Partial<Record<"help" | "settings" | "downloading" | "version" | "run" | "export" | "tweet" | "copyIssue" | "copyLink" | "copyPreview" | "ast" | "bugWorkbench" | "vscode" | "codeSandbox" | "stackBlitz" | "share", string>> & { config: string; close: string; languageBlurb: string; examples: string; javascriptSubtitle?: string }
type Props = { locale: string; examples: ExampleTOC; optionsSummary: unknown[]; handbook: { docs: unknown[] }; copy: PlaygroundCopy }

const copy: Record<string, string> = {
  play_subnav_settings: "Settings", play_settings_tabs_settings: "Sidebar Tabs",
  play_sidebar_options_disable_ata: "Disable ATA", play_sidebar_options_disable_ata_copy: "Disable the automatic acquisition of types for imports and requires.",
  play_sidebar_options_disable_save: "Disable Save-On-Type", play_sidebar_options_disable_save_copy: "Disable changing the URL when you type.",
  play_sidebar_js: ".JS", play_sidebar_dts: ".D.TS", play_sidebar_errors: "Errors", play_sidebar_logs: "Logs", play_sidebar_logs_no_logs: "No logs",
  play_sidebar_plugins: "Plugins", play_sidebar_featured_plugins: "Featured Plugins", play_sidebar_plugins_options_external: "3rd Party Plugins from npm",
  play_sidebar_plugins_options_external_warning: "Warning: Code from plugins comes from third-parties.", play_sidebar_plugins_options_modules: "Custom npm Modules",
  play_sidebar_plugins_options_modules_placeholder: "Module name from npm.", play_sidebar_plugins_plugin_dev: "Plugin Dev", play_sidebar_plugins_plugin_dev_option: "Connect to localhost:5000", play_sidebar_plugins_plugin_dev_copy: "Connect to a Playground plugin in development mode.",
  play_sidebar_js_title: "JavaScript", play_sidebar_js_blurb: "Shows the transpiled JS", play_sidebar_dts_title: "Definition Files", play_sidebar_dts_blurb: "Shows the .d.ts output of your code",
  play_sidebar_err_title: "Compiler Errors", play_sidebar_err_blurb: "Shows compiler errors in full", play_sidebar_run_title: "Run JavaScript in Browser", play_sidebar_run_blurb: "Shows the output of running the JavaScript in the editor",
  play_sidebar_plugins_title: "Manage Playground Plugins", play_sidebar_plugins_blurb: "Handles adding/removing 3rd party extensions to the playground", play_sidebar_ast_title: "[WIP] AST Viewer", play_sidebar_ast_blurb: "Inspect the TypeScript AST",
  play_sidebar_tools_filter_placeholder: "Filter", play_export_clipboard: "URL copied to clipboard", play_esm_mode: "Switched to ESM mode", play_clear_logs: "Logs cleared", play_run_js: "Executed JavaScript", play_run_ts: "Executed transpiled TypeScript", play_run_js_fail: "Executed JavaScript Failed:",
}

const defaultCode = `// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A location to learn TypeScript where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript

const anExampleVariable = "Hello World"
console.log(anExampleVariable)

// To learn more about the language, click above in "Examples" or "What's New".
// Otherwise, get started by removing these comments and the world is your playground.
  `
const latestRelease = "6.0.3"
const exampleHref = (example: Example, locale: string) => {
  const params = { ...(example.compilerSettings || {}), q: Math.floor(Math.random() * 512) }
  const query = `${example.name.includes(".js") ? "useJavaScript=true" : ""}${Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&")}`
  return `/${locale === "en" ? "" : `${locale}/`}play?${query}#example/${example.id}`
}

export default function PlaygroundIsland({ locale, examples, optionsSummary, handbook, copy: localizedCopy }: Props) {
  const initialized = useRef(false)
  const label = <K extends keyof PlaygroundCopy>(key: K, fallback: string) => localizedCopy[key] || fallback
  const [status, setStatus] = useState(label("downloading", "Downloading TypeScript..."))
  const [exampleSection, setExampleSection] = useState<"JavaScript" | "TypeScript">("TypeScript")
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    let disposed = false
    const fail = (message: string, error?: unknown) => { console.error(message, error || ""); if (!disposed) setStatus(message) }
    const boot = async () => {
      if (!window.localStorage) return fail("Cannot load the Playground with storage disabled in your browser.")
      const params = new URLSearchParams(location.search)
      let requestedVersion = params.get("ts") || latestRelease
      try {
        if (requestedVersion === "Nightly" || requestedVersion === "next") {
          const response = await fetch("https://playgroundcdn.typescriptlang.org/indexes/next.json", { cache: "no-cache" })
          if (!response.ok) throw new Error(`Nightly index returned ${response.status}`)
          requestedVersion = (await response.json()).version
        }
        requestedVersion = requestedVersion.replace("-insiders.", "-dev.")
        const channel = requestedVersion === "dev" || /(?:pr|dev)/.test(requestedVersion) ? "dev" : "min"
        const monacoRoot = requestedVersion === "dev" ? "http://localhost:5615/dev/vs" : `https://playgroundcdn.typescriptlang.org/cdn/${requestedVersion}/monaco/${channel}/vs`
        const check = await fetch(`${monacoRoot}/editor/editor.main.js`, { method: "HEAD" })
        if (!check.ok) return fail(`TypeScript ${requestedVersion} has not been prepared for the Playground. Try ${latestRelease} or Nightly.`)
        const amd = window.require
        if (!amd) return fail("The Playground module loader did not initialize.")
        amd.config({ paths: { vs: monacoRoot, "typescript-sandbox": "/js/sandbox", "typescript-playground": "/js/playground", unpkg: "https://unpkg.com", local: "http://localhost:5000" }, ignoreDuplicateModules: ["vs/editor/editor.main"], catchError: true, onError: (error: unknown) => fail("Cannot load the Playground in this browser. See the console for details.", error) })
        amd(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index", "typescript-playground/index"], async (monaco: any, worker: any, sandboxPackage: any, playgroundPackage: any) => {
          if (disposed) return
          const ts = window.ts || worker.typescript
          if (!monaco || !ts || !sandboxPackage || !playgroundPackage) return fail("A required Playground module could not be loaded.")
          const filetype = (params.has("useJavaScript") ? "js" : params.get("filetype") || "ts") as "js" | "ts" | "d.ts"
          const workerPath = params.has("multiFile") ? `${location.origin}/js/playground-worker/index.js?filetype=${filetype}` : undefined
          const sandbox = await sandboxPackage.createTypeScriptSandbox({ text: localStorage.getItem("sandbox-history") || defaultCode, compilerOptions: {}, domID: "monaco-editor-embed", filetype, acquireTypes: !localStorage.getItem("disable-ata"), supportTwoslashCompilerOptions: true, customTypeScriptWorkerPath: workerPath, monacoSettings: { fontFamily: "var(--code-font)", fontLigatures: true } }, monaco, ts)
          if (disposed) return sandbox.editor.dispose()
          const playground = playgroundPackage.setupPlayground(sandbox, monaco, { lang: locale, prefix: "/", supportCustomPlugins: true }, window.i, React)
          window.sandbox = sandbox
          window.playground = playground
          setTimeout(() => {
            const navigation = document.getElementById("navigation-container")
            if (!disposed && location.hash.startsWith("#handbook") && !navigation?.classList.contains("handbook")) {
              document.getElementById("handbook-button")?.click()
            }
          }, 200)
          if (document.documentElement.classList.contains("dark-theme")) monaco.editor.setTheme("sandbox-dark")
          const container = document.getElementById("playground-container")!
          const layout = () => {
            const bottomOffset = matchMedia("(max-width: 620px)").matches ? 13 : 18
            container.style.height = `${Math.max(innerHeight, 600) - Math.round(container.getBoundingClientRect().top) - bottomOffset}px`
            sandbox.editor.layout()
          }
          addEventListener("resize", layout)
          setStatus("")
          requestAnimationFrame(() => requestAnimationFrame(() => { layout(); sandbox.editor.focus() }))
        }, (error: unknown) => fail("The Playground modules could not be downloaded. Check your network connection and try again.", error))
      } catch (error) { fail("The TypeScript compiler or Monaco editor could not be downloaded. Check your network connection and try again.", error) }
    }
    window.optionsSummary = optionsSummary.map(option => {
      if (!option || typeof option !== "object" || !("oneliner" in option)) return option
      const summary = (option as { oneliner?: unknown }).oneliner
      if (typeof summary !== "string") return option
      const parsed = new DOMParser().parseFromString(summary, "text/html")
      return { ...option, oneliner: parsed.body.textContent?.trim() || "" }
    })
    window.playgroundHandbookTOC = handbook; window.react = React; window.reactDOM = ReactDOM
    window.i = window.__tsLocalize = key => copy[key] || key
    const existing = document.querySelector<HTMLScriptElement>("script[data-playground-loader]")
    if (window.require) void boot()
    else if (existing) existing.addEventListener("load", boot, { once: true })
    else {
      const loader = document.createElement("script")
      loader.src = `https://playgroundcdn.typescriptlang.org/cdn/${latestRelease}/monaco/min/vs/loader.js`; loader.dataset.playgroundLoader = "true"
      loader.addEventListener("load", boot, { once: true }); loader.addEventListener("error", () => fail("The Playground module loader could not be downloaded."), { once: true }); document.head.appendChild(loader)
    }
    return () => { disposed = true; window.sandbox?.editor?.dispose?.() }
  }, [locale, optionsSummary, handbook])
  const exportAction = (name: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    const action = window.playground?.exporter?.[name]
    if (typeof action === "function") action(event)
  }
  return <section id="playground-app" aria-label="TypeScript Playground">
    <nav className="navbar-sub playground-topbar" aria-label="Playground controls"><ul className="nav"><li className="name hide-small"><span>Playground</span></li>
      <li className="dropdown"><a id="compiler-options-button" href="#" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="compiler-options-dropdown">{localizedCopy.config} <span className="caret" /></a><div id="compiler-options-dropdown" className="dropdown-dialog" aria-labelledby="compiler-options-button"><h3>{localizedCopy.config}</h3><div id="config-container"><button className="examples-close">{localizedCopy.close}</button><div id="compiler-dropdowns"><label className="select"><span className="select-label">Lang</span><select id="language-selector"><option>TypeScript</option><option>TypeScript Definitions</option><option>JavaScript</option></select><span className="compiler-flag-blurb">{localizedCopy.languageBlurb}</span></label></div></div></div></li>
      <li className="dropdown"><a id="examples-button" href="#" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="examples">{localizedCopy.examples} <span className="caret" /></a><div id="examples" className="dropdown-dialog" aria-labelledby="examples-button"><button className="examples-close" aria-label="Close dropdown">{localizedCopy.close}</button><div className="examples"><div role="tablist"><button type="button" role="tab" aria-selected={exampleSection === "JavaScript"} className={`section-name button${exampleSection === "JavaScript" ? " selected" : ""}`} onClick={() => setExampleSection("JavaScript")}>{examples.sections.find(item => item.id === "JavaScript")?.name || "JavaScript"}</button><button type="button" role="tab" aria-selected={exampleSection === "TypeScript"} className={`section-name button${exampleSection === "TypeScript" ? " selected" : ""}`} onClick={() => setExampleSection("TypeScript")}>{examples.sections.find(item => item.id === "TypeScript")?.name || "TypeScript"}</button></div>{(["JavaScript", "TypeScript"] as const).map(sectionId => {
        const section = examples.sections.find(item => item.id === sectionId)
        const groups = examples.sortedSubSections.filter(name => examples.examples.some(example => (example.path[0] === sectionId || example.path[0] === sectionId.replace(".", "-")) && example.path[1] === name))
        const subtitle = sectionId === "JavaScript" && localizedCopy.javascriptSubtitle ? localizedCopy.javascriptSubtitle : section?.subtitle || ""
        return <div className={`section-content button-${sectionId.toLowerCase()}${exampleSection === sectionId ? " selected" : ""}`} style={exampleSection === sectionId ? {} : { display: "none" }} role="tabpanel" key={sectionId}><p style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: subtitle }} />{groups.map(group => <div className="section-list" key={group}><h4>{group}</h4><ol>{examples.examples.filter(example => (example.path[0] === sectionId || example.path[0] === sectionId.replace(".", "-")) && example.path[1] === group).sort((a, b) => a.sortIndex - b.sortIndex).map(example => <li key={example.id}><a className="example-link" title={`Open the example: ${example.title}`} href={exampleHref(example, locale)}>{example.title}</a><div className="example-indicator" data-id={example.id} data-hash={example.hash} /></li>)}</ol></div>)}</div>
      })}</div></div></li>
      <li className="dropdown"><a id="handbook-button" href="#" role="button" aria-haspopup="menu" aria-expanded="false">{label("help", "Help")} <span className="caret" /></a></li></ul><ul className="nav navbar-right"><li><a id="playground-settings" href="#" role="button">{label("settings", "Settings")}</a></li></ul></nav>
    {status && <div id="loader"><div className="loader-dots" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div><p id="loading-message" className="loading" role="status">{status}</p></div>}
    <div id="playground-container" style={{ display: status ? "none" : "flex" }}><div id="editor-container"><div id="story-container" style={{ display: "none" }} />
      <div id="editor-toolbar" className="navbar-sub playground-toolbar"><ul><li id="versions" className="dropdown"><a href="#" id="versions-button" role="button" aria-haspopup="menu" aria-expanded="false">{label("version", "Version...")} ... <span className="caret" /></a><ul className="dropdown-menu versions" /></li><li><a id="run-button" href="#" role="button">{label("run", "Run")}</a></li><li className="dropdown"><a id="exports-dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" aria-controls="export-dropdown-menu">{label("export", "Export")} <span className="caret" /></a><ul id="export-dropdown-menu" className="dropdown-menu"><li><a href="#" onClick={exportAction("exportAsTweet")}>{label("tweet", "Tweet link to Playground")}</a></li><li className="divider" role="separator" /><li><a href="#" onClick={exportAction("copyAsMarkdownIssue")}>{label("copyIssue", "Copy as Markdown Issue")}</a></li><li><a href="#" onClick={exportAction("copyForChat")}>{label("copyLink", "Copy as Markdown Link")}</a></li><li><a href="#" onClick={exportAction("copyForChatWithPreview")}>{label("copyPreview", "Copy as Markdown Link with Preview")}</a></li><li className="divider" role="separator" /><li><a href="#" onClick={exportAction("openInTSAST")}>{label("ast", "Open in TypeScript AST Viewer")}</a></li><li><a href="#" onClick={exportAction("openInBugWorkbench")}>{label("bugWorkbench", "Open in Bug Workbench")}</a></li><li><a href="#" onClick={exportAction("openInVSCodeDev")}>{label("vscode", "Open in VSCode TS Playground (alpha)")}</a></li><li className="divider" role="separator" /><li><a href="#" onClick={exportAction("openProjectInCodeSandbox")}>{label("codeSandbox", "Open in CodeSandbox")}</a></li><li><a href="#" onClick={exportAction("openProjectInStackBlitz")}>{label("stackBlitz", "Open in StackBlitz")}</a></li></ul></li><li><a id="share-button" href="#" role="button">{label("share", "Share")}</a></li></ul><ul className="right"><li><a id="sidebar-toggle" aria-label="Hide Sidebar" href="#">⇥</a></li></ul></div>
      <div id="monaco-editor-embed" /></div></div>
  </section>
}
